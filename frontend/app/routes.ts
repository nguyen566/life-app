import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { APP_ROUTES } from "./route-constants";

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
