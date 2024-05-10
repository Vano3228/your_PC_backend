const Router = require('express')
const router = new Router()
const computersController = require('../controller/computers.controller')


router.post('/computers', computersController.createComputer)
router.post('/computers/getPC', computersController.getComputers)
router.get('/computers/recommend/:pc_id', computersController.recommendPC)
router.put('/computers', computersController.updateComputers)
router.delete('/computers/:id', computersController.deleteComputer)



module.exports = router
