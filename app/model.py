import datetime
import os

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Calendar(db.Model):
    """Calendar class"""

    __tablename__ = "calendars"

    url = db.Column(db.String(30), primary_key=True)
    events = db.relationship('Event', backref='calendar')

    def __repr__(self):
        return '<Calendar(url=%s)>' % (
            self.url,
        )

class Event(db.Model):
    """Event Class"""

    __tablename__ = "events"

    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    calendar_url = db.Column(db.String, db.ForeignKey('calendars.url'))

    def __repr__(self):
        return '<Event(event_id=%r, start_time=%r, end_time=%r, title=%r, "calendar_url="%r)>' % (
            self.event_id,
            self.start_time,
            self.end_time,
            self.title,
            self.calendar_url,
        )

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
    connect_to_database(app)
