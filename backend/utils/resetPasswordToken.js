const crypto = require('crypto');

exports.resetPasswordToken = () => {
	// Generate token
	const restToken = crypto.randomBytes(20).tostring('hex');

	// Hash and set to the resetPasswordToken in the database
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(restToken)
		.digest('hex');

	// Set token expire time and save to the database
	const resetPasswordExpire = Date.now() + 30 * 60 * 1000;

	return restToken;
};
