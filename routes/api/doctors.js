const express = require('express');
const router = express();
const doctorsApiController = require('../../controllers/apiControllers/doctorsApiController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles');

router.route('/')
    .get(doctorsApiController.getAllDoctorinfos)
    .patch(doctorsApiController.updateDoctorinfo)
    .delete(doctorsApiController.deleteDoctorinfo);


module.exports = router;
