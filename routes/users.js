const express = require('express');
const router = express.Router();
const dashboardController = require('../app/api/controller/dashboard');
const userController = require('../app/api/controller/users');
const authController = require('../app/api/controller/authflow');
const fitbitApiController = require('../app/api/controller/fitbitApiIntegration');

/* Dashboard and User info routes */
router.get('/getname', dashboardController.getNameById);
router.get('/getpersonalinfo', dashboardController.getPersonalInfo);
router.get('/signout', userController.signout);
router.post('/updatepersonalinfo', dashboardController.updatePersonalInfo);
router.post('/updatepassword', userController.updatePassword);

/* Fitbit authorization with OAuth 2.0 routes*/
router.get('/checkOAuthTokenStatus', authController.checkOAuthTokenStatus);
router.post('/obtainToken', authController.obtainToken);
router.post('/revokeToken', authController.revokeToken);

/* Fitbit API integration routes */
router.get('/getcaloriesburned', fitbitApiController.getCaloriesBurned);
router.get('/getactivitysummary', fitbitApiController.getActivitySummary);
router.get('/getheartrate', fitbitApiController.getHeartRate);
router.get('/getweightdata', fitbitApiController.getWeightData);
router.get('/getweightgoal', fitbitApiController.getWeightGoal);

module.exports = router;
