import ReactEcharts from 'echarts-for-react';
import {useState } from 'react';
import Switch from '@mui/material/Switch';

type Props = {
  yearRange: number[];
  filteredData: any;
  type: string
};

export default ({ yearRange, filteredData, type }: Props) => {

  const [stacked, setStacked] = useState(false);
   
  const [chartTypeLine, setChartTypeLine] = useState(false)
  const toggleChartType = (e) => {      
        setChartTypeLine(e.target.checked);
   };


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
      <Switch onChange={() => setStacked(!stacked)} checked={ stacked } inputProps={{ 'aria-label': 'Empiler' }} /> Empiler
      <Switch onChange={() => setChartTypeLine(!chartTypeLine)} checked={ chartTypeLine } inputProps={{ 'aria-label': 'Barre / Lignes' }} /> En barre
      <ReactEcharts option={option} notMerge style={{ height: '400px' }} />
    </>
  );
};
