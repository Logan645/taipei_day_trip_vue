from flask import *
from api.models import db
import jwt
from dotenv import load_dotenv
import os
import json
load_dotenv()
JWT_Key = os.getenv('JWT_Key')
booking = Blueprint( "booking", __name__ )

@booking.route('/booking', methods=['GET'])
def check_cart():
    cookie = request.cookies.get('JWT')
    try:
        if cookie:
            id = jwt.decode(cookie, JWT_Key ,algorithms="HS256")['id']
            sql = 'select * from cart where user_id = %s'
            val = (id, )
            cart_data = db.engine.execute(sql, val).fetchall()
            if cart_data==[]:
                response = {"data": None}
                return jsonify(response) ,200
            else:
                sql = 'select * from attractions where id = %s'
                val = (cart_data[0][2],)
                attraction_data = list(db.engine.execute(sql, val).fetchone())
                # print(type(cart_data[3])) #<class 'datetime.date'>
                response = {
                    "data": {
                        "attraction": {
                            "id": cart_data[0][2],
                            "name": attraction_data[1],
                            "address": attraction_data[4],
                            "image":  json.loads(attraction_data[-1])[0]
                        },
                    "date": cart_data[0][3].strftime("%Y-%b-%d"), #日期格式有問題，要轉換
                    "time": cart_data[0][4],
                    "price": cart_data[0][5]
                    }
                }
                return jsonify(response) ,200
        else:
            response = {
                "error": True,
                "message": "請登入後進行預約"
            }
            return jsonify(response),403
    except:
        response = {
            "error": True,
            "message": "伺服器發生錯誤請稍後再試"
        }
        return jsonify(response), 500

@booking.route('/booking', methods=['POST'])
def add_to_cart():
    cookie = request.cookies.get('JWT')
    try:
        if cookie:
            data = request.json
            payload = jwt.decode(cookie, JWT_Key ,algorithms="HS256")
            sql = 'select * from cart where user_id = %s'
            val = val = (payload['id'],)
            if db.engine.execute(sql, val).fetchone():
                sql = 'DELETE FROM cart WHERE user_id = %s'
                val = (payload['id'],)
                db.engine.execute(sql, val)
                sql = 'insert into cart(user_id, attraction_id, date, time,price) values (%s, %s, %s, %s, %s)'
                val = (payload['id'], data['attractionId'], data['date'], data['time'], data['price'])
                db.engine.execute(sql, val)
                response = {"ok": True}
                return jsonify(response) ,200
            else:
                sql = 'insert into cart(user_id, attraction_id, date, time,price) values (%s, %s, %s, %s, %s)'
                val = (payload['id'], data['attractionId'], data['date'], data['time'], data['price'])
                db.engine.execute(sql, val)
                response = {"ok": True}
                return jsonify(response) ,200
        else:
            response = {
                "error": True,
                "message": "請登入後進行預約"
            }
            return jsonify(response),403
    except:
        response = {
            "error": True,
            "message": "伺服器發生錯誤請稍後再試"
        }
        return jsonify(response), 500

@booking.route('/booking', methods=['DELETE'])
def delete_booking():
    try:
        cookie = request.cookies.get('JWT')
        if cookie:
            sql = 'delete from cart where user_id = %s'
            payload = jwt.decode(cookie, JWT_Key ,algorithms="HS256")
            val = (payload['id'],)
            db.engine.execute(sql, val)
            response = {"ok": True}
            return jsonify(response) ,200
        else:
            response = {
                "error": True,
                "message": "請登入後進行預約"
            }
            return jsonify(response),403
    except:
        response = {
            "error": True,
            "message": "伺服器發生錯誤請稍後再試"
        }
        return jsonify(response), 500