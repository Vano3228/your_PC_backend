const db = require('../db')
class ComputersController {
    async createComputer(req, res) {
        const {
            cpu_id,
            gpu_id,
            motherboard_id,
            pc_case_id,
            ram_id,
            power_supply_id,
            cooler_id,
            hard_drive_id,
            creator_id,
            is_completed
        } = req.body
        const newComputer = await db.query (
            `INSERT INTO computers (
                cpu_id, 
                gpu_id, 
                motherboard_id, 
                pc_case_id, ram_id, 
                power_supply_id, 
                cooler_id, 
                hard_drive_id, 
                creator_id, 
                is_completed
                ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,  [
                cpu_id,
                gpu_id,
                motherboard_id,
                pc_case_id, ram_id,
                power_supply_id,
                cooler_id,
                hard_drive_id,
                creator_id,
                is_completed]
                )
        res.json(newComputer.rows[0])
    }

    async getAllComputers(req, res) {
        const allComputers = await db.query(`SELECT * FROM computers`)
        res.json(allComputers.rows)
    }

    async getRecommendedComputers(req, res) {
        const recommendedComputers = await db.query(`SELECT * FROM computers WHERE is_recommended`)
        res.json(recommendedComputers.rows)
    }

    async getOneComputer(req, res) {
        const id = req.params.id
        const computer = await db.query(`SELECT * FROM computers WHERE id = $1`, [id])
        res.json(computer.rows[0])
    }

    async updateComputers(req, res) {
        const {
            id,
            cpu_id,
            gpu_id,
            motherboard_id,
            pc_case_id,
            ram_id,
            power_supply_id,
            cooler_id,
            hard_drive_id,
            creator_id,
            is_completed
        } = req.body

        const updatedComputer = await db.query(`UPDATE computers set 
            cpu_id = $1,
            gpu_id = $2,
            motherboard_id = $3,
            pc_case_id = $4,
            ram_id = $5,
            power_supply_id = $6,
            cooler_id = $7,
            hard_drive_id = $8,
            creator_id = $9,
            is_completed = $10
            WHERE id = $11 RETURNING *`, [
            cpu_id,
            gpu_id,
            motherboard_id,
            pc_case_id,
            ram_id,
            power_supply_id,
            cooler_id,
            hard_drive_id,
            creator_id,
            is_completed,
            id
        ])
        res.json(updatedComputer.rows[0])
    }

    async deleteComputer(req, res) {
        const id = req.params.id
        const delComputer = await db.query(`DELETE FROM computers WHERE id = $1`, [id])
        res.json(`success delete ${id} computer`)
    }

}

module.exports = new ComputersController()
