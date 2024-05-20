const db = require('../db')

class ComponentsController {
    async getPrice(req, res) {
        const {type, id} = req.params
        const priceObj = await db.query(`SELECT * FROM "${type}_prices" WHERE "${type}_id" = ${id} ORDER BY price LIMIT 1`);
        return(res.json(priceObj.rows[0]))
    }


    async getCompatibilityComponents(req, res) {
        const compatibilityObj = req.body
        const type = compatibilityObj['type']
        const cpuFormats = type === 'cpu' ? {
            motherboard_socket: compatibilityObj['motherboard_socket'] && `socket = '${compatibilityObj['motherboard_socket']}'`,
            cooler_socket: compatibilityObj['cooler_socket'] && `strpos('${compatibilityObj['cooler_socket']}', socket ) > 0`,
            cooler_tdp: compatibilityObj['cooler_tdp'] && `tdp <= ${compatibilityObj['cooler_tdp']}`,
            ram_memory_type: compatibilityObj['ram_memory_type'] && `strpos(ram_type, '${compatibilityObj['ram_memory_type']}' ) > 0`
        } : {}
        const gpuFormats = type === 'gpu' ? {
            power_supply_power: compatibilityObj['power_supply_power'] && `recommended_psu <= ${compatibilityObj['power_supply_power']}`,
            pc_case_length: compatibilityObj['pc_case_length'] && `length <= ${compatibilityObj['pc_case_length']}`
        } : {}
        const ramFormats = type === 'ram' ? {
            motherboard_ram_type: compatibilityObj['motherboard_ram_type'] && `memory_type = '${compatibilityObj['motherboard_ram_type']}'`,
            cpu_ram_type: compatibilityObj['cpu_ram_type'] && `strpos('${compatibilityObj['cpu_ram_type']}', memory_type ) > 0`
        } : {}
        const power_supplyFormats = type === 'power_supply' ? {
            gpu_recommended_psu: compatibilityObj['gpu_recommended_psu'] && `power >= ${compatibilityObj['gpu_recommended_psu']}`
        } : {}
        const pc_caseFormats = type === 'pc_case' ? {
            motherboard_size_type: compatibilityObj['motherboard_size_type'] && `strpos(mb_types, '${compatibilityObj['motherboard_size_type']}') > 0`,
            gpu_length: compatibilityObj['gpu_length'] && `gpu_max_length >= ${compatibilityObj['gpu_length']}`,
            cooler_height: compatibilityObj['cooler_height'] && `cooler_max_height >= ${compatibilityObj['cooler_height']}`
        } : {}
        const hard_driveFormats = type === 'hard_drive' ? {
            motherboard_m2_slots: compatibilityObj['motherboard_m2_slots'] && `((interface = 'M.2' AND ${compatibilityObj['motherboard_m2_slots']} > 0) OR (interface = 'SATA'))`
        } : {}
        const motherboardFormats = type === 'motherboard' ? {
            cpu_socket: compatibilityObj['cpu_socket'] && `socket = '${compatibilityObj['cpu_socket']}'`,
            cooler_socket: compatibilityObj['cooler_socket'] && `strpos('${compatibilityObj['cooler_socket']}', socket ) > 0 `,
            pc_case_mb_types: compatibilityObj['pc_case_mb_types'] && `strpos('${compatibilityObj['pc_case_mb_types']}', size_type) > 0`,
            hard_drive_interface: compatibilityObj['hard_drive_interface'] && `((m2_slots > 0 AND '${compatibilityObj['hard_drive_interface']}' = 'M.2') OR ('${compatibilityObj['hard_drive_interface']}' = 'SATA'))`,
            ram_memory_type: compatibilityObj['ram_memory_type'] && `ram_type = '${compatibilityObj['ram_memory_type']}'`
        } : {}
        const coolerFormats = type === 'cooler' ? {
            cpu_socket: compatibilityObj['cpu_socket'] && `strpos(socket, '${compatibilityObj['cpu_socket']}') > 0`,
            motherboard_socket: compatibilityObj['motherboard_socket'] && `strpos(socket, '${compatibilityObj['motherboard_socket']}') > 0`,
            cpu_tdp: compatibilityObj['cpu_tdp'] && `tdp >= ${compatibilityObj['cpu_tdp']}`,
            pc_case_cooler_max_height: compatibilityObj['pc_case_cooler_max_height'] && `height <= ${compatibilityObj['pc_case_cooler_max_height']}`
        } : {}
        const conditionsFormats = {...cpuFormats, ...gpuFormats, ...ramFormats, ...motherboardFormats, ...coolerFormats, ...hard_driveFormats, ...pc_caseFormats, ...power_supplyFormats}
        const whereStr = Object.values(conditionsFormats).filter(el=>el).join(' AND ')
        const allComponentsReq = await db.query(`SELECT * FROM ${type} ${whereStr && `WHERE ${whereStr}`}`)
        return(res.json(allComponentsReq.rows))
    }
}


module.exports = new ComponentsController()
