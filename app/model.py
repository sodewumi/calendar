import os 

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Calendar(object):
    """Calendar class"""

    __tablename__ = "calendars"

    url = db.Column(db.Integer, primary_key=True, autoincrement=True)
    events = db.relationship('Event', backref='events')

class Event(object):
    """Event Class"""

    __tablename__ = "events"

    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    calendar_url = db.Column(db.Integer, db.ForeignKey('calendars.url'))

def connect_to_database(app):
    """Connect the database to our Flask app."""

    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
    app.config['SQLALCHEMY_ECHO'] = True
    db.app = app
    db.init_app(app)
    db.create_all()

if __name__ == "__main__":
    from flask import Flask

    app = Flask(__name__)
    connect_to_db(app)