// const fs = require('fs');
// const parse = require('csv-parse/lib/sync');
// const kmeans = require('skmeans');
// const workoutModelKM = require('../models/workoutmodel');

// var trainingData;
// var trainedModel;
// function modelTest() {}
// async function trainModel() {
//     try {
//         const data = fs.readFileSync('data.csv', function(err, data) {
//             if (err) {
//                 console.error(err);
//                 return false;
//             }
//         });
//         parseData(data);
//     } catch (err) {
//         throw err;
//     }
// }
// function parseData(data) {
//     const records = parse(data);
//     trainingData = records.slice(1).map(function(d) {
//         return d.map(function(entry) {
//             return Number(entry);
//         });
//     });
//     getModel(trainingData);
// }
// function getModel(trainingData) {
//     try {
//         trainedModel = kmeans(trainingData, 4, [
//             [6.1, 22, 23.332],
//             [22.1, 35, 27.325],
//             [24.2, 40, 29.016],
//             [32.6, 50, 31.79],
//         ]);
//         modelTest = trainedModel.test;
//         const saveModel = async () => {
//             await workoutModelKM.create({
//                 model: {
//                     it: trainedModel.it,
//                     k: trainedModel.k,
//                     centroids: trainedModel.centroids,
//                     idxs: trainedModel.idxs,
//                 },
//             });
//         };
//         saveModel();
//         var counts = {};
//         for (var i = 0; i < trainedModel.idxs.length; i++) {
//             var num = trainedModel.idxs[i];
//             counts[num] = counts[num] ? counts[num] + 1 : 1;
//         }
//         console.log(counts);
//         // const saveModel = async docmodel => {
//         //     await docmodel.save();
//         // };
//     } catch (err) {
//         console.log('Failed', err);
//     }
// }
// function getPrediction(model) {
//     console.log(model);
// }

// module.exports = { trainModel, getPrediction, modelTest };
