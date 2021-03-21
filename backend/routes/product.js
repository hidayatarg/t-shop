const express = require('express');

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const {
	getAllProducts,
	createProduct,
	getSingleProductById,
	updateProductById,
	deleteProductById,
} = require('../controllers/productController');

router.route('/products').get(getAllProducts);
router.route('/products/:id').get(getSingleProductById);
router
	.route('/admin/products/new')
	.post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);

router
	.route('/admin/products/:id')
	.put(isAuthenticatedUser, authorizeRoles('admin'), updateProductById)
	.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProductById);

module.exports = router;
