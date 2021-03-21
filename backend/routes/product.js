const express = require('express');

const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/auth');

const {
	getAllProducts,
	createProduct,
	getSingleProductById,
	updateProductById,
	deleteProductById,
} = require('../controllers/productController');

router.route('/products').get(getAllProducts);
router.route('/products/:id').get(getSingleProductById);
router.route('/admin/products/new').post(isAuthenticatedUser, createProduct);

router
	.route('/admin/products/:id')
	.put(isAuthenticatedUser, updateProductById)
	.delete(isAuthenticatedUser, deleteProductById);

module.exports = router;
