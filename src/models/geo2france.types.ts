export interface Geo2FranceGenericResponse {
  type: string;
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  crs: string | null;
  bbox?: number[];
}
