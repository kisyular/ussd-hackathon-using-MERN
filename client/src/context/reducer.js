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
	SEND_INFO_BEGIN,
	SEND_INFO_SUCCESS,
	SEND_INFO_ERROR,
	CLEAR_INFO_AFTER_SENDING,
} from './actions'
import { initialState } from './appContext'

const reducer = (state, action) => {
	if (action.type === DISPLAY_ALERT) {
		return {
			...state,
			showAlert: true,
			alertType: 'danger',
			alertText: 'Please provide all values!',
		}
	}

	if (action.type === CLEAR_ALERT) {
		return {
			...state,
			showAlert: false,
			alertType: '',
			alertText: '',
		}
	}

	if (action.type === SETUP_USER_BEGIN) {
		return { ...state, isLoading: true }
	}

	if (action.type === SETUP_USER_SUCCESS) {
		return {
			...state,
			user: action.payload.admin,
			token: action.payload.token,
			userLocation: action.payload.location,
			isLoading: false,
			showAlert: true,
			alertType: 'success',
			alertText: action.payload.alertText,
		}
	}

	if (action.type === SETUP_USER_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === TOGGLE_SIDEBAR) {
		return { ...state, showSidebar: !state.showSidebar }
	}

	if (action.type === LOGOUT_USER) {
		return {
			...initialState,
			user: null,
			token: null,
			userLocation: '',
			jobLocation: '',
		}
	}

	if (action.type === UPDATE_USER_BEGIN) {
		return { ...state, isLoading: true }
	}

	if (action.type === UPDATE_USER_SUCCESS) {
		return {
			...state,
			isLoading: false,
			token: action.payload.token,
			user: action.payload.admin,
			userLocation: action.payload.location,
			jobLocation: action.payload.location,
			showAlert: true,
			alertType: 'success',
			alertText: 'User Profile Updated!',
		}
	}

	if (action.type === UPDATE_USER_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === HANDLE_CHANGE) {
		return { ...state, [action.payload.name]: action.payload.value }
	}

	if (action.type === CLEAR_VALUES) {
		const initialState = {
			isEditing: false,
			editJobId: '',
			information: '',
			referenceURL: '',
			infoFrequency: 'weekly',
			status: 'queued',
		}
		return { ...state, ...initialState }
	}

	if (action.type === CREATE_INFO_BEGIN) {
		return { ...state, isLoading: true }
	}
	if (action.type === CREATE_INFO_SUCCESS) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'success',
			alertText: 'New Information Created!',
		}
	}
	if (action.type === CREATE_INFO_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === GET_INFO_BEGIN) {
		return { ...state, isLoading: true, showAlert: false }
	}

	if (action.type === GET_INFO_SUCCESS) {
		return {
			...state,
			isLoading: false,
			infos: action.payload.infos,
			totalInfos: action.payload.totalInfos,
			numOfPages: action.payload.numOfPages,
		}
	}

	if (action.type === SET_EDIT_INFO) {
		const info = state.infos.find((info) => info._id === action.payload.id)
		const { _id, information, infoFrequency, referenceURL, about, status } =
			info
		return {
			...state,
			isEditing: true,
			editInfoId: _id,
			information,
			infoFrequency,
			referenceURL,
			about,
			status,
		}
	}

	if (action.type === DELETE_INFO_BEGIN) {
		return { ...state, isLoading: true }
	}

	if (action.type === EDIT_INFO_BEGIN) {
		return { ...state, isLoading: true }
	}

	if (action.type === EDIT_INFO_SUCCESS) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'success',
			alertText: 'Info Updated!',
		}
	}

	if (action.type === EDIT_INFO_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}

	if (action.type === SHOW_STATS_BEGIN) {
		return { ...state, isLoading: true, showAlert: false }
	}

	if (action.type === SHOW_STATS_SUCCESS) {
		return {
			...state,
			isLoading: false,
			aboutStats: action.payload.aboutStats,
			statusStats: action.payload.statusStats,
			monthlyApplications: action.payload.monthlyApplications,
		}
	}

	if (action.type === CLEAR_FILTERS) {
		return {
			...state,
			search: '',
			searchStatus: 'all',
			searchType: 'all',
			sort: 'latest',
			searchAbout: 'all',
			searchFrequency: 'all',
		}
	}

	if (action.type === CHANGE_PAGE) {
		return { ...state, page: action.payload.page }
	}

	if (action.type === HANDLE_CHANGE) {
		// set back to first page

		return {
			...state,
			page: 1,
			[action.payload.name]: action.payload.value,
		}
	}

	if (action.type === GET_SUBSCRIBERS_BEGIN) {
		return { ...state, isLoading: true, showAlert: false }
	}

	if (action.type === GET_SUBSCRIBERS_SUCCESS) {
		return {
			...state,
			isLoading: false,
			subscribers: action.payload.subscribers,
		}
	}

	if (action.type === SET_INFO_TO_SEND) {
		return { ...state, infoToSend: action.payload.infoToSend }
	}

	if (action.type === SEND_INFO_BEGIN) {
		return { ...state, isLoading: true }
	}

	if (action.type === SEND_INFO_SUCCESS) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'success',
			alertText: 'Information Sent!',
		}
	}
	if (action.type === SEND_INFO_ERROR) {
		return {
			...state,
			isLoading: false,
			showAlert: true,
			alertType: 'danger',
			alertText: action.payload.msg,
		}
	}
	if (action.type === CLEAR_INFO_AFTER_SENDING) {
		return { ...state, infoToSend: '', subscribers: [] }
	}
}

export default reducer
