const db = require('../db')
class ComputersController {
    async createComputer(req, res) {
        const {
            pc_name,
            description,
            pc_type,
            cpu_id,
            gpu_id,
            motherboard_id,
            pc_case_id,
            ram_id,
            power_supply_id,
            cooler_id,
            hard_drive_id,
            creator_id
        } = req.body
        const newComputer = await db.query(
            `INSERT INTO computers (
                pc_name,
                description,
                pc_type,
                cpu_id, 
                gpu_id, 
                motherboard_id, 
                pc_case_id, 
                ram_id, 
                power_supply_id, 
                cooler_id, 
                hard_drive_id, 
                creator_id
                ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,  [
                pc_name,
                description,
                pc_type,
                cpu_id,
                gpu_id,
                motherboard_id,
                pc_case_id,
                ram_id,
                power_supply_id,
                cooler_id,
                hard_drive_id,
                creator_id]
                )
        res.json('success')
    }

    async getAllComputers(req, res) {
        const allComputers = await db.query(`SELECT * FROM computers`)
        res.json(allComputers.rows)
    }

    async getRecommendedComputers(req, res) {
        const recommendedComputers = await db.query(`SELECT * FROM computers WHERE is_recommended`)
        res.json(recommendedComputers.rows)
    }

    async getComputersByUserID(req, res) {
        const userID = req.params.userID
        const ComputersByUserID = await db.query(`SELECT * FROM computers WHERE creator_id = ${userID}`)
        res.json(ComputersByUserID.rows)
    }

    async getOneComputer(req, res) {
        const id = req.params.id
        const computerReq = await db.query(`SELECT * FROM computers WHERE id = $1`, [id])
        const computer_with_ids = computerReq.rows[0]
        const computer_with_objects = {
            pc_id: computer_with_ids.id,
            pc_name: computer_with_ids.pc_name,
            pc_type: computer_with_ids.pc_type,
            description: computer_with_ids.description,
            creator_id: computer_with_ids.creator_id,
            created_at: computer_with_ids.created_at
        }
        const cpuReq = await db.query(`SELECT * FROM cpu WHERE id = $1`, [computer_with_ids.cpu_id])
        computer_with_objects.cpu = cpuReq.rows[0]

        const gpuReq = await db.query(`SELECT * FROM gpu WHERE id = $1`, [computer_with_ids.gpu_id])
        computer_with_objects.gpu = gpuReq.rows[0]

        const ramReq = await db.query(`SELECT * FROM ram WHERE id = $1`, [computer_with_ids.ram_id])
        computer_with_objects.ram = ramReq.rows[0]

        const motherboardReq = await db.query(`SELECT * FROM motherboard WHERE id = $1`, [computer_with_ids.motherboard_id])
        computer_with_objects.motherboard = motherboardReq.rows[0]

        const coolerReq = await db.query(`SELECT * FROM cooler WHERE id = $1`, [computer_with_ids.cooler_id])
        computer_with_objects.cooler = coolerReq.rows[0]

        const pc_caseReq = await db.query(`SELECT * FROM pc_case WHERE id = $1`, [computer_with_ids.pc_case_id])
        computer_with_objects.pc_case = pc_caseReq.rows[0]

        const power_supplyReq = await db.query(`SELECT * FROM power_supply WHERE id = $1`, [computer_with_ids.power_supply_id])
        computer_with_objects.power_supply = power_supplyReq.rows[0]

        const hard_driveReq = await db.query(`SELECT * FROM hard_drive WHERE id = $1`, [computer_with_ids.hard_drive_id])
        computer_with_objects.hard_drive = hard_driveReq.rows[0]

        return res.json(computer_with_objects)
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
