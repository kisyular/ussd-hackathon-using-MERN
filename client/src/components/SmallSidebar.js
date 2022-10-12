import Wrapper from '../assets/wrappers/SmallSidebar'
import { FaTimes } from 'react-icons/fa'
import Logo from './Logo'
import NavLinks from './NavLinks'

export const SmallSidebar = () => {
	const showSidebar = true
	return (
		<Wrapper>
			<div
				className={
					showSidebar
						? 'sidebar-container show-sidebar'
						: 'sidebar-container'
				}
			>
				<div className='content'>
					<button
						className='close-btn'
						onClick={() => console.log('Toggle Sidebar')}
					>
						<FaTimes />
					</button>
					<header>
						<Logo />
					</header>
					<NavLinks
						toggleSidebar={() => console.log('Toggle Sidebar')}
					/>
				</div>
			</div>
		</Wrapper>
	)
}

export default SmallSidebar
