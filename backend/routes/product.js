const express = require("express");

const router = express.Router();

const {
  getAllProducts,
  createProduct,
  getSingleProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/productController");

router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getSingleProductById);
router.route("/admin/products/new").post(createProduct);

router
  .route("/admin/products/:id")
  .put(updateProductById)
  .delete(deleteProductById);

module.exports = router;
