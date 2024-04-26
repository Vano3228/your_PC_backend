const Router = require('express')
const router = new Router()
const usersController = require('../controller/users.controller')

router.post('/users', usersController.createUser)
router.get('/users/:id', usersController.getOneUser)
router.post('/loginUser', usersController.loginUser)

module.exports = router
