import datetime
import os

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Calendar(db.Model):
    """Calendar class"""

    __tablename__ = "calendars"

    url = db.Column(db.String(30), primary_key=True)
    date_created_timestamp = db.Column(db.DateTime(), nullable=False)
    events = db.relationship('Event', backref='events')

    def __init__(self, url):
        self.url = url
        self.date_created_timestamp = datetime.datetime.utcnow()

    def __repr__(self):
        return '<Calendar(url=%s, date_created_timestamp=%r)>' % (
            self.url,
            self.date_created_timestamp
        )

class Event(db.Model):
    """Event Class"""

    __tablename__ = "events"

    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    calendar_url = db.Column(db.String, db.ForeignKey('calendars.url'))

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