const Alert = () => {
	const alert = {
		alertType: 'success',
		alertText: 'This is a success alert',
	}
	const { alertType, alertText } = alert
	return <div className={`alert alert-${alertType}`}>{alertText}</div>
}

export default Alert
