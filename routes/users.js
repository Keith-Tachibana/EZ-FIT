const express = require('express');
const router = express.Router();
const phrController = require('../app/api/controller/phr');
const userController = require('../app/api/controller/users');
router.get('/', phrController.getNameById);
router.post('/updatepassword',userController.updatePassword);
module.exports = router;