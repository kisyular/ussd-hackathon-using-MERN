const Info = require('../models/Info.js')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/index.js')
const checkPermissions = require('../utils/checkPermissions.js')
const mongoose = require('mongoose')
const moment = require('moment')

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
	const { status, about, sort, search } = req.query
	const queryObject = {
		createdBy: req.user.userId,
	}

	if (status && status !== 'all') {
		queryObject.status = status
	}

	if (about && about !== 'all') {
		queryObject.about = about
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
		result = result.sort('position')
	}
	if (sort === 'z-a') {
		result = result.sort('-position')
	}

	const infos = await result

	res.status(StatusCodes.OK).json({
		infos,
		totalInfos: infos.length,
		numOfPages: 1,
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
		// { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{ $group: { _id: '$about', count: { $sum: 1 } } },
	])
	let status = await Info.aggregate([
		// { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{ $group: { _id: '$status', count: { $sum: 1 } } },
	])

	about = reduceStats(about)
	status = reduceStats(status)

	const defaultAbout = {
		symptoms: about.symptoms || 0,
		prevention: about.prevention || 0,
		management: about.management || 0,
		treatment: about.treatment || 0,
		diagnosis: about.diagnosis || 0,
		risk_factors: about['risk factors'] || 0,
	}
	const defaultStatus = {
		sent: status.sent || 0,
		queued: status.queued || 0,
	}
	let monthlyApplications = await Info.aggregate([
		// { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
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

//module.exports = { createInfo, getAllInfo, deleteInfo, updateInfo }
module.exports = { createInfo, getAllInfo, deleteInfo, updateInfo, showStats }
