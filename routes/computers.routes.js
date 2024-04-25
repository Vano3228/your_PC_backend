const Router = require('express')
const router = new Router()
const computersController = require('../controller/computers.controller')

router.post('/computers', computersController.createComputer)
router.get('/computers/all', computersController.getAllComputers)
router.get('/computers/recommended', computersController.getRecommendedComputers)
router.get('/computers/user/:userID', computersController.getComputersByUserID)
router.get('/computers/:id', computersController.getOneComputer)
router.put('/computers', computersController.updateComputers)
router.delete('/computers/:id', computersController.deleteComputer)



module.exports = router
