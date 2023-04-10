const { readFile } = require('fs/promises')
require('dotenv').config()

const connectDB = require('./config/db.js')
const Info = require('./models/Info.js')

const start = async () => {
	//Connect to the database
	connectDB()
	try {
		await Job.deleteMany()
		const jsonProducts = JSON.parse(
			await readFile(new URL('./mock-data.json', import.meta.url))
		)
		await Info.create(jsonProducts)
		console.log('Success!!!!')
		process.exit(0)
	} catch (err) {
		console.log(err)
		process.exit(1)
	}
}

start()
