const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const connectDB = require('./config/db.js')
require('dotenv').config()
require('express-async-errors')
const morgan = require('morgan')

//Use cors to allow cross origin resource sharing
app.use(cors())

// Import middleware.
const notFoundMiddleware = require('./middleware/not-found.js')
const errorHandlerMiddleware = require('./middleware/error-handler.js')
// const authenticateUser = require('./middleware/auth.js')

// Import routes.
const authRoutes = require('./routes/authRoutes.js')
const infoRoutes = require('./routes/infoRoutes.js')

//import user.js from util
const { isRegistered } = require('./utils/user')
const User = require('./models/user')

//import menu.js
const {
	mainMenuRegistered,
	mainMenuNotregistered,
	registerMenu,
	middleware,
	gestationalDiabetesMenu,
	settingMenu,
	subscribeMenu,
} = require('./menu')

//Connect to MongoDB
connectDB()

app.post('/', async (req, res) => {
	// Read the variables sent via POST from our API
	const { sessionId, serviceCode, phoneNumber, text } = req.body
	const userIsRegistered = await isRegistered(phoneNumber)
	const cleanText = await middleware(text)

	let response = ''

	//If user is not registered and cleanText is empty
	if (text == '' && !userIsRegistered) {
		// This is the first request. Note how we start the response with CON
		response = `CON Welcome to Afya Mama choose your language
        1. English
        2. Kiswahili
		3. Emergency
		4. Talk to health worker`
	} else if (text == '1') {
		// Business logic for first level response
		response = `CON Choose account information you want to view
        1. Account number`
	} else if (text == '2') {
		// Business logic for first level response
		// This is a terminal request. Note how we start the response with END
		response = `END Your phone number is ${phoneNumber}`
	} else if (text == '1*1') {
		// This is a second level response where the user selected 1 in the first instance
		const accountNumber = 'ACC100101'
		// This is a terminal request. Note how we start the response with END
		response = `END Your account number is ${accountNumber}`
	}

	// Send the response back to the API
	res.set('Content-Type: text/plain')
	res.send(response)
})

//Apply the routes
app.use('/api/auth', authRoutes)
app.use('/api/info', infoRoutes)

//Apply the middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

//Add port to listen to
const port = process.env.PORT || 8080
app.listen(port)
