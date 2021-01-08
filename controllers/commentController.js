const Comment = require('../model/Comment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../controllers/handlerFactory');

exports.getAllComments = handlerFactory.getAll(Comment);

exports.setRequestAndUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.request) req.body.request = req.params.requestId;

  next();
};

exports.createReply = catchAsync(async (req, res, next) => {
  const reply = {
    body: req.body.body,
    replyUser: req.user.id,
  };

  const comment = await Comment.findById(req.params.id);

  if (!comment)
    return next(
      new AppError('No comment with that ID found on this server', 404)
    );

  comment.replies.push(reply);
  await comment.save();

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.getComment = handlerFactory.getOne(Comment);
exports.createComment = handlerFactory.createOne(Comment);
exports.updateComment = handlerFactory.updateOne(Comment);
exports.deleteComment = handlerFactory.deleteOne(Comment);
