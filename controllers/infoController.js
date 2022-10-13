const Info = require('../models/Info.js')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/index.js')
//const createInfo = (req, res) => {}
const createInfo = async (req, res) => {
	const { information } = req.body

	if (!information) {
		throw new BadRequestError('Please Provide All Values')
	}

	req.body.createdBy = req.user.userId

	const info = await Info.create(req.body)
	res.status(StatusCodes.CREATED).json({ info })
}

//const getAllInfo = (req, res) => {}
const getAllInfo = async (req, res) => {
	res.send('Get All Info')
}

//const deleteInfo = (req, res) => {}
const deleteInfo = async (req, res) => {
	res.send('Delete Info')
}

//const updateInfo = (req, res) => {}
const updateInfo = async (req, res) => {
	res.send('Update Info')
}

//module.exports = { createInfo, getAllInfo, deleteInfo, updateInfo }
module.exports = { createInfo, getAllInfo, deleteInfo, updateInfo }
