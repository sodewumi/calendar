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

	return new_event

def get_overlapping_events_in_calendar():
	event_alias = aliased(Event)
	event_alias1 = aliased(Event)
	q= db.session.query(event_alias).filter(event_alias.calendar_url=='foo').\
	                join(event_alias1).\
	                filter(event_alias.start_time <= event_alias1.end_time).\
	                filter(event_alias.end_time >= event_alias1.start_time).\
	                all()
	print q

def get_calendar():
	pass

# TODO: MOVE TO functions
# event_alias1 = aliased(Event)

# # get all overlapping events
# qa = db.session.query(Event.event_id).join(
#         event_alias1,
#         Event.event_id != event_alias1.event_id
#     ).filter(
#         Event.start_time <= event_alias1.end_time,
#         Event.end_time >= event_alias1.start_time,
#         Event.calendar_url == "foo",
#         event_alias1.calendar_url == "foo",
#         Event.start_time >= datetime.datetime(2012, 9, 1, 0, 0),
#         Event.end_time <= datetime.datetime(2012, 9, 30, 0, 0),
#     ).group_by(Event.event_id).all()

# # overlapping object
# qc = db.session.query(Event.event_id).join(
#         event_alias1,
#         Event.event_id != event_alias1.event_id
#     ).filter(
#         Event.start_time <= event_alias1.end_time,
#         Event.end_time >= event_alias1.start_time,
#         Event.calendar_url == "foo",
#         event_alias1.calendar_url == "foo",
#         Event.start_time >= datetime.datetime(2012, 9, 1, 0, 0),
#         Event.end_time <= datetime.datetime(2012, 9, 30, 0, 0),
#     )

# # get all non-oeverlapping events
# qb = db.session.query(Event.event_id).filter(
#     ~Event.event_id.in_(qc),
#     Event.calendar_url == "foo",
#     event_alias1.calendar_url == "foo",
#     Event.start_time >= datetime.datetime(2012, 9, 1, 0, 0),
#     Event.end_time <= datetime.datetime(2012, 9, 30, 0, 0),
# ).group_by(Event.event_id).all()

# # edit event
# # datetime value is obj's datetime
# all_overlapping_events_b4_edit = db.session.query(Event.event_id).filter(
#     Event.start_time <= datetime.datetime(2012, 9, 16, 1, 30),
#     Event.end_time >= datetime.datetime(2012, 9, 16, 5, 30),
# )
# # def update (eventobj_event_id)
# eventobj = db.session.query(Event).filter(
#     Event.event_id == eventobj_event_id
# ).one()

# eventobj.start_time = a_new_start_time
# eventobj.end_time = a_new_end_time

# db.session.commit()

# # turns red
# all_overlapping_events_after_edit = db.session.query(Event.event_id).filter(
#     Event.start_time <= eventobj.start_time,
#     Event.end_time >= eventobj.end_time,
# )

# # turn black
# all_overlaping_b4_edit_afterwards = db.session.query(
#         Event.event_id
#     ).filter(
#         and_(
#             # all things that were overlapping but are not anymore
#             # give me everything that was overlapping before the edit
#             Event.event_id.in_(all_overlapping_events_b4_edit),
#             # 
#             ~Event.event_id.in_(all_overlapping_events_after_edit)
#             Event.calendar_url == "foo",
#             event_alias1.calendar_url == "foo",
#             Event.start_time >= datetime.datetime(2012, 9, 1, 0, 0),
#             Event.end_time <= datetime.datetime(2012, 9, 30, 0, 0),
#         )

#     )


