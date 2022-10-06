const mongoose = require('mongoose')
const { Schema } = mongoose

const USSDLevelSchema = new Schema({
	sessionId: {
		type: String,
		required: true,
	},
	ussdLevel: {
		type: Number,
		required: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
})

//export the model
module.exports = mongoose.model('USSDLevel', USSDLevelSchema)
