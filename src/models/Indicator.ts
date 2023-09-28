export interface Indicator {
  type: string;
  features: Feature[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  crs: string | null;
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
