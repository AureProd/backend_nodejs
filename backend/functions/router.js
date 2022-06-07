const express = require('express');
const router = express.Router()

const homeController = require('../routes/home_controller');
const authController = require('../routes/auth_controller');
const securityController = require('../routes/security_controller');
const userController = require('../routes/user_controller');

router.all("/", [homeController.homePage]);

router.post("/login", [authController.loginRequest, authController.sendMailVerifEmail, userController.sendUserToken]);
router.post("/register", [authController.registerRequest, authController.sendMailVerifEmail, userController.sendUserToken]);
router.get("/me", [securityController.authUser, userController.sendUserInformations]);

module.exports = router;