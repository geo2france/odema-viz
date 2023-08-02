import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import SelectMultiple from '../components/SelectMultiple/SelectMultiple';
import geowebService from '../services/geoweb.service';
import { MatrixFeatures, MatrixFromIndicator } from '../models/matrice.types';
import { getCookie, setCookie } from '../helpers/cookie.helper';
import { getQueryParamsFromSelector } from '../helpers/urlParams.helper';
import {
  formatCorrectCaractersForTracking,
  parseYearRange,
} from '../helpers/formatters.helper';
import SelectWithBoxes from '../components/SelectWithBoxes/SelectWithBoxes';
import SliderRange from '../components/SliderRange/SliderRange';
import RadioGroupUnit from '../components/RadioGroupUnit/RadioGroupUnit';

export default () => {
  const { guid } = useParams<{ guid: string }>();

  const [matrice, setMatrice] = useState<MatrixFromIndicator | null>(null);
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
    handleGetCookieAxis();

    if (axisTypes?.length === axisSelected.length && axisSelected.length > 0) {
      setAxisSelectedAll(true);
    }

    //Get URL params and cookie for year Range
    setMinMaxYearRange([initialMinYear, initialMaxYear]);
    setYearRange([initialMinYear, initialMaxYear]);

    getQueryParamsFromSelector('yearRange', setYearRange, true, parseYearRange);
    handleGetCookieYearRange();

    //Get URL params and cookie for Unit
    setUnitSelected(pickedUnits ?? 'Unité');
    handleGetCookieUnit();
  }, [matrice]);

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

  const updateURL = (selector: string, newValues: string[]) => {
    const serializedValues = newValues.join(';');
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

  const handleGetCookieAxis = () => {
    //We need to rewrite some specific caracters to handle the array
    const axisFromCookie = getCookie('axis');
    if (axisFromCookie) {
      setSelectedAxis(formatCorrectCaractersForTracking(axisFromCookie));
    }
  };

  const handleGetCookieYearRange = () => {
    const yearRangeCookie = getCookie('yearRange')?.split(',');
    if (yearRangeCookie) {
      setYearRange(
        yearRangeCookie.map((yearAsString: string) =>
          parseInt(yearAsString, 10)
        )
      );
    }
  };

  const handleGetCookieUnit = () => {
    const unitFromCookie = getCookie('unit');
    if (unitFromCookie) {
      setUnitSelected(unitFromCookie);
    }
  };

  const handleAxisSelected = (event: any) => {
    const newValue = event.target.value;

    if (newValue.includes('Tout')) {
      if (!axisSelectedAll) {
        setAxisSelectedAll(true);
        setSelectedAxis(axisTypes);
        updateURL('axis', axisTypes);
        setCookie('axis', axisTypes);
      } else {
        setAxisSelectedAll(false);
        setSelectedAxis([]);
        updateURL('axis', []);
        setCookie('axis', []);
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
      setCookie('axis', newValue);
    }
  };

  const handleYearRange = (_event: Event, newValue: number[]) => {
    setYearRange(newValue as number[]);
    updateURL(
      'yearRange',
      newValue.map((value: number) => value.toString())
    );
    setCookie('yearRange', newValue);
  };

  const handleUnitRadio = (_event: Event, newValue: string) => {
    setUnitSelected(newValue);
    setCookie('unit', newValue);
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
            {!!axisTypes.length && (
              <>
                <SelectWithBoxes
                  label={analyseAxisLabel}
                  options={axisWithAllOption}
                  propValue={axisSelected}
                  handleValue={handleAxisSelected}
                  selectedAll={axisSelectedAll}
                />
              </>
            )}
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
        </>
      )}
    </>
  );
};
