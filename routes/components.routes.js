const Router = require('express')
const router = new Router()
const componentsController = require('../controller/components.conroller')

router.get('/components/:type/:id', componentsController.getPrice)


module.exports = router