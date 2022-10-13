import React, { useReducer, useContext } from 'react'
import axios from 'axios'

import reducer from './reducer'
import {
	DISPLAY_ALERT,
	CLEAR_ALERT,
	SETUP_USER_BEGIN,
	SETUP_USER_SUCCESS,
	SETUP_USER_ERROR,
	TOGGLE_SIDEBAR,
	LOGOUT_USER,
	UPDATE_USER_BEGIN,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_ERROR,
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
	showSidebar: false,
}
const BASE_URL = 'http://localhost:8080/api/auth'
const AppContext = React.createContext()
const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	const authFetch = axios.create({
		baseURL: BASE_URL,
	})

	// response interceptor
	authFetch.interceptors.request.use(
		(config) => {
			config.headers.Authorization = `Bearer ${state.token}`
			return config
		},
		(error) => {
			return Promise.reject(error)
		}
	)
	// response interceptor
	authFetch.interceptors.response.use(
		(response) => {
			return response
		},
		(error) => {
			console.log(error)
			if (error.response.status === 401) {
				logoutUser()
				console.log('AUTH ERROR')
			}
			return Promise.reject(error)
		}
	)

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

	const setupUser = async ({ currentUser, endPoint, alertText }) => {
		dispatch({ type: SETUP_USER_BEGIN })
		try {
			const response = await axios.post(
				`${BASE_URL}/${endPoint}`,
				currentUser
			)
			const { admin, token, location } = response.data
			dispatch({
				type: SETUP_USER_SUCCESS,
				payload: {
					admin,
					token,
					location,
					alertText,
				},
			})

			// will add later
			addUserToLocalStorage({
				admin,
				token,
				location,
			})
		} catch (error) {
			dispatch({
				type: SETUP_USER_ERROR,
				payload: { msg: error.response.data.msg },
			})
		}
		clearAlert()
	}

	const toggleSidebar = () => {
		dispatch({ type: TOGGLE_SIDEBAR })
	}

	const logoutUser = () => {
		dispatch({ type: LOGOUT_USER })
		removeUserFromLocalStorage()
	}

	const updateAdmin = async (currentUser) => {
		dispatch({ type: UPDATE_USER_BEGIN })
		try {
			const { data } = await authFetch.patch('/update', currentUser)
			const { admin, location } = data
			console.log(admin)
			dispatch({
				type: UPDATE_USER_SUCCESS,
				payload: { admin, token, location },
			})
			addUserToLocalStorage({
				admin,
				token: initialState.token,
				location,
			})
		} catch (error) {
			if (error.response.status !== 401) {
				dispatch({
					type: UPDATE_USER_ERROR,
					payload: { msg: error.response.data.msg },
				})
			}
		}
		clearAlert()
	}

	return (
		<AppContext.Provider
			value={{
				...state,
				displayAlert,
				setupUser,
				toggleSidebar,
				logoutUser,
				updateAdmin,
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
