const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('./catchAsyncErrors');
const pool = require('../database/pool');
const { SECRET_KEY } = require('../config/configurationConst');
const ErrorHandler = require('../utils/errorHandler');

const getUserByIdQuery = 'SELECT * FROM users WHERE id = $1';

// Check user authentication
exports.isAuthenticatedUser = async (req, res, next) => {
	// if the token is in header
	/*
	const authorizationHeader = req.headers['authorization'];
    let token;

    if (authorizationHeader) {
        // from front end it will come as Bearer TTTTOOOKKKEEEN
        //  token = authorizationHeader.split(' ')[1];
        // for backend
        token = authorizationHeader;

    }
	*/
	if (!req.headers.cookie) {
		return next(new ErrorHandler('Login first to access this resource', 401));
	}

	const token = req.headers.cookie.split('token=')[1];

	console.log('token: ', token);

	if (!token) {
		return next(new ErrorHandler('Login first to access this resource', 401));
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		console.log('Decoded User: ', decoded);
		// check the avaliablity in database
		req.user = await pool.query(getUserByIdQuery, [decoded.id]);
		next();
	} catch (err) {
		console.log('error: ', err.stack);
		res.status(403).json({
			error: 'Not Authorized to Make Rquest',
		});
	}
};
