const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
	// if error StatusCode is not avaliable throw 500
	err.statusCode = err.statusCode || 500;

	if (process.env.NODE_ENV === 'DEVELOPMENT') {
		res.status(err.statusCode).json({
			success: false,
			error: err,
			errorMessage: err.message,
			stack: err.stack,
		});
	}

	if (process.env.NODE_ENV === 'PRODUCTION') {
		const error = { ...err };

		error.message = err.message;

		res.status(error.statusCode).json({
			success: false,
			message: error.message || 'Invalid Server Error',
		});
	}
	// TODO: added for the development of the vscode debugger
	// Delete after project completes
	else {
		res.status(err.statusCode).json({
			success: false,
			error: err,
			errorMessage: err.message,
			stack: err.stack,
		});
	}
};
