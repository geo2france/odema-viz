import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import geowebService from '../services/geoweb.service';

export default () => {
  const { guid } = useParams<{ guid: string }>();

  const [matrice, setMatrice] = useState<any>([]);

  useEffect(() => {
    const fetchMatrixIndicator = async () => {
      const response = await geowebService.getMatrixForIndicator({
        guid: guid,
      });
      setMatrice(response);
    };
    fetchMatrixIndicator();
    console.log(guid, 'GUID');
  }, []);

  return (
    <>
      <Header />
    </>
  );
};
