const express = require('express');
const router = express.Router();
const userAuthController = require('../../controllers/authController/userAuthController');
const loginLimiter = require('../../middlewares/loginLimiter');

router.route('/signup')
    .post(userAuthController.userSignup)

router.route('/signin')
    .post(loginLimiter, userAuthController.userSignin)

router.route('/signout')
    .post(userAuthController.userSignout)

module.exports = router