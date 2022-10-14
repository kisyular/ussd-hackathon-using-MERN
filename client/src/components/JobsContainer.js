import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import Loading from './Loading'
import Info from './Info'
import Wrapper from '../assets/wrappers/JobsContainer'

const JobsContainer = () => {
	const { getInfo, infos, isLoading, page, totalInfos } = useAppContext()
	useEffect(() => {
		getInfo()
	}, [])

	if (isLoading) {
		return <Loading center />
	}
	if (infos?.length === 0) {
		return (
			<Wrapper>
				<h2>No information to display...</h2>
			</Wrapper>
		)
	}
	return (
		<Wrapper>
			<h5>
				{totalInfos} Information{infos?.length > 1 && 's'} found
			</h5>
			<div className='jobs'>
				{infos.map((info) => {
					return <Info key={info._id} {...info} />
				})}
			</div>
		</Wrapper>
	)
}

export default JobsContainer
