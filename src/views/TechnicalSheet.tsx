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

export default () => {
  const { guid } = useParams<{ guid: string }>();

  const [matrice, setMatrice] = useState<MatrixFromIndicator | null>(null);
  const [territoriesSelected, setTerritoriesSelected] = useState<string[]>([]);
  const [territoriesInput, setInputTerritories] = useState<string>('');

  const [wasteTypesSelected, setSelectedWasteTypes] = useState<string[]>([]);
  const [wasteTypesSelectedAll, setWasteTypesSelectedAll] =
    useState<boolean>(false);

  const [yearRange, setYearRange] = useState<number[]>([0, 0]);
  const [minMaxYearRange, setMinMaxYearRange] = useState<number[]>([0, 0]);

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
      setSelectedWasteTypes([]);
      setWasteTypesSelectedAll(false);
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

    //Get URL params and cookie for wasteTypes
    getQueryParamsFromSelector('wasteTypes', setSelectedWasteTypes);
    handleGetCookieWasteTypes();

    if (wasteTypes?.length === wasteTypesSelected.length) {
      setWasteTypesSelectedAll(true);
    }

    setMinMaxYearRange([initialMinYear, initialMaxYear]);
    setYearRange([initialMinYear, initialMaxYear]);

    getQueryParamsFromSelector('yearRange', setYearRange, true, parseYearRange);
    handleGetCookieYearRange();
  }, [matrice]);

  const groupedTerritories = [
    //We want unique territory value from the API
    ...new Set(
      matrice?.features.map(
        (feature: MatrixFeatures) => feature.properties.nom_territoire
      )
    ),
  ];
  const wasteTypes: string[] | undefined = [
    ...new Set(
      matrice?.features
        .filter(
          (feature: MatrixFeatures) =>
            feature.properties?.nom_axe === 'Type de déchets'
        )
        .map(
          (filteredFeature: MatrixFeatures) =>
            filteredFeature.properties?.valeur_axe
        )
    ),
  ];

  const wasteTypesWithAllOption = ['Tout', ...wasteTypes];

  const groupedYears: number[] = [
    ...new Set(
      matrice?.features.map(
        (feature: MatrixFeatures) => feature.properties.annee
      )
    ),
  ];

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

  const handleGetCookieWasteTypes = () => {
    //We need to rewrite some specific caracters to handle the array
    const wasteTypesFromCookie = getCookie('wasteTypes');
    if (wasteTypesFromCookie) {
      setSelectedWasteTypes(
        formatCorrectCaractersForTracking(wasteTypesFromCookie)
      );
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

  const handleWasteTypesSelected = (event: any) => {
    const newValue = event.target.value;

    if (newValue.includes('Tout')) {
      if (!wasteTypesSelectedAll) {
        setWasteTypesSelectedAll(true);
        setSelectedWasteTypes(wasteTypes);
        updateURL('wasteTypes', wasteTypes);
        setCookie('wasteTypes', wasteTypes);
      } else {
        setWasteTypesSelectedAll(false);
        setSelectedWasteTypes([]);
        updateURL('wasteTypes', []);
        setCookie('wasteTypes', []);
      }
    } else {
      if (newValue.length === wasteTypes.length) {
        setWasteTypesSelectedAll(true);
      }

      if (wasteTypesSelectedAll && newValue.length !== wasteTypes.length) {
        setWasteTypesSelectedAll(false);
      }
      setSelectedWasteTypes(newValue);
      updateURL('wasteTypes', newValue);
      setCookie('wasteTypes', newValue);
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
            {!!wasteTypes.length && (
              <>
                <SelectWithBoxes
                  label={'Type de déchet'}
                  options={wasteTypesWithAllOption}
                  propValue={wasteTypesSelected}
                  handleValue={handleWasteTypesSelected}
                  selectedAll={wasteTypesSelectedAll}
                />
              </>
            )}
            <SliderRange
              value={yearRange}
              minValue={minMaxYearRange[0]}
              maxValue={minMaxYearRange[1]}
              setter={handleYearRange}
            />
          </div>
        </>
      )}
    </>
  );
};
