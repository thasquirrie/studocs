const express = require('express');
const requestController = require('../controllers/requestController');
const authController = require('../controllers/authController');
const commentRouter = require('../routes/commentRoutes');

const router = express.Router();

router.use('/:requestId/comments', commentRouter);

router
    .route('/')
    .get(requestController.getAllRequests)
    .post(
        authController.protect,
        requestController.setUserOnRequest,
        requestController.createRequest
    );

router
    .route('/:id')
    .get(requestController.getRequest)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'user'),
        requestController.deleteRequest
    )
    .patch(requestController.updateRequest);

module.exports = router;