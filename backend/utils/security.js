const crypto = require('crypto');

exports.resetPasswordToken = async user => {
	// Generate token
	const resetToken =
		crypto.randomBytes(20) && crypto.randomBytes(20).toString('hex');

	// Hash and set to the resetPasswordToken in the database
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set token expire time and save to the database
	const resetPasswordExpire = Date.now() + 30 * 60 * 1000;

	return {
		resetToken,
		resetPasswordToken,
		resetPasswordExpire,
	};
};
