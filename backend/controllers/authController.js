const pool = require('../database/pool');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const bcrypt = require('bcryptjs');
const { sendToken } = require('../utils/sendToken');

const createUserQuery = `INSERT INTO users (firstname, lastname, email, password, created_date, is_active, role) VALUES ($1, $2, $3, $4, Now(), true, 'user') RETURNING *`;
const getUserByEmailQuery = 'SELECT * FROM users WHERE email = $1';

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	const { firstname, lastname, email, password } = req.body;
	const encryptedPassword = await bcrypt.hash(password, 10);
	try {
		const result = await pool.query(createUserQuery, [
			firstname,
			lastname,
			email,
			encryptedPassword,
		]);

		if (result.rows) {
			const user = result.rows[0];
			sendToken(user, 201, res);
		}
	} catch (err) {
		res.json(err.stack);
	}
});

// Login a user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email && !password) {
		return next(new ErrorHandler('Please Enter Email and Password', 400));
	}

	// find user in the Database
	try {
		const result = await pool.query(getUserByEmailQuery, [email]);
		if (result.rowCount === 0) {
			return next(new ErrorHandler('Invalid Email or Password', 401));
		}

		// check the password
		const data = result.rows[0];
		const isPasswordMatch = await bcrypt.compare(password, data.password);
		if (!isPasswordMatch) {
			return next(new ErrorHandler('Invalid Email or Password', 401));
		}

		const user = result.rows[0];
		sendToken(user, 201, res);
	} catch (err) {
		res.json(err.stack);
	}
});

// Logout a user => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httponly: true,
	});

	res.status(200).json({
		success: true,
		message: 'User logged out',
	});
});
