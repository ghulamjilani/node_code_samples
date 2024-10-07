import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomLoading from "../components/CustomLoading";

export default function PublicRoute({ element, ...rest }) {
  const isAuthenticated = useSelector((state) => state.auth.loggedIn);
  const { isLoading } = rest;

  if (isLoading) {
    return <CustomLoading loading={isLoading} />;
  }

  return !isAuthenticated ? element : <Navigate to="/" replace />;
}
