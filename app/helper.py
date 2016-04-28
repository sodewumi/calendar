import json
from collections import defaultdict

def create_calendar_events(event_list):
    calendar_events_dict = defaultdict(list)
    for event in event_list:
        day = event.start_time.day
        event = {
            'day': day,
            'title': event.title,
            'startTimestampUTC': event.start_time.isoformat(),
            'endTimestampUTC': event.end_time.isoformat(),
            'title': event.title,
            'overlap': False,
        }

        calendar_events_dict[day].append(event)
    calendar_event_json = json.dumps(calendar_events_dict)
    return calendar_event_json

