const pool = require('../database/pool');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const bcrypt = require('bcryptjs');

const createUserQuery = `INSERT INTO users (firstname, lastname, email, password, created_date, is_active, role) VALUES ($1, $2, $3, $4, Now(), true, 'user') RETURNING *`;

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
		res.status(201).json({
			success: true,
			data: result.rows,
		});
	} catch (err) {
		res.json(err.stack);
	}
});
