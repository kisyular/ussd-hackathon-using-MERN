import { useState, useEffect } from 'react'
import { Logo, FormRow } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
// global context and useNavigate later

const initialState = {
	name: '',
	email: '',
	password: '',
	isMember: true,
}
// if possible prefer local state
// global state

function Register() {
	const [values, setValues] = useState(initialState)

	// global context and useNavigate later
	const toggleMember = () => {
		setValues({ ...values, isMember: !values.isMember })
	}

	const handleChange = (e) => {
		console.log(e.target)
	}

	const onSubmit = (e) => {
		e.preventDefault()
		console.log(e.target)
	}
	return (
		<Wrapper className='full-page'>
			<form className='form' onSubmit={onSubmit}>
				<Logo />
				<h3>{values.isMember ? 'Login' : 'Register'}</h3>

				{/* name input */}
				{!values.isMember && (
					<FormRow
						type='text'
						name='name'
						value={values.name}
						handleChange={handleChange}
					/>
				)}

				{/* email input */}
				<FormRow
					type='email'
					name='email'
					value={values.email}
					handleChange={handleChange}
				/>
				{/* password input */}
				<FormRow
					type='password'
					name='password'
					value={values.password}
					handleChange={handleChange}
				/>

				<button type='submit' className='btn btn-block'>
					submit
				</button>
				<p>
					{values.isMember
						? 'Not a member yet?'
						: 'Already a member?'}

					<button
						type='button'
						onClick={toggleMember}
						className='member-btn'
					>
						{values.isMember ? 'Register' : 'Login'}
					</button>
				</p>
			</form>
			<small style={{ textAlign: 'center', fontSize: '8px' }}>
				pic{' '}
				<a href='https://storyset.com/people'>
					people illustrations by Storyset
				</a>
			</small>
		</Wrapper>
	)
}

export default Register
