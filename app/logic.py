import datetime

from model import db, Calendar, Event

def create_calendar(calendar_url):
	new_calendar = Calendar(url = calendar_url)
	db.session.add(new_calendar)
	db.session.commit()

def calender_exists(calendar_url):
	return db.session.query(
		Calendar
	).filter(
		Calendar.url == calendar_url
	).first()

def create_event(calendar_url):
	pass

def get_events_for_calendar():
	pass

def get_calendar():
	pass
