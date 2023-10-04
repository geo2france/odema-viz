export function formatCorrectCaractersForTracking(values: string): string[] {
  return values
    .replace(', ', ';')
    .split(',')
    .map((value: string) => value.replace(';', ', '));
}

export function parseYearRange(yearRangeAsString: string[]) {
  return yearRangeAsString.map((yearToParse: string) =>
    parseInt(yearToParse, 10)
  );
}

export function convertZerosToNullFromObject(object: any): any {
  const initialStateOfObject = { ...object };
  Object.keys(initialStateOfObject).map((key: string) => {
    if (
      initialStateOfObject[key] === 0 ||
      initialStateOfObject[key] === null ||
      isNaN(initialStateOfObject[key])
    ) {
      return (initialStateOfObject[key] = null);
    }
  });
  return initialStateOfObject;
}
    
export function flatGeojson(geojson: any){
    // Aplatit le geojson. Utile pour créer un Arquero.Table (avec Table.from() )
    return geojson.features.map((feature: any)  => {
        delete feature.type;
        const new_feat = {...feature.properties, ...feature };
        delete new_feat.properties;
        return new_feat
    })
}


