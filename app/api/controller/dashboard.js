const userModel = require('../models/users');
const axios = require('axios');

async function getNameById(req, res, next){
    await userModel.findById(req.body.userId, (err, userInfo) => {
        if (err){
            next(err);
        } else {
            res.json({
                status: "success",
                message: "User found",
                data: {
                    firstName: userInfo.contact.firstName,
                    lastName: userInfo.contact.lastName,
                }
            });
        }
    });
};

async function getVerificationStatus(req, res, next){
    try{
        const userInfo = await userModel.findById(req.body.userId);
        res.json({
            status: "success",
            message: "User found",
            data: {
                isVerified: userInfo.isVerified,
            }
        });
    } catch (err){
        next(err);
    }
}

async function getPersonalInfo(req, res, next){
    await userModel.findById(req.body.userId, (err, userInfo) => {
        if (err){
            next(err);
        } else {
            res.json({
                status: "success",
                message: "User found",
                data: {
                    firstName: userInfo.contact.firstName,
                    lastName: userInfo.contact.lastName,
                    email: userInfo.email,
                    phone: userInfo.contact.phone,
                    street: userInfo.contact.address.street,
                    city: userInfo.contact.address.city,
                    state: userInfo.contact.address.state,
                    postal: userInfo.contact.address.postal,
                    country: userInfo.contact.address.country,
                    additionalInfo: userInfo.contact.additionalInfo,
                }
            })
        }
    });
};

async function updatePersonalInfo(req, res, next){
    await userModel.updateOne({
        "_id": req.body.userId,
      } ,{$set: { 
            "contact.firstName": req.body.firstName,
            "contact.lastName": req.body.lastName,
            "email": req.body.email,
            "contact.address.phone": req.body.phone,
            "contact.address.street": req.body.street,
            "contact.address.city": req.body.city,
            "contact.address.state": req.body.state,
            "contact.address.postal": req.body.postal,
            "contact.address.country": req.body.country,
            "contact.additionalInfo": req.body.additionalInfo, 
        }}, (err) => {
          if (err){
              next(err);
          } else {
            res.json({
                status: "success",
                message: "Successfully updated personal information",
                data: null
              });
          }
    });
};

async function getActivitySummary(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        const accessToken = userInfo.authToken.access_token;
        const userId = userInfo.authToken.user_id;
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/activities/date/today.json`,
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept-Language': 'en_US',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            // console.log(resp.data);
            res.json({
                status: "success",
                message: "Successfully retrieved activity summary",
                data: resp.data,
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
                status: "error",
                message: "Error retrieving activity summary",
                data: null,
            })
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
        try {
            const resp = await axios.get(
                `https://api.fitbit.com/1/user/${userId}/activities/calories/date/today/30d.json`,
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            console.log(resp.data);
            const caloriesBurnedData = resp.data['activities-calories'].map(obj => {
                let rObj = {};
                rObj.dateTime = obj.dateTime;
                rObj.value = parseInt(obj.value);
                return rObj;
            });
            res.json({
                status: "success",
                message: "Successfully retrieved calories",
                data: {"activities-calories": caloriesBurnedData},
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
                status: "error",
                message: "Error getting calories data",
                data: null,
              });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {getNameById, getPersonalInfo, updatePersonalInfo, getActivitySummary, getCalories};