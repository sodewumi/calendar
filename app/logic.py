import datetime

from model import Calendar, connect_to_database, db, Event


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

	return new_event

def get_all_events_for_calendar(
  date_start,
  date_end,
  calendar_url,
):
  return db.session.query(
    Event
  ).filter(
    Event.calendar_url == calendar_url,
        Event.start_time >= date_start,
        Event.end_time <= date_end,
  ).order_by(Event.start_time).all()

if __name__ == "__main__":
    from flask import Flask

    app = Flask(__name__)
    connect_to_database(app)
