import { Error, Register, ProtectedRoutes } from './pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AddInformation, AllInformation, SharedLayout } from './pages/dashboard'
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
					<Route
						path='all-info'
						index
						element={<AllInformation />}
					></Route>
					<Route path='add-info' element={<AddInformation />}></Route>
				</Route>
				<Route path='/register' element={<Register />} />
				<Route path='*' element={<Error />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
