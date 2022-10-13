//const register = async (req, res) => {}
const register = async (req, res) => {
	const { name, email, password } = req.body
	res.send('Register')
}

//const login = async (req, res) => {}
const login = async (req, res) => {
	const { email, password } = req.body
	res.send('Login')
}

//module.exports = { register, login }
module.exports = { register, login }
