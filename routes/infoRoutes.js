//create router
const router = require('express').Router()
const authenticateUser = require('../middleware/auth')
//import controllers
const {
	createInfo,
	getAllInfo,
	deleteInfo,
	updateInfo,
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

module.exports = router
