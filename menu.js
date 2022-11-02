const User = require('./models/user')
const InfoRequest = require('./models/InfoRequest')
const translate = require('./utils/translate')
const sendSMS = require('./utils/sms')

let response = ''
const mainMenuNotregistered = () => {
	response = `Welcome to Afya Mama choose your language 
	1 English 
	2 Kiswahili 
	3 Help and Emergency 
	4 Talk to health official 
	100 Exit`
	return response
}

const registerMenu = async (textArray, phoneNumber, language) => {
	const count = textArray.length
	if (count == 1) {
		response = await translate(
			`Afya Mama empowers pregnant mothers with knowledge on hypertensive disorders during pregnancy
			1 Register
			98 Go back
			99 Go to main menu
			100 Exit`,
			language
		)
	} else if (count == 2 && textArray[1] == 1) {
		response = await translate(
			`Please enter your first and last name`,
			language
		)
	} else if (count === 3 && textArray[1] == 1) {
		response = await translate(`Please enter your age`, language)
	} else if (count === 4 && textArray[1] == 1) {
		response = await translate(
			`Please enter your county of residence`,
			language
		)
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
				`Thank you for registering with Afya Mama We will keep you updated on the latest news and information`,
				language
			)
			sendSMS(phoneNumber, response)
			//delete the ussdSession from the database
			await USSDLevel.deleteMany({ phoneNumber })
			response = await translate(
				`Thank you ${name} for registering with Afya Mama You will receive an SMS shortly
			99:Go to main menu`,
				language
			)
		} catch (error) {
			console.log('Error: ', error)
			response = `END An error occured. Please try again`
		}
	} else {
		response = `Invalid entry Please try again`
	}

	return response
}

const mainMenuRegistered = async (name, language) => {
	response = await translate(
		`CON Welcome ${name}, Afya Mama empowers pregnant mothers with knowledge on hypertensive disorders during pregnancy
		1:Learn about Gestational Diabetes
		2:Change settings
		3:Subscribe to SMS
		4:Exit`,
		language
	)
	return response
}

const gestationalDiabetesMenu = async (textArray, language, phoneNumber) => {
	const user = await User.findOne({ phoneNumber })
	const level = textArray.length
	if (level === 1) {
		response = await translate(
			`
			1:Definition of gestational diabetes
			2:Symptoms of gestational diabetes
			3:Diagnosis of gestational diabetes
			4:Risk factors of gestational diabetes
			5:Treatment of gestational diabetes
			6:Prevention of gestational diabetes
			7:Management of gestational diabetes
			`,
			language
		)
	} else if (level === 2) {
		if (textArray[1] == 1) {
			response = await translate(
				`A type of diabetes that onsets mid or late pregnancy as the body cannot produce enough of the hormone that controls blood glucose and mothers report high glucose levels for the first time
				98:Go back`,
				language
			)
			await sendSMS(phoneNumber, response.replace('98:Go back', ''))
			//save the info request to the database
			const infoRequest = new InfoRequest({
				requestedBy: user._id,
				info: 'definition',
			})
			await infoRequest.save()
		} else if (textArray[1] == 2) {
			response = await translate(
				`Gestational diabetes usually does not have any symptoms but look out for heightened symptoms of pregnancy and repetitive yeast infections
				98:Go back`,
				language
			)
			//remove 98:Go back from the response
			await sendSMS(phoneNumber, response.replace('98:Go back', ''))
			//save the info request to the database
			const infoRequest = new InfoRequest({
				requestedBy: user._id,
				info: 'symptoms',
			})
			await infoRequest.save()
		} else if (textArray[1] == 3) {
			response = await translate(
				`The following tests are used to know how your body is tolerating glucose;
				Fasting blood sugar, random blood sugar, urine  glucose, glycosylated hemoglobin test				
				98:Go back`,
				language
			)
			await sendSMS(phoneNumber, response.replace('98:Go back', ''))
			//save the info request to the database
			const infoRequest = new InfoRequest({
				requestedBy: user._id,
				info: 'diagnosis',
			})
			await infoRequest.save()
		} else if (textArray[1] == 4) {
			response = await translate(
				`You are likely to get gestational diabetes if your body mass index (BMI) is 30 or higher, you have previously given birth to a baby weighing 4.5 kg or more, have had gestational diabetes before, have a relative with diabetes, are of African, south Asian, or latino.
				98:Go back`,
				language
			)
			await sendSMS(phoneNumber, response.replace('98:Go back', ''))
			//save the info request to the database
			const infoRequest = new InfoRequest({
				requestedBy: user._id,
				info: 'risk factors',
			})
			await infoRequest.save()
		} else if (textArray[1] == 5) {
			response = await translate(
				`If glucose levels are too high, anti diabetic medications will be given as well as insulin shots but mostly diet and exercise will be recommended.
				98:Go back`,
				language
			)
			await sendSMS(phoneNumber, response.replace('98:Go back', ''))
			//save the info request to the database
			const infoRequest = new InfoRequest({
				requestedBy: user._id,
				info: 'treatment',
			})
			await infoRequest.save()
		} else if (textArray[1] == 6) {
			response = await translate(
				`You can prevent gestational diabetes by maintaining a healthy weight, regular testing for glucose level, eating a healthy diet, and exercising regularly.
				98:Go back`,
				language
			)
			await sendSMS(phoneNumber, response.replace('98:Go back', ''))
			//save the info request to the database
			const infoRequest = new InfoRequest({
				requestedBy: user._id,
				info: 'prevention',
			})
			await infoRequest.save()
		} else if (textArray[1] == 7) {
			response = await translate(
				`
				1. Management during pregnancy
				2. Management after pregnancy
				98:Go back`,
				language
			)
		}
	} else if (level === 3) {
		if (textArray[2] == 1) {
			response = await translate(
				`Perform regular glucose tests, attend all your antenatal visits, eat a balanced diet and exercise regularly and take all medicines prescribed diligently.
				98:Go back`,
				language
			)
			await sendSMS(phoneNumber, response.replace('98:Go back', ''))
			//save the info request to the database
			const infoRequest = new InfoRequest({
				requestedBy: user._id,
				info: 'management during pregnancy',
			})
			await infoRequest.save()
		} else if (textArray[2] == 2) {
			response = await translate(
				`Breastfeed baby as their glucose may be low and monitor their sugar levels. Diabetes medications may be stopped after delivery. Monitor mothers glucose up to 6 months postpartum.
				98:Go back`,
				language
			)
			await sendSMS(phoneNumber, response.replace('98:Go back', ''))
			//save the info request to the database
			const infoRequest = new InfoRequest({
				requestedBy: user._id,
				info: 'management after pregnancy',
			})
			await infoRequest.save()
		}
	}

	return `CON ${response}`
}

const settingMenu = async (textArray, language, user) => {
	const level = textArray.length
	if (level === 1) {
		response = await translate(
			`CON Change your settings
		1:Change language
		2:Change county
		3:Change name
		4:Change age
		98:Go back`,
			language
		)
	} else if (level === 2) {
		if (textArray[1] == 1) {
			response = await translate(
				`CON Change language
			1. English
			2. Kiswahili`,
				language
			)
		} else if (textArray[1] == 2) {
			response = await translate(`CON Enter your county`, language)
		} else if (textArray[1] == 3) {
			response = await translate(`CON Enter your name`, language)
		} else if (textArray[1] == 4) {
			response = await translate(`CON Enter your age`, language)
		}
	} else if (level === 3) {
		if (textArray[1] == 1) {
			if (textArray[2] == 1) {
				try {
					user.language = 'en'
					await user.save()
					response = `CON Your language has been updated to English
					99:Go to main menu`
				} catch (error) {
					console.log('error: ', error)
				}
			} else if (textArray[2] == 2) {
				try {
					user.language = 'sw'
					await user.save()
					response = `CON Lugha yako imebadilishwa kwa Kiswahili kwa mafanikio
					99:Rudi kwenye menyu kuu`
				} catch (error) {
					console.log('error: ', error)
				}
			}
		} else if (textArray[1] == 2) {
			try {
				user.county = textArray[2]
				await user.save()
				response = await translate(
					`CON Your county has been updated to ${textArray[2]}
					99:Go to main menu`,
					language
				)
			} catch (error) {
				console.log('error: ', error)
			}
		} else if (textArray[1] == 3) {
			try {
				user.name = textArray[2]
				await user.save()
				response = await translate(
					`CON Your name has been updated to ${textArray[2]}
					99:Go to main menu`,
					language
				)
			} catch (error) {
				console.log('error: ', error)
			}
		} else if (textArray[1] == 4) {
			try {
				user.age = textArray[2]
				await user.save()
				response = await translate(
					`CON Your age has been updated to ${textArray[2]}
					99:Go to main menu`,
					language
				)
			} catch (error) {
				console.log('error: ', error)
			}
		}
	}
	return response
}

const middleware = async (text) => {
	//return text returned from goBack function
	return await exitMenu(goBack(goToMainMenu(text)))
}

const subscribeMenu = async (textArray, user, language) => {
	const level = textArray.length
	if (level === 1) {
		response = await translate(
			`CON Subscribe to receive gestational diabetes tips
		1:Weekly
		2:Monthly
		3:Unsubscribe
		98:Go back
		100:Exit`,
			language
		)
	} else if (level === 2) {
		if (textArray[1] == 1) {
			user.subscribed = true
			user.frequency = 'weekly'
			await user.save()
			response = await translate(
				`CON You have been subscribed to receive weekly tips
			99:Go to main menu
			100:Exit`,
				language
			)
		} else if (textArray[1] == 2) {
			user.subscribed = true
			user.frequency = 'monthly'
			await user.save()
			response = await translate(
				`CON You have been subscribed to receive monthly tips
			99:Go to main menu
			100:Exit`,
				language
			)
		} else if (textArray[1] == 3) {
			user.subscribed = false
			user.frequency = ''
			await user.save()
			response = await translate(
				`CON You have been unsubscribed
			99:Go to main menu
			100:Exit`,
				language
			)
		}
	}
	return response
}

//const goBack = async (textArray) => {}
const goBack = (text) => {
	if (text) {
		//split the text into an array using * as a delimiter
		const textArray = text.split('*')
		//search for all 98s in the array and remove them with their preceding values
		let length = textArray.length

		while (length--) {
			if (textArray[length] === '98') {
				textArray.splice(textArray.indexOf('98') - 1, 2)
			}
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
		//search for the last 99 in the array and remove it and all elements before it
		const index = textArray.lastIndexOf('99')
		if (index > -1) {
			textArray.splice(0, index + 1)
		}
		//return the array joined back together using the delimiter "*"
		return textArray.join('*')
	} else {
		return ''
	}
}

const exitMenu = async (text, language) => {
	if (text) {
		//split the text into an array using * as a delimiter
		const textArray = text.split('*')
		//search for the last 100 in the array and remove it and all elements before it
		const index = textArray.lastIndexOf('100')
		if (index > -1) {
			return `EXITMENU`
		}
		//return the array joined back together using the delimiter "*"
		return textArray.join('*')
	} else {
		return ''
	}
}

module.exports = {
	mainMenuRegistered,
	mainMenuNotregistered,
	registerMenu,
	middleware,
	gestationalDiabetesMenu,
	settingMenu,
	subscribeMenu,
}
