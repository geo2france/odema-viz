export function formatCorrectCaractersForTracking(values: string): string[] {
  return values
    .toString()
    .replace(', ', ';')
    .split(',')
    .map((value: string) => value.replace(';', ', '));
}

export function parseYearRange(yearRangeAsString: string[]) {
  return yearRangeAsString.map((yearToParse: string) =>
    parseInt(yearToParse, 10)
  );
}
