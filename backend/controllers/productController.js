const pool = require('../database/pool');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const getAllProductsQuery = 'SELECT * FROM products ORDER BY id DESC';
const createProductQuery =
	'INSERT INTO products (name, price, description, rating, category_id, seller_id, stock_amount, created_date, created_by, is_active, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, Now(), $8, true, $9) RETURNING *';
const getProductByIdQuery = 'SELECT * FROM products WHERE id = $1';
const updateProductByIdQuery =
	'UPDATE products SET name = $1, price = $2, description = $3, rating = $4, category_id = $5, seller_id = $6, stock_amount = $7, updated_date = Now(), updated_by = $8, is_active = true WHERE id = $9 RETURNING *';
const deleteProductByIdQuery = 'DELETE FROM products WHERE id = $1';
const findProductByNameKeywordsQuery =
	'SELECT * FROM products WHERE LOWER(name) LIKE';

// GetAllProducts => api/v1/products
// GetAllProducts => api/v1/products?keyword = apple
const getAllProducts = async (req, res, next) => {
	const { keyword } = req.query;
	if (keyword) {
		const result = await pool.query(
			findProductByNameKeywordsQuery + "'%" + keyword + "%'"
		);
		if (result.rowCount === 0) {
			return next(new ErrorHandler('Product Not Found', 200));
		}

		return res.status(200).json({
			success: true,
			data: result.rows,
		});
	}
	const result = await pool.query(getAllProductsQuery);
	if (result.rowCount === 0) {
		return next(new ErrorHandler('Products Not Found', 200));
	}
	res.status(200).json({
		success: true,
		data: result.rows,
	});
};

// createProduct => api/v1/products/new
const createProduct = catchAsyncErrors(async (req, res, next) => {
	const {
		name,
		price,
		description,
		rating,
		category_id,
		seller_id,
		stock_amount,
		created_by,
	} = req.body;

	req.body.user_id = req.user.id;

	try {
		const result = await pool.query(createProductQuery, [
			name,
			price,
			description,
			rating,
			category_id,
			seller_id,
			stock_amount,
			created_by,
			user_id,
		]);
		res.status(201).json({
			success: true,
			data: result.rows,
		});
	} catch (err) {
		res.json(err.stack);
	}
});

// getSingleProductById => api/v1/products/:id
const getSingleProductById = async (req, res, next) => {
	const id = parseInt(req.params.id);
	const result = await pool.query(getProductByIdQuery, [id]);
	if (result.rowCount === 0) {
		return next(new ErrorHandler('Product Not Found', 404));
	}
	res.status(200).json({
		success: true,
		data: result.rows,
	});
};

const updateProductById = async (req, res, next) => {
	const id = parseInt(req.params.id);
	const {
		name,
		price,
		description,
		rating,
		category_id,
		seller_id,
		stock_amount,
		updated_by,
	} = req.body;

	try {
		const result = await pool.query(updateProductByIdQuery, [
			name,
			price,
			description,
			rating,
			category_id,
			seller_id,
			stock_amount,
			updated_by,
			id,
		]);
		res.status(200).json({
			success: true,
			data: result.rows,
		});
	} catch (err) {
		res.json(err.stack);
	}
};

const deleteProductById = async (req, res, next) => {
	const id = parseInt(req.params.id);
	try {
		const result = await pool.query(deleteProductByIdQuery, [id]);
		if (result.rowCount === 0) {
			return res.status(200).json({
				success: false,
				message: 'Not Found',
			});
		}
		res.status(200).json({
			success: true,
			message: `Product with ${id} has been deleted successfully`,
		});
	} catch (err) {
		res.json(err.stack);
	}
};

module.exports = {
	getAllProducts,
	createProduct,
	getSingleProductById,
	updateProductById,
	deleteProductById,
};
