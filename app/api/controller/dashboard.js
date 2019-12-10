const userModel = require('../models/users');
const moment = require('moment');

async function getNameById(req, res, next) {
    await userModel.findById(req.body.userId, (err, userInfo) => {
        if (err) {
            next(err);
        } else {
            res.json({
                status: 'success',
                message: 'User found',
                data: {
                    firstName: userInfo.contact.firstName,
                    lastName: userInfo.contact.lastName,
                },
            });
        }
    });
}

async function getVerificationStatus(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        res.json({
            status: 'success',
            message: 'User found',
            data: {
                isVerified: userInfo.isVerified,
            },
        });
    } catch (err) {
        next(err);
    }
}

async function getPersonalInfo(req, res, next) {
    await userModel.findById(req.body.userId, (err, userInfo) => {
        if (err) {
            next(err);
        } else {
            res.json({
                status: 'success',
                message: 'User found',
                data: {
                    firstName: userInfo.contact.firstName,
                    lastName: userInfo.contact.lastName,
                    email: userInfo.email,
                    phone: userInfo.contact.phone,
                    street: userInfo.contact.address.street,
                    city: userInfo.contact.address.city,
                    state: userInfo.contact.address.state,
                    postal: userInfo.contact.address.postal,
                    country: userInfo.contact.address.country,
                    additionalInfo: userInfo.contact.additionalInfo,
                },
            });
        }
    });
}

async function updatePersonalInfo(req, res, next) {
    await userModel.updateOne(
        {
            _id: req.body.userId,
        },
        {
            $set: {
                'contact.firstName': req.body.firstName,
                'contact.lastName': req.body.lastName,
                email: req.body.email,
                'contact.address.phone': req.body.phone,
                'contact.address.street': req.body.street,
                'contact.address.city': req.body.city,
                'contact.address.state': req.body.state,
                'contact.address.postal': req.body.postal,
                'contact.address.country': req.body.country,
                'contact.additionalInfo': req.body.additionalInfo,
            },
        },
        err => {
            if (err) {
                next(err);
            } else {
                res.json({
                    status: 'success',
                    message: 'Successfully updated personal information',
                    data: null,
                });
            }
        }
    );
}

async function getBodyStatus(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        if (userInfo) {
            res.json({
                status: 'success',
                message: 'Body status found',
                data: {
                    general: userInfo.bodyStatus.general,
                    arms: userInfo.bodyStatus.arms,
                    legs: userInfo.bodyStatus.legs,
                },
            });
        } else {
            res.json({
                status: 'error',
                message: 'User not found',
                data: null,
            });
        }
    } catch (err) {
        next(err);
    }
}

async function updateBodyStatus(req, res, next) {
    try {
        const userInfo = await userModel.findById(req.body.userId);
        if (userInfo) {
            if (
                userInfo.bodyStatus.general === req.body.general &&
                userInfo.bodyStatus.arms === req.body.arms &&
                userInfo.bodyStatus.legs === req.body.legs
            ) {
                res.json({
                    status: 'success',
                    message: 'No change in body status',
                    data: null,
                });
            } else {
                const doc = await userModel.updateOne(
                    {
                        _id: req.body.userId,
                    },
                    {
                        $set: {
                            'bodyStatus.general': req.body.general,
                            'bodyStatus.arms': req.body.arms,
                            'bodyStatus.legs': req.body.legs,
                            workoutExpiry: moment() + 1000,
                        },
                    }
                );
                res.json({
                    status: 'success',
                    message: 'Successfully updated body status',
                    data: null,
                });
            }
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getNameById,
    getPersonalInfo,
    updatePersonalInfo,
    getBodyStatus,
    updateBodyStatus,
};
