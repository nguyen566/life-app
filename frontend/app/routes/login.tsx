import { useContext } from "react";
import { Navigate } from "react-router";
import { LoginForm } from "~/components/login-form";
import { AuthContext } from "~/contexts/AuthContext";

export default function LoginPage() {
  const { token } = useContext(AuthContext);

  if (token) {
    return (
      <>
        <Navigate to={"/"} />
      </>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
