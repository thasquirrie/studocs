const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/signup', viewController.getSignUp);
router.get('/login', viewController.login);
router.get('/dashboard', viewController.getAccount);
router.get('/settings', viewController.getSettings);

module.exports = router;
