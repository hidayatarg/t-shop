const pool = require('../database/pool');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const bcrypt = require('bcryptjs');
const { sendToken } = require('../utils/sendToken');
const { resetPasswordToken } = require('../utils/security');
const { sendEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

// Queries
const createUserQuery = `INSERT INTO users (firstname, lastname, email, password, created_date, is_active, role) VALUES ($1, $2, $3, $4, Now(), true, 'user') RETURNING *`;
const getUserByEmailQuery = 'SELECT * FROM users WHERE email = $1';
const getUserByIdQuery = `SELECT id, firstname, lastname, email, created_date, avatar, role FROM users WHERE id = $1`;
const getUserAllDetailsByIdQuery = `SELECT * FROM users WHERE id = $1`;
const updateUserResetTokenByIdQuery = `UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE id = $3`;
const updateUserPasswordByIdQuery = `UPDATE users SET password = $1, reset_password_token = null, reset_password_expire = null WHERE id = $2`;
const getUserByPasswordTokenQuery = `SELECT * FROM users WHERE reset_password_token = $1 and reset_password_expire > $2`;
const updateUserProfileByIdQuery = `UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4`;
const getAllusersQuery = `SELECT * FROM users where is_active = true`;
// Admin Queries
// TODO: Add an Update Field for the Users Table
const updateUserDetailsByIdQuery = `UPDATE users SET firstname = $1, lastname = $2, email = $3, is_active = $4, role = $5 WHERE id = $6`;
const deleteUserByIdQuery = `DELETE FROM users WHERE id = $1`;

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

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
	const { email } = req.body;
	const user = await pool.query(getUserByEmailQuery, [email]);

	if (user.rowCount === 0) {
		return next(new ErrorHandler('User not found with this email', 404));
	}

	const data = user.rows[0];

	// Get reset token
	const reset = await resetPasswordToken();

	// Create reset password url
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/password/reset/${reset.resetToken}`;

	const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, ignore it.`;

	try {
		// update the user password token and expire
		await pool.query(updateUserResetTokenByIdQuery, [
			reset.resetPasswordToken,
			reset.resetPasswordExpire,
			data.id,
		]);

		await sendEmail({
			email: data.email,
			subject: 'T Shop Password Recovery',
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email sent to: ${data.email}`,
		});
	} catch (err) {
		reset.resetpasswordToken = undefined;
		reset.resetPasswordExpire = undefined;
		// Return error
		return next(new ErrorHandler(err.message, 500));
	}
});

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await pool.query(getUserByPasswordTokenQuery, [
		resetPasswordToken,
		Date.now(),
	]);

	if (user.rowCount === 0) {
		return next(
			new ErrorHandler('Password reset token is invalid or has expired', 400)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHandler('Password does not match', 400));
	}

	// Set up new password and Save
	try {
		const userData = user.rows[0];
		const encryptedPassword = await bcrypt.hash(req.body.password, 10);

		await pool.query(updateUserPasswordByIdQuery, [
			encryptedPassword,
			userData.id,
		]);
		sendToken(userData, 200, res);
	} catch (err) {
		return next(new ErrorHandler(err.message, 500));
	}
});

// Get currently logged user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
	// in the auth middleware we add user details in req.user
	const user = await (await pool.query(getUserByIdQuery, [req.user.id]))
		?.rows[0];
	res.status(200).json({
		success: true,
		user,
	});
});

// Update / change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	const user = await (
		await pool.query(getUserAllDetailsByIdQuery, [req.user.id])
	)?.rows[0];
	const isPasswordMatch = await bcrypt.compare(
		req.body.oldPassword,
		user.password
	);
	if (!isPasswordMatch) {
		return next(new ErrorHandler('Old password mismatch.', 400));
	}

	// update the password in database
	const encryptedPassword = await bcrypt.hash(req.body.password, 10);
	await pool.query(updateUserPasswordByIdQuery, [encryptedPassword, user.id]);
	sendToken(user, 200, res);
});

// Update user profile => /api/v1/me/update
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
	const { firstname, lastname, email } = req.body;
	// TODO: Update user avatar
	if (!firstname && !lastname && !email) {
		return next(
			new ErrorHandler('Firstname, lastname and email are required.')
		);
	}

	await pool.query(updateUserProfileByIdQuery, [
		firstname,
		lastname,
		email,
		req.user.id,
	]);

	res.status(200).json({
		success: true,
	});
});

// Admin routes
// Get all users => /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
	const users = (await pool.query(getAllusersQuery)).rows;

	res.status(200).json({
		success: true,
		users,
	});
});

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
	const user = await (await pool.query(getUserByIdQuery, [req.params.id]))
		?.rows[0];

	if (!user) {
		return next(
			new ErrorHandler(`User was not found with id: ${req.params.id}`)
		);
	}

	res.status(200).json({
		success: true,
		user,
	});
});

// Update user details => /api/v1/admin/user/:id
exports.updateUserDetails = catchAsyncErrors(async (req, res, next) => {
	const user = await (await pool.query(getUserByIdQuery, [req.user.id]))
		?.rows[0];

	if (!user) {
		new ErrorHandler(`User was not found with id: ${req.params.id}`);
	}

	const { firstname, lastname, email, isActive, role } = req.body;
	// TODO: Add a validation here

	await pool.query(updateUserDetailsByIdQuery, [
		firstname,
		lastname,
		email,
		isActive,
		role,
		req.user.id,
	]);

	res.status(200).json({
		success: true,
		message: `User with id: ${req.params.id} was updated successfully.`,
	});
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
	const user = await (await pool.query(getUserByIdQuery, [req.params.id]))
		?.rows[0];

	if (!user) {
		new ErrorHandler(`User was not found with id: ${req.params.id}`);
	}

	await pool.query(deleteUserByIdQuery, [req.params.id]);

	res.status(200).json({
		success: true,
		message: `User with id: ${req.params.id} was deleted successfully.`,
	});
});
