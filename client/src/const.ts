export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Self-hosted: redirect to local admin login page instead of OAuth
export const getLoginUrl = () => {
  return "/admin-login";
};
