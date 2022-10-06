const mongoose = require('mongoose')
const { Schema } = mongoose
const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	language: {
		type: String,
		default: 'en',
	},
	invalidEntryCount: {
		type: Number,
		default: 0,
	},
	registeredOn: {
		type: Date,
		default: Date.now,
	},
})

//export the model
module.exports = mongoose.model('User', UserSchema)
