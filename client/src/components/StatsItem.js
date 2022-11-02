import Wrapper from '../assets/wrappers/StatItem'

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
					<span>Number of requests for this info {infoRequest}</span>
				</>
			)}
		</Wrapper>
	)
}

export default StatItem
