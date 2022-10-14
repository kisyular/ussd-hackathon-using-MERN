//create router
const router = require('express').Router()
const authenticateUser = require('../middleware/auth')
//import controllers
const {
	createInfo,
	getAllInfo,
	deleteInfo,
	updateInfo,
	showStats,
} = require('../controllers/infoController')

//create routes
router
	.route('/')
	.post(authenticateUser, createInfo)
	.get(authenticateUser, getAllInfo)
router
	.route('/:id')
	.delete(authenticateUser, deleteInfo)
	.patch(authenticateUser, updateInfo)
router.route('/stats').get(authenticateUser, showStats)

module.exports = router
