import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "~/contexts/AuthContext";

const ProtectedLayout = () => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
