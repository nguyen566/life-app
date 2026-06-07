import { type RouteConfig, index, route } from "@react-router/dev/routes";

export const APP_ROUTES = {
  ACCOUNT: "/me",
  DASHBOARD: "/dashboard",
  FORGOT_PASSWORD: "/forgot-password",
  LOGIN: "/login",
  RESET_PASSWORD: "/reset-password",
  SIGNUP: "/sign-up",
  SUBMIT_JOB_APPLICATION: "/submit-job-application",
  VERIFY_EMAIL: "/verify",
};

export default [
  route(APP_ROUTES.FORGOT_PASSWORD, "routes/forgot-password.tsx"),
  route(APP_ROUTES.LOGIN, "routes/login.tsx"),
  route(APP_ROUTES.RESET_PASSWORD, "routes/reset-password.tsx"),
  route(APP_ROUTES.SIGNUP, "routes/signup.tsx"),
  route(APP_ROUTES.VERIFY_EMAIL, "routes/verify-email.tsx"),
  route("/", "layouts/protected-layout.tsx", [
    index("routes/dashboard.tsx"),
    route(APP_ROUTES.ACCOUNT, "routes/account.tsx"),
    route(
      APP_ROUTES.SUBMIT_JOB_APPLICATION,
      "routes/submit-job-application.tsx",
    ),
  ]),
] satisfies RouteConfig;
