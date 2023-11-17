const express = require('express');
const router = express.Router();
const refreshController = require('../../controllers/authController/refreshController');

router.route('/refresh')
    .get(refreshController.refresh)

module.exports = router