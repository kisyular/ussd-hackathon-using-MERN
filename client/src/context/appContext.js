import React, { useReducer, useContext, useEffect } from 'react'
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
	HANDLE_CHANGE,
	CLEAR_VALUES,
	CREATE_INFO_BEGIN,
	CREATE_INFO_SUCCESS,
	CREATE_INFO_ERROR,
	GET_INFO_BEGIN,
	GET_INFO_SUCCESS,
	SET_EDIT_INFO,
	DELETE_INFO_BEGIN,
	EDIT_INFO_BEGIN,
	EDIT_INFO_SUCCESS,
	EDIT_INFO_ERROR,
	SHOW_STATS_BEGIN,
	SHOW_STATS_SUCCESS,
	CLEAR_FILTERS,
	CHANGE_PAGE,
	GET_SUBSCRIBERS_BEGIN,
	GET_SUBSCRIBERS_SUCCESS,
	SET_INFO_TO_SEND,
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
	isEditing: false,
	editInfoId: '',
	information: '',
	referenceURL: '',
	infoFrequency: 'weekly',
	infoFrequencyOptions: ['weekly', 'monthly'],
	about: 'symptoms',
	aboutOptions: [
		'symptoms',
		'diagnosis',
		'treatment',
		'prevention',
		'risk factors',
		'management',
	],
	status: 'queued',
	statusOptions: ['sent', 'queued'],
	infos: [],
	totalInfos: 0,
	numOfPages: 1,
	page: 1,
	aboutStats: {},
	statusStats: {},
	monthlyApplications: [],
	search: '',
	searchStatus: 'all',
	searchAbout: 'all',
	searchFrequency: 'all',
	sort: 'latest',
	sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
	subscribers: [],
	infoToSend: '',
}
const BASE_URL = 'http://localhost:8080/api'
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
				`${BASE_URL}/auth/${endPoint}`,
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
			const { data } = await authFetch.patch('/auth/update', currentUser)
			const { admin, location } = data
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

	const handleChange = ({ name, value }) => {
		dispatch({
			type: HANDLE_CHANGE,
			payload: { name, value },
		})
	}

	const clearValues = () => {
		dispatch({ type: CLEAR_VALUES })
	}

	const createInfo = async () => {
		dispatch({ type: CREATE_INFO_BEGIN })
		try {
			const { information, infoFrequency, referenceURL, status, about } =
				state

			await authFetch.post('/info', {
				information,
				infoFrequency,
				referenceURL,
				status,
				about,
			})
			dispatch({
				type: CREATE_INFO_SUCCESS,
			})
			// call function instead clearValues()
			dispatch({ type: CLEAR_VALUES })
		} catch (error) {
			if (error.response.status === 401) return
			dispatch({
				type: CREATE_INFO_ERROR,
				payload: { msg: error.response.data.msg },
			})
		}
		clearAlert()
	}

	const getInfo = async () => {
		const {
			search,
			searchStatus,
			searchAbout,
			sort,
			searchFrequency,
			page,
		} = state

		let url = `/info?page=${page}&status=${searchStatus}&about=${searchAbout}&infoFrequency=${searchFrequency}&sort=${sort}`
		if (search) {
			url = url + `&search=${search}`
		}

		dispatch({ type: GET_INFO_BEGIN })
		try {
			const { data } = await authFetch(url)
			const { infos, totalInfos, numOfPages } = data
			dispatch({
				type: GET_INFO_SUCCESS,
				payload: {
					infos,
					totalInfos,
					numOfPages,
				},
			})
		} catch (error) {
			console.log(error.response)
			logoutUser()
		}
		clearAlert()
	}

	useEffect(
		() => {
			getInfo()
		},
		// eslint-disable-next-line
		[]
	)

	const setEditInfo = (id) => {
		dispatch({ type: SET_EDIT_INFO, payload: { id } })
	}

	const editInfo = async () => {
		dispatch({ type: EDIT_INFO_BEGIN })
		try {
			const { information, infoFrequency, referenceURL, status, about } =
				state

			await authFetch.patch(`/info/${state.editInfoId}`, {
				information,
				infoFrequency,
				referenceURL,
				status,
				about,
			})
			dispatch({
				type: EDIT_INFO_SUCCESS,
			})
			dispatch({ type: CLEAR_VALUES })
		} catch (error) {
			console.log(error)
			if (error.response.status === 401) return
			dispatch({
				type: EDIT_INFO_ERROR,
				payload: { msg: error.response.data.msg },
			})
		}
		clearAlert()
	}

	const deleteInfo = async (id) => {
		dispatch({ type: DELETE_INFO_BEGIN })
		try {
			await authFetch.delete(`/info/${id}`)
			getInfo()
		} catch (error) {
			logoutUser()
		}
	}

	const showStats = async () => {
		dispatch({ type: SHOW_STATS_BEGIN })
		try {
			const { data } = await authFetch('/info/stats')
			dispatch({
				type: SHOW_STATS_SUCCESS,
				payload: {
					aboutStats: data.defaultAbout,
					statusStats: data.defaultStatus,
					monthlyApplications: data.monthlyApplications,
				},
			})
		} catch (error) {
			console.log(error.response)
			logoutUser()
		}
		clearAlert()
	}

	const clearFilters = () => {
		dispatch({ type: CLEAR_FILTERS })
	}

	const changePage = (page) => {
		dispatch({ type: CHANGE_PAGE, payload: { page } })
	}

	const setInfoToSend = (infoToSend) => {
		dispatch({ type: SET_INFO_TO_SEND, payload: { infoToSend } })
	}

	const getSubscribers = async (infoToSend) => {
		dispatch({ type: GET_SUBSCRIBERS_BEGIN })
		setInfoToSend(infoToSend)
		try {
			const { data } = await authFetch('info/subscribers')
			dispatch({
				type: GET_SUBSCRIBERS_SUCCESS,
				payload: {
					subscribers: data.subscribers,
				},
			})
		} catch (error) {
			console.log(error.response)
			logoutUser()
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
				handleChange,
				clearValues,
				createInfo,
				getInfo,
				setEditInfo,
				deleteInfo,
				editInfo,
				showStats,
				clearFilters,
				changePage,
				getSubscribers,
				setInfoToSend,
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
