const { UnAuthenticatedError } = require('../errors/index.js')

const checkPermissions = (requestUser, resourceUserId) => {
	// if (requestUser.role === 'admin') return
	if (requestUser.userId === resourceUserId.toString()) return
	throw new UnAuthenticatedError('Not authorized to access this route')
}

module.exports = checkPermissions
