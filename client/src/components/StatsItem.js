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
					<div>
						Number of requests for this info{' '}
						<strong style={{ color: color, fontWeight: 'bolder' }}>
							{infoRequest}
						</strong>
					</div>
				</>
			)}
		</Wrapper>
	)
}

export default StatItem
