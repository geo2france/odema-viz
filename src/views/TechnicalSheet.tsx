import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import geowebService from '../services/geoweb.service';
import { MatrixFromIndicator } from '../models/matrice.types';

export default () => {
  const { guid } = useParams<{ guid: string }>();

  const [matrice, setMatrice] = useState<MatrixFromIndicator | null>(null);

  useEffect(() => {
    const fetchMatrixIndicator = async () => {
      const response = await geowebService.getMatrixForIndicator({
        guid: guid,
      });
      setMatrice(response);
    };
    fetchMatrixIndicator();
  }, []);

  return (
    <>
      <Header indicatorName={matrice?.features[0].properties.nom_indicateur} />
    </>
  );
};
