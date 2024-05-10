const db = require('../db')
const components = [
    'cpu', 'gpu', 'ram', 'motherboard', 'cooler', 'pc_case', 'power_supply', 'hard_drive'
];
class ComputersController {

    static async createComputer(req, res) {
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
                ) values (
                '${pc_name}', 
                '${description}', 
                '${pc_type}', 
                '${cpu_id}', 
                '${gpu_id}', 
                '${motherboard_id}', 
                '${pc_case_id}', 
                '${ram_id}', 
                '${power_supply_id}', 
                '${cooler_id}', 
                '${hard_drive_id}', 
                '${creator_id}') 
                RETURNING *`)
        res.json('success')
    }

    static async getComputers(req, res) {
        const {type, userID} = req.body
        const typeObj = {
            all: '',
            recommended: 'WHERE is_recommended',
            user: `WHERE creator_id = ${userID}`
        }
        const respPC = await db.query(`SELECT * FROM computers ${typeObj[type]}`)

        const promises = respPC.rows.map(async (el) => await ComputersController.getOneComputer(el.id));
        const PCwithoutPrices = await Promise.all(promises);

        res.json(PCwithoutPrices);
    }

    static async recommendPC(req, res) {
        const pc_id = req.params.pc_id
        const recommendPCReq = await db.query(`
            UPDATE computers 
            SET is_recommended = 'true' 
            WHERE id = '${pc_id}' 
            RETURNING *`
        )
        res.json(recommendPCReq.rows[0] && `Сборка ${pc_id} теперь рекоммендованая!`)
    }

    static async updateComputers(req, res) {
        const {
            pc_id,
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

        const updatedComputer = await db.query(`UPDATE computers SET 
            cpu_id = '${cpu_id}',
            gpu_id = '${gpu_id}',
            motherboard_id = '${motherboard_id}',
            pc_case_id = '${pc_case_id}',
            ram_id = '${ram_id}',
            power_supply_id = '${power_supply_id}',
            cooler_id = '${cooler_id}',
            hard_drive_id = '${hard_drive_id}',
            creator_id = '${creator_id}',
            pc_name = '${pc_name}',
            pc_type = '${pc_type}',
            description = '${description}'
            WHERE id = '${pc_id}'
            RETURNING *`)

        if (updatedComputer.rows[0]) res.json('update')
    }

    static async deleteComputer(req, res) {
        console.log(req.params)
        const id = req.params.id
        const delComputer = await db.query(`DELETE FROM computers WHERE id = $1`, [id])
        res.json(`Компьютер ${id} успешно удален`)
    }


    static async getOneComputer(id) {
        const computerReq = await db.query(`SELECT * FROM computers WHERE id = $1`, [id]);
        const computer_with_ids = computerReq.rows[0];

        const computer_with_objects = {
            pc_id: computer_with_ids.id,
            title: computer_with_ids.pc_name,
            type: computer_with_ids.pc_type,
            description: computer_with_ids.description,
            creator_id: computer_with_ids.creator_id,
            created_at: computer_with_ids.created_at,
            is_recommended: computer_with_ids.is_recommended,
            pc_price: 0
        };

        for (const component of components) {
            const componentReq = await db.query(`
            SELECT ${component}.*, min_price.price AS price, min_price.shop, min_price.url 
            FROM ${component}
            LEFT JOIN (
                SELECT ${component}_id, shop, price, url
                FROM ${component}_prices
                WHERE price = (
                        SELECT MIN(price)
                        FROM ${component}_prices
                        WHERE ${component}_id = $1)
            ) AS min_price ON ${component}.id = min_price.${component}_id
            WHERE ${component}.id = $1;
        `, [computer_with_ids[`${component}_id`]]);

            computer_with_objects[component] = componentReq.rows[0];
            computer_with_objects.pc_price += componentReq.rows[0].price
        }
        console.log(computer_with_objects)
        return computer_with_objects;
    }
}


module.exports = ComputersController
