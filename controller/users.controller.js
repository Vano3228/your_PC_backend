const db = require('../db')
class ComputersController {
    async createUser(req, res) {
        const {login, mail, password} = req.body
        const newUser = await db.query (
            `INSERT INTO users (login, mail, password) VALUES ($1, $2, $3) RETURNING *`,
            [login, mail, password]
        )
        res.json(newUser.rows[0])
    }
    async getOneUser(req, res) {
        const id = req.params.id
        const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id])
        res.json(user.rows[0])
    }
}


module.exports = new ComputersController()
