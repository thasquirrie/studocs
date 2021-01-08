const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'A comment must have a comment body'],
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    request: {
      type: mongoose.Schema.ObjectId,
      ref: 'Request',
      required: [true, 'A comment must have a request'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A comment must have a user'],
    },
    replies: [
      {
        body: {
          type: String,
          required: [true, 'A reply must have a body'],
        },
        replyUser: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: [true, 'A reply must have a user'],
        },
        dateCreated: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  //   .populate({
  //     path: 'request',
  //     select: 'title',
  //   });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
