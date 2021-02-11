const express = require("express");

const router = express.Router();

const { getAllProducts, createProduct, getSingleProductById } = require("../controllers/productController");

router.route("/products").get(getAllProducts);
router.route("/products/new").post(createProduct);
router.route("/products/:id").get(getSingleProductById);

module.exports = router;
