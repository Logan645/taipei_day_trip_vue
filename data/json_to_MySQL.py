import json, os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()
MySQL_password=os.getenv('MySQL_password') #密碼更新
mydb = mysql.connector.connect(
    host = 'localhost', 
    user = 'root', 
    password = '{}'.format(MySQL_password), 
    database = 'taipei_day_trip')
mycursor = mydb.cursor()

with open('data/taipei-attractions.json') as file:
    data=json.load(file)
    # print(data)
    # print(data['result']['results'][0])
    # attractions = []
    for i in data['result']['results']:
        # id = i['_id']
        name = i['name']    
        category = i['CAT']
        description = i['description']
        address = i['address']
        transport = i['direction']
        mrt = i['MRT']
        latitude = i['latitude']
        longitude = i['longitude']
        images = []
        for j in i['file'].split('https://'):
            if j.lower().endswith('jpg') or j.lower().endswith('.png'):
                image = 'https://' + j
                images.append(image)
        sql = 'insert into attractions (name, category, description, address, transport, mrt, latitude, longitude, images) values(%s, %s, %s, %s, %s, %s, %s, %s, %s)'
        val = (name, category, description, address, transport, mrt, latitude, longitude, json.dumps(images))
        mycursor.execute(sql,val)
        mydb.commit()