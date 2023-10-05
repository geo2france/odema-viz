import ReactEcharts from 'echarts-for-react';
import Typography from '@mui/material/Typography';
import {useContext} from 'react';
import DarkModeProvider, {DarkModeContext,} from "../../context/DarkModeProvider";

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

  const { darkMode } = useContext(DarkModeContext);
  const option = {
    legend: {
      x: "center",
      data: Object.keys(filteredData),
      textStyle: {
        color: darkMode ? "white" : "black",
      }
    },
    series: [
      {
        type: "pie",
        data: [...pieData],
        radius: ["40%", "70%"],
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
