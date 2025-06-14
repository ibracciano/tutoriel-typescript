import { CookieOptions } from "express";
import { NODE_ENV } from "../constants/env";
import { fifteenMinutesFromNow, thirthyDaysFromNow } from "./date";

type Params = {
  res: any;
  accessToken: string;
  refreshToken: string;
};

const secure = NODE_ENV !== "production";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

const getAccessTokenCookiesOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});
const getRefreshTokenCookiesOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirthyDaysFromNow(),
  path: "/auth/refresh",
});

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookiesOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookiesOptions);
};
