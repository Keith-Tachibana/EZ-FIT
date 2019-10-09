const express = require('express');
const router = express.Router();
const phrController = require('../app/api/controller/phr');
router.get('/', phrController.getNameById);

module.exports = router;