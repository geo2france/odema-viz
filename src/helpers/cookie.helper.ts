import Cookies from 'js-cookie';

export function setCookie(
  selector: string,
  value: any,
  expirationDelay: number = 90
) {
  Cookies.set(selector, value, { expires: expirationDelay });
}

export function getCookie(selector: string) {
  return Cookies.get(selector);
}
