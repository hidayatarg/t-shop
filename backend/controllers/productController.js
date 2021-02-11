const pool = require('../database/pool')
const getAllProductsQuery = 'SELECT * FROM products ORDER BY id DESC'
const createProductQuery = 'INSERT INTO products (name, price, description, rating, category_id, seller_id, stock_amount, created_date, created_by, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, Now(), $8, true) RETURN'
const getProducts = async(req, res, next) => {
        try {
            const result = await pool.query(getAllProductsQuery)
            res.status(200).json({
                success: true,
                data: result.rows
            })
        } catch (err) {
            res.json(err.stack)
        }
}

const createProduct = async(req, res, next) => {
    const { 
        name, 
        price, 
        description, 
        rating, 
        category_id, 
        seller_id,
        stock_amount,
        created_by,
    } = request.body


    try {
        const result = await pool.query(createProductQuery, [...req.body])
        res.status(200).json({
            success: true,
            data: result.rows
        })
    } catch (err) {
        res.json(err.stack)
    }
}

module.exports = {
    getProducts
}
