const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

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
              { expiresIn: 300 }
            ); //5 minute JWT tokens for now
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
  console.log("Just checking if I'm here");
  const userToken = sessionStorage.getItem("access-token");
  if (userToken !== null) {
    var decoded = jwt.verify(userToken, req.app.get("secretKey"));
    var userId = decoded.id;
    userModel.findOne({ _id: userId }).then(function(err, userInfo) {
      if (err) {
        next(err);
      } else {
        try {
          if (bcrypt.match(req.body.oldPassword, userInfo.password))
            res.json({
              status: "success",
              message: "Correct old password",
              data: null
            });
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
  console.log(userToken);
}

module.exports = { register, signin, updatePassword };
