import { IoBarChartSharp } from 'react-icons/io5'
import { MdQueryStats } from 'react-icons/md'
import { FaWpforms } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'

const links = [
	{
		id: 1,
		text: 'all info',
		path: '/',
		icon: <MdQueryStats />,
	},
	{
		id: 2,
		text: 'stats',
		path: '/stats',
		icon: <IoBarChartSharp />,
	},

	{
		id: 3,
		text: 'add info',
		path: 'add-info',
		icon: <FaWpforms />,
	},
	{
		id: 4,
		text: 'profile',
		path: 'profile',
		icon: <ImProfile />,
	},
]

export default links
