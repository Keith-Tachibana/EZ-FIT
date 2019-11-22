const express = require('express');
const router = express.Router();
const dashboardController = require('../app/api/controller/dashboard');
const userController = require('../app/api/controller/users');
const authController = require('../app/api/controller/authflow');
const fitbitApiController = require('../app/api/controller/fitbitApiIntegration');

router.get('/getname', dashboardController.getNameById);
router.get('/getpersonalinfo', dashboardController.getPersonalInfo);
router.get('/signout', userController.signout);
router.post('/updatepersonalinfo', dashboardController.updatePersonalInfo);
router.post('/updatepassword', userController.updatePassword);
router.get('/checkOAuthTokenStatus', authController.checkOAuthTokenStatus);
router.post('/obtainToken', authController.obtainToken);
router.post('/revokeToken', authController.revokeToken);

router.get('/getUserSummary', fitbitApiController.getUserSummary);

module.exports = router;
