import { setCookie } from "./cookieUtils";

export const setTokenInCookies = async (
  name: string,
  token: string,
  fallbackMaxAgeInSeconds = 60 * 60 * 24, // 1 days
) => {


  await setCookie (name, token, fallbackMaxAgeInSeconds);
};