import React, { useReducer, useContext } from 'react'
import reducer from './reducer'
import {
	DISPLAY_ALERT,
	CLEAR_ALERT,
	// SETUP_USER_BEGIN,
	// SETUP_USER_SUCCESS,
	// SETUP_USER_ERROR,
} from './actions'

export const initialState = {
	isLoading: false,
	showAlert: false,
	alertText: '',
	alertType: '',
}
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

	return (
		<AppContext.Provider
			value={{
				...state,
				displayAlert,
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