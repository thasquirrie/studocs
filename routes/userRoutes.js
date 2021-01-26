const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgetPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.patch(
  '/updateMe',
  authController.protect,
  userController.userPhotoUpload,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

module.exports = router;
