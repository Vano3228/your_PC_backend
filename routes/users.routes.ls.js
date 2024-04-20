const Router = require('express')
const router = new Router()
const usersController = require('../controller/users.controller')

router.post('/users', usersController.createUser)
router.get('/users/:id', usersController.getOneUser)


module.exports = router
