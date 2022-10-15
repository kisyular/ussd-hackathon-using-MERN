import React, { useEffect } from 'react'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { useAppContext } from '../../context/appContext'
import { useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

const Information = () => {
	const {
		// showAlert,
		subscribers,
		// displayAlert,
		infoToSend,
	} = useAppContext()
	const navigate = useNavigate()

	useEffect(() => {
		if (!subscribers || !infoToSend) {
			navigate(-1)
		}
	}, [subscribers, infoToSend, navigate])

	console.log(subscribers)
	return (
		<Wrapper>
			<Card>
				<Card.Header as='h5'>Send Information</Card.Header>
				<Card.Body>
					<Card.Title>
						Send information to
						{subscribers.map((subscriber) => {
							return (
								<span key={subscriber.phoneNumber}>
									{' '}
									[{subscriber.phoneNumber},{' '}
									{subscriber.language}]
								</span>
							)
						})}
					</Card.Title>
					<Card.Text>{infoToSend}</Card.Text>
					<button
						style={{ marginRight: '10px' }}
						className='btn view-btn'
					>
						Send Information
					</button>
					<button
						onClick={() => navigate(-1)}
						className='btn btn-danger'
					>
						Cancel
					</button>
				</Card.Body>
			</Card>
		</Wrapper>
	)
}

export default Information
