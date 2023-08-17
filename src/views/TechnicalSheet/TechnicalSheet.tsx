import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import SelectMultiple from '../../components/SelectMultiple/SelectMultiple';
import geowebService from '../../services/geoweb.service';
import {
  MatrixFeatures,
  MatrixFromIndicator,
} from '../../models/matrice.types';
import { getCookie, setCookie } from '../../helpers/cookie.helper';
import { getQueryParamsFromSelector } from '../../helpers/urlParams.helper';
import { parseYearRange } from '../../helpers/formatters.helper';
import SelectWithBoxes from '../../components/SelectWithBoxes/SelectWithBoxes';
import SliderRange from '../../components/SliderRange/SliderRange';
import RadioGroupUnit from '../../components/RadioGroupUnit/RadioGroupUnit';

import TableTabulator from '../../components/TableTabulator/TableTabulator';

import StackLineChart from '../../components/StackLineChart/StackLineChart';

import './TechnicalSheet.css';

export default () => {
  const { guid } = useParams<{ guid: string }>();

  const [matrice, setMatrice] = useState<MatrixFromIndicator | null>(null);
  const [filteredMatrix, setFilteredMatrix] = useState<MatrixFeatures[] | null>(
    null
  );
  const [territoriesSelected, setTerritoriesSelected] = useState<string[]>([]);
  const [territoriesInput, setInputTerritories] = useState<string>('');

  const [axisSelected, setSelectedAxis] = useState<string[]>([]);
  const [axisSelectedAll, setAxisSelectedAll] = useState<boolean>(false);

  const [yearRange, setYearRange] = useState<number[]>([0, 0]);
  const [minMaxYearRange, setMinMaxYearRange] = useState<number[]>([0, 0]);

  const [unitSelected, setUnitSelected] = useState<string>('');

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
    //Get URL params and cookie for territories
    getQueryParamsFromSelector(
      'territories',
      setTerritoriesSelected,
      true,
      fetchTerritoriesNameFromMatrix
    );
    handleGetCookieTerritories();

    //Get URL params and cookie for axisTypes
    getQueryParamsFromSelector('axis', setSelectedAxis);

    if (axisTypes?.length === axisSelected.length && axisSelected.length > 0) {
      setAxisSelectedAll(true);
    }

    //Get URL params and cookie for year Range
    setMinMaxYearRange([initialMinYear, initialMaxYear]);
    setYearRange([initialMinYear, initialMaxYear]);

    getQueryParamsFromSelector('yearRange', setYearRange, true, parseYearRange);

    //Get URL params and cookie for Unit
    setUnitSelected(pickedUnits ?? 'Unité');
    getQueryParamsFromSelector(
      'unit',
      setUnitSelected,
      true,
      (value: string[]) => value[0]
    );
  }, [matrice]);

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

  const axisWithAllOption: string[] = ['Tout', ...axisTypes];

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

  const units = !!pickedUnits
    ? [pickedUnits, `${pickedUnits}/habitant`]
    : ['Unité', 'Unité/habitant'];

  const initialMinYear: number = Math.min(...groupedYears);
  const initialMaxYear: number = Math.max(...groupedYears);

  const areResultsDisplayed =
    territoriesSelected.length > 0 &&
    (hasAxisNoValuesInHisSelector ||
      (!hasAxisNoValuesInHisSelector && axisSelected.length > 0));

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
      ? newValues.join(';')
      : newValues;
    const queryParams = new URLSearchParams(window.location.search);
    if (!!newValues.length) {
      queryParams.set(selector, serializedValues);
    } else {
      queryParams.delete(selector);
    }
    const newURL = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({ path: newURL }, '', newURL);
  };

  const handleGetCookieTerritories = () => {
    const territories = getCookie('territories')?.split(',');
    if (territories) {
      setTerritoriesSelected(fetchTerritoriesNameFromMatrix(territories));
    }
  };

  const handleTerritoriesSelected = (values: string[]) => {
    setTerritoriesSelected(values);
    setCookie('territories', fetchTerritoriesIdsFromMatrix(values));

    const ids = fetchTerritoriesIdsFromMatrix(values);

    updateURL('territories', ids);
  };

  const handleAxisSelected = (event: any) => {
    const newValue = event.target.value;

    if (newValue.includes('Tout')) {
      if (!axisSelectedAll) {
        setAxisSelectedAll(true);
        setSelectedAxis(axisTypes);
        updateURL('axis', axisTypes);
      } else {
        setAxisSelectedAll(false);
        setSelectedAxis([]);
        updateURL('axis', []);
      }
    } else {
      if (newValue.length === axisTypes.length) {
        setAxisSelectedAll(true);
      }

      if (axisSelectedAll && newValue.length !== axisTypes.length) {
        setAxisSelectedAll(false);
      }
      setSelectedAxis(newValue);
      updateURL('axis', newValue);
    }
  };

  const handleYearRange = (_event: Event, newValue: number[]) => {
    setYearRange(newValue as number[]);
    updateURL(
      'yearRange',
      newValue.map((value: number) => value.toString())
    );
  };

  const handleUnitRadio = (_event: Event, newValue: string) => {
    setUnitSelected(newValue);
    updateURL('unit', newValue);
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

  const calcSummedByTerritory = (
    summedByTerritory: any,
    territory: string,
    annee: number,
    value: number,
    populationRef: number | null,
    perInhabitants: boolean
  ) => {
    if (!summedByTerritory[territory][annee]) {
      summedByTerritory[territory][annee] = perInhabitants
        ? populationRef === null
          ? null
          : value / populationRef
        : value;
    } else {
      summedByTerritory[territory][annee] =
        summedByTerritory[territory][annee] +
        (perInhabitants
          ? populationRef === null
            ? null
            : value / populationRef
          : value);
    }
  };
  const formatTerritoriesWithYearStatistics = () => {
    let summedByTerritory: any = {};

    filteredMatrix?.forEach((feature: MatrixFeatures) => {
      const territory = feature.properties.nom_territoire;
      const annee = feature.properties.annee;
      const value = feature.properties.valeur;
      const populationRef = feature.properties.pop_reference;
      const perInhabitants =
        unitSelected === `${feature.properties.unite}/habitant`;

      if (!summedByTerritory[territory]) {
        summedByTerritory = { ...summedByTerritory, [territory]: {} };
      }

      //The following calc is taking care of the unit selected and if population ref has a value
      calcSummedByTerritory(
        summedByTerritory,
        territory,
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
        <>
          <Header
            indicatorName={matrice?.features[0].properties.nom_indicateur}
          />
          <div className="technical-sheet--selectors">
            <SelectMultiple
              label={'Territoire(s)'}
              values={territoriesSelected}
              options={groupedTerritories}
              setFunction={handleTerritoriesSelected}
              inputValue={territoriesInput}
              setInputValue={setInputTerritories}
              placeHolder="Territoire"
            />
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
            <SliderRange
              value={yearRange}
              minValue={minMaxYearRange[0]}
              maxValue={minMaxYearRange[1]}
              setter={handleYearRange}
            />
            <RadioGroupUnit
              label={'Unité'}
              units={units}
              selectedValue={unitSelected}
              setter={handleUnitRadio}
            />
          </div>
          <div className="technical-sheet--table">
            {areResultsDisplayed && (
              <TableTabulator
                minMaxYearRange={minMaxYearRange}
                territoriesWithYearStatistics={formatTerritoriesWithYearStatistics()}
                unitSelected={unitSelected}
              />
            )}
          </div>
          <div className="technichal-sheet--graphs">
            {areResultsDisplayed && (
              <>
                <StackLineChart
                  minMaxYearRange={minMaxYearRange}
                  filteredData={formatTerritoriesWithYearStatistics()}
                  type={'line'}
                />
                <StackLineChart
                  minMaxYearRange={minMaxYearRange}
                  filteredData={formatTerritoriesWithYearStatistics()}
                  type={'bar'}
                />
                <StackLineChart
                  minMaxYearRange={minMaxYearRange}
                  filteredData={formatTerritoriesWithYearStatistics()}
                  type={'bar'}
                  stacked
                />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
