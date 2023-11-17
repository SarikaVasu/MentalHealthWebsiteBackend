const express = require('express');
const router = express();
const usersApiController = require('../../controllers/apiControllers/usersApiController');
const verifyJWT = require('../../middlewares/verifyJWT');

router.use(verifyJWT)

router.route('/')
    .get(usersApiController.getAllUserinfos)
    .put(usersApiController.updateUserinfoAll)
    .patch(usersApiController.updateUserinfo)
    .delete(usersApiController.deleteUserinfo);



module.exports = router;
