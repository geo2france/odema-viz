import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { EPCIData } from '../../models/epci.types';

type Props = {
  geometryFeatures: EPCIData[];
};

const ProportionalSymbolsMap = ({ geometryFeatures }: Props) => {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://your-map-style-url',
      center: [2.9333, 49.9333],
      zoom: 10,
    });

    map.addSource('locations', {
      type: 'geojson',
      data: geometryFeatures,
    });

    // Ajouter une couche de symboles proportionnels
    map.addLayer({
      id: 'symbols-layer',
      type: 'circle',
      source: 'locations',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'value'],
          0,
          5, // Taille minimale du symbole
          500,
          50, // Taille maximale du symbole
        ],
        'circle-color': 'rgb(35, 139, 69)',
        'circle-opacity': 0.7,
      },
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default ProportionalSymbolsMap;
