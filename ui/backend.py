# import libraries
import json
from flask import Flask, render_template

# create a flast app
app = Flask(__name__)

# read the json file for building selection panel
building_types_file = open('input/buildingTypes.json')
building_types_JSON = json.load(building_types_file)

# decorator and function for the home page
@app.route("/")
def index():
	return render_template('index.html', building_types=building_types_JSON)

# main function
if __name__ == '__main__':
	
	# run the app
	app.run(debug=True)