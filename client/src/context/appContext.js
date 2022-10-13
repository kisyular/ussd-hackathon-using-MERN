import React, { useReducer, useContext } from 'react'
import axios from 'axios'

import reducer from './reducer'
import {
	DISPLAY_ALERT,
	CLEAR_ALERT,
	REGISTER_USER_BEGIN,
	REGISTER_USER_SUCCESS,
	REGISTER_USER_ERROR,
} from './actions'

// set as default
const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

export const initialState = {
	isLoading: false,
	showAlert: false,
	alertText: '',
	alertType: '',
	user: user ? JSON.parse(user) : null,
	token: token,
	userLocation: userLocation || '',
}
const BASE_URL = 'http://localhost:8080'
const AppContext = React.createContext()
const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	const displayAlert = () => {
		dispatch({
			type: DISPLAY_ALERT,
		})
		clearAlert()
	}

	const clearAlert = () => {
		setTimeout(() => {
			dispatch({
				type: CLEAR_ALERT,
			})
		}, 4000)
	}

	const addUserToLocalStorage = ({ admin, token, location }) => {
		localStorage.setItem('user', JSON.stringify(admin))
		localStorage.setItem('token', token)
		localStorage.setItem('location', location)
	}

	const removeUserFromLocalStorage = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		localStorage.removeItem('location')
	}

	const registerUser = async (currentUser) => {
		dispatch({ type: REGISTER_USER_BEGIN })
		try {
			const response = await axios.post(
				`${BASE_URL}/api/auth/register`,
				currentUser
			)
			console.log(response)
			const { admin, token, location } = response.data
			console.log('user', admin)
			dispatch({
				type: REGISTER_USER_SUCCESS,
				payload: {
					admin,
					token,
					location,
				},
			})

			// will add later
			addUserToLocalStorage({
				admin,
				token,
				location,
			})
		} catch (error) {
			console.log(error.response)
			dispatch({
				type: REGISTER_USER_ERROR,
				payload: { msg: error.response.data.msg },
			})
		}
		clearAlert()
	}

	return (
		<AppContext.Provider
			value={{
				...state,
				displayAlert,
				registerUser,
			}}
		>
			{children}
		</AppContext.Provider>
	)
}
// make sure use
export const useAppContext = () => {
	return useContext(AppContext)
}

export { AppProvider }
