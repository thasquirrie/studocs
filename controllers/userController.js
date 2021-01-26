const multer = require('multer');
const sharp = require('sharp');
const User = require('../model/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../controllers/handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `${req.user.role}-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload images only. Try again', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.userPhotoUpload = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${req.user.role}-${req.user.id}-${Date.now()}.jpeg`;
  console.log(req.file.filename);

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This is not the route to update password, this is just for updating user profile',
        401
      )
    );

  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'username',
    'department'
  );
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  currentUser.active = false;
  await currentUser.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      currentUser,
    },
  });
});
exports.getAllUsers = handlerFactory.getAll(User);

exports.getUser = handlerFactory.getOne(User, {
  path: 'comments',
  select: 'comment -user',
});

exports.updateUser = handlerFactory.updateOne(User);
