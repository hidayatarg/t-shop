const express = require('express');

const router = express.Router();

const {
	registerUser,
	loginUser,
	logoutUser,
	forgotPassword,
	resetPassword,
	getUserProfile,
	updatePassword,
	updateUserProfile,
} = require('../controllers/authController');

// middleware
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/me/update').put(isAuthenticatedUser, updateUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

module.exports = router;
