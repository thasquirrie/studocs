const User = require('../model/User');
const Request = require('../model/Request');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('../controllers/handlerFactory');

exports.getOverview = catchAsync(async(req, res, next) => {
    res.status(200).render('overview', {
        title: 'Student Crowdsourcing Site',
    });
});

exports.getSignUp = (req, res, next) => {
    res.status(200).render('signup', {
        title: 'Sign Up Page',
    });
};

exports.login = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login',
    });
};

exports.getAccount = (req, res, next) => {
    res.status(200).render('dashboard', {
        title: 'Dashboard',
        class: 'side-nav--active',
    });
};

exports.getSettings = (req, res, next) => {
    res.status(200).render('settings', {
        title: 'Settings',
    });
};

exports.getRequests = catchAsync(async(req, res, next) => {
    const requests = await Request.find();
    // console.log(requests);

    res.status(200).render('features', {
        title: 'Requests',
        requests,
    });
});

// exports.getRequests = handlerFactory.getAll(Request);

exports.getRequest = catchAsync(async(req, res, next) => {
    const request = await Request.findById(req.params.id).populate({
        path: 'comments',
    });

    console.log('Request:', request);
    res.status(200).render('request', {
        title: 'Request',
        request,
    });
});

exports.addRequest = (req, res, next) => {
    res.status(200).render('add-request', {
        title: 'Make a request'
    });
};