import ReactEcharts from 'echarts-for-react';
import Typography from '@mui/material/Typography';
import {useContext, useState, useEffect} from 'react';
import {DarkModeContext,} from "../../context/DarkModeProvider";
import { Empty } from 'antd';

type Props = {
  filteredData: { [key: string]: { [key: string]: number } };
  selectedYear: number;
};

export default ({ filteredData, selectedYear }: Props) => {

  const [noData, setNoData] = useState<boolean>(false);

  useEffect(() => {
    setNoData(filteredData[selectedYear] === undefined);
  }, [selectedYear]);

  const pieData = Object.keys(filteredData).map((axis: string) => {
    if (filteredData[selectedYear] && filteredData[selectedYear][axis] > 0) {
      return { name: axis, value: filteredData[selectedYear][axis] };
    }
  }).filter((data) => data !== undefined); ;

  const { darkMode } = useContext(DarkModeContext);
  const option = {
    legend: {
      x: "center",
      data: Object.keys(filteredData),
      textStyle: {
        color: darkMode ? "white" : "black",
      },
      bottom :[-5],
    },
    
    series: [
      {
        type: "pie",
        data: [...pieData],
        radius: ["40%", "70%"],
        label: {
          color: darkMode ? "white" : "black", // Changer la couleur du texte ici
        },
      },
    ],
  };
  return (
    <>
      <Typography
        style={{ textAlign: "center" }}
        id="range-slider"
        gutterBottom
      >
        Année {selectedYear}
      </Typography>
      { noData ? (
          <Empty />
      ) :(
      <ReactEcharts option={option} style={{ height: "450px", marginTop:"-50px"}} />
      )
      }
    </>
  );
};
