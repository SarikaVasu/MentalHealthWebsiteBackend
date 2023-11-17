const express = require('express');
const router = express.Router();
const doctorAuthController = require('../../controllers/authController/doctorAuthController');
const loginLimiter = require('../../middlewares/loginLimiter');

router.route('/signup')
    .post(doctorAuthController.doctorSignup)

router.route('/signin')
    .post(loginLimiter, doctorAuthController.doctorSignin)

router.route('/signout')
    .post(doctorAuthController.doctorSignout)

module.exports = router