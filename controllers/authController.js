const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const { findOneAndUpdate } = require('../model/User');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const details = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  };

  const newUser = await User.create(details);

  newUser.password = undefined;
  newUser.confirmPassword = undefined;

  //   const token = signToken(newUser.id);

  //   res.status(201).json({
  //     status: 'success',
  //     token,
  //     data: {
  //       user: newUser,
  //     },
  //   });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  // console.log('User', user);

  if (!user || !(await user.comparePasswords(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  //   const token = signToken(user._id);

  //   res.status(200).json({
  //     status: 'success',
  //     token,
  //   });

  user.password = undefined;
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token = '';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You need to be logged in to access this route', 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError(
        'This token does not belong to any user in the database',
        400
      )
    );

  const checked = user.changedPasswordAfter(decoded.iat);

  if (checked)
    return next(
      new AppError(
        'Password changed after token was issued! Please log in again',
        401
      )
    );

  req.user = user;

  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // console.log(req.cookies);
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);
    // console.log('Here', user);

    if (!user) return next();

    const checked = user.changedPasswordAfter(decoded.iat);

    // console.log('Here', user);

    if (checked) return next();

    res.locals.user = user;
    // console.log('Local user', res.locals.user);
    return next();
  }

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You are not authorized to perform this action', 403)
      );

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new AppError('Please provide an email', 400));

  const user = await User.findOne({ email });

  if (!user)
    return next(
      new AppError('No user with that email found on this server', 404)
    );

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Make a patch request to this reset url: ${resetURL}. Please ignore if you didn't make this request.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 15 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpireTime = undefined;

    user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the token to your email', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpireTime: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError('Token is invalid or token has expired', 404));

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordTokenExpireTime = undefined;
  await user.save();

  //   token = signToken(user.id);

  //   res.status(200).json({
  //     status: 'success',
  //     token,
  //   });

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  const { currentPassword, password, confirmPassword } = req.body;

  if (!(await user.comparePasswords(currentPassword, user.password)))
    return next(new AppError('Incorrect Current Password', 401));

  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    message: 'Password updated',
  });
});
