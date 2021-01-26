const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Upload = require('../model/Upload');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../controllers/handlerFactory');
const { diskStorage } = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const DB = process.env.DB_LOCAL;

const storage = diskStorage({
    destination: (req, file, cb) => {
        console.log('Yes this is called');
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];

        cb(null, `${file.originalname.split('.')[0]}-${Date.now()}.${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFiles = ['pdf', 'txt', 'epub'];
    if (file.mimetype.split('/')[1].includes(...allowedFiles) || file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                `The file type uploaded is '${
          file.mimetype.split('/')[1]
        }' and it's not allowed on this server`,
                400
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
});

exports.uploads = upload.single('file');

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach(el => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });

//   return newObj;
// };

exports.uploadFile = catchAsync(async(req, res, next) => {
    console.log(req.file);
    if (!req.file) return next(new AppError('No file recieved!', 400));

    //   const filteredBody = filterObj(req.body, 'name', 'file', '');

    //   const uploads = Upload.create();

    const newUpload = {
        name: req.file.filename,
        user: req.user.id,
        file: req.file.mimetype.split('/')[1],
    };

    console.log({ newUpload });

    await new Upload(newUpload).save();

    res.status(201).json({
        status: 'success',
        data: {
            upload: newUpload,
        },
    });
});

exports.getFiles = catchAsync(async(req, res, next) => {
    const files = await Upload.find().populate();

    res.status(200).json({
        status: 'success',
        length: files.length,
        data: {
            files,
        },
    });
});