const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        'Please provide an authentic email address!',
      ],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    department: {
      type: String,
      default: 'Specify your department',
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Password is needed for authentication'],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      // required: [true, 'User needs to confirm password'],
      // validate: {
      //   validator: function (el) {
      //     return this.password === el;
      //   },
      //   message: "Passwords don't match",
      // },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordTokenExpireTime: Date,
    active: {
      type: Boolean,
      default: true,
      //   select: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

userSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 5000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  // console.log(await bcrypt.compare(candidatePassword, userPassword));
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTime = this.passwordChangedAt.getTime() / 1000;
    // console.log(typeof changedTime);

    // console.log(`Result: ${changedTime}, ${JWTTimestamp}`);
    // console.log(changedTime > JWTTimestamp);
    return changedTime > JWTTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordTokenExpireTime = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
