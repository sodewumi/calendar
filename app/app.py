import jinja2

from flask import flash, Flask, jsonify, redirect, request, render_template
from flask.ext.bootstrap import Bootstrap
from flask_socketio import emit, join_room, leave_room, send, SocketIO

from forms import AddEventForm, CreateCalendarForm
from logic import calender_exists, create_calendar, create_event
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

@socketio.on('connect', namespace='/calendar_app')
def connect_to_calendar():

    emit('connection response', {'msg':"user has connected"})

# TODO: change name of event
@socketio.on('join room', namespace='/calendar_app')
def join_calendar_room(event):

    join_room(event['calendarURL'])
    emit('join room response', {'msg':"user has joined room " +event['calendarURL']})

@socketio.on('add calendar event', namespace='/calendar_app')
def add_calendar_event(event):

    created_event_obj = create_event(
        event['data']['startTimestampUTC'],
        event['data']['endTimestampUTC'],
        event['data']['eventTitle'],
        event['data']['calendarURL'],
    )

    created_event = {
        'event_id': created_event_obj.event_id,
        'start_time': created_event_obj.start_time.isoformat(),
        'end_time': created_event_obj.end_time.isoformat(),
        'title': created_event_obj.title,
        'calendar_url': created_event_obj.calendar_url,
    }

    emit('add calendar event response', created_event)


if __name__ == "__main__":
    connect_to_database(app)
    Bootstrap(app)
    socketio.run(app)
    app.run(debug=True)

