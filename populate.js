import { readFile } from 'fs/promises'
import dotenv from 'dotenv'
dotenv.config()

import connectDB from './config/db.js'
import Info from './models/Info.js'

const start = async () => {
	//Connect to the database
	connectDB()
	try {
		// await Job.deleteMany()
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
