const User = require('./models/user')
const translate = require('./utils/translate')
const sendSMS = require('./utils/sms')
const USSDLevel = require('./models/USSDSessions')

let response = ''
// change city to county in Kenya

const mainMenuRegistered = async (name, language) => {
	response = await translate(
		`CON Welcome ${name}, what would you like to check
		1. Learn about Gestational Diabetes
		2. Nearby health facilities in the county
		3. Other
		4. Change language
		5. Exit`,
		language
	)
	return response
}

const mainMenuNotregistered = () => {
	response = `Welcome to ${process.env.COMPANY_NAME}. To continue in English, press 1. Kwa Kiswahili, bonyeza 2
	1. English
	2. Kiswahili
	3. Emergency
	4. Exit`
	return response
}

const gestationalDiabetesMenu = async (
	textArray,
	language,
	user,
	phoneNumber
) => {
	const level = textArray.length
	if (level === 1) {
		response = await translate(
			`1. What is Gestational Diabetes?
		2. Symptoms of Gestational Diabetes?
		3. Risk factors of Gestational Diabetes?
		4. Diagnosis of Gestational Diabetes?
		5. Treatment of Gestational Diabetes?
		6. Prevention of Gestational Diabetes?`,
			language
		)
	} else if (level === 2) {
		if (textArray[1] == 1) {
			response = await translate(
				`A type of diabetes that onsets mid or late pregnancy as the body cannot produce enough of the hormone that controls blood glucose to meet the extra needs of pregnancy hence high blood glucose levels.
				98. Go back`,
				language
			)
			await sendSMS(phoneNumber, response)
		} else if (textArray[1] == 2) {
			response = await translate(
				`Gestational diabetes usually doesn’t have any symptoms. If you’re pregnant, your doctor should test you for gestational diabetes between 24 and 28 weeks of pregnancy. If needed, you can make changes to protect your health and your baby’s health
				98. Go back`,
				language
			)
			await sendSMS(phoneNumber, response)
		} else if (textArray[1] == 3) {
			response = await translate(
				`Your body mass index (BMI) is 30 or higher
				You have previously given birth to a baby weighing 4.5 kg or more
				Have had gestational diabetes before
				Have a relative with diabetes
				Are of African, south Asian, or latino
				98. Go back`,
				language
			)
			await sendSMS(phoneNumber, response)
		}
	}

	return `CON ${response}`
}

const nearbyFacilitiesMenu = async (textArray, language, user, phoneNumber) => {
	const name = user.name
	const level = textArray.length
	if (level === 1) {
		response = await translate(
			`CON ${name} we will share information about nearby health facilities
			99. Go to main menu`,
			language
		)
		const res = await sendSMS(
			phoneNumber,
			await translate(
				`Thank you for your interest. We will share information about about nearby health facilities through SMS shortly`,
				language
			)
		)
		console.log('res: ', res)
	}
	return response
}

const otherOptionMenu = async (textArray, language, user) => {
	const name = user.name
	const level = textArray.length
	if (level === 1) {
		response = await translate(
			`END ${name} we will share information about other options`,
			language
		)
	}
	return response
}

const languageSettingMenu = async (textArray, phoneNumber) => {
	const level = textArray.length
	if (level === 1) {
		response = `CON Choose your language
		1. English
		2. Kiswahili
		3. Exit`
	} else if (level === 2) {
		//update the user language
		if (textArray[1] == 1) {
			//persist user language using try catch
			try {
				await User.findOneAndUpdate(
					{ phoneNumber },
					{ language: 'en' },
					{ new: true }
				)
				response = `CON Your language has been updated to English
				99. Go to main menu`
			} catch (error) {
				console.log('error: ', error)
			}
		} else if (textArray[1] == 2) {
			//persist user language
			try {
				await User.findOneAndUpdate(
					{ phoneNumber },
					{ language: 'sw' },
					{ new: true }
				)
				response = `CON Lugha yako imebadilishwa kwa Kiswahili kwa mafanikio
				99. Rudi kwenye menyu kuu`
			} catch (error) {
				console.log('error: ', error)
			}
		} else if (textArray[1] == 3) {
			response = `END Thank you for using ${process.env.COMPANY_NAME}`
		}
	}
	return response
}

const registerMenu = async (textArray, phoneNumber, language) => {
	const count = textArray.length
	if (count == 1) {
		response = await translate(
			`Welcome to ${process.env.COMPANY_NAME}, what would you like to check
			1. Register
			98. Go back
			99. Go to main menu`,
			language
		)
	} else if (count == 2 && textArray[1] == 1) {
		response = await translate(`Fill your name`, language)
	} else if (count === 3 && textArray[1] == 1) {
		response = await translate(`Fill your age`, language)
	} else if (count === 4 && textArray[1] == 1) {
		response = await translate(`Fill your county eg Nairobi`, language)
	} else if (count === 5 && textArray[1] == 1) {
		const name = textArray[2]
		const age = textArray[3]
		const location = textArray[4]

		//create a new user
		const user = new User({
			phoneNumber,
			name,
			age,
			location,
			language,
		})
		//save the user to the database using try catch
		try {
			await user.save()
			response = await translate(
				`Thank you for registering with ${process.env.COMPANY_NAME}. We will keep you updated on the latest news and information`,
				language
			)
			sendSMS(phoneNumber, response)
			//delete the ussdSession from the database
			await USSDLevel.deleteMany({ phoneNumber })
			response = await translate(
				`Thank you ${name} for registering with ${process.env.COMPANY_NAME}. You will receive an SMS shortly
			99. Go to main menu`,
				language
			)
		} catch (error) {
			console.log('Error: ', error)
			response = `END An error occured. Please try again`
		}
	} else {
		response = `Invalid entry. Please try again`
	}

	return response
}

const middleware = async (text, sessionId, phoneNumber) => {
	//return text returned from goBack function
	return goBack(goToMainMenu(text))
	// return await checkInvalidEntry(
	// 	goBack(goToMainMenu(text)),
	// 	sessionId,
	// 	phoneNumber
	// )
}

//const goBack = async (textArray) => {}
const goBack = (text) => {
	if (text) {
		// console.log('Text from goBack: ', text)
		//split the text into an array using * as a delimiter
		const textArray = text.split('*')
		//search for 98 in the array and remove it and one element before it
		const index = textArray.indexOf('98')
		if (index > -1) {
			textArray.splice(index - 1, 2)
		}
		//return the array joined back together using the delimiter "*"
		return textArray.join('*')
	} else {
		return ''
	}
}

//const goToMainMenu() = async (textArray) => {}
const goToMainMenu = (text) => {
	if (text) {
		// console.log('Text from goToMainMenu: ', text)
		//split the text into an array using * as a delimiter
		const textArray = text.split('*')
		//search for 99 in the array and remove it and and all the elements before it
		const index = textArray.indexOf('99')
		if (index > -1) {
			textArray.splice(0, index + 1)
		}
		//return the array joined back together using the delimiter "*"
		return textArray.join('*')
	} else {
		return ''
	}
}

// const persistInvalidEntry = async (
// 	phoneNumber,
// 	language,
// 	sessionId,
// 	ussdLevel
// ) => {
// 	//Save the invalid entry to the USSDLevel model
// 	const ussdSession = new USSDLevel({
// 		sessionId,
// 		ussdLevel,
// 		phoneNumber,
// 		language,
// 	})
// 	try {
// 		await ussdSession.save()
// 	} catch (error) {
// 		console.log('Error: ', error)
// 	}
// }

// const checkInvalidEntry = async (ussdStr, sessionId, phoneNumber) => {
// 	console.log('USSD String: ', ussdStr)
// 	//select all in database where sessionId is equal to the sessionId and phoneNumber is equal to the phoneNumber
// 	const ussdSession = await USSDLevel.find({
// 		sessionId,
// 		phoneNumber,
// 	}).distinct('ussdLevel')
// 	//if the ussdSession is empty, return the ussdStr
// 	if (ussdSession.length === 0) {
// 		return ussdStr
// 	}

// 	//explode the ussdStr into an array using * as a delimiter
// 	const ussdStrArray = ussdStr.split('*')
// 	//loop through the ussdStrArray and remove elements at index ussdSession
// 	for (let i = 0; i <= ussdSession.length; i++) {
// 		ussdStrArray.splice(ussdSession[i], 1)
// 	}
// 	//return the ussdStrArray joined back together using * as a delimiter
// 	return ussdStrArray.join('*')
// }

module.exports = {
	mainMenuRegistered,
	mainMenuNotregistered,
	registerMenu,
	middleware,
	// persistInvalidEntry,
	gestationalDiabetesMenu,
	languageSettingMenu,
	otherOptionMenu,
	nearbyFacilitiesMenu,
}
