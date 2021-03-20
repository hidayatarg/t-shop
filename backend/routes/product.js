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

router.route('/products').get(isAuthenticatedUser, getAllProducts);
router.route('/products/:id').get(isAuthenticatedUser, getSingleProductById);
router.route('/admin/products/new').post(createProduct);

router
	.route('/admin/products/:id')
	.put(updateProductById)
	.delete(deleteProductById);

module.exports = router;
