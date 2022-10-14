import { FormRow, Alert, FormTextArea, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
const AddInformation = () => {
	const {
		isLoading,
		isEditing,
		showAlert,
		displayAlert,
		information,
		referenceURL,
		infoFrequencyOptions,
		infoFrequency,
		statusOptions,
		status,
		handleChange,
		clearValues,
		createInfo,
		about,
		aboutOptions,
	} = useAppContext()

	const handleSubmit = (e) => {
		e.preventDefault()

		if (!information || !referenceURL) {
			displayAlert()
			return
		}
		if (isEditing) {
			// updateInfo()
			return
		}
		createInfo()
	}

	const handleInfoInput = (e) => {
		handleChange({ name: e.target.name, value: e.target.value })
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

					<FormRowSelect
						labelText='select about'
						name='about'
						value={about}
						handleChange={handleInfoInput}
						list={aboutOptions}
					/>
					{/* reference url */}
					<FormRow
						type='text'
						labelText='Reference URL'
						name='referenceURL'
						value={referenceURL}
						handleChange={handleInfoInput}
					/>

					<div className='btn-container'>
						<button
							className='btn btn-block submit-btn'
							type='submit'
							onClick={handleSubmit}
							disabled={isLoading}
						>
							submit
						</button>

						<button
							className='btn btn-block clear-btn'
							onClick={(e) => {
								e.preventDefault()
								clearValues()
							}}
						>
							clear
						</button>
					</div>
				</div>
			</form>
		</Wrapper>
	)
}

export default AddInformation
