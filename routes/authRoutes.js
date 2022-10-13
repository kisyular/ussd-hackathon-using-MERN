const { Router } = require('express')
const {
	register,
	login,
	updateAdmin,
} = require('../controllers/authController')
const router = Router()
const authenticateUser = require('../middleware/auth')

const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10,
	message:
		'Too many requests from this IP, please try again after 15 minutes',
})

router.route('/register').post(register)
router.route('/login').post(apiLimiter, login)
router.route('/update').patch(authenticateUser, updateAdmin)
module.exports = router
