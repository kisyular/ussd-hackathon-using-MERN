import { FormRow, Alert, FormTextArea, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
const AddInformation = () => {
	const {
		isEditing,
		showAlert,
		displayAlert,
		information,
		refereceURL,
		infoFrequencyOptions,
		infoFrequency,
		statusOptions,
		status,
	} = useAppContext()

	const handleSubmit = (e) => {
		e.preventDefault()

		if (!information || !refereceURL) {
			displayAlert()
			return
		}
		console.log('create job')
	}

	const handleInfoInput = (e) => {
		const name = e.target.name
		const value = e.target.value
		console.log(`${name}:${value}`)
	}

	return (
		<Wrapper>
			<form className='form'>
				<h3>{isEditing ? 'edit information' : 'add information'} </h3>
				{showAlert && <Alert />}

				{/* position */}
				<FormTextArea
					type='text'
					name='information'
					value={information}
					handleChange={handleInfoInput}
					labelText='gestational diabetes information'
				/>
				<div className='form-center'>
					{/* reference url */}
					<FormRow
						type='text'
						labelText={'Reference URL'}
						name='refereceURL'
						value={refereceURL}
						handleChange={handleInfoInput}
					/>

					{/* info frequency */}
					<FormRowSelect
						labelText='information frequency'
						name='infoFrequency'
						value={infoFrequency}
						handleChange={handleInfoInput}
						list={infoFrequencyOptions}
					/>

					{/* info status */}
					<FormRowSelect
						labelText='status'
						name='status'
						value={status}
						handleChange={handleInfoInput}
						list={statusOptions}
					/>

					<div className='btn-container'>
						<button
							className='btn btn-block submit-btn'
							type='submit'
							onClick={handleSubmit}
						>
							submit
						</button>
					</div>
				</div>
			</form>
		</Wrapper>
	)
}

export default AddInformation
