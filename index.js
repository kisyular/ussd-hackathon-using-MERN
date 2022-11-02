const express = require('express')
const bodyParser = require('body-parser')

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

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'))
}

app.use(mongoSanitize())
app.use(cors())

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
	if (cleanText === 'EXITMENU') {
		response = 'END Thank you for using this service'
	}

	//If user is registered and cleanText is empty
	else if (userIsRegistered && cleanText == '') {
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
			response = await settingMenu(textArray, language, user)
		} else if (cleanText[0] == 3) {
			response = await subscribeMenu(textArray, user, language)
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
		} else if (cleanText[0] == '3') {
			response = `END Please call 999 112 or 911`
		} else if (cleanText[0] == '4') {
			response = `END Our plan was to connect the patient with a couple gyenacologist If we move forward to the next phase we will consult 4 gyenacologist for their services`
		} else {
			response = `END Invalid entry. Please try again`
		}
	}
	res.set('Content-Type: text/plain')
	res.send(response)
})
//Routers
app.use('/api/auth', authRoutes)
app.use('/api/info', infoRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

//Add port to listen to
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server started on port ${port}`))
