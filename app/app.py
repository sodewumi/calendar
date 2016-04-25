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
    )

@app.errorhandler(404)
def page_not_found(err):
    return render_template('404.html'), 404

@socketio.on('connect', namespace='/chat')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('add calendar event', namespace='/chat')
def add_calendar_event(event):
    created_event = create_event(
        event['data']['startTimestampUTC'],
        event['data']['endTimestampUTC'],
        event['data']['eventTitle'],
        'foo',
    )
    emit('add calendar event response', {'data': 'Connectedss'})


if __name__ == "__main__":
    connect_to_database(app)
    Bootstrap(app)
    socketio.run(app)
    app.run(debug=True)

