const Info = require('../models/Info')
const { StatusCodes } = require('http-status-codes')
const {
	BadRequestError,
	NotFoundError,
	CustomError,
} = require('../errors/index.js')
const checkPermissions = require('../utils/checkPermissions.js')
const mongoose = require('mongoose')
const moment = require('moment')
const User = require('../models/User')
const sendSMS = require('../utils/sms')
const translate = require('../utils/translate')
const InfoRequest = require('../models/InfoRequest')

//const createInfo = (req, res) => {}
const createInfo = async (req, res) => {
	const { information, referenceURL, about } = req.body

	if (!information || !referenceURL || !about) {
		throw new BadRequestError('Please Provide All Values')
	}

	req.body.createdBy = req.user.userId

	const info = await Info.create(req.body)
	res.status(StatusCodes.CREATED).json({ info })
}

//const getAllInfo = (req, res) => {}
const getAllInfo = async (req, res) => {
	const { status, about, sort, search, infoFrequency } = req.query
	const queryObject = {
		createdBy: req.user.userId,
	}

	if (status && status !== 'all') {
		queryObject.status = status
	}

	if (about && about !== 'all') {
		queryObject.about = about
	}
	if (infoFrequency && infoFrequency !== 'all') {
		queryObject.infoFrequency = infoFrequency
	}

	if (search) {
		queryObject.information = { $regex: search, $options: 'i' }
	}

	// const infos = await Info.find({ createdBy: req.user.userId })
	// NO AWAIT
	let result = Info.find(queryObject)
	// chain sort conditions
	if (sort === 'latest') {
		result = result.sort('-createdAt')
	}
	if (sort === 'oldest') {
		result = result.sort('createdAt')
	}
	if (sort === 'a-z') {
		result = result.sort('about')
	}
	if (sort === 'z-a') {
		result = result.sort('-about')
	}

	// setup pagination
	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit

	result = result.skip(skip).limit(limit)

	const infos = await result

	const totalJobs = await Info.countDocuments(queryObject)
	const numOfPages = Math.ceil(totalJobs / limit)

	res.status(StatusCodes.OK).json({
		infos,
		totalInfos: totalJobs,
		numOfPages,
	})
}

//const updateInfo = (req, res) => {}
const updateInfo = async (req, res) => {
	const { id: infoId } = req.params
	const { information, referenceURL, about } = req.body
	if (!information || !referenceURL || !about) {
		throw new BadRequestError('Please Provide All Values')
	}

	const info = await Info.findOne({ _id: infoId })

	if (!info) {
		throw new NotFoundError(`No information with id ${infoId}`)
	}
	// check permissions
	checkPermissions(req.user, info.createdBy)

	const updatedInfo = await Info.findOneAndUpdate({ _id: infoId }, req.body, {
		new: true,
		runValidators: true,
	})

	res.status(StatusCodes.OK).json({ updatedInfo })
}
//const deleteInfo = (req, res) => {}
const deleteInfo = async (req, res) => {
	const { id: infoId } = req.params

	const info = await Info.findOne({ _id: infoId })

	if (!info) {
		throw new CustomError.NotFoundError(
			`No information with id : ${infoId}`
		)
	}

	checkPermissions(req.user, info.createdBy)

	await info.remove()
	res.status(StatusCodes.OK).json({ msg: 'Success! Information removed' })
}
const reduceStats = (stats) => {
	stats = stats.reduce((acc, curr) => {
		const { _id: title, count } = curr
		acc[title] = count
		return acc
	}, {})
	return stats
}

const showStats = async (req, res) => {
	let about = await Info.aggregate([
		{ $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{ $group: { _id: '$about', count: { $sum: 1 } } },
	])
	let status = await Info.aggregate([
		{ $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{ $group: { _id: '$status', count: { $sum: 1 } } },
	])

	let infoRequest = await InfoRequest.aggregate([
		{ $group: { _id: '$info', count: { $sum: 1 } } },
	])

	about = reduceStats(about)
	status = reduceStats(status)
	infoRequest = reduceStats(infoRequest)

	const defaultAbout = {
		symptoms: about.symptoms || 0,
		prevention: about.prevention || 0,
		management: about.management || 0,
		treatment: about.treatment || 0,
		diagnosis: about.diagnosis || 0,
		risk_factors: about['risk factors'] || 0,
		definitionInfoRequest: infoRequest.definition || 0,
		symptomsInfoRequest: infoRequest.symptoms || 0,
		preventionInfoRequest: infoRequest.prevention || 0,
		treatmentInfoRequest: infoRequest.treatment || 0,
		diagnosisInfoRequest: infoRequest.diagnosis || 0,
		risk_factorsInfoRequest: infoRequest['risk factors'] || 0,
		management_duringInfoRequest:
			infoRequest['management during pregnancy'] || 0,
		management_afterInfoRequest:
			infoRequest['management after pregnancy'] || 0,
	}
	const defaultStatus = {
		sent: status.sent || 0,
		queued: status.queued || 0,
	}

	let monthlyApplications = await Info.aggregate([
		{ $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{
			$group: {
				_id: {
					year: {
						$year: '$createdAt',
					},
					month: {
						$month: '$createdAt',
					},
				},
				count: { $sum: 1 },
			},
		},
		{ $sort: { '_id.year': -1, '_id.month': -1 } },
		{ $limit: 6 },
	])

	monthlyApplications = monthlyApplications
		.map((item) => {
			const {
				_id: { year, month },
				count,
			} = item
			// accepts 0-11
			const date = moment()
				.month(month - 1)
				.year(year)
				.format('MMM Y')
			return { date, count }
		})
		.reverse()

	res.status(StatusCodes.OK).json({
		defaultAbout,
		defaultStatus,
		monthlyApplications,
	})
}

const getSubscribers = async (req, res) => {
	let phoneNumbers = []
	const subscribers = await User.find({
		subscribed: true,
		// frequency: 'monthly',
	}).select('phoneNumber language')
	subscribers.forEach(async (subscriber) => {
		phoneNumbers.push(subscriber)
	})
	res.status(StatusCodes.OK).json({ subscribers: phoneNumbers })
}

const markInfoSend = async (req, res) => {
	const { id: infoId } = req.params
	const info = await Info.findOne({ _id: infoId })
	if (!info) {
		throw new NotFoundError(`No information with id ${infoId}`)
	}

	const updatedInfo = await Info.findOneAndUpdate(
		{ _id: infoId },
		{ status: 'sent' },
		{
			new: true,
			runValidators: true,
		}
	)

	res.status(StatusCodes.OK).json({ updatedInfo })
}

const sendSMStoSubscribers = async (req, res) => {
	const { message, phoneNumbers } = req.body
	if (!message || !phoneNumbers) {
		throw new BadRequestError('Please Provide All Values')
	}
	//loop through phone numbers and send sms
	phoneNumbers.forEach(async (subscriber) => {
		const { phoneNumber, language } = subscriber
		await sendSMS(phoneNumber, await translate(message, language || 'en'))
	})
	res.status(StatusCodes.OK).json({ msg: 'Success! SMS sent' })
}

const getUserRequests = async (req, res) => {
	const { infotype } = req.body
	const userInfoRequests = await InfoRequest.find({
		info: infotype,
	}).populate('requestedBy')
	res.status(StatusCodes.OK).json({ userInfoRequests })
}

module.exports = {
	createInfo,
	getAllInfo,
	deleteInfo,
	updateInfo,
	showStats,
	getSubscribers,
	sendSMStoSubscribers,
	markInfoSend,
	getUserRequests,
}
