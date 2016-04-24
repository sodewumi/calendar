from flask.ext.wtf import Form
from wtforms import DateTimeField, StringField, SubmitField, validators

class CreateCalendarForm(Form):
	url = StringField('Calendar Name', [validators.Length(max=30), validators.Required()])
	submit = SubmitField('Create!')

# (TODO) add error handeling if event is longer than a day or start_time is ;ess
#  than end_time
class AddEventForm(Form):
	event_title = StringField('Title', [validators.Required()])
	day = DateTimeField('Day', [validators.Required()])
	start_time = DateTimeField('Event Start', [validators.Required()])
	end_time = DateTimeField('Event End', [validators.Required()])
	submit = SubmitField('Add New Event!')