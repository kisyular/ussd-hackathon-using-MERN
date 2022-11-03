import { FaLocationArrow, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'
import moment from 'moment'

import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'

const Info = ({
	_id,
	about,
	infoFrequency,
	createdAt,
	status,
	referenceURL,
	information,
}) => {
	const { setEditInfo, deleteInfo, getSubscribers } = useAppContext()

	let date = moment(createdAt).format('MMM Do, YYYY')
	const [show, setShow] = useState(false)

	const handleClose = () => {
		setShow(false)
	}
	const handleShow = () => setShow(true)

	function ShowMoreInfo() {
		return (
			<>
				<Modal show={show} onHide={handleClose} size='lg'>
					<Modal.Header closeButton>
						<Modal.Title>
							<h5>{about}</h5>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>{information}</Modal.Body>
				</Modal>
			</>
		)
	}

	return (
		<Wrapper>
			<ShowMoreInfo />
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
					<JobInfo
						icon={<FaLocationArrow />}
						text={
							<a
								target='_blank'
								href={referenceURL}
								rel='noreferrer'
							>
								Reference
							</a>
						}
					/>
					<div className={`status ${status}`}>{status}</div>
					<JobInfo icon={<FaCalendarAlt />} text={date} />
				</div>
				<div className='content-bottom'>
					{information.substring(0, 100)}
					{information.length > 100 && (
						<Link onClick={handleShow} variant='success'>
							{' '}
							read more
						</Link>
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

						<Link
							type='button'
							to={_id}
							className='btn view-btn'
							onClick={() => getSubscribers(information, status)}
						>
							{status === 'sent' ? 'Resend' : 'Send'}
						</Link>
					</div>
				</footer>
			</div>
		</Wrapper>
	)
}

export default Info
