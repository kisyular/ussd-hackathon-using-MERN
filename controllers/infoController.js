//const createInfo = (req, res) => {}
const createInfo = async (req, res) => {
	res.send('Add Info')
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
