//Create a model to store the information user requests
const mongoose = require('mongoose')
const { Schema } = mongoose

const InfoRequestSchema = new Schema(
	{
		requestedBy: {
			//the user who requested the information use ref to link to the user model
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		info: {
			type: String,
			enum: [
				'definition',
				'symptoms',
				'diagnosis',
				'treatment',
				'prevention',
				'risk factors',
				'management during pregnancy',
				'management after pregnancy',
			],
		},
	},
	{
		timestamps: true,
	}
)

//export the model
module.exports = mongoose.model('InfoRequest', InfoRequestSchema)
