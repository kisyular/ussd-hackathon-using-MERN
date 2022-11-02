import Wrapper from '../assets/wrappers/StatItem'

function StatItem({ count, title, icon, color, bcg, infoRequest }) {
	return (
		<Wrapper color={color} bcg={bcg}>
			<header>
				<span className='count'>{count}</span>
				<div className='icon'>{icon}</div>
				<h5 className='title'>{title}</h5>
			</header>
			<hr />
			<span>Number of requests for this info {infoRequest}</span>
		</Wrapper>
	)
}

export default StatItem
