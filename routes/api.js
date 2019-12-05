const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const dashboardController = require('../app/api/controller/dashboard');
const userController = require('../app/api/controller/users');
const authController = require('../app/api/controller/authflow');
const fitbitApiController = require('../app/api/controller/fitbitApiIntegration');
const workoutPredictor = require('../app/api/controller/WorkoutModelTrainer');

/* Dashboard and User info routes */
router.get('/getname', dashboardController.getNameById);
router.get('/getpersonalinfo', dashboardController.getPersonalInfo);
router.get('/getbodystatus', dashboardController.getBodyStatus);
router.get('/signout', userController.signout);
router.post('/updatepersonalinfo', dashboardController.updatePersonalInfo);
router.post('/updatepassword', userController.updatePassword);

router.post(
    '/updatebodystatus',
    [
        // check if head exists
        check('head')
            .isLength({ min: 1 })
            .withMessage("Head can't be blank."),
        // check if arms exists
        check('arms')
            .isLength({ min: 1 })
            .withMessage("Arms can't be blank."),
        // check if legs exists
        check('legs')
            .isLength({ min: 1 })
            .withMessage("Legs can't be blank."),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ status: 'error', errors: errors.array() });
        }
        dashboardController.updateBodyStatus(req, res, next);
    }
);

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
router.get('/getbmidata', fitbitApiController.getBMIData);

/* Model routes */
router.get('/getWorkoutPrediction', workoutPredictor.trainModel);

module.exports = router;
