const db = require('../db')
const bcrypt = require('bcryptjs')
class ComputersController {
    async createUser(req, res) {
        const {login, password} = req.body
        const checkLogin = await db.query(`SELECT * FROM users WHERE login = $1`, [login])
        if (checkLogin.rows[0] !== undefined) {
            return res.json('alreadyCreate')
        }
        else {
            const newUser = await db.query (
                `INSERT INTO users (login, password, role) VALUES ($1, $2, $3) RETURNING *`,
                [login, bcrypt.hashSync(password), 'user']
            )
            const newUser_id = newUser.rows[0].id
            delete newUser['id']
            return res.json({...newUser.rows[0], user_id: newUser_id})
        }

    }
    async getOneUser(req, res) {
        const id = req.params.id
        const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id])
        return res.json(user.rows[0])
    }


    async loginUser(req, res) {
        const { login, password } = req.body;
        const dbResult = await db.query(`SELECT * FROM users WHERE login = $1`, [login]);
        if (dbResult.rows.length === 0) {
            return res.json('fail');
        }
        const dbPassword = dbResult.rows[0].password;
        bcrypt.compare(password, dbPassword, (err, result) => {
            if (result) {
                const resObj = {
                    user_id: dbResult.rows[0].id,
                    login,
                    register_data: dbResult.rows[0].register_date,
                    role: dbResult.rows[0].role
                }
                return res.json(resObj);
            } else {
                return res.json('fail');
            }
        })
    }

}


module.exports = new ComputersController()
