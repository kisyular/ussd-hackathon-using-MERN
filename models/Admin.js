const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const AdminSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide name'],
		minlength: 3,
		maxlength: 20,
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'Please provide email'],
		validate: {
			validator: validator.isEmail,
			message: 'Please provide a valid email',
		},
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide password'],
		minlength: 6,
		select: false, // excludes the password from the response.
	},
	lastName: {
		type: String,
		trim: true,
		maxlength: 20,
		default: 'Admin',
	},
	location: {
		type: String,
		trim: true,
		maxlength: 20,
		default: 'Nairobi, Kenya',
	},
})

// AdminSchema.pre('save', async function (next)  this is a middleware which is executed before the save method is executed. It is used to hash the password before it is saved to the database.
AdminSchema.pre('save', async function () {
	// console.log(this.modifiedPaths())
	if (!this.isModified('password')) return
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// AdminSchema.methods.createJWT = function ()  this is a method which is used to create a JSON Web Token. It is used to create a token which is used to authenticate the user.
AdminSchema.methods.createJWT = function () {
	return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	})
}

// AdminSchema.methods.comparePassword = function (password)  this is a method which is used to compare the password with the hashed password in the database.
AdminSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
}

export default mongoose.model('Admin', AdminSchema)
