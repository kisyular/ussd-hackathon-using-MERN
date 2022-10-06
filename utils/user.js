//import user.js from models
const User = require('../models/user')

//check if user is registered using phone number
const isRegistered = async (phoneNumber) => {
	//use try catch to handle error
	try {
		//check if user is registered
		const user = await User.findOne({ phoneNumber })
		if (user) {
			return true
		}
		return false
	} catch (error) {
		console.log(error)
	}
}

const readUserName = async (phoneNumber) => {
	//use try catch to handle error
	try {
		//read user name
		const user = await User.findOne({ phoneNumber })
		if (user) {
			return user.name
		}
		return null
	} catch (error) {
		console.log(error)
	}
}

//export the function
module.exports = { isRegistered, readUserName }
