const FormTextArea = ({ type, name, value, handleChange, labelText }) => {
	return (
		<div className='form-row'>
			<label htmlFor={name} className='form-label'>
				{labelText || name}
			</label>

			<textarea
				type={type}
				value={value}
				style={{ height: '50px' }}
				name={name}
				onChange={handleChange}
				className='form-input'
			/>
		</div>
	)
}

export default FormTextArea
