//create router
const router = require('express').Router()
//import controllers
const {
	createInfo,
	getAllInfo,
	deleteInfo,
	updateInfo,
} = require('../controllers/infoController')

//create routes
router.route('/').post(createInfo).get(getAllInfo)
router.route('/:id').delete(deleteInfo).patch(updateInfo)

module.exports = router
