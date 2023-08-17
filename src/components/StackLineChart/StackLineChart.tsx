import ReactEcharts from 'echarts-for-react';

type Props = {
  minMaxYearRange: number[];
  filteredData: any;
  type: string;
};

export default ({ minMaxYearRange, filteredData, type }: Props) => {
  const flatYears = () => {
    let flattedYears = [];
    if (minMaxYearRange[0] !== 0 && minMaxYearRange[1] !== 0) {
      for (let year = minMaxYearRange[0]; year <= minMaxYearRange[1]; year++) {
        flattedYears.push(year.toString());
      }
    }

    return flattedYears;
  };

  const flatDataPerTerritoriesPerYears = () => {
    const abscissa: string[] = flatYears();
    let territoryValues: any = [];
    Object.keys(filteredData).forEach((territory: string) => {
      let series: any = {
        name: territory,
        type,
        data: [],
        connectNulls: true,
      };
      abscissa.forEach((year: string) => {
        if (!filteredData[territory][year]) {
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
    },
    series: [...flatDataPerTerritoriesPerYears()],
  };
  return (
    <>
      <ReactEcharts option={option} style={{ height: '400px' }} />
    </>
  );
};
