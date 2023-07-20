import { Geo2FranceGenericResponse } from './geo2france.types';

export interface MatrixFromIndicator extends Geo2FranceGenericResponse {
  features: MatrixFeatures[];
}

export interface MatrixFeatures {
  type: string;
  id: string;
  geometry: any[];
  geometry_name: string;
  properties: any;
  bbox: number[];
}

export interface GeometryMatrixFeatures {
  type: string;
  coordinates: number[][][][];
}
