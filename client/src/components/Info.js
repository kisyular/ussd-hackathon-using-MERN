import { FaLocationArrow, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'
import moment from 'moment'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
const Info = ({
	_id,
	about,
	infoFrequency,
	createdAt,
	status,
	referenceURL,
	information,
}) => {
	const { setEditInfo, deleteInfo } = useAppContext()

	let date = moment(createdAt).format('MMM Do, YYYY')

	const popover = (
		<Popover id='popover-basic'>
			<Popover.Header as='h3'>{referenceURL}</Popover.Header>
			<Popover.Body>{information}</Popover.Body>
		</Popover>
	)

	return (
		<Wrapper>
			<header>
				<div className='main-icon'>{about.charAt(0)}</div>
				<div className='info'>
					<h5>{about}</h5>
					<p>{infoFrequency}</p>
				</div>
			</header>
			<div className='content'>
				{/* content center later */}
				<div className='content-center'>
					<JobInfo icon={<FaLocationArrow />} text={referenceURL} />
					<div className={`status ${status}`}>{status}</div>
					<JobInfo icon={<FaCalendarAlt />} text={date} />
				</div>
				<div className='content-bottom'>
					{information.substring(0, 100)}
					{information.length > 100 && (
						<OverlayTrigger
							trigger='click'
							placement='top'
							overlay={popover}
						>
							<Link variant='success'>read more</Link>
						</OverlayTrigger>
					)}
				</div>
				<footer>
					<div className='actions'>
						<Link
							to='/add-info'
							onClick={() => setEditInfo(_id)}
							className='btn edit-btn'
						>
							Edit
						</Link>
						<button
							type='button'
							className='btn delete-btn'
							onClick={() => deleteInfo(_id)}
						>
							Delete
						</button>
					</div>
				</footer>
			</div>
		</Wrapper>
	)
}

export default Info
