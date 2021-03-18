const jwt = require('jsonwebtoken');
const secretKey = 'VeryHardSecretKey';

exports.tokenCreator = (id, username, sessionTime = '24h') => {
	const signProperties = {
		username: username,
		id: id,
	};

	const options = {
		expiresIn: sessionTime,
	};

	return jwt.sign(signProperties, secretKey, options);
};
