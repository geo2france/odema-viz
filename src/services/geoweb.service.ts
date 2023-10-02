import axios from 'axios';
import { Indicator, Feature } from '../models/indicator.types';
import { MatrixFromIndicator } from '../models/matrice.types';

const GEO2FRANCE_BASE_REQUEST =
  'https://www.geo2france.fr/geoserver/odema/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&OUTPUTFORMAT=application/json';
class GeoWebService {
  async getFilteredIndicatorsProperties(): Promise<Indicator[]> {
    const url = `${GEO2FRANCE_BASE_REQUEST}&TYPENAMES=odema:ind_ref_dev&PROPERTYNAME=guid,nom_indicateur,tags`;
    let response = await axios.get(url);
    response.data.features.forEach((feature: Feature) => {
        feature.properties.tags_array = feature.properties.tags ? feature.properties.tags.split('|') : null;
    });
    return response.data;
  }
  async getMatrixForIndicator({
    guid,
  }: {
    guid: string | undefined;
  }): Promise<MatrixFromIndicator> {
    const cql_filters_encoded = encodeURIComponent(`guid_indicateur='${guid}'`);
    const url = `${GEO2FRANCE_BASE_REQUEST}&TYPENAMES=odema:ind_matrice_dev&CQL_FILTER=${cql_filters_encoded}`;
    const response = await axios.get(url);
    return response.data;
  }
}

export default new GeoWebService();
