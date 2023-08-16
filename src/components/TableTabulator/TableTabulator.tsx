import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/css/tabulator_bootstrap4.min.css';

type Props = {
  minMaxYearRange: number[];
  territoriesWithYearStatistics: any;
  unitSelected: string;
};

export default ({ minMaxYearRange, territoriesWithYearStatistics }: Props) => {
  const formattedColumns = () => {
    let flattedColumns = [];

    if (minMaxYearRange[0] !== 0 && minMaxYearRange[1] !== 0) {
      for (let year = minMaxYearRange[0]; year <= minMaxYearRange[1]; year++) {
        flattedColumns.push({
          title: String(year),
          field: String(year),
          headerSort: false,
        });
      }
    }

    const columns = [
      { title: 'Territories', field: 'territory' },
      ...flattedColumns,
    ];
    return columns;
  };

  const createSumOfTerritoriesValuesPerYear = (summedByTerritory: any) => {
    let sumByYear: any = {};

    Object.keys(summedByTerritory).forEach((territoryName: string) => {
      Object.keys(summedByTerritory[territoryName]).forEach(
        (yearValue: string) => {
          if (!sumByYear.hasOwnProperty(yearValue)) {
            sumByYear = { ...sumByYear, [yearValue]: 0 };
          }

          sumByYear[yearValue] =
            sumByYear[yearValue] +
            (summedByTerritory[territoryName][yearValue] ?? 0);
        }
      );
    });

    return sumByYear;
  };

  const createAverageOfTerritoriesValuesPerYear = (
    summedByTerritory: any,
    sumByYear: any
  ) => {
    let coefficientsPeryear: any = {};
    let finalAverage: any = {};

    Object.keys(summedByTerritory).map((territoryName: string) => {
      Object.keys(summedByTerritory[territoryName]).map((year: string) => {
        if (!coefficientsPeryear.hasOwnProperty(year)) {
          coefficientsPeryear = { ...coefficientsPeryear, [year]: 0 };
        }

        if (summedByTerritory[territoryName].hasOwnProperty(year)) {
          coefficientsPeryear[year] = coefficientsPeryear[year] + 1;
        }
      });
    });

    Object.keys(coefficientsPeryear).map((yearCoefficient: string) => {
      if (!finalAverage.hasOwnProperty(yearCoefficient)) {
        finalAverage = { ...finalAverage, [yearCoefficient]: 0 };
      }

      finalAverage[yearCoefficient] =
        sumByYear[yearCoefficient] / coefficientsPeryear[yearCoefficient];
    });

    return finalAverage;
  };

  const roundValues = (summedByTerritory: any) => {
    Object.keys(summedByTerritory).map((territoryName: string) => {
      for (let year in summedByTerritory[territoryName]) {
        if (typeof summedByTerritory[territoryName][year] === 'number') {
          summedByTerritory[territoryName][year] = parseFloat(
            summedByTerritory[territoryName][year].toFixed(2)
          );
        }
      }
    });
  };

  //exemple with Coût du SPGD par habitant
  const computeDataWithUnitForTable = () => {
    const sumByYear = {
      territory: 'Somme totale par année',
      ...createSumOfTerritoriesValuesPerYear(territoriesWithYearStatistics),
    };
    const averageByYear = {
      territory: 'Moyenne par année',
      ...createAverageOfTerritoriesValuesPerYear(
        territoriesWithYearStatistics,
        sumByYear
      ),
    };

    const fullStatistics = {
      ...territoriesWithYearStatistics,
      sumByYear,
      averageByYear,
    };

    //We round values to two decimal
    roundValues(fullStatistics);

    const mappedValues = Object.keys(fullStatistics).map(
      (TerritoryName: string) => {
        return {
          territory: TerritoryName,
          ...fullStatistics[TerritoryName],
        };
      }
    );

    return mappedValues;
  };

  return (
    <div>
      <ReactTabulator
        data={computeDataWithUnitForTable()}
        columns={formattedColumns()}
        layout={'fitdata'}
      />
    </div>
  );
};
