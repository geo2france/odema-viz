export function getQueryParamsFromSelector(
  selector: string,
  setter: (values: any) => any,
  needToBeFormat: boolean = false,
  formatter: (values: any) => any = () => {}
) {
  const queryParams = new URLSearchParams(window.location.search);
  let serializedValues = queryParams.get(selector)?.split(';');
  if (serializedValues) {
    if (needToBeFormat) {
      setter(formatter(serializedValues));
      return;
    }
    setter(serializedValues);
  }
}

export function hasParametersOnUrl(selector: string) {
  const queryParams = new URLSearchParams(window.location.search);
  console.log(queryParams.get(selector)?.split(';'));
  return !!queryParams.get(selector)?.split(';');
}
