const userModel = require('../models/users');
const axios = require('axios');
const qs = require('querystring');
const authFlow = require('../controller/authflow');
const moment = require('moment');

async function checkTokenExpiry(tokenExpiry, userInfo) {
    try {
        const refreshRequired = Date.now() > tokenExpiry ? true : false;
        if (refreshRequired) {
            refreshResult = await authFlow.refreshToken(userInfo);
            if (refreshResult.status === 200) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } catch (err) {
        throw err;
    }
}

async function checkTokenStatus(userInfo) {
    try {
        if (userInfo) {
            if (
                authFlow.checkTokenValidity(userInfo.authToken) === false
            ) {
                return false;
            }
            const tokenExpiry = userInfo.authToken.expires_in;
            if (tokenExpiry !== '') {
                const refreshResult = await checkTokenExpiry(
                    tokenExpiry,
                    userInfo
                );

                return refreshResult;
            }
        }
    } catch (err) {
        throw err;
    }
}

async function getActivitySummary(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        const tokenStatus = await checkTokenStatus(userInfo);
        if (tokenStatus === false) {
            return res.json({
                status: 'error',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/activities/date/today.json`,
                {
                    headers: {
                        'Accept-Language': 'en_US',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            // console.log(resp.data);
            res.json({
                status: 'success',
                message: 'Successfully retrieved activity summary',
                data: resp.data,
            });
        } catch (err) {
            console.log(err.response.data.errors);
            res.json({
                status: 'error',
                message: 'Error retrieving activity summary',
                data: null,
            });
        }
    } catch (err) {
        next(err);
    }
}
async function getCaloriesBurned(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        const tokenStatus = await checkTokenStatus(userInfo);
        if (tokenStatus === false) {
            return res.json({
                status: 'error',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/activities/calories/date/today/30d.json`,
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            // console.log(resp.data);
            const caloriesBurnedData = resp.data[
                'activities-calories'
            ].map(obj => {
                let rObj = {};
                rObj.dateTime = obj.dateTime;
                rObj.value = parseInt(obj.value);
                return rObj;
            });
            res.json({
                status: 'success',
                message: 'Successfully retrieved calories',
                data: { 'activities-calories': caloriesBurnedData },
            });
        } catch (err) {
            console.log(err.response.data.errors);
            res.json({
                status: 'error',
                message: 'Error getting calories data',
                data: null,
            });
        }
    } catch (err) {
        next(err);
    }
}

async function getHeartRate(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        const tokenStatus = await checkTokenStatus(userInfo);
        if (tokenStatus === false) {
            return res.json({
                status: 'error',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/activities/heart/date/today/30d.json`,
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            // console.log(resp.data);
            const heartRateData = resp.data;
            res.json({
                status: 'success',
                message: 'Successfully retrieved heart rate data',
                data: heartRateData,
            });
        } catch (err) {
            console.log(err.response.data.errors);
            res.json({
                status: 'error',
                message: 'Error getting heart rate data',
                data: null,
            });
        }
    } catch (err) {
        next(err);
    }
}

async function getWeightData(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        const tokenStatus = await checkTokenStatus(userInfo);
        if (tokenStatus === false) {
            return res.json({
                status: 'error',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/body/weight/date/today/30d.json`,
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                        'Accept-Language': 'en_US',
                    },
                }
            );
            const weightData = resp.data;
            res.json({
                status: 'success',
                message: 'Successfully retrieved weight data',
                data:  weightData,
            });
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
              res.json({
                status: 'error',
                message: 'Error getting weight data',
                data: null,
            });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = { getActivitySummary, getCaloriesBurned, getHeartRate, getWeightData };
