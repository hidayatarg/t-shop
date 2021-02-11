const pool = require("../database/pool");
const getAllProductsQuery = "SELECT * FROM products ORDER BY id DESC";
const createProductQuery =
  "INSERT INTO products (name, price, description, rating, category_id, seller_id, stock_amount, created_date, created_by, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, Now(), $8, true) RETURNING *";
const getProductByIdQuery = "SELECT * FROM products WHERE id = $1";

const getAllProducts = async (req, res, next) => {
  try {
    const result = await pool.query(getAllProductsQuery);
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    res.json(err.stack);
  }
};

const createProduct = async (req, res, next) => {
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
    ]);
    res.status(201).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    res.json(err.stack);
  }
};

const getSingleProductById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(getProductByIdQuery, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "result not found",
      });
    }
    res.status(200).json({
      success: false,
      data: result.rows,
    });
  } catch (err) {
    res.json(err.stack);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getSingleProductById,
};
