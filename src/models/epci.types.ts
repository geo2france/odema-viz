import { Geo2FranceGenericResponse, Geometry } from './geo2france.types';

export interface EPCIData extends Geo2FranceGenericResponse {
  features: any[];
}

export interface EPCIDataFeature {
  type: string;
  id: string;
  geometry: Geometry;
}
