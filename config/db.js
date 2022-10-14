const mongoose = require('mongoose')
// import mongoose from 'mongoose'
const colors = require('colors')
// import colors from 'colors'

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI)
		console.log(
			`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
		)
	} catch (err) {
		console.log(`MongoDB encountered an error: ${err}`.red.underline.italic)
	}
}

module.exports = connectDB
// export default connectDB
