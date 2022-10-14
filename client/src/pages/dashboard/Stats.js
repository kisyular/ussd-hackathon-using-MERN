import { useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { StatsContainer, Loading, ChartsContainer } from '../../components'
import WrapperStatus from '../../assets/wrappers/StatsContainerStatus'
import { FaCheckDouble, FaClock } from 'react-icons/fa'
const Stats = () => {
	const { showStats, isLoading, monthlyApplications, statusStats } =
		useAppContext()
	useEffect(() => {
		showStats()
	}, [])

	if (isLoading) {
		return <Loading center />
	}

	return (
		<>
			<WrapperStatus>
				<h3>
					Information Sent {statusStats.sent} <FaCheckDouble />
				</h3>
				<h3>
					Information Queued {statusStats.queued} <FaClock />{' '}
				</h3>
			</WrapperStatus>
			<StatsContainer />
			{monthlyApplications.length > 0 && <ChartsContainer />}
		</>
	)
}

export default Stats
