const db = require('../db')

class ComponentsController {
    async getPrice(req, res) {
        const {type, id} = req.params
        const priceObj = await db.query(`SELECT * FROM ${type}_prices WHERE ${type}_id = ${id} ORDER BY price LIMIT 1`)
        return(res.json(priceObj.rows[0]))
    }
}

module.exports = new ComponentsController()
