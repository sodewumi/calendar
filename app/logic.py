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

def create_event(
	start_time,
	end_time,
	title,
	calendar_url
):
	new_event = Event(
		start_time=start_time,
		end_time=end_time,
		title=title,
		calendar_url=calendar_url
	)

	db.session.add(new_event)
	db.session.commit()

	return {"1":"2"}

def get_events_for_calendar():
	pass

def get_calendar():
	pass


