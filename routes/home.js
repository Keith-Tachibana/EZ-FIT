const express = require('express');
const router = express.Router();
const userController = require('../app/api/controller/users');
const { check, validationResult } = require('express-validator');
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});
router.post('/register', [
    // check if is an email
    check('email').isEmail(),
    // check if password is at least 8 characters
    check('password').isLength({ min: 8 }),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ status:"error", errors: errors.array() });
    }
    userController.register(req, res, next);
});
router.post('/signin', userController.signin);
router.post('/updatePassword',userController.updatePassword);
module.exports = router;