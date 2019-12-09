const workoutFile = require('../data/workouts');
const userModel = require('../models/users');
const shuffle = require('knuth-shuffle').knuthShuffle;

var trainingData;
var trainedModel;
// async function trainModel() {
//     if (appConfig.modelTrained) {
//         return false;
//     }
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
//         const saveModel = async () => {
//             await workoutModelKM.create({
//                 model: {
//                     it: trainedModel.it,
//                     k: trainedModel.k,
//                     centroids: trainedModel.centroids,
//                     idxs: trainedModel.idxs,
//                 },
//             });
//             appConfig.modelTrained = true;
//         };
//         saveModel();
//         // var counts = {};
//         // for (var i = 0; i < trainedModel.idxs.length; i++) {
//         //     var num = trainedModel.idxs[i];
//         //     counts[num] = counts[num] ? counts[num] + 1 : 1;
//         // }
//         // console.log(counts);
//         // const saveModel = async docmodel => {
//         //     await docmodel.save();
//         // };
//     } catch (err) {
//         console.log('Failed', err);
//     }
// }
async function getWorkoutClusterFromModel() {
    //Fetch cluster from ezfit2
    //Get bmi, age and fat for prediction first
    return 0;
}
function getWorkoutForWeek(upperCheck, lowerCheck, workoutCluster) {
    const weekWorkout = [];
    const upperWorkoutList =
        workoutFile.workouts[workoutCluster].workout[upperCheck.category];
    const lowerWorkoutList =
        workoutFile.workouts[workoutCluster].workout[lowerCheck.category];
    const cardioWorkoutList =
        workoutFile.workouts[workoutCluster].workout['cardio'];
    const upperWorkoutElement = { name: upperCheck.category, exercises: [] };
    const lowerWorkoutElement = { name: lowerCheck.category, exercises: [] };
    const cardioWorkoutElement = { name: 'cardio', exercises: [] };
    const restWorkoutElement = { name: 'rest', exercises: [] };

    upperWorkoutList.map(exerciseObj => {
        // const { name, category, url, ...durationObj } = exerciseObj;
        upperWorkoutElement.exercises.push({
            name: exerciseObj['exercise']['name'],
            category: exerciseObj['exercise']['category'],
            url: exerciseObj['exercise']['url'],
            duration: exerciseObj['exercise'][upperCheck.duration],
        });
    });
    lowerWorkoutList.map(exerciseObj => {
        // const { name, category, url, ...durationObj } = exerciseObj;
        lowerWorkoutElement.exercises.push({
            name: exerciseObj['exercise']['name'],
            category: exerciseObj['exercise']['category'],
            url: exerciseObj['exercise']['url'],
            duration: exerciseObj['exercise'][lowerCheck.duration],
        });
    });
    cardioWorkoutList.map(exerciseObj => {
        // const { name, category, url, ...durationObj } = exerciseObj;
        cardioWorkoutElement.exercises.push({
            name: exerciseObj['exercise']['name'],
            category: exerciseObj['exercise']['category'],
            url: exerciseObj['exercise']['url'],
            duration: exerciseObj['exercise'][lowerCheck.duration],
        });
    });
    weekWorkout.push(
        upperWorkoutElement,
        upperWorkoutElement,
        lowerWorkoutElement,
        lowerWorkoutElement,
        restWorkoutElement,
        restWorkoutElement,
        cardioWorkoutElement
    );
    const shuffledWorkoutWeek = shuffle(weekWorkout);
    return shuffledWorkoutWeek;
}

function doArmCheck(userInfo) {
    var armWorkout = {};
    if (userInfo.bodyStatus.arms === 'normal') {
        armWorkout = { category: 'upper', duration: 'duration_normal' };
    } else if (userInfo.bodyStatus.arms === 'light') {
        armWorkout = { category: 'upper', duration: 'duration_light' };
    } else armWorkout = { category: 'lower', duration: 'duration_light' };
    return armWorkout;
}
function doLegCheck(userInfo) {
    var lowerWorkout = {};
    if (userInfo.bodyStatus.legs === 'normal') {
        lowerWorkout = { category: 'lower', duration: 'duration_normal' };
    } else if (userInfo.bodyStatus.legs === 'light') {
        lowerWorkout = { category: 'lower', duration: 'duration_light' };
    } else lowerWorkout = { category: 'upper', duration: 'duration_light' };
    return lowerWorkout;
}
async function getWorkout(userInfo, workoutCluster) {
    const generalStatus = userInfo.bodyStatus.general;
    var durationStatus = 'normal';
    var workoutPlan = [];
    if (generalStatus === 'severe') {
        durationStatus = 'duration_severe';
        const severeUpper = { category: 'upper', duration: durationStatus };
        const severeLower = { category: 'lower', duration: durationStatus };
        workoutPlan = getWorkoutForWeek(
            severeUpper,
            severeLower,
            workoutCluster
        );
    } else if (generalStatus === 'light') {
        durationStatus = 'duration_light';
        const lightUpper = { category: 'upper', duration: durationStatus };
        const lightLower = { category: 'lower', duration: durationStatus };
        workoutPlan = getWorkoutForWeek(lightUpper, lightLower, workoutCluster);
    } else if (generalStatus === 'normal') {
        const upperCheck = doArmCheck(userInfo);
        const lowerCheck = doLegCheck(userInfo);
        workoutPlan = getWorkoutForWeek(upperCheck, lowerCheck, workoutCluster);
    }
    return workoutPlan;
}
async function getPrediction(req, res, next) {
    try {
        const workoutCluster = await getWorkoutClusterFromModel();
        const userId = req.body.userId;
        if (userId !== null) {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                const workoutPlan = await getWorkout(userInfo, workoutCluster);
                console.log('Gottteeeeem', workoutPlan);
                res.json({
                    status: 'success',
                    message: 'Obtained workout plan for the week',
                    data: workoutPlan,
                });
            }
        }
    } catch (err) {
        console.log('Error in creating workout', err);
        next(err);
    }
}

module.exports = { getPrediction };
