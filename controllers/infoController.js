const Info = require('../models/Info.js')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/index.js')
const checkPermissions = require('../utils/checkPermissions.js')
const mongoose = require('mongoose')

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
	const infos = await Info.find({ createdBy: req.user.userId })

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

const showStats = async (req, res) => {
	let stats = await Info.aggregate([
		// { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{ $group: { _id: '$about', count: { $sum: 1 } } },
	])

	stats = stats.reduce((acc, curr) => {
		const { _id: title, count } = curr
		acc[title] = count
		return acc
	}, {})

	const defaultStats = {
		pending: stats.pending || 0,
		interview: stats.interview || 0,
		declined: stats.declined || 0,
	}
	let monthlyApplications = []

	res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

//module.exports = { createInfo, getAllInfo, deleteInfo, updateInfo }
module.exports = { createInfo, getAllInfo, deleteInfo, updateInfo, showStats }
