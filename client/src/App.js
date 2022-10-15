import { Error, Register, ProtectedRoutes } from './pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
	AddInformation,
	AllInformation,
	SharedLayout,
	Profile,
	Stats,
	Information,
} from './pages/dashboard'
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={
						<ProtectedRoutes>
							<SharedLayout />
						</ProtectedRoutes>
					}
				>
					<Route index element={<Stats />} />
					<Route path='all-info' element={<AllInformation />} />
					<Route path='all-info/:id' element={<Information />} />
					<Route path='add-info' element={<AddInformation />} />
					<Route path='profile' element={<Profile />} />
				</Route>
				<Route path='/register' element={<Register />} />
				<Route path='*' element={<Error />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
