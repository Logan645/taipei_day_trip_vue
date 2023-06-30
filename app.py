from flask import *
app=Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"]=True #當flask偵測到template有修改後，會自動去更新。
app.config["JSON_SORT_KEYS"] = False #Json是否自動排序
app.config["JSON_AS_ASCII"]=False #把对象序列化为 ASCII-encoded JSON

#註冊blueprint 
from api.attractions_route import attractions
from api.user import user
from api.booking import booking
app.register_blueprint(attractions, url_prefix="/api")
app.register_blueprint(user, url_prefix="/api")
app.register_blueprint(booking, url_prefix="/api")

from dotenv import load_dotenv
import os
from api.models import db
load_dotenv()
MySQL_password=os.getenv('MySQL_password')
JWT_Key = os.getenv('JWT_Key')
#会追踪对象的修改并且发送信号。这需要额外的内存， 如果不必要的可以禁用它。
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#要連線的資料庫
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://root:{MySQL_password}@localhost:3306/taipei_day_trip"
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
	"pool_pre_ping":True,
	"pool_recycle": 300,
    'pool_timeout': 900,
    'pool_size': 10,
    'max_overflow': 5,
}
db.init_app(app)

@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
#change MySQL passwords
app.run(host='0.0.0.0', port=3333, debug=True)