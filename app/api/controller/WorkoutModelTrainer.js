const workoutFile = require('../data/workouts');
const userModel = require('../models/users');
const shuffle = require('knuth-shuffle').knuthShuffle;
const axios = require('axios');
const fitbitApi = require('./fitbitApiIntegration');
const moment = require('moment');

/* //Printing a nested object
function logRecursive(object) {
    for (key in object) {
        var value = object[key];
        if (typeof value === 'object') {
            console.log('{');
            logRecursive(value);
            console.log('}');
        } else {
            console.log(value);
        }
    }
} */
async function getFat(req) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        const tokenStatus = await fitbitApi.checkTokenStatus(userInfo);
        if (tokenStatus === false) {
            return res.json({
                status: 'error',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/body/fat/date/today/1d.json`,
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                        'Accept-Language': 'en_US',
                    },
                }
            );
            // const bmiData = resp.data;
            const fatData = resp.data['body-fat'].map(obj => {
                let rObj = {};
                rObj.dateTime = obj.dateTime;
                rObj.value = parseFloat(obj.value);
                return rObj;
            });
            return {
                status: 'success',
                message: 'Successfully retrieved fat data',
                data: { 'body-fat': fatData },
            };
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            return {
                status: 'error',
                message: 'Error getting fat data',
                data: null,
            };
        }
    } catch (err) {
        throw err;
    }
}
async function getAge(req) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        const tokenStatus = await fitbitApi.checkTokenStatus(userInfo);
        if (tokenStatus === false) {
            return res.json({
                status: 'error',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/profile.json`,
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                        'Accept-Language': 'en_US',
                    },
                }
            );
            // const bmiData = resp.data;
            const ageData = resp.data['user']['age'];
            return {
                status: 'success',
                message: 'Successfully retrieved age data',
                data: { age: ageData },
            };
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            return {
                status: 'error',
                message: 'Error getting Age data',
                data: null,
            };
        }
    } catch (err) {
        throw err;
    }
}
async function getBMI(req) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        const tokenStatus = await fitbitApi.checkTokenStatus(userInfo);
        if (tokenStatus === false) {
            return res.json({
                status: 'error',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/body/bmi/date/today/1d.json`,
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                        'Accept-Language': 'en_US',
                    },
                }
            );
            // const bmiData = resp.data;
            const bmiData = resp.data['body-bmi'].map(obj => {
                let rObj = {};
                rObj.dateTime = obj.dateTime;
                rObj.value = parseFloat(obj.value);
                return rObj;
            });
            console.log(bmiData);
            return {
                status: 'success',
                message: 'Successfully retrieved weight data',
                data: { 'body-bmi': bmiData },
            };
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            return {
                status: 'error',
                message: 'Error getting BMI data',
                data: null,
            };
        }
    } catch (err) {
        throw err;
    }
}

async function getWorkoutClusterFromModel(req) {
    //Fetch cluster from ezfit2
    //Get bmi, age and fat for prediction first
    try {
        var bmi, age, fat;
        const bmiResponse = await getBMI(req);
        if (bmiResponse.status === 'success') {
            bmi = bmiResponse.data['body-bmi'][0].value;
        }
        const ageResponse = await getAge(req);
        if (ageResponse.status === 'success') {
            age = ageResponse.data['age'];
        }
        const fatResponse = await getFat(req);
        if (fatResponse.status === 'success') {
            fat = fatResponse.data['body-fat'][0].value;
        }
        const resp = await axios.get(
            `https://ezfit2.herokuapp.com/model?fat=${fat}&age=${age}&bmi=${bmi}`,
            {},
            {}
        );
        if (resp.statusText === 'OK') return resp.data.prediction;
    } catch (err) {
        throw err;
    }
}
function getWorkoutForWeek(
    upperCheck,
    lowerCheck,
    generalStatus,
    workoutCluster
) {
    const weekWorkout = [];
    const restWorkoutElement = { name: 'Rest day', type: null, exercises: [] };
    const upperStatus = upperCheck.duration.substring(
        upperCheck.duration.indexOf('_') + 1
    );
    const lowerStatus = lowerCheck.duration.substring(
        lowerCheck.duration.indexOf('_') + 1
    );
    console.log(
        'General:',
        generalStatus,
        '\nUpper:',
        upperStatus,
        '\nLower:',
        lowerStatus
    );
    if (
        generalStatus === 'severe' ||
        (upperStatus === 'severe' && lowerStatus === 'severe')
    ) {
        weekWorkout.push(
            restWorkoutElement,
            restWorkoutElement,
            restWorkoutElement,
            restWorkoutElement,
            restWorkoutElement,
            restWorkoutElement,
            restWorkoutElement
        );
    } else {
        const upperWorkoutList =
            workoutFile.workouts[workoutCluster].workout[upperCheck.category];
        const lowerWorkoutList =
            workoutFile.workouts[workoutCluster].workout[lowerCheck.category];
        const cardioWorkoutList =
            workoutFile.workouts[workoutCluster].workout['cardio'];
        const upperWorkoutElement = {
            name: `Strength Training (${upperCheck.category})`,
            type: upperStatus,
            exercises: [],
        };
        const lowerWorkoutElement = {
            name: `Strength Training (${lowerCheck.category})`,
            type: lowerStatus,
            exercises: [],
        };
        const cardioWorkoutElement = {
            name: `Cardio Training`,
            type: lowerStatus,
            exercises: [],
        };

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
    }
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
    if (
        generalStatus === 'severe' ||
        (userInfo.bodyStatus.arms === 'severe' &&
            userInfo.bodyStatus.legs === 'severe')
    ) {
        durationStatus = 'duration_severe';
        const severeUpper = { category: 'upper', duration: durationStatus };
        const severeLower = { category: 'lower', duration: durationStatus };
        workoutPlan = getWorkoutForWeek(
            severeUpper,
            severeLower,
            generalStatus,
            workoutCluster
        );
    } else if (generalStatus === 'light') {
        durationStatus = 'duration_light';
        const lightUpper = { category: 'upper', duration: durationStatus };
        const lightLower = { category: 'lower', duration: durationStatus };
        workoutPlan = getWorkoutForWeek(
            lightUpper,
            lightLower,
            generalStatus,
            workoutCluster
        );
    } else if (generalStatus === 'normal') {
        const upperCheck = doArmCheck(userInfo);
        const lowerCheck = doLegCheck(userInfo);
        workoutPlan = getWorkoutForWeek(
            upperCheck,
            lowerCheck,
            generalStatus,
            workoutCluster
        );
    }
    return workoutPlan;
}
async function getPrediction(req, res, next) {
    try {
        const workoutCluster = await getWorkoutClusterFromModel(req);
        const userId = req.body.userId;
        if (userId !== null) {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                const workoutExpiry = userInfo.workout.workoutExpiry < moment();
                if (workoutExpiry) {
                    const workoutPlan = await getWorkout(
                        userInfo,
                        workoutCluster
                    );
                    //Use the below function to get the full workout printed out
                    // logRecursive(workoutPlan);
                    await userModel.updateOne(
                        { _id: req.body.userId },
                        {
                            $set: {
                                workout: {
                                    workoutPlan: workoutPlan,
                                    workoutExpiry: moment().endOf('week'),
                                },
                            },
                        }
                    );
                    res.json({
                        status: 'success',
                        message: 'Obtained workout plan for the week',
                        data: workoutPlan,
                    });
                } else {
                    res.json({
                        status: 'success',
                        message: 'Obtained workout plan for the week',
                        data: userInfo.workoutPlan,
                    });
                }
            }
        }
    } catch (err) {
        console.log('Error in creating workout', err);
        next(err);
    }
}

module.exports = { getPrediction };
