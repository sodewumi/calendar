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

# get_all_events_for_calendar(start, end, 'this')
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

# def get_events_for_a_specific_day(
# 	dateobj,
# 	calendar_url
# ):
# 	return db.session.query(
# 		Event
# 	).filter(
# 		Calendar.url == calendar_url,
#         Event.start_time.day == dateobj.day,
#         Event.start_time.month == dateobj.month,
#         Event.start_time.year == dateobj.year,
# 	).order_by(Event.start_time).all()
def get_events_for_a_specific_day1(
):
	return db.session.query(
		Event
	).filter(
		Calendar.url == "hey",
        Event.start_time.day == 0,
        Event.start_time.month == 4,
        Event.start_time.year == 18,
	).order_by(Event.start_time).all()
def get_overlapping_events_object(
	calendar_url,
	start_time,
	end_time
):
	event_alias = db.aliased(Event)

	return db.session.query(
		Event.event_id
	).join(
        event_alias,
        Event.event_id != event_alias.event_id
    ).filter(
        Event.start_time <= event_alias.end_time,
        Event.end_time >= event_alias.start_time,
        Event.calendar_url == calendar_url,
        event_alias.calendar_url == calendar_url,
        Event.start_time >= start_time,
        Event.end_time <= end_time,
    ).group_by(
    	Event.event_id
    )

def get_overlapping_events_in_calendar(
	calendar_url,
	start_time,
	end_time
):
	overlapping_events_object = get_overlapping_events_object(
		calendar_url,
		start_time,
		end_time
	)
	
	return overlapping_events_object.all()

def get_non_overlapping_events_in_calendar(
	calendar_url,
	start_time,
	end_time
):
	event_alias1 = db.aliased(Event)

	overlapping_events_object = get_overlapping_events_object(
		calendar_url,
		start_time,
		end_time
	)

	return db.session.query(
		Event.event_id
	).filter(
	    ~Event.event_id.in_(overlapping_events_object),
	    Event.calendar_url == calendar_url,
	    event_alias1.calendar_url == calendar_url,
        Event.start_time >= start_time,
        Event.end_time <= end_time,
	).group_by(
		Event.event_id
	).all()

if __name__ == "__main__":
    from flask import Flask

    app = Flask(__name__)
    connect_to_database(app)

 #    foo = db.session.query(
	# 	Event
	# ).filter(
	# 	Calendar.url == "hey",
 #        Event.start_time >= month_start,
 #        Event.end_time <= month_end,
	# ).order_by(Event.start_time).all()

