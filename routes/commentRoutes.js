const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(commentController.getAllComments)
  .post(
    authController.protect,
    commentController.setRequestAndUserId,
    commentController.createComment
  );

router
  .route('/:id')
  .get(commentController.getComment)
  .post(authController.protect, commentController.createReply)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
