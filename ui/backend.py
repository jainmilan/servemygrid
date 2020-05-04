# import libraries
import json
from flask import Flask, render_template, request, jsonify, redirect

# create a flast app
app = Flask(__name__)

UPLOAD_FOLDER = 'output'
ALLOWED_EXTENSIONS = {'json'}

# read the json file for building selection panel
building_types_file = open('input/buildingTypes.json')
building_types_JSON = json.load(building_types_file)

# read the json file for building selection panel
building_file = open('input/buildingJson.json')
building_JSON = json.load(building_file)

# default appliance list
default_appliances = {
	"HVAC": [
		{"label": "Power Conumption", "stream": "xyz", "filename": "xyz"}, 
		{"label": "Temperature", "stream": "xyz", "filename": "xyz"}
	], 
	"Lighting": [
		{"label": "Power Conumption", "stream": "xyz", "filename": "xyz"}, 
		{"label": "Temperature", "stream": "xyz", "filename": "xyz"}
	], 
	"Desktops": [
		{"label": "Power Conumption", "stream": "xyz", "filename": "xyz"}, 
		{"label": "Temperature", "stream": "xyz", "filename": "xyz"}
	], 
	"Laptops": [
		{"label": "Power Conumption", "stream": "xyz", "filename": "xyz"}, 
		{"label": "Temperature", "stream": "xyz", "filename": "xyz"}
	]
}
# decorator and function for the home page
@app.route("/")
def index():
	return render_template('index.html')

# decorator and function for the home page
@app.route("/analyse")
def analyze():
	return render_template('model.html')

# decorator and function for the home page
@app.route("/query", methods=['GET', 'POST'])
def build():
	if request.method == "POST":
		if request.json['query_type'] == 'scratch':
			return jsonify(building_types_JSON);
		elif request.json['query_type'] == 'upload':
			return render_template('building.html', building_types=building_types_JSON)
		elif request.json['query_type'] == 'map':
			return jsonify(building_JSON)
		elif request.json['query_type'] == 'default':
			return jsonify(default_appliances)
		else:
			return render_template('error_modal.html')
	else:
		return render_template('error_modal.html')
	

# main function
if __name__ == '__main__':
	
	# run the app
	app.run(debug=True)