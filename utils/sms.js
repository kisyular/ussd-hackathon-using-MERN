const dotenv = require('dotenv')
dotenv.config()
const credentials = {
	apiKey: process.env.API_KEY,
	username: process.env.AT_USERNAME || 'sandbox',
}

// Initialize the SDK
const AfricasTalking = require('africastalking')(credentials)

// Get the SMS service
const sms = AfricasTalking.SMS

const sendSMS = async (phoneNumber, message) => {
	// Use the service to send a message
	const response = await sms.send({ to: phoneNumber, message })
	return response
}

// export the function
module.exports = sendSMS
