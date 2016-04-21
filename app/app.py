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

if __name__ == "__main__":
    connect_to_database(app)
    Bootstrap(app)
    app.run(debug=True)

