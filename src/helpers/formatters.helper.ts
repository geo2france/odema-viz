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
    if (initialStateOfObject[key] === 0 || initialStateOfObject[key] === null) {
      return (initialStateOfObject[key] = null);
    }
  });
  return initialStateOfObject;
}
