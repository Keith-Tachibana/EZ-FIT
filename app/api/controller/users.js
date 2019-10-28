const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
var ObjectID = require('mongodb').ObjectID;

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
  // console.log(req.body);
  const email = validator.normalizeEmail(req.body.email);
  if (!validator.isEmail(email)) {
    return res.json({
      status: "error",
      message: "Invalid email.",
      data: null
    });
  }
  userModel.findOne(
    {
      email: req.body.email
    },
    async (err, userInfo) => {
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
  );
}
function updatePassword(req, res, next) {
  const token = req.body.token;
  console.log('Did i get the tokeN?',token);
  let decoded;
  try{
    decoded = jwt.verify(token,"TEST_KEY");
    console.log('Did i get the code',decoded);
  }
  catch(err){
    res.json({
      status:"error",
      message:"Couldn't authorize token",
      data:null
    });
    next(err);
  }
  var userId = decoded.id;
  console.log('DId ig tet the IDee',userId);
  if (userId !== null) {
    userModel.findById(userId,async (err, userInfo) => {
      if (err) {
        next(err);
      } else {
        try {
          console.log('Old with the new',req.body.oldPassword,'vs',userInfo.password)
          const match = await bcrypt.compare(req.body.oldPassword, userInfo.password);
          if (match){
            userModel.updateOne({
              "_id": ObjectID(userId)
            },{$set: { "password" : req.body.password}}, async (err) =>{
            res.json({
              status:"success",
              message:"Successfully updated password",
              data:null
            });
            console.log("Didya?",res.json.message);
          });
          }
          else {
            console.log("Its a failer");
            res.json({
              status: "error",
              message: "Couldn't validate old password",
              data: null
            });
            next();
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

module.exports = { register, signin, updatePassword };
