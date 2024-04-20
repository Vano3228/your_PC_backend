const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password: "26041986Cher",
    host: "localhost",
    port: 5432,
    database: "Your_Comp"
})

module.exports = pool
