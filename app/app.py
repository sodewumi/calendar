import jinja2
import json
# import response

import dateutil.parser
from datetime import datetime
from collections import defaultdict
from flask import flash, Flask, jsonify, redirect, request, render_template
from flask.ext.bootstrap import Bootstrap
from flask_socketio import emit, join_room, leave_room, send, SocketIO

from forms import AddEventForm, CreateCalendarForm
from helper import create_calendar_events
from logic import calender_exists, create_calendar, create_event, get_all_events_for_calendar
from model import connect_to_database


app = Flask(__name__)
app.secret_key = 'secret'
app.jinja_env.undefined = jinja2.StrictUndefined
socketio = SocketIO(app)

@app.route("/", methods=["GET", "POST"])
def index():
    create_calendar_form = CreateCalendarForm()

    if create_calendar_form.validate_on_submit():
        calendar_url = create_calendar_form.data['url']

        if calender_exists(calendar_url):
            flash("That calendar name already exists!")
            return redirect('/')

        create_calendar(calendar_url)
        flash("You've created a calendar!")
        calendar_route = '/calendar/' + calendar_url
        return redirect(calendar_route)

    return render_template(
        'homepage.html',
        create_calendar_form = create_calendar_form
    )

@app.route("/calendar/<calendar_url>")
def calendar(calendar_url):
    add_event_form = AddEventForm()

    return render_template(
        'calendar.html',
        add_event_form = add_event_form,
        calendar_url = calendar_url,
    )

@app.errorhandler(404)
def page_not_found(err):
    return render_template('404.html'), 404

# TODO: change name of event
@socketio.on('join room', namespace='/calendar_app')
def join_calendar_room(events):
    calendar_event_dict = {}

    events_in_calendar = get_all_events_for_calendar(
        events['startMonthTimestampUTC'],
        events['endMonthTimestampUTC'],
        events['calendarURL'],
    )

    room_code = events['calendarURL']
    join_room(room_code)

    calendar_event_json = create_calendar_events(events_in_calendar)

    emit(
        'join room response',
        calendar_event_json,
        broadcast=True,
        room=room_code,
    )

@socketio.on('add calendar event', namespace='/calendar_app')
def add_calendar_event(event):

    created_event_obj = create_event(
        event['data']['startTimestampUTC'],
        event['data']['endTimestampUTC'],
        event['data']['eventTitle'],
        event['data']['calendarURL'],
    )

    events_in_calendar = get_all_events_for_calendar(
        event['data']['startOfDay'],
        event['data']['endOfDay'],
        event['data']['calendarURL'],
    )

    create_event_json = create_calendar_events(events_in_calendar)
    room_code = event['data']['calendarURL']

    emit(
        'add calendar event response',
        create_event_json,
        broadcast=True,
        room=event['data']['calendarURL']
    )

@socketio.on('leave room', namespace='/calendar_app')
def leave_calendar_room(room):
    leave_room(room['room'])

    emit(
        'leave room response',
        {'msg': "left room" + room['room']},
        broadcast=True,
        room=room['room'],
    )

if __name__ == "__main__":
    connect_to_database(app)
    Bootstrap(app)
    socketio.run(app)
    app.run(debug=True)
