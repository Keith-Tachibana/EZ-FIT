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

async function getPersonalInfo(req, res, next){
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
                    email: userInfo.email,
                    phone: userInfo.contact.phone,
                    street: userInfo.contact.address.street,
                    city: userInfo.contact.address.city,
                    state: userInfo.contact.address.state,
                    postal: userInfo.contact.address.postal,
                    country: userInfo.contact.address.country,
                    additionalInfo: userInfo.contact.additionalInfo,
                }
            })
        }
    });
};

async function updatePersonalInfo(req, res, next){
    await userModel.updateOne({
        "_id": req.body.userId,
      } ,{$set: { 
            "contact.firstName": req.body.firstName,
            "contact.lastName": req.body.lastName,
            "email": req.body.email,
            "contact.address.phone": req.body.phone,
            "contact.address.street": req.body.street,
            "contact.address.city": req.body.city,
            "contact.address.state": req.body.state,
            "contact.address.postal": req.body.postal,
            "contact.address.country": req.body.country,
            "contact.additionalInfo": req.body.additionalInfo, 
        }}, (err) => {
          if (err){
              next(err);
          } else {
            res.json({
                status:"success",
                message:"Successfully updated personal information",
                data:null
              });
          }
    });
};


module.exports = {getNameById, getPersonalInfo, updatePersonalInfo};