const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const kmeans = require('skmeans');
const workoutModelKM = require('../models/workoutmodel');

var trainingData;
var trainedModel;
var modelTest;
async function trainModel() {
    try {
        const data = fs.readFileSync('data.csv', function(err, data) {
            if (err) {
                console.error(err);
                return false;
            }
        });
        parseData(data);
    } catch (err) {
        throw err;
    }
}
function parseData(data) {
    const records = parse(data);
    trainingData = records.slice(1).map(function(d) {
        return d.map(function(entry) {
            return Number(entry);
        });
    });
    getModel(trainingData);
}
function getModel(trainingData) {
    trainedModel = kmeans(trainingData, 4);
    modelTest = trainedModel.test;
    const saveModel = async () => {
        await workoutModelKM.create({
            model: {
                it: trainedModel.it,
                k: trainedModel.k,
                centroids: trainedModel.centroids,
                idxs: trainedModel.idxs,
            },
        });
    };
    // console.log(trainedModel);
    // const saveModel = async docmodel => {
    //     await docmodel.save();
    // };
}
function getPrediction(model) {
    console.log(model);
}

module.exports = { trainModel, getPrediction, modelTest };
