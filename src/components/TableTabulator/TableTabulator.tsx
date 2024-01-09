import { useContext, useEffect, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import Button from '@mui/material/Button';

import { DarkModeContext } from "../../context/DarkModeProvider";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { convertZerosToNullFromObject } from "../../helpers/formatters.helper";

//import "react-tabulator/css/tabulator_midnight.min.css";
import "./tabulator_midnight.css";

import "./TableTabulator.css";

import "react-tabulator/css/tabulator.min.css";

type Props = {
  yearRange: number[];
  territoriesWithYearStatistics: any;
  checkIsTerritoryEPCI: (territories: string) => boolean;
  checkIsAtLeastOneEPCISelected: () => boolean;
};

export default ({
  yearRange,
  territoriesWithYearStatistics,
  checkIsTerritoryEPCI,
  checkIsAtLeastOneEPCISelected,
}: Props) => {

  let tableRef: any = useRef(null);

  // Gestion du darkMode
  const { darkMode } = useContext(DarkModeContext);
  useEffect(() => {
    const tableElement = document.getElementById("tab");
    if (tableElement) {
      tableElement.classList.add("hidden-table");
      setTimeout(() => {
        tableElement.classList.remove("hidden-table");
      }, 1); // problème changement de thème du tableau
    }
  }, [darkMode]);

  const formattedColumns = () => {
    let flattedColumns = [];

    if (yearRange[0] !== 0 && yearRange[1] !== 0) {
      for (let year = yearRange[0]; year <= yearRange[1]; year++) {
        flattedColumns.push({
          title: String(year),
          field: String(year),
          headerSort: false,
        });
      }
    }

    const columns = [
      { title: "Territoires", field: "territory" },
      ...flattedColumns,
    ];
    return columns;
  };

  const createSumOfTerritoriesValuesPerYear = (summedByTerritory: any) => {
    let sumByYear: any = {};
    Object.keys(summedByTerritory).forEach((territoryName: string) => {
      if (checkIsTerritoryEPCI(territoryName)) {
        Object.keys(summedByTerritory[territoryName]["values"]).forEach(
          (yearValue: string) => {
            if (!sumByYear.hasOwnProperty(yearValue)) {
              sumByYear = { ...sumByYear, [yearValue]: 0 };
            }

            sumByYear[yearValue] =
              sumByYear[yearValue] +
              (summedByTerritory[territoryName]["values"][yearValue] ?? 0);
          }
        );
      }
    });

    //We don't want any value displayed when it's null
    return { values: convertZerosToNullFromObject(sumByYear) };
  };

  const createAverageOfTerritoriesValuesPerYear = (
    summedByTerritory: any,
    sumByYear: any
  ) => {
    let coefficientsPeryear: any = {};
    let finalAverage: any = {};

    Object.keys(summedByTerritory).map((territoryName: string) => {
      if (checkIsTerritoryEPCI(territoryName)) {
        Object.keys(summedByTerritory[territoryName]["values"]).map(
          (year: string) => {
            if (!coefficientsPeryear.hasOwnProperty(year)) {
              coefficientsPeryear = { ...coefficientsPeryear, [year]: 0 };
            }

            if (
              summedByTerritory[territoryName]["values"].hasOwnProperty(year)
            ) {
              coefficientsPeryear[year] = coefficientsPeryear[year] + 1;
            }
          }
        );
      }
    });

    Object.keys(coefficientsPeryear).map((yearCoefficient: string) => {
      if (!finalAverage.hasOwnProperty(yearCoefficient)) {
        finalAverage = { ...finalAverage, [yearCoefficient]: 0 };
      }

      finalAverage[yearCoefficient] =
        sumByYear[yearCoefficient] / coefficientsPeryear[yearCoefficient];
    });
    return { values: convertZerosToNullFromObject(finalAverage) };
  };

  const roundAndSeparateThousandsOfValues = (summedByTerritory: any) => {
    Object.keys(summedByTerritory).map((territoryName: string) => {
      for (let year in summedByTerritory[territoryName]["values"]) {
        if (
          typeof summedByTerritory[territoryName]["values"][year] === "number"
        ) {
          summedByTerritory[territoryName]["values"][year] = parseFloat(
            summedByTerritory[territoryName]["values"][year].toFixed(2)
          );
          summedByTerritory[territoryName]["values"][year] = summedByTerritory[
            territoryName
          ]["values"][year]
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
      }
    });
  };

  //exemple with Coût du SPGD par habitant
  const computeDataWithUnitForTable = () => {
    let fullStatistics = {
      ...territoriesWithYearStatistics,
    };

    if (checkIsAtLeastOneEPCISelected()) {
      const sumByYear = {
        territory: "Somme totale par année (EPCI)",
        ...createSumOfTerritoriesValuesPerYear(territoriesWithYearStatistics),
      };
      const averageByYear = {
        territory: "Moyenne par année (par EPCI)",
        ...createAverageOfTerritoriesValuesPerYear(
          territoriesWithYearStatistics,
          sumByYear["values"]
        ),
      };

      fullStatistics["Somme totale par année (EPCI)"] = sumByYear;
      fullStatistics["Moyenne par année (par EPCI)"] = averageByYear;
    }

    //We round values to two decimal
    roundAndSeparateThousandsOfValues(fullStatistics);

    const mappedValues = Object.keys(fullStatistics).map(
      (TerritoryName: string) => {
        return {
          territory: TerritoryName,
          ...fullStatistics[TerritoryName]["values"],
        };
      }
    );

    return mappedValues;
  };


  const handleExportCSV = () => {
    if (tableRef.current) {
      tableRef.current.download('csv', 'data.csv');
    }
  };

  return (
    <div>
      <ReactTabulator
        onRef={(r) => (tableRef = r)}
        id="tab"
        className={`${darkMode ? "dark" : ""}`}
        data={computeDataWithUnitForTable()}
        columns={formattedColumns()}
        layout={"fitData"}
        options  = {{
          downloadDataFormatter: (data:any) => data,
          downloadReady: (_fileContents:any, blob:any) => blob,
      }}
      />
      <Button  size="small" variant="contained" startIcon={<FileDownloadIcon />} onClick={handleExportCSV}>
        Exporter
      </Button>
    </div>
  );
};
