import Wrapper from '../assets/wrappers/StatItem'
import { Link } from 'react-router-dom'

function StatItem({ count, title, icon, color, bcg, infoRequest, underline }) {
	return (
		<Wrapper color={color} bcg={bcg}>
			<header>
				<span className='count'>{underline ? count : infoRequest}</span>
				<div className='icon'>{icon}</div>
				<h5 className='title'>{title}</h5>
			</header>
			{underline && (
				<>
					<hr />
					<div>
						Number of requests for this info{' '}
						<Link
							className='btn btn-info'
							style={{
								background: color,
								fontWeight: 'bolder',
								minWidth: '4rem',
							}}
							to='/info-requests'
							onClick={() => console.log("I'm here")}
						>
							{infoRequest}
						</Link>
					</div>
				</>
			)}
		</Wrapper>
	)
}

export default StatItem
