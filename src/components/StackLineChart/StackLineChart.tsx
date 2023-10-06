import ReactEcharts from 'echarts-for-react';

import {useState, useContext} from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import  { DarkModeContext } from "../../context/DarkModeProvider"; 


  
type Props = {
  yearRange: number[];
  filteredData: any;
};

export default ({ yearRange, filteredData }: Props) => {

  const [chartType, setChartType] = useState('line');

  const flatYears = () => {
    let flattedYears = [];
    if (yearRange[0] !== 0 && yearRange[1] !== 0) {
      for (let year = yearRange[0]; year <= yearRange[1]; year++) {
        flattedYears.push(year.toString());
      }
    }

    return flattedYears;
  };

  const flatDataPerTerritoriesPerYears = () => {
    const xCoordinates: string[] = flatYears();
    let territoryValues: any = [];
    Object.keys(filteredData).forEach((territory: string) => {
      let series: any = {
        name: territory,
        type: chartType == 'line' ? 'line' : 'bar',
        data: [],
        connectNulls: true,
        stack: chartType == 'stackedBar' ? filteredData[territory]['territory_type'] : '',
      };
      xCoordinates.forEach((year: string) => {
        if (
          !filteredData[territory]['values'][year] &&
          filteredData[territory]['values'][year] !== 0
        ) {
          series.data = [...series.data, null];
        } else {
          series.data = [...series.data, filteredData[territory]['values'][year]];
        }
      });
      territoryValues = [...territoryValues, series];
    });
    return territoryValues;
  };

  const handleLegend = () => {
    const flatData = flatDataPerTerritoriesPerYears();
    let legend: string[] = [];
    flatData.forEach((territoryData: any) => {
      const hasValues =
        territoryData.data.filter((dataSeries: any[]) => dataSeries !== null)
          .length > 0;
      if (hasValues) {
        legend = [...legend, territoryData.name];
      }
    });
    return legend;
  };

  const handleChartType = (
      _event: React.MouseEvent<HTMLElement>,
      newChartType: string | null) => {
        if (newChartType !== null){
            setChartType(newChartType);
        }
  }
  
  const { darkMode } = useContext(DarkModeContext);

  const option = {
    xAxis: {
      data: [...flatYears()],
    },
    yAxis: {},
    legend: {
      data: handleLegend(),
      bottom: 0,
      type: "scroll",
      textStyle: {
        color: darkMode ? "white" : "black", // Changez ici la couleur de la légende en blanc
      },
    },
    toolbox: {
      feature: {
        saveAsImage: { show: true, title: "Exporter le graphique" },
      },
    },
    series: [...flatDataPerTerritoriesPerYears()],
  };
  return (
    <>
      <ToggleButtonGroup exclusive onChange={handleChartType} value={chartType}>
        <ToggleButton value='line' title='Lignes' >
         <SsidChartIcon/>
        </ToggleButton>         
        <ToggleButton value='bar' title="Barres" >
          <LeaderboardIcon/>
        </ToggleButton>        
        <ToggleButton value='stackedBar' title="Barres empilées"> 
          <StackedBarChartIcon/>
        </ToggleButton>
      </ToggleButtonGroup>
      <ReactEcharts option={option} notMerge style={{ height: '400px' }} />
    </>
  );
};
