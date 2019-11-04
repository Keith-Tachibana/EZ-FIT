const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
var ObjectID = require('mongodb').ObjectID;
const  appConfig = require('../../../config/appConfig');
function register(req, res, next) {
  userModel.create(
    {
      contact: {
        firstName: req.body.firstName,
        lastName: req.body.lastName
      },
      email: validator.normalizeEmail(req.body.email),
      password: req.body.password
    },
    (err, result) => {
      if (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          res.json({
            status: "error",
            message: "This email is already registered.",
            data: null
          });
        }
        next(err);
      } else {
        res.json({
          status: "success",
          message: "User added successfully.",
          data: null
        });
      }
    }
  );
}

function signin(req, res, next) {
  console.log(req.body.email);
  userModel.findOne(
    {
      email: validator.normalizeEmail(req.body.email),
    },
    async (err, userInfo) => {
      if (!userInfo) {
        res.json({
          status: "error",
          message: "Invalid email/password.",
          data: null
        });
      } else {
        if (err) {
          next(err);
        } else {
          try {
            const match = await bcrypt.compare(
              req.body.password,
              userInfo.password
            );
            if (match) {
              const token = jwt.sign(
                { id: userInfo._id },
                req.app.get("secretKey"),
                { expiresIn: 30000 }
              ); //500 minute JWT tokens for now
              res.json({
                status: "success",
                message: "User found.",
                data: { token: token }
              });
            } else {
              res.json({
                status: "error",
                message: "Invalid email/password.",
                data: null
              });
            }
          } catch (err) {
            res.json({
              status: "error",
              message: "Invalid email/password.",
              data: null
            });
            next(err);
          }
        }
      }
    }
  );
}

function signout(req, res, next) {
  res.json({
    status: "success",
    message: "Successfully signed out",
    data: null,
  });
}

function updatePassword(req, res, next) {
  if(req.body.oldPassword === req.body.password){
    req.json({
      status:"error",
      message:"New password must not be the same as the current password",
      data:null
    });
    next(err);
  }
  var userId = req.body.userId;
  if (userId !== null) {
    userModel.findById(userId,async (err, userInfo) => {
      if (err) {
        next(err);
      } else {
        try {
          const match = await bcrypt.compare(req.body.oldPassword, userInfo.password);
          if (match){
            const hashedPassword = await bcrypt.hash(req.body.password,appConfig.saltRounds);
            userModel.updateOne({
              "_id": ObjectID(userId)
            },{$set: { "password" : hashedPassword}}, async (err) =>{
            res.json({
              status:"success",
              message:"Successfully updated password",
              data:null
            });
          });
          }
          else {
            res.json({
              status: "error",
              message: "Couldn't validate old password",
              data: null
            });
          }
        } catch (err) {
          res.json({
            status: "error",
            message: "Couldn't validate old password",
            data: null
          });
          next(err);
        }
      }
    });
  }
}

function forgetPassword(req, res, next) {
  userModel.findOne(
    {
      email: validator.normalizeEmail(req.body.email),
    },
    async (err, userInfo) => {
      if (!userInfo) {
        return res.json({
          status: "success",
          message: "Reset email sent.",
          data: null,
        });
      }
      if (err){
        next(err);
      } else {
        try {
          createdDate = new Date(userInfo.createdDate);
          let secret = userInfo.password + createdDate.toISOString();
          console.log(secret);
          const token = jwt.sign(
            { id: userInfo._id },
            secret,
            { expiresIn: 60 * 60 * 24 }
          );
          res.json({
            status: "success",
            message: "Reset email sent.",
            data: token,
          });
        } catch (err) {
          next(err);
        }
      }
    }
  )
}

function resetPassword(req, res, next) {

}

module.exports = { register, signin, signout, updatePassword, forgetPassword, resetPassword };
