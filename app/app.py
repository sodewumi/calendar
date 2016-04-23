import jinja2

from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap

from model import connect_to_database


app = Flask(__name__)
app.secret_key = 'secret'
app.jinja_env.undefined = jinja2.StrictUndefined

@app.route("/")
def index():
    return render_template('homepage.html')

@app.route("/calendar/<int:calendar_url>")
def calendar(calendar_url):
	return render_template('calendar.html')

@app.errorhandler(404)
def page_not_found(err):
	return render_template('404.html'), 404

if __name__ == "__main__":
    connect_to_database(app)
    Bootstrap(app)
    app.run(debug=True)

