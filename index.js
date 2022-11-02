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

// Import middleware.
const notFoundMiddleware = require('./middleware/not-found.js')
const errorHandlerMiddleware = require('./middleware/error-handler.js')
// const authenticateUser = require('./middleware/auth.js')

//Connect to MongoDB
connectDB()

app.post('/', (req, res) => {
	// Read the variables sent via POST from our API
	const { sessionId, serviceCode, phoneNumber, text } = req.body

	let response = ''

	if (text == '') {
		// This is the first request. Note how we start the response with CON
		response = `CON What would you like to check
        1. My account
        2. My phone number`
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

//Apply the middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

//Add port to listen to
const port = process.env.PORT || 8080
app.listen(port)
