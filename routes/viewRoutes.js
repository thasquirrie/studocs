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
router.get('/features', viewController.getRequests);
router.get('/request/:id', viewController.getRequest);
router.get('/add-request', viewController.addRequest);

module.exports = router;