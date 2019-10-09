const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function register(req, res, next){
    userModel.create({
        contact: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        },
        email: req.body.email,
        password: req.body.password,
    }, (err, result) => {
        if (err){
            if (err.name === 'MongoError' && err.code === 11000){
                res.json({
                    status: "error",
                    message: "This email is already registered.",
                    data: null,
                });
            }
            next(err);
        } else {
            res.json({
                status: "success",
                message: "User added successfully.",
                data: null,
            });
        }
    });
};

function signin(req, res, next){
    userModel.findOne({
        'email': req.body.email,
    }, async (err, userInfo) => {
        if (err){
            next(err);
        } else {
            const match = await bcrypt.compare(req.body.password, userInfo.password);
            if (match){
                const token = jwt.sign(
                    {id: userInfo._id},
                    req.app.get('secretKey'),
                    {expiresIn: 300}); //5 minute JWT tokens for now
                res.json({
                    status: "success",
                    message: "User found.",
                    data: {token: token},
                })
            } else {
                res.json({
                    status: "error",
                    message: "Invalid email/password.",
                    data: null,
                });
            }
        }
    });
};

module.exports = {register, signin};