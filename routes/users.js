const express = require("express");
const router = express.Router();
const dashboardController = require("../app/api/controller/dashboard");
const userController = require("../app/api/controller/users");
const authController = require("../app/api/controller/authflow");

router.get("/getname", dashboardController.getNameById);
router.get("/getpersonalinfo", dashboardController.getPersonalInfo);
router.get("/signout", userController.signout);
router.post("/updatepersonalinfo", dashboardController.updatePersonalInfo);
router.post("/updatepassword", userController.updatePassword);
router.get("/checkOAuthTokenStatus", authController.checkOAuthTokenStatus);

module.exports = router;
