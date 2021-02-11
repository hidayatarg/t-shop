## Node JS React JS BootCamp
Under Development an Open-source E-commerce Framework

### PG Admin Example
```js
// promises
const getProducts = async(req, res, next) => {  
    pool
        .query(getAllProductsQuery)
        .then(result => {
            res.status(200).json({
                success: true,
                data: result.rows
            })
        })
        .catch(e => res.json(e.stack))

// Async await
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
```

### TODO
    - Create a Seeder => Not DONE
    - Create Validator for Post and Put Methods => Not DONE

### Seting ENV in MacOSX
`export NODE_ENV=DEVELOPMENT`