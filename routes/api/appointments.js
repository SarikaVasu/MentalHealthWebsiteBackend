const express = require('express');
const router = express();
const appointmentsApiController = require('../../controllers/apiControllers/appointmentsApiController');

router.route('/')
    .get(appointmentsApiController.getAppinfoByDateDoctor) //check clashes
    .post(appointmentsApiController.createAppinfo)
    .patch(appointmentsApiController.updateAppinfo)
    .delete(appointmentsApiController.deleteAppinfo);

router.route('/:id')
    .get(appointmentsApiController.getAllAppinfos)  //display app for each user

module.exports = router;
