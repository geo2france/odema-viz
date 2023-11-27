import { useEffect, useState, SyntheticEvent } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import SelectMultiple from "../../components/SelectMultiple/SelectMultiple";
import geowebService from "../../services/geoweb.service";
import {
  MatrixFeatures,
  MatrixFromIndicator,
} from "../../models/matrice.types";
import { getCookie, setCookie } from "../../helpers/cookie.helper";
import {
  getQueryParamsFromSelector,
  hasParametersOnUrl,
} from "../../helpers/urlParams.helper";
import { parseYearRange } from "../../helpers/formatters.helper";
import SelectWithBoxes from "../../components/SelectWithBoxes/SelectWithBoxes";
import SliderRange from "../../components/SliderRange/SliderRange";
import RadioGroupUnit from "../../components/RadioGroupUnit/RadioGroupUnit";

import ShareButton from "../../components/ShareButton/ShareButton";

import TableTabulator from "../../components/TableTabulator/TableTabulator";

import StackLineChart from "../../components/StackLineChart/StackLineChart";

import "./TechnicalSheet.css";
import Tabs from "../../components/Tabs/Tabs";
import TabPanels from "../../components/TabPanels/TabPanels";
import PieChart from "../../components/PieChart/PieChart";

import { Col, Row } from "antd";

export default () => {

  
  const { guid } = useParams<{ guid: string }>();

  const [matrice, setMatrice] = useState<MatrixFromIndicator | null>(null);
  const [filteredMatrix, setFilteredMatrix] = useState<MatrixFeatures[] | null>(
    null
  );
  const [territoriesSelected, setTerritoriesSelected] = useState<string[]>([]);
  const [territoriesInput, setInputTerritories] = useState<string>("");

  const [axisSelected, setSelectedAxis] = useState<string[]>([]);
  const [axisSelectedAll, setAxisSelectedAll] = useState<boolean>(false);

  const [yearRange, setYearRange] = useState<number[]>([0, 0]);
  const [minMaxYearRange, setMinMaxYearRange] = useState<number[]>([0, 0]);

  const [unitSelected, setUnitSelected] = useState<string>("");

  const [indexTab, setIndexTab] = useState<number>(0);

  const [hoveredDonutValue, setHoveredDonutValue] = useState<number>(0);

  const [tradeURL, setTradeURL] = useState<string>(
    `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.hash}`
  );

  useEffect(() => {
    const fetchMatrixIndicator = async () => {
      const response = await geowebService.getMatrixForIndicator({
        guid: guid,
      });
      setMatrice(response);
    };
    fetchMatrixIndicator();

    return () => {
      setTerritoriesSelected([]);
      setSelectedAxis([]);
      setAxisSelectedAll(false);
    };
  }, []);

  useEffect(() => {
    const currentParams = window.location.hash.split("?")[1];
    //Get URL params and cookie for territories
    getQueryParamsFromSelector(
      "territories",
      setTerritoriesSelected,
      currentParams,
      true,
      fetchTerritoriesNameFromMatrix
    );

    if (!hasParametersOnUrl("territories", currentParams)) {
      handleGetCookieTerritories();
    }

    //Get URL params and cookie for axisTypes
    getQueryParamsFromSelector("axis", setSelectedAxis, currentParams);

    if (!hasParametersOnUrl("axis", currentParams) && axisTypes?.length) {
      setSelectedAxis([...axisTypes]);
    }

    //Get URL params and cookie for year Range
    setMinMaxYearRange([initialMinYear, initialMaxYear]);
    setYearRange([initialMinYear, initialMaxYear]);
    setHoveredDonutValue(initialMaxYear);

    getQueryParamsFromSelector(
      "yearRange",
      setYearRange,
      currentParams,
      true,
      parseYearRange
    );

    //Get URL params and cookie for Unit
    setUnitSelected(pickedUnits ?? "unité");
    getQueryParamsFromSelector(
      "unit",
      setUnitSelected,
      currentParams,
      true,
      (value: string[]) => value[0]
    );
  }, [matrice]);

  useEffect(() => {
    if (axisTypes?.length && axisTypes[0] !== null) {
      updateURL("axis", [...axisSelected]);
      if (
        axisTypes?.length === axisSelected.length &&
        axisSelected.length > 0
      ) {
        setAxisSelectedAll(true);
      }
    }
  }, [axisSelected]);

  useEffect(() => {
    computedDataFromFilters();
  }, [territoriesSelected, axisSelected, yearRange, unitSelected]);

  const groupedTerritories = [
    //We want unique territory value from the API
    ...new Set(
      matrice?.features.map(
        (feature: MatrixFeatures) => feature.properties.nom_territoire
      )
    ),
  ];
  const axisTypes: string[] | undefined = [
    ...new Set(
      matrice?.features.map(
        (filteredFeature: MatrixFeatures) =>
          filteredFeature.properties?.valeur_axe
      )
    ),
  ];

  const hasAxisNoValuesInHisSelector: boolean =
    axisTypes.length === 1 && axisTypes[0] === null;

  const axisWithAllOption: string[] = ["Tout", ...axisTypes];

  const analyseAxisLabel: string = [
    ...new Set(
      matrice?.features.map(
        (feature: MatrixFeatures) => feature.properties?.nom_axe
      )
    ),
  ][0];

  const groupedYears: number[] = [
    ...new Set(
      matrice?.features.map(
        (feature: MatrixFeatures) => feature.properties.annee
      )
    ),
  ];

  const pickedUnits = [
    ...new Set(
      matrice?.features.map(
        (feature: MatrixFeatures) =>
          feature.properties?.unite_libel ?? feature.properties?.unite
      )
    ),
  ][0];

  const checkIsAtLeastOneEPCISelected = () => {
    const idsTerritories = [
      ...new Set(
        filteredMatrix?.map(
          (feature: MatrixFeatures) =>
            !feature.properties.id_territoire.includes("DEP") &&
            !feature.properties.id_territoire.includes("REG")
        )
      ),
    ];

    return idsTerritories.includes(true);
  };

  const units = !!pickedUnits
    ? [pickedUnits, `${pickedUnits}/habitant`]
    : ["Unité", "Unité/habitant"];

  const initialMinYear: number = Math.min(...groupedYears);
  const initialMaxYear: number = Math.max(...groupedYears);

  const areResultsDisplayed =
    territoriesSelected.length > 0 &&
    (hasAxisNoValuesInHisSelector ||
      (!hasAxisNoValuesInHisSelector && axisSelected.length > 0));

  const checkIsTerritoryEPCI = (territoryName: string): boolean => {
    const idTerritory: string | null = fetchTerritoriesIdsFromMatrix([
      territoryName,
    ])[0];

    if (!idTerritory) {
      return false;
    }

    return !idTerritory.includes("DEP") && !idTerritory.includes("REG");
  };

  enum territoryType {
    EPCI = "EPCI",
    DEPARTEMENT = "departement",
    REGION = "region",
    AUTRE = "autre",
  }

  const getTerritoryType = (idTerritory: string): territoryType => {
    if (idTerritory.includes("DEP")) {
      return territoryType.DEPARTEMENT;
    } else if (idTerritory.includes("REG")) {
      return territoryType.REGION;
    } else {
      return territoryType.EPCI;
    }
  };

  const fetchTerritoriesIdsFromMatrix = (territories: string[]) => {
    let ids: string[] = [];
    territories.forEach((territoryName: string) => {
      const matrixSelected = matrice?.features.find(
        (feature: MatrixFeatures) =>
          feature.properties.nom_territoire === territoryName
      );
      if (matrixSelected) {
        ids.push(matrixSelected.properties.id_territoire.toString());
      }
    });
    return ids;
  };

  const fetchTerritoriesNameFromMatrix = (ids: string[]) => {
    let territories: string[] = [];
    ids.forEach((id: string) => {
      const matrixSelected = matrice?.features.find(
        (feature: MatrixFeatures) =>
          feature.properties.id_territoire === id.toString()
      );
      if (matrixSelected) {
        territories.push(matrixSelected.properties.nom_territoire);
      }
    });
    return territories;
  };

  const updateURL = (selector: string, newValues: string | string[]) => {
    const serializedValues = Array.isArray(newValues)
      ? newValues.join(";")
      : newValues;

    const baseURL = tradeURL.split("?")[0];
    const getQueryParamsFromUrl = tradeURL.split("?")[1];

    const queryParams = new URLSearchParams(getQueryParamsFromUrl);
    if (!!newValues.length) {
      queryParams.set(selector, serializedValues);
    } else {
      queryParams.delete(selector);
    }

    const newURL = `${baseURL}?${queryParams.toString()}`;

    setTradeURL(newURL);
  };

  const handleGetCookieTerritories = () => {
    const territories = getCookie("territories")?.split(",");
    if (territories && territories[0].length) {
      setTerritoriesSelected(fetchTerritoriesNameFromMatrix([...territories]));
      updateURL("territories", territories);
    }
  };

  const handleTerritoriesSelected = (values: string[]) => {
    setTerritoriesSelected(values);

    const ids = fetchTerritoriesIdsFromMatrix(values);

    updateURL("territories", ids);
    setCookie("territories", ids);
  };

  const handleAxisSelected = (event: any) => {
    const newValue = event.target.value;

    if (newValue.includes("Tout")) {
      if (!axisSelectedAll) {
        setAxisSelectedAll(true);
        setSelectedAxis(axisTypes);
      } else {
        setAxisSelectedAll(false);
        setSelectedAxis([]);
      }
    } else {
      if (newValue.length === axisTypes.length) {
        setAxisSelectedAll(true);
      }

      if (axisSelectedAll && newValue.length !== axisTypes.length) {
        setAxisSelectedAll(false);
      }
      setSelectedAxis(newValue);
    }
  };

  const handleYearRange = (newValue: number | number[]) => {
    setYearRange(newValue as number[]);
    updateURL("yearRange", newValue.toString());
  };

  const handleUnitRadio = (_event: Event, newValue: string) => {
    setUnitSelected(newValue);
    updateURL("unit", newValue);
  };

  const handleIndexTab = (_event: SyntheticEvent, newValue: number) => {
    setIndexTab(newValue);
  };
  const computedDataFromFilters = () => {
    const features = matrice?.features;
    if (!features) {
      return;
    }
    let data: MatrixFeatures[] = [...features];

    if (!!territoriesSelected) {
      const idTerritories = fetchTerritoriesIdsFromMatrix(territoriesSelected);
      data = features?.filter((feature: MatrixFeatures) =>
        idTerritories.includes(feature.properties.id_territoire)
      );
    }

    if (!!axisSelected.length) {
      data = data.filter((feature: MatrixFeatures) => {
        return axisSelected.includes(feature.properties.valeur_axe);
      });
    }

    if (initialMinYear !== 0 && initialMaxYear !== 0) {
      data = data.filter(
        (feature: MatrixFeatures) =>
          feature.properties.annee >= yearRange[0] &&
          feature.properties.annee <= yearRange[1]
      );
    }
    setFilteredMatrix(data);
  };

  const computedDataForGraphDonut = () => {
    const features = matrice?.features ? [...matrice.features] : [];
    if (
      features.length === 0 ||
      territoriesSelected.length === 0 ||
      hasAxisNoValuesInHisSelector ||
      axisSelected.length === 0 ||
      initialMaxYear === 0
    ) {
      return [];
    }

    let data: MatrixFeatures[] = [...features];

    const idTerritories = fetchTerritoriesIdsFromMatrix(territoriesSelected);

    data = data.filter((feature: MatrixFeatures) => {
      return (
        idTerritories.includes(feature.properties.id_territoire) &&
        axisSelected.includes(feature.properties.valeur_axe) &&
        feature.properties.annee === hoveredDonutValue
      );
    });
    return data;
  };

  const formatDonutGraphData = () => {
    let donutData = [...computedDataForGraphDonut()];
    let formattedDonutData: any = {};

    axisSelected.forEach((axis: string) => {
      formattedDonutData = { ...formattedDonutData, [axis]: 0 };
    });

    donutData.forEach((feature: MatrixFeatures) => {
      formattedDonutData[feature.properties.valeur_axe] =
        formattedDonutData[feature.properties.valeur_axe] +
        feature.properties.valeur;
    });
    return formattedDonutData;
  };

  const calcSummedByTerritory = (
    summedByTerritory: any,
    territory: string,
    territory_type: territoryType,
    annee: number,
    value: number,
    populationRef: number | null,
    perInhabitants: boolean
  ) => {
    if (!summedByTerritory[territory]["values"][annee]) {
      summedByTerritory[territory]["values"][annee] = perInhabitants
        ? populationRef === null
          ? null
          : value / populationRef
        : value;
    } else {
      summedByTerritory[territory]["values"][annee] =
        summedByTerritory[territory]["values"][annee] +
        (perInhabitants
          ? populationRef === null
            ? null
            : value / populationRef
          : value);
    }
    summedByTerritory[territory]["territory_type"] = territory_type;
  };
  const formatTerritoriesWithYearStatistics = () => {
    let summedByTerritory: any = {};

    filteredMatrix?.forEach((feature: MatrixFeatures) => {
      const territory = feature.properties.nom_territoire;
      const territory_type = getTerritoryType(feature.properties.id_territoire);
      const annee = feature.properties.annee;
      const value = feature.properties.valeur;
      const populationRef = feature.properties.pop_reference;
      const perInhabitants =
        unitSelected === `${feature.properties.unite ?? "unité"}/habitant`;

      if (!summedByTerritory[territory]) {
        summedByTerritory = {
          ...summedByTerritory,
          [territory]: { values: {} },
        };
      }

      //The following calc is taking care of the unit selected and if population ref has a value
      calcSummedByTerritory(
        summedByTerritory,
        territory,
        territory_type,
        annee,
        value,
        populationRef,
        perInhabitants
      );
    });
    return summedByTerritory;
  };





  return (
    <>
      {matrice && (
        <div>
          <Header
            indicatorName={matrice?.features[0].properties.nom_indicateur}
          />
          <Row
            justify="space-around"
            align="middle"
            className="configComponents"
          >
            <Col xs={22} sm={10} lg={6} className="marginCol">
              <SelectMultiple
                label={"Territoire(s)"}
                values={territoriesSelected}
                options={groupedTerritories}
                setFunction={handleTerritoriesSelected}
                inputValue={territoriesInput}
                setInputValue={setInputTerritories}
                placeHolder="Territoire"
              />
            </Col>
            <Col xs={22} sm={10} lg={6} className="marginCol">
              <SelectWithBoxes
                disabled={hasAxisNoValuesInHisSelector}
                label={
                  hasAxisNoValuesInHisSelector
                    ? "Aucun axe n'est disponible"
                    : analyseAxisLabel
                }
                options={axisWithAllOption}
                propValue={axisSelected}
                handleValue={handleAxisSelected}
                selectedAll={axisSelectedAll}
              />
            </Col>
            <Col xs={18} sm={10} lg={4}>
              <SliderRange
                value={yearRange}
                minValue={minMaxYearRange[0]}
                maxValue={minMaxYearRange[1]}
                setter={handleYearRange}
              />
            </Col>
            <Col xs={20} sm={10} lg={5}>
              <RadioGroupUnit
                label={"Unité"}
                units={units}
                selectedValue={unitSelected}
                setter={handleUnitRadio}
              />
            </Col>

            <ShareButton url={tradeURL} />
          </Row>

          <Row justify="space-around" align="middle">
            <Col span={23}>
              {areResultsDisplayed && (
                <TableTabulator
                  yearRange={yearRange}
                  territoriesWithYearStatistics={formatTerritoriesWithYearStatistics()}
                  checkIsTerritoryEPCI={checkIsTerritoryEPCI}
                  checkIsAtLeastOneEPCISelected={checkIsAtLeastOneEPCISelected}
                />
              )}
            </Col>
          </Row>
          <Row justify="space-around" align="middle">
            <Col span={24}>
              <div className="technichal-sheet--graphs">
                {areResultsDisplayed && (
                  <>
                    <Tabs
                      tabLabels={[
                        { name: "Evolution", disabled: false },
                        {
                          name: hasAxisNoValuesInHisSelector
                            ? ""
                            : "Répartition par " + analyseAxisLabel,
                          disabled: hasAxisNoValuesInHisSelector,
                        },
                      ]}
                      value={indexTab}
                      handler={handleIndexTab}
                    />
                    <TabPanels index={0} value={indexTab}>
                      <StackLineChart
                        yearRange={yearRange}
                        filteredData={formatTerritoriesWithYearStatistics()}
                      />
                    </TabPanels>
                    <TabPanels index={1} value={indexTab}>
                      <PieChart
                        filteredData={formatDonutGraphData()}
                        selectedYear={hoveredDonutValue}
                      />
                    </TabPanels>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};
