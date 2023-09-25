import ReactEcharts from 'echarts-for-react';
import {useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import Tooltip from '@mui/material/Tooltip';

type Props = {
  yearRange: number[];
  filteredData: any;
};

export default ({ yearRange, filteredData }: Props) => {

  const [stacked, setStacked] = useState(false);
   
  const [chartTypeLine, setChartTypeLine] = useState(false)

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
        type: chartTypeLine ? 'bar' : 'line',
        data: [],
        areaStyle: stacked ? {} : null,
        connectNulls: true,
        stack: stacked ? 'x' : '',
      };
      xCoordinates.forEach((year: string) => {
        if (
          !filteredData[territory][year] &&
          filteredData[territory][year] !== 0
        ) {
          series.data = [...series.data, null];
        } else {
          series.data = [...series.data, filteredData[territory][year]];
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

  const option = {
    xAxis: {
      data: [...flatYears()],
    },
    yAxis: {},
    legend: {
      data: handleLegend(),
      bottom: 0,
      type: 'scroll',
    },
    series: [...flatDataPerTerritoriesPerYears()],
  };
  return (
    <>
      <Tooltip title="Diagramme en barres">
        <ToggleButton onChange={() => setChartTypeLine(!chartTypeLine)} selected={ chartTypeLine } value={true} > <LeaderboardIcon/></ToggleButton>
      </Tooltip>
      <Tooltip title="Empiler">
        <ToggleButton onChange={() => setStacked(!stacked)} selected={ stacked } value={true}> <StackedBarChartIcon/> </ToggleButton>
      </Tooltip>
      <ReactEcharts option={option} notMerge style={{ height: '400px' }} />
    </>
  );
};
