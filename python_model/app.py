from flask import Flask, jsonify
from flask_restful import reqparse, abort, Api, Resource
import pickle
import numpy as np
from joblib import load
from waitress import serve
import os

app = Flask(__name__)
api = Api(app)


model = load('lib/models/model.joblib')

# argument parsing
parser = reqparse.RequestParser()
parser.add_argument('fat', required=True, type=float)
parser.add_argument('age', required=True, type=int)
parser.add_argument('bmi', required=True, type=float)

class PredictWorkout(Resource):
    def get(self):
        # use parser and find the user's query
        args = parser.parse_args()
        fat = args['fat']
        age = args['age']
        bmi = args['bmi']

        query = [fat, age, bmi]
        print("Query: Fat: {} Age: {} BMI: {} ".format(fat, age, bmi))

        # vectorize the user's query and make a prediction
        prediction = model.predict(np.array(query).reshape(1, -1))

        print("Prediction: ", int(prediction[0]))
        # create JSON object
        output = {'prediction': int(prediction[0])}

        return output


# Setup the Api resource routing here
# Route the URL to the resource
api.add_resource(PredictWorkout, '/model')

@app.errorhandler(404)
def invalid_route(e):
    return jsonify({
        'errorCode': 404,
        'message': 'Route not found'
        })


if __name__ == '__main__':
    # app.run()
    serve(app, port=os.environ['PORT'])