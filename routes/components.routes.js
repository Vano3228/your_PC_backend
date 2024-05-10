const Router = require('express')
const router = new Router()
const componentsController = require('../controller/components.conroller')


router.post('/components/all', componentsController.getCompatibilityComponents)
router.get('/components/:type/:id', componentsController.getPrice)


module.exports = router
