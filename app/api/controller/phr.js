const userModel = require('../models/users');

async function getNameById(req, res, next){
    await userModel.findById(req.body.userId, (err, userInfo) => {
        if (err){
            next(err);
        } else {
            res.json({
                status: "success",
                message: "User found",
                data: {
                    firstName: userInfo.contact.firstName,
                    lastName: userInfo.contact.lastName,
                }
            });
        }
    });
};

module.exports = {getNameById};