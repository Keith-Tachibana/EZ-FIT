const userModel = require('../models/users');
const axios = require('axios');
const qs = require('querystring');
const authFlow = require('../controller/authflow');
const moment = require('moment');

async function checkTokenExpiry(tokenExpiry, userInfo) {
    try {
        const refreshRequired = Date.now() > tokenExpiry ? true : false;
        if (refreshRequired) {
            refreshResult = await authFlow.refreshToken(req, userInfo);
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
                status: 'fail',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/activities/date/today.json`,
                {
                    headers: {
                        'content-type':
                            'application/x-www-form-urlencoded',
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
async function getCalories(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        const tokenStatus = await checkTokenStatus(userInfo);
        if (tokenStatus === false) {
            return res.json({
                status: 'fail',
                message: "Couldn't refresh token",
            });
        }
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/activities/calories/date/today/30d.json`,
                {
                    headers: {
                        'content-type':
                            'application/x-www-form-urlencoded',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            console.log(resp.data);
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

module.exports = { getActivitySummary, getCalories };
