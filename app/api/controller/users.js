const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const axios = require('axios');
const appConfig = require('../../../config/appConfig');
const mailgun = require('mailgun-js');

const DOMAIN = appConfig.mailDomain;
const mg = mailgun({ apiKey: appConfig.mailgunApiKey, domain: DOMAIN });

function sendVerificationEmail(email, verificationLink) {
    const data = {
        from:
            'EZ-FIT <no-reply@mail.ezfit.rocks>',
        to: email,
        subject: '[EZ-FIT] Activate your account',
        template: 'confirm_email',
        't:text': 'yes',
        'v:verification_link': verificationLink,
    };
    mg.messages().send(data, function(error, body) {
        console.log(body);
        if (error) {
            console.log(error);
        }
    });
}

function sendResetEmail(email, resetLink) {
    const data = {
        from:
            'EZ-FIT <no-reply@mail.ezfit.rocks>',
        to: email,
        subject: '[EZ-FIT] Password reset',
        template: 'reset_email',
        't:text': 'yes',
        'v:reset_link': resetLink,
    };
    mg.messages().send(data, function(error, body) {
        console.log(body);
        if (error) {
            console.log(error);
        }
    });
}

async function resendVerificationEmail(req, res, next) {
    try {
        const userInfo = await userModel.findOne({
            email: validator.normalizeEmail(req.body.email),
        });
        if (!userInfo) {
            return res.json({
                status: 'error',
                message: 'Error sending verification email',
                data: null,
            });
        }
        if (userInfo.isVerified) {
            return res.json({
                status: 'error',
                message: 'User already verified',
                data: null,
            });
        }
        const createdDate = new Date(userInfo.createdDate);
        const secret = userInfo.password + createdDate.toISOString();
        const token = jwt.sign(
            {
                id: userInfo._id,
                email: userInfo.email,
            },
            secret,
            { expiresIn: 86400 } // 24 hour expiration
        );
        const verificationLink =
            'https://' +
            req.hostname +
            '/verify?id=' +
            userInfo._id +
            '&token=' +
            token;
        sendVerificationEmail(userInfo.email, verificationLink);
        res.json({
            status: 'success',
            message: 'Verification email sent',
            data: null,
        });
    } catch (err) {
        console.log(err);
        return res.json({
            status: 'error',
            message: 'Error sending verification email',
            data: null,
        });
    }
}

async function register(req, res, next) {
    try {
        const userInfo = await userModel.create({
            contact: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            },
            email: validator.normalizeEmail(req.body.email),
            password: req.body.password,
            authToken: {},
            bodyStatus: {},
        });
        if (userInfo) {
            const createdDate = new Date(userInfo.createdDate);
            const secret = userInfo.password + createdDate.toISOString();
            const token = jwt.sign(
                {
                    id: userInfo._id,
                    email: userInfo.email,
                },
                secret,
                { expiresIn: 86400 } // 24 hour expiration
            );
            const verificationLink =
                'https://' +
                req.hostname +
                '/verify?id=' +
                userInfo._id +
                '&token=' +
                token;
            sendVerificationEmail(userInfo.email, verificationLink);
            res.json({
                status: 'success',
                message: 'Your account has been created.  Please check your email for verification.',
                data: null,
            });
        } else {
            res.json({
                status: 'error',
                message: 'Error adding user',
                data: null,
            });
        }
    } catch (err) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                res.json({
                    status: 'error',
                    message: 'This email is already registered',
                    data: null,
                });
            }
        }
    }
}

async function signin(req, res, next) {
    try {
        const userInfo = await userModel.findOne({
            email: validator.normalizeEmail(req.body.email),
        });
        if (!userInfo) {
            res.json({
                status: 'error',
                message: 'Invalid email/password',
                data: null,
            });
        } else {
            if (!userInfo.isVerified) {
                return res.json({
                    status:'error',
                    message: 'User not verified',
                    data: null,
                });
            }
            const expireTime = req.body.remember ? 86400 : 3600; // 24 hour if remember else 1 hour
            try {
                const match = await bcrypt.compare(
                    req.body.password,
                    userInfo.password
                );
                if (match) {
                    const token = jwt.sign(
                        { id: userInfo._id },
                        req.app.get('secretKey'),
                        { expiresIn: expireTime }
                    );
                    res.json({
                        status: 'success',
                        message: 'User found.',
                        data: { token: token },
                    });
                } else {
                    res.json({
                        status: 'error',
                        message: 'Invalid email/password',
                        data: null,
                    });
                }
            } catch (err) {
                res.json({
                    status: 'error',
                    message: 'Invalid email/password',
                    data: null,
                });
                next(err);
            }
        }
    } catch (err) {
        res.json({
            status: 'error',
            message: 'Invalid email/password',
            data: null,
        });
    }
}

function signout(req, res, next) {
    res.json({
        status: 'success',
        message: 'Successfully signed out',
        data: null,
    });
}

function updatePassword(req, res, next) {
    if (req.body.oldPassword === req.body.password) {
        req.json({
            status: 'error',
            message:
                'New password must not be the same as the current password',
            data: null,
        });
    }
    var userId = req.body.userId;
    if (userId !== null) {
        userModel.findById(userId, async (err, userInfo) => {
            if (err) {
                next(err);
            } else {
                try {
                    const match = await bcrypt.compare(
                        req.body.oldPassword,
                        userInfo.password
                    );
                    if (match) {
                        userInfo.password = req.body.password;
                        try {
                            await userInfo.save();
                            res.json({
                                status: 'success',
                                message: 'Successfully updated password',
                                data: null,
                            });
                        } catch (err) {
                            res.json({
                                status: 'error',
                                message: 'Error updating password',
                                data: null,
                            });
                        }
                    } else {
                        res.json({
                            status: 'error',
                            message: "Couldn't validate old password",
                            data: null,
                        });
                    }
                } catch (err) {
                    res.json({
                        status: 'error',
                        message: "Couldn't validate old password",
                        data: null,
                    });
                    next(err);
                }
            }
        });
    }
}

async function forgetPassword(req, res, next) {
    try {
        const userInfo = await userModel.findOne({
            email: validator.normalizeEmail(req.body.email),
        });
        if (!userInfo) {
            return res.json({
                status: 'success',
                message: 'Reset email sent if account exists.',
                data: null,
            });
        }
        createdDate = new Date(userInfo.createdDate);
        let secret = userInfo.password + createdDate.toISOString();
        const token = jwt.sign(
            { id: userInfo._id },
            secret,
            { expiresIn: 86400 } // 24 hour expiration
        );
        const resetLink =
            'https://' +
            req.hostname +
            '/resetpassword?id=' +
            userInfo._id +
            '&token=' +
            token;
        sendResetEmail(userInfo.email, resetLink);
        res.json({
            status: 'success',
            message: 'Reset email sent if account exists.',
            data: resetLink,
        });
    } catch (err) {
        next(err);
    }
}

async function resetPassword(req, res, next) {
    const userId = req.query.id;
    const resetToken = req.query.token;
    if (userId !== null) {
        const userInfo = await userModel.findById(userId);
        try {
            const createdDate = new Date(userInfo.createdDate);
            const secret = userInfo.password + createdDate.toISOString();
            jwt.verify(resetToken, secret, async (err, decoded) => {
                if (err) {
                    res.json({
                        status: 'error',
                        message: 'Invalid reset token',
                        data: null,
                    });
                } else {
                    // check if reset token id is same as user id
                    if (userId !== decoded.id) {
                        res.json({
                            status: 'error',
                            message: 'Invalid reset token',
                            data: null,
                        });
                    } else {
                        userInfo.password = req.body.password;
                        try {
                            await userInfo.save();
                            res.json({
                                status: 'success',
                                message: 'Successfully reset password',
                                data: null,
                            });
                        } catch (err) {
                            res.json({
                                status: 'error',
                                message: 'Invalid reset token',
                                data: null,
                            });
                        }
                    }
                }
            });
        } catch (err) {
            res.json({
                status: 'error',
                message: 'Invalid reset token',
                data: null,
            });
        }
    }
}

async function verify(req, res, next) {
    const userId = req.query.id;
    const verificationToken = req.query.token;
    try {
        let userInfo = await userModel.findById(userId);
        if (userInfo.isVerified) {
            return res.json({
                status: 'success',
                message: 'User already verified',
                data: null,
            });
        }
        const createdDate = new Date(userInfo.createdDate);
        const secret = userInfo.password + createdDate.toISOString();
        jwt.verify(verificationToken, secret, async (err, decoded) => {
            if (err) {
                res.json({
                    status: 'error',
                    message: err.message,
                    data: null,
                });
            } else {
                if (userId !== decoded.id) {
                    res.json({
                        status: 'error',
                        message: 'Invalid verification token',
                        data: null,
                    });
                } else {
                    userInfo = await userModel.updateOne(
                        {
                            _id: decoded.id,
                        },
                        {
                            $set: {
                                isVerified: true,
                            },
                        }
                    );
                    res.json({
                        status: 'success',
                        message: 'Successfully verified email',
                        data: null,
                    });
                }
            }
        });
    } catch (err) {
        res.json({
            status: 'error',
            message: 'Invalid reset token',
            data: null,
        });
    }
}

module.exports = {
    register,
    signin,
    signout,
    updatePassword,
    forgetPassword,
    resetPassword,
    verify,
    resendVerificationEmail,
};
