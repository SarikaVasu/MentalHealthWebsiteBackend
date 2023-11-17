const express = require('express');
const router = express();
const postsApiController = require('../../controllers/apiControllers/postsApiController');

router.route('/')
    .get(postsApiController.getAllPosts)
    .post( postsApiController.createNewPost)
    .put( postsApiController.updatePost)
    .delete( postsApiController.deletePost)

router.route('/:id')
    .put(postsApiController.updatePostById)
    .delete(postsApiController.deletePostById)
    .patch(postsApiController.updateReactionById)

module.exports = router;
