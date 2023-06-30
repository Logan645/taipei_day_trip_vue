from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Attraction(db.Model):
    __tablename__ = 'attractions'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(255))
    category = db.Column(db.String(255))
    description = db.Column(db.String(10000))
    address = db.Column(db.String(1000))
    transport = db.Column(db.String(1000))
    mrt = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    images = db.Column(db.JSON)
