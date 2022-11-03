import { useAppContext } from '../context/appContext'
import StatItem from './StatsItem'
import {
	FaFileMedicalAlt,
	FaHandHoldingMedical,
	FaHeartbeat,
	FaSyringe,
	FaViruses,
	FaStethoscope,
	FaHandHoldingHeart,
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
			infoRequest: aboutStats.symptomsInfoRequest || 0,
			underline: true,
		},
		{
			title: 'Treatment Info Added',
			count: aboutStats.treatment || 0,
			icon: <FaSyringe />,
			color: '#647acb',
			bcg: '#e0e8f9',
			infoRequest: aboutStats.treatmentInfoRequest || 0,
			underline: true,
		},
		{
			title: 'Diagnosis Info Added',
			count: aboutStats.diagnosis || 0,
			icon: <FaStethoscope />,
			color: '#d66a6a',
			bcg: '#ffeeee',
			infoRequest: aboutStats.diagnosisInfoRequest || 0,
			underline: true,
		},
		{
			title: 'Prevention Info Added',
			count: aboutStats.prevention || 0,
			icon: <FaHandHoldingMedical />,
			color: '#6a9d66',
			bcg: '#e8f6ee',
			infoRequest: aboutStats.preventionInfoRequest || 0,
			underline: true,
		},
		{
			title: 'Risk Factors Info Added',
			count: aboutStats.risk_factors || 0,
			icon: <FaHeartbeat />,
			color: '#f96b6a',
			bcg: '#feeef0',
			infoRequest: aboutStats.riskFactorsInfoRequest || 0,
			underline: true,
		},
		{
			title: 'Management Info Added',
			count: aboutStats.management || 0,
			icon: <FaFileMedicalAlt />,
			color: '#9E7676',
			bcg: '#F8E0E0',
			infoRequest:
				aboutStats.management_afterInfoRequest +
					aboutStats.management_duringInfoRequest || 0,
			underline: true,
		},
		{
			title: 'GDM Definition Info Rquested',
			icon: <FaHandHoldingHeart />,
			//light pink color for definition info request
			//light pink color for definition info request
			color: '#8f5ad6',
			bcg: '#f2e8f9',
			infoRequest: aboutStats.definitionInfoRequest || 0,
			underline: false,
		},
		{
			title: 'Management During Pregnancy Info Rquested',
			icon: <FaHandHoldingHeart />,
			color: '#8f5ad6',
			bcg: '#f2e8f9',
			infoRequest: aboutStats.management_afterInfoRequest || 0,
			underline: false,
		},
		{
			title: 'Management After Pregnancy Info Rquested',
			icon: <FaHandHoldingHeart />,
			color: '#8f5ad6',
			bcg: '#f2e8f9',
			infoRequest: aboutStats.management_duringInfoRequest || 0,
			underline: false,
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
