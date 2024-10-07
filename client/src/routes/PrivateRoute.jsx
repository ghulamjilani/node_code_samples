import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  ClientLayout,
  FinancialAdvisorLayout,
  SuperAdminLayout,
} from "../layouts";
import CustomLoading from "../components/CustomLoading";
import { Roles } from "../utills/constants";

export default function PrivateRoute({ element, ...rest }) {
  const storeState = useSelector((state) => state?.auth);

  const { isLoading } = rest;
  if (isLoading) {
    return <CustomLoading loading={isLoading} />;
  }

  const isAuthenticated = storeState?.loggedIn;
  const role = storeState?.user?.role;

  return isAuthenticated ? (
    role === Roles.SUPER_ADMIN ? (
      <SuperAdminLayout />
    ) : role === Roles.FINANCIAL_ADVISER ? (
      <FinancialAdvisorLayout />
    ) : (
      <ClientLayout />
    )
  ) : (
    <Navigate to="/signin" replace />
  );
}
