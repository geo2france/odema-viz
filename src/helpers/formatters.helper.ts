export function formatCorrectCaractersForTracking(values: string): string[] {
  return values
    .toString()
    .replace(', ', ';')
    .split(',')
    .map((value: string) => value.replace(';', ', '));
}
