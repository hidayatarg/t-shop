const { json } = require('express')
const pool = require('../database/pool')
const getAllProductsQuery = 'SELECT * FROM products ORDER BY id DESC'

const getProducts = async(req, res, next) => {
    
    // pool
    //     .query(getAllProductsQuery)
    //     .then(result => {
    //         res.status(200).json({
    //             success: true,
    //             data: result.rows
    //         })
    //     })
    //     .catch(e => res.json(e.stack))

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

module.exports = {
    getProducts
}
