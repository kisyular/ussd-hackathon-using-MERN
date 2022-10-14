const Info = require('../models/Info.js')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/index.js')
const checkPermissions = require('../utils/checkPermissions.js')

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

//module.exports = { createInfo, getAllInfo, deleteInfo, updateInfo }
module.exports = { createInfo, getAllInfo, deleteInfo, updateInfo }
