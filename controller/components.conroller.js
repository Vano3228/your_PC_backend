const db = require('../db')

class ComponentsController {
    async getPrice(req, res) {
        const {type, id} = req.params
        try {
            const priceObj = await db.query(`SELECT * FROM "${type}_prices" WHERE "${type}_id" = ${id} ORDER BY price LIMIT 1`);
            return(res.json(priceObj.rows[0]))
        }
        catch (error) {
            console.error('Error fetching price:', error)
        }
    }

    async getAllComponents(req, res) {
        const type = req.params.type
        const allComponentsReq = await db.query(`SELECT * FROM ${type}`)
        return(res.json(allComponentsReq.rows))
    }
}


module.exports = new ComponentsController()
