from flask.ext.wtf import Form
from wtforms import StringField, SubmitField, validators

class CreateCalendarForm(Form):
	url = StringField('Calendar Name', [validators.Length(max=30), validators.Required()])
	submit = SubmitField('Create!')
