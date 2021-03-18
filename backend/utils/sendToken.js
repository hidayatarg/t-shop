// Create, Send and Save Token in the Cookie
const { tokenCreator } = require('../utils/tokenCreator');

exports.sendToken = (user, statusCode, res) => {
	const COOKIE_EXPIRE = 1; // 1 day
	const token = tokenCreator(user.id, user.email);

	// options
	const options = {
		expiresIn: new Date(Date.now() * COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token: token,
	});
};
