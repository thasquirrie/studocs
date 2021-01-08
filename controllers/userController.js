const User = require('../model/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../controllers/handlerFactory');

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

  const filteredBody = filterObj(req.body, 'name', 'email', 'username');
  // console.log(filteredBody);

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
