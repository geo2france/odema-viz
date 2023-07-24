import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import SelectMultiple from '../components/SelectMultiple/SelectMultiple';
import geowebService from '../services/geoweb.service';
import { MatrixFromIndicator } from '../models/matrice.types';

export default () => {
  const { guid } = useParams<{ guid: string }>();

  const [matrice, setMatrice] = useState<MatrixFromIndicator | null>(null);
  const [territoriesSelected, setTerritoriesSelected] = useState<string[]>([]);
  const [territoriesInput, setInputTerritories] = useState<string>('');

  useEffect(() => {
    const fetchMatrixIndicator = async () => {
      const response = await geowebService.getMatrixForIndicator({
        guid: guid,
      });
      setMatrice(response);
    };
    fetchMatrixIndicator();
  }, []);

  const groupedTerritories = [
    //We want unique territory value from the API
    ...new Set(
      matrice?.features.map((feature: any) => feature.properties.nom_territoire)
    ),
  ];

  return (
    <>
      <Header indicatorName={matrice?.features[0].properties.nom_indicateur} />
      <div className="technical-sheet--selectors">
        <SelectMultiple
          label={'Territoire(s)'}
          values={territoriesSelected}
          options={groupedTerritories}
          setFunction={setTerritoriesSelected}
          inputValue={territoriesInput}
          setInputValue={setInputTerritories}
          placeHolder="Territoire"
        />
      </div>
    </>
  );
};
