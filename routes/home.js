const express = require('express');
const router = express.Router();
const userController = require('../app/api/controller/users');
const { check, validationResult } = require('express-validator');
const validator = require('validator');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

router.post('/verify', (req, res, next) => {
    userController.verify(req, res, next);
});

router.post('/register', [
    // check if firstName exists
    check('firstName').isLength({ min: 1 }).withMessage('First name can\'t be blank.'),
    // check if lastName exists
    check('lastName').isLength({ min: 1 }).withMessage('Last name can\'t be blank.'),
    // check if is an email
    check('email').isEmail().withMessage('Invalid email.'),
    // check if password is at least 8 characters
    check('password').isLength({ min: 8 }).withMessage('Password must be 8 chars long.'),
], (req, res, next) => {
    req.body.email = validator.normalizeEmail(req.body.email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ status: "error", errors: errors.array() });
    }
    userController.register(req, res, next);
});

router.post('/signin', [
    // check if is an email
    check('email').isEmail().withMessage('Invalid email.'),
], (req, res, next) => {
    req.body.email = validator.normalizeEmail(req.body.email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ status: "error", errors: errors.array() });
    }
    userController.signin(req, res, next);
});

router.post('/forgetpassword', [
    // check if is an email
    check('email').isEmail().withMessage('Invalid email.'),
], (req, res, next) => {
    req.body.email = validator.normalizeEmail(req.body.email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ status: "error", errors: errors.array() });
    }
    userController.forgetPassword(req, res, next);
});

router.post('/resetpassword', [
    check('password').isLength({ min: 8 }).withMessage('Password must be 8 chars long.'),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ status: "error", errors: errors.array() });
    }
    userController.resetPassword(req, res, next);
});

router.post('/resendverificationemail', (req, res, next) => {
    req.body.email = validator.normalizeEmail(req.body.email);
    userController.resendVerificationEmail(req, res, next);
});

module.exports = router;