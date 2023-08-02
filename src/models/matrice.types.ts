import { Geo2FranceGenericResponse } from './geo2france.types';

export interface MatrixFromIndicator extends Geo2FranceGenericResponse {
  features: MatrixFeatures[];
}

export interface MatrixFeatures {
  type: string;
  id: string;
  geometry: any[];
  geometry_name: string;
  properties: MatrixFeatureProperties;
  bbox: number[];
}

export interface GeometryMatrixFeatures {
  type: string;
  coordinates: number[][][][];
}

export interface MatrixFeatureProperties {
  annee: number;
  nom_indicateur: string;
  code_indicateur: string | null;
  guid_indicateur: string;
  id_territoire: string;
  nom_territoire: string;
  nom_axe: string;
  valeur_axe: string;
  valeur: number;
  unite: string;
  unite_libel?: string | null;
  pop_reference: string | null;
}
