const axios = require('axios').default
const { v4: uuidv4 } = require('uuid')

let key = process.env.MICROSOFT_TRANSALATE_KEY
let endpoint = 'https://api.cognitive.microsofttranslator.com'

// location, also known as region.
// required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
let location = process.env.MICROSOFT_TRANSALATE_REGION

const translate = async (text, to) => {
	const translatedText = await axios({
		baseURL: endpoint,
		url: '/translate',
		method: 'post',
		headers: {
			'Ocp-Apim-Subscription-Key': key,
			// location required if you're using a multi-service or regional (not global) resource.
			'Ocp-Apim-Subscription-Region': location,
			'Content-type': 'application/json',
			'X-ClientTraceId': uuidv4().toString(),
		},
		params: {
			'api-version': '3.0',
			from: 'en',
			to,
		},
		data: [{ text }],
		responseType: 'text',
	})
	return translatedText.data[0].translations[0].text
}

// const translate = async (text, to) => {
// 	return text
// }

//Export the function
module.exports = translate
