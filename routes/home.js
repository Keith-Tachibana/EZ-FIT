const express = require('express');
const router = express.Router();
const userController = require('../app/api/controller/users');
const path = require('path');

router.post('/register', userController.register);
router.post('/signin', userController.signin);
router.get('/', (req, res) => {
    // console.log(path.resolve(__dirname, '../'));
    res.sendFile('under_construction.html', { root: path.resolve(__dirname, '../')})
});

module.exports = router;