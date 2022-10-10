const express = require('express')
const bodyParser = require('body-parser')

const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const connectDB = require('./config/db.js')
require('dotenv').config()

//import user.js from util
const { isRegistered, readUserName } = require('./utils/user')
const User = require('./models/user')
//import menu.js
const {
	mainMenuRegistered,
	mainMenuNotregistered,
	registerMenu,
	middleware,
	// persistInvalidEntry,
	gestationalDiabetesMenu,
	nearbyFacilitiesMenu,
	settingMenu,
} = require('./menu')
const sendSMS = require('./utils/sms.js')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(mongoSanitize())
app.use(cors())

app.use(function (req, res, next) {
	res.setHeader('Content-Type', 'text/json')
	next()
})

// Connect to MongoDB
connectDB()

//create a route for get request and respond with a message
app.get('/', (req, res) => {
	res.send('Welcome to the USSD API')
})

app.post('/', async (req, res) => {
	// Read the variables sent via POST from our API
	const { sessionId, serviceCode, phoneNumber, text } = req.body
	const userIsRegistered = await isRegistered(phoneNumber)
	const cleanText = await middleware(text, sessionId, phoneNumber)
	const user = await User.findOne({ phoneNumber })

	let response = ''
	//If user is registered and cleanText is empty
	if (cleanText == '' && userIsRegistered) {
		const language = user.language
		//pass language to the mainMenuRegistered function
		response = await mainMenuRegistered(user.name, language)
	}
	//If user is registered and cleanText is not empty
	else if (userIsRegistered && cleanText != '') {
		const language = user.language
		const textArray = cleanText.split('*')
		if (cleanText[0] == 1) {
			response = await gestationalDiabetesMenu(
				textArray,
				language,
				phoneNumber
			)
		} else if (cleanText[0] == 2) {
			response = await nearbyFacilitiesMenu(
				textArray,
				language,
				user,
				phoneNumber
			)
		} else if (cleanText[0] == 3) {
			response = await settingMenu(textArray, language, user)
		} else if (cleanText[0] == 4) {
			response = await languageSettingMenu(textArray, phoneNumber)
		} else {
			response = 'END Invalid option'
		}
	}
	//If user is not registered and cleanText is empty
	else if (cleanText == '' && !userIsRegistered) {
		response = `CON ${mainMenuNotregistered()}`
	}

	//If user is not registered and cleanText is not empty
	else if (!userIsRegistered && cleanText !== '') {
		if (cleanText[0] == '1') {
			response = `CON ${await registerMenu(
				cleanText.split('*'),
				phoneNumber,
				'en'
			)}`
		} else if (cleanText[0] == '2') {
			response = `CON ${await registerMenu(
				cleanText.split('*'),
				phoneNumber,
				'sw'
			)}`
		} else if (cleanText == '3') {
			//End the session
			response = `END Please call the hotline for assistance. Thank you.`
			await sendSMS('+254700000000', `New user: ${phoneNumber}`)
		} else if (cleanText == '4') {
			response = `END Thank you for using the service.`
		} else {
			response = `END Invalid entry. Please try again \n${mainMenuNotregistered()}`
			// const ussdLevel = text.split('*').length - 1
			// console.log('ussdLevel: ', ussdLevel)
			// //persist invalid entry
			// await persistInvalidEntry(phoneNumber, 'en', sessionId, ussdLevel)
		}
	}
	res.send(response)
})

//Add port to listen to
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server started on port ${port}`))
