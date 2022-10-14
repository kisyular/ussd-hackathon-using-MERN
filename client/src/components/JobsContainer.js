import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import Loading from './Loading'
import Info from './Info'
import Wrapper from '../assets/wrappers/JobsContainer'
import PageBtnContainer from './PageBtnContainer'

const JobsContainer = () => {
	const {
		getInfo,
		infos,
		isLoading,
		totalInfos,
		search,
		searchStatus,
		searchAbout,
		sort,
		searchFrequency,
		numOfPages,
		page,
	} = useAppContext()
	useEffect(
		() => {
			getInfo()
		},
		// eslint-disable-next-line
		[search, searchStatus, searchAbout, sort, searchFrequency, page]
	)

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
			{numOfPages > 1 && <PageBtnContainer />}
		</Wrapper>
	)
}

export default JobsContainer
