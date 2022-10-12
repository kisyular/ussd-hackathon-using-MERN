import { Navigate } from 'react-router-dom'
// import { useAppContext } from '../context/appContext'

const ProtectedRoutes = ({ children }) => {
	// const { user } = useAppContext()
	const user = null
	if (!user) {
		return <Navigate to='/register' />
	}
	return children
}

export default ProtectedRoutes
