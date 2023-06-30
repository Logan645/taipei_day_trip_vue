from flask import *
from api.models import db
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
load_dotenv()
JWT_Key = os.getenv('JWT_Key')

user = Blueprint( "user", __name__ )

@user.route('/user', methods=['POST'])
def signup():
    try:
        data = request.json
        name = data['name']
        email = data['email']
        password = data['password']
        # if name=="" or email=="" or password=="":
        #     result = {
        #         "error": True,
        #         "message": "有欄位未輸入"
        #     }
        #     return jsonify(result),400
        sql = 'select * from member where email = %s'
        val = (email,)
        sql_data = db.engine.execute(sql, val).fetchall()
        if sql_data != []:
            response = {
                "error": True,
                "message": "此email已有人註冊"
            }
            return jsonify(response),400
        else:
            sql = 'insert into member(name, email, password) values (%s,%s,%s)'
            val = (name, email, password)
            db.engine.execute(sql, val)
            response ={
                "ok":True
            }
            return jsonify(response),200
    except Exception as err:
        response = {
            "error": True,
            "message": f"{err}"
        }
        return jsonify(response),500

@user.route('/user/auth', methods=['PUT'])
def signin():
    try:
        data = request.json
        email = data['email']
        password = data['password']
        sql = 'select * from member where email = %s and password = %s'
        val = (email, password)
        sql_data = db.engine.execute(sql, val).fetchone()
        if sql_data:
            response = make_response(jsonify({"ok" : True}))
            id = sql_data['id']
            # 取得 DateTime 物件，此物件會設定為這部電腦上目前的日期和時間，以國際標準時間 (UTC) 表示。
            expire_time = datetime.utcnow() + timedelta(weeks=1)
            id = sql_data['id']
            payload = {"id":id , "exp": expire_time}
            jwt_encode = jwt.encode(payload, JWT_Key, algorithm = "HS256")
            response.set_cookie(key="JWT", value=f"{jwt_encode}", expires = expire_time)
            return response, 200
        else:
            response ={
                "error": True,
                "message": "帳號或密碼輸入錯誤"
            }
            return jsonify(response),400
    except Exception as err:
        response = {
            "error": True,
            "message": f"{err}"
        }
        return jsonify(response),500

#確認使用狀態
@user.route('/user/auth', methods=['GET'])
def get_userdata():
    cookie = request.cookies.get('JWT')
    try:
        # cookie = request.cookies.get('JWT')
        payload = jwt.decode(cookie, JWT_Key ,algorithms="HS256")
        sql = 'select * from member where id = %s'
        val = (payload['id'],)
        #Object of type LegacyRow is not JSON serializable
        # sql_data = db.engine.execute(sql, val).fetchone() #這是一個tuple
        # response = {"data": sql_data}
        sql_data = list(db.engine.execute(sql, val).fetchone())
        response = {"data": 
                {
                    "id": sql_data[0],
                    "name": sql_data[1],
                    "email": sql_data[2]
                }
            }
        return jsonify(response) ,200
    except:
        response = {"data": None}
        return jsonify(response), 200

#登出系統
@user.route('/user/auth', methods=['DELETE'])
def log_out():
    response = make_response(jsonify({"ok": True}))
    response.set_cookie(key="JWT", value="", expires = 0)
    return response, 200



# 這寫法可以操作資料庫
# @user.route('/test')
# def test():
#     sql='insert into member(name, email, password) values (%s,%s,%s)'
#     val=('Logan', 'logan@gmail.com', '12345678')
#     db.engine.execute(sql, val)