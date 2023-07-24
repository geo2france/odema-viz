import { Link } from 'react-router-dom';
import geowebService from '../services/geoweb.service';
import { IndicatorsContext } from '../context/IndicatorsContext';
import { useContext, useEffect } from 'react';
import { Feature } from '../models/indicator.types';
export default () => {
  const { indicators, fetchIndicators } = useContext<any>(IndicatorsContext);

  useEffect(() => {
    const getIndicators = async () => {
      const response = await geowebService.getFilteredIndicatorsProperties();
      fetchIndicators(response);
    };
    getIndicators();
  }, []);

  return (
    <>
      {indicators?.features && (
        <div className="dashboard-map">
          {indicators.features.map((indicator: Feature, index: number) => {
            return (
              <Link
                key={index}
                to={`/technicalsheet/${indicator.properties.guid}`}
              >
                <div className="dashboard-map--indicator">
                  {indicator.properties.nom_indicateur}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};
