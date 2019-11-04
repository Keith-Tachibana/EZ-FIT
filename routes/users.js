const express = require('express');
const router = express.Router();
const dashboardController = require('../app/api/controller/dashboard');
const userController = require('../app/api/controller/users');

router.get('/getname', dashboardController.getNameById);
router.get('/getpersonalinfo', dashboardController.getPersonalInfo);
router.get('/signout', userController.signout);
router.post('/updatepersonalinfo', dashboardController.updatePersonalInfo);
router.post('/updatepassword',userController.updatePassword);

module.exports = router;