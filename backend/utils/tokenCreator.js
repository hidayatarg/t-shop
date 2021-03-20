const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/configurationConst');

exports.tokenCreator = (id, username, sessionTime = '24h') => {
	const signProperties = {
		username: username,
		id: id,
	};

	const options = {
		expiresIn: sessionTime,
	};

	return jwt.sign(signProperties, SECRET_KEY, options);
};
