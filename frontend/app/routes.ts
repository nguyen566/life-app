import { type RouteConfig, index, route } from "@react-router/dev/routes";

export const APP_ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  ACCOUNT: "/me",
  SUBMIT_JOB_APPLICATION: "/submit-job-application",
} 

export default [
  index("routes/home.tsx"),
  route(APP_ROUTES.LOGIN, "routes/login.tsx"),
  route(APP_ROUTES.FORGOT_PASSWORD, "routes/forgot-password.tsx"),
  route("/", "layouts/protected-layout.tsx", [
    route(APP_ROUTES.DASHBOARD, "routes/dashboard.tsx"),
    route(APP_ROUTES.ACCOUNT, "routes/account.tsx"),
    route(APP_ROUTES.SUBMIT_JOB_APPLICATION, "routes/submit-job-application.tsx"),
  ]),
] satisfies RouteConfig;
