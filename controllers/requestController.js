const Request = require('../model/Request');
const APIFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('../controllers/handlerFactory');

exports.getAllRequests = handlerFactory.getAll(Request, 'comments');

exports.setUserOnRequest = (req, res, next) => {
  req.body.user = req.user._id;

  next();
};

exports.createRequest = handlerFactory.createOne(Request);
exports.getRequest = handlerFactory.getOne(Request, 'comments');
exports.updateRequest = handlerFactory.updateOne(Request);
exports.deleteRequest = handlerFactory.deleteOne(Request);
