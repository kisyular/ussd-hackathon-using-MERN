const Admin = require('../models/Admin')
const { BadRequestError, UnAuthenticatedError } = require('../errors/index.js')
const { StatusCodes } = require('http-status-codes')

//const register = async (req, res) => {}
const register = async (req, res) => {
	const { name, email, password } = req.body
	// this is used to check if the email, name and password are provided.
	if (!name || !email || !password) {
		throw new BadRequestError('Please provide all values')
	}
	// if (email !== 'afya.mama.app@gmail.com') {
	// 	throw new UnAuthenticatedError('You are not authorized to register')
	// }

	// const admin = new Admin({ name, email, password }) // this is used to find the admin in the database. If the admin is not found, then it will create a new admin.
	const adminAlreadyExists = await Admin.findOne({ email })
	if (adminAlreadyExists) {
		throw new BadRequestError('Email already in use')
	}
	//const admin = new admin({ name, email, password }). Create a new admin with the values provided in the request body in the database.
	const admin = await Admin.create({ name, email, password })
	const token = admin.createJWT() // this is used to create a JSON Web Token. It is used to create a token which is used to authenticate the admin.

	//Sends back admin details and token to client excluding the password.
	res.status(StatusCodes.CREATED).json({
		admin: {
			email: admin.email,
			lastName: admin.lastName,
			location: admin.location,
			name: admin.name,
		},
		token,
		location: admin.location,
	})
}

//const login = async (req, res) => {}
const login = async (req, res) => {
	const { email, password } = req.body
	// Used to check if the email and password are provided.
	if (!email || !password) {
		throw new BadRequestError('Please provide all values')
	}
	// Used to find the admin in the database. If the admin is found, then it will select the admin and the password.
	const admin = await Admin.findOne({ email }).select('+password')

	// Used to check if the admin is found. If the admin is not found, then it will throw an error.
	if (!admin) {
		throw new UnAuthenticatedError('Invalid Credentials')
	}
	// Used to check if the password is correct. If the password is incorrect, then it will throw an error. It uses the comparePassword function to check if the password is correct. comparePassword comes from the Admin model through the bcryptjs library.
	const isPasswordCorrect = await admin.comparePassword(password)
	if (!isPasswordCorrect) {
		throw new UnAuthenticatedError('Invalid Credentials')
	}
	// Used to create a JSON Web Token. It is used to create a token which is used to authenticate the admin.
	const token = admin.createJWT()
	admin.password = undefined
	res.status(StatusCodes.OK).json({ admin, token, location: admin.location })
}

// const updateUser = async (req, res) => {} Used to update the admin details.
const updateAdmin = async (req, res) => {
	const { email, name, lastName, location } = req.body
	if (!email || !name || !lastName || !location) {
		throw new BadRequestError('Please provide all values')
	}
	// Used to find the admin in the database. If the admin is found, then it will update the admin.
	const admin = await Admin.findOne({ _id: req.user.userId })
	if (!admin) {
		console.log('Admin not found')
		// throw new UnAuthenticatedError('Invalid Credentials')
	}
	admin.email = email
	admin.name = name
	admin.lastName = lastName
	admin.location = location
	await admin.save()

	// various setups
	// in this case only id
	// if other properties included, must re-generate

	const token = admin.createJWT()
	res.status(StatusCodes.OK).json({
		admin,
		token,
		location: admin.location,
	})
}

//module.exports = { register, login }
module.exports = { register, login, updateAdmin }
