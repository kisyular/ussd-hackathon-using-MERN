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
	getSubscribers,
	sendSMStoSubscribers,
	markInfoSend,
	getUserRequests,
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
router.route('/subscribers').get(authenticateUser, getSubscribers)
router.route('/subscribers/send').post(authenticateUser, sendSMStoSubscribers)
router.route('/mark/:id').patch(authenticateUser, markInfoSend)
router.route('/requests').get(authenticateUser, getUserRequests)

module.exports = router
