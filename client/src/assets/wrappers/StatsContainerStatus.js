import styled from 'styled-components'

const WrapperStatus = styled.section`
	display: grid;
	row-gap: 2rem;
	margin-bottom: 2rem;
	text-align: center;
	@media (min-width: 768px) {
		grid-template-columns: 1fr 1fr;
		column-gap: 1rem;
	}
	@media (min-width: 1120px) {
		grid-template-columns: 1fr 1fr;
		column-gap: 1rem;
	}
`
export default WrapperStatus
