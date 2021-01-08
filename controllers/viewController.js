const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
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
