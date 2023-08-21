import ReactEcharts from 'echarts-for-react';
import Typography from '@mui/material/Typography';

type Props = {
  filteredData: { [key: string]: number };
  selectedYear: number;
};

export default ({ filteredData, selectedYear }: Props) => {
  const pieData = Object.keys(filteredData).map((axis: string) => {
    if (filteredData[axis] > 0) {
      return { name: axis, value: filteredData[axis] };
    }
  });

  const option = {
    legend: {
      x: 'center',
      data: Object.keys(filteredData),
    },
    series: [
      {
        type: 'pie',
        data: [...pieData],
        radius: ['40%', '70%'],
      },
    ],
  };
  return (
    <>
      <ReactEcharts option={option} style={{ height: '400px' }} />
      <Typography
        style={{ textAlign: 'center' }}
        id="range-slider"
        gutterBottom
      >
        Année {selectedYear}
      </Typography>
    </>
  );
};
