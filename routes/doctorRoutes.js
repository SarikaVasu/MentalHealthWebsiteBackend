const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(doctorsController.getAllDoctors)
    .post(doctorsController.createNewDoctor)
    .patch(doctorsController.updateDoctor)
    .delete(doctorsController.deleteDoctor)

module.exports = router;

