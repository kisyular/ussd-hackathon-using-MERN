import React, { useEffect } from 'react'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { useAppContext } from '../../context/appContext'
import { useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Loading from '../../components/Loading'
import Alert from '../../components/Alert'

const Information = () => {
	const {
		// showAlert,
		subscribers,
		// displayAlert,
		infoToSend,
		isLoading,
		sendInfo,
		showAlert,
	} = useAppContext()
	const navigate = useNavigate()

	useEffect(() => {
		if (!subscribers || !infoToSend) {
			navigate(-1)
		}
	}, [subscribers, infoToSend, navigate])

	if (isLoading) {
		return <Loading center />
	}
	return (
		<Wrapper>
			{showAlert && <Alert />}

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
						onClick={sendInfo}
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
