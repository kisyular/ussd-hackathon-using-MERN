const mongoose = require('mongoose')

const InfoSchema = new mongoose.Schema(
	{
		information: {
			type: String,
			required: [true, 'Please provide information to share'],
			maxlength: 200,
		},
		about: {
			type: String,
			enum: [
				'symptoms',
				'diagnosis',
				'treatment',
				'prevention',
				'risk factors',
				'management',
			],
			required: [true, 'Please provide position'],
			maxlength: 100,
		},
		status: {
			type: String,
			enum: ['sent', 'queued'],
			default: 'queued',
		},

		infoFrequency: {
			type: String,
			enum: ['weekly', 'monthly'],
			default: 'weekly',
		},
		referenceURL: {
			type: String,
			required: [true, 'Please provide reference'],
			maxlength: 300,
		},
		infoCounty: {
			type: String,
			default: 'Nairobi',
			required: true,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please provide user'],
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Info', InfoSchema)
