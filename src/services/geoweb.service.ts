import axios from 'axios';
import { Indicator } from '../models/Indicator';

const GEO2FRANCE_BASE_REQUEST =
  'https://www.geo2france.fr/geoserver/odema/ows?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&OUTPUTFORMAT=application/json';
class GeoWebService {
  async getFilteredIndicatorsProperties(): Promise<Indicator> {
    const url = `${GEO2FRANCE_BASE_REQUEST}&TYPENAMES=odema:ind_ref_dev&PROPERTYNAME=guid,nom_indicateur`;
    const response = await axios.get(url);
    return response.data;
  }
}

export default new GeoWebService();
