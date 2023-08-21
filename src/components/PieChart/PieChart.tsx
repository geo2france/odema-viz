import ReactEcharts from 'echarts-for-react';

type Props = {
  filteredData: { [key: string]: number };
};

export default ({ filteredData }: Props) => {
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
    </>
  );
};
