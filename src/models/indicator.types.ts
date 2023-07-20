import { Geo2FranceGenericResponse } from './geo2france.types';

export interface Indicator extends Geo2FranceGenericResponse {
  features: Feature;
}

export interface Feature {
  type: string;
  id: string;
  geometry: string | null;
  properties: FeatureProperties;
}

export interface FeatureProperties {
  code_indicateur?: string | null;
  guid: string;
  nom_indicateur: string;
  nom_axe?: string;
  valeurs_axe?: string;
  premiere_annee?: number;
  derniere_annee?: number;
  nombre_valeurs?: number;
  granularite?: string;
  sources?: string;
  tags?: string | null;
  is_public?: boolean;
  commentaires?: string | null;
}
