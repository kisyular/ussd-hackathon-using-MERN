import { useAppContext } from '../context/appContext'
import StatItem from './StatsItem'
import {
	FaFileMedicalAlt,
	FaHandHoldingMedical,
	FaHeartbeat,
	FaSyringe,
	FaViruses,
	FaStethoscope,
} from 'react-icons/fa'
import Wrapper from '../assets/wrappers/StatsContainer'

const StatsContainer = () => {
	const { aboutStats } = useAppContext()
	const defaultAboutStats = [
		{
			title: 'Symptoms Info Added',
			count: aboutStats.symptoms || 0,
			icon: <FaViruses />,
			color: '#e9b949',
			bcg: '#fcefc7',
		},
		{
			title: 'Treatment Info Added',
			count: aboutStats.treatment || 0,
			icon: <FaSyringe />,
			color: '#647acb',
			bcg: '#e0e8f9',
		},
		{
			title: 'Diagnosis Info Added',
			count: aboutStats.diagnosis || 0,
			icon: <FaStethoscope />,
			color: '#d66a6a',
			bcg: '#ffeeee',
		},
		{
			title: 'Prevention Info Added',
			count: aboutStats.prevention || 0,
			icon: <FaHandHoldingMedical />,
			color: '#6a9d66',
			bcg: '#e8f6ee',
		},
		{
			title: 'Risk Factors Info Added',
			count: aboutStats.risk_factors || 0,
			icon: <FaHeartbeat />,
			color: '#f96b6a',
			bcg: '#feeef0',
		},
		{
			title: 'Management Info Added',
			count: aboutStats.management || 0,
			icon: <FaFileMedicalAlt />,
			color: '#8f5ad6',
			bcg: '#f2e8f9',
		},
	]

	return (
		<Wrapper>
			{defaultAboutStats.map((item, index) => {
				return <StatItem key={index} {...item} />
			})}
		</Wrapper>
	)
}

export default StatsContainer
