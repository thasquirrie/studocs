const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const authController = require('../controllers/authController');
const router = express.Router();

const upload = multer({ dest: 'public/uploads' });

router
  .route('/')
  .get(uploadController.getFiles)
  .post(
    uploadController.uploads,
    authController.protect,
    uploadController.uploadFile
  );

// router.post('/', upload.single('file'), uploadController.upload);

module.exports = router;
