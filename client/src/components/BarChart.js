import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

const BarChartComponent = ({ data }) => {
	return (
		<ResponsiveContainer width='100%' height={400}>
			<BarChart
				data={data}
				margin={{
					top: 50,
				}}
			>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='date' padding={{ top: 70 }} />
				<YAxis allowDecimals={false} />
				<Tooltip />
				<Bar dataKey='count' fill='#2cb1bc' barSize={75} />
			</BarChart>
		</ResponsiveContainer>
	)
}

export default BarChartComponent
