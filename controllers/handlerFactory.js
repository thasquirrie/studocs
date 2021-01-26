const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Model } = require('mongoose');
const APIFeatures = require('../utils/ApiFeatures');
const { request } = require('../app');

exports.getAll = (Model, popOptions) =>
    catchAsync(async(req, res, next) => {
        // For nested route of comments and requests(hack)
        let filter = {};
        if (req.params.requestId) filter = { request: req.params.requestId };

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .fields()
            .page();

        if (popOptions) features.query.populate(popOptions);
        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            length: doc.length,
            // data: {
            //   data: doc,
            // },
            doc
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async(req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        // console.log(req.params.id);
        // console.log(doc);

        if (!doc)
            return next(
                new AppError(`No document with that ID found on this server`, 404)
            );

        res.status(200).json({
            status: 'success',
            doc,
        });
    });

exports.createOne = Model =>
    catchAsync(async(req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.updateOne = Model =>
    catchAsync(async(req, res, next) => {
        // console.log(req.params);
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc)
            return next(new AppError('No doc with that ID found on this server!'));

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.deleteOne = Model =>
    catchAsync(async(req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc)
            return next(
                new AppError('No document with that ID found on this server', 404)
            );

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });