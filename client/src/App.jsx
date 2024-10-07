import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import {
  SignIn,
  Signup,
  ResetPassword,
  ForgotPassword,
  SetupPassword,
} from "./pages/auth";
import VerificationCheckPage from "./pages/auth/VerificationCheckPage";
import IdentityVerification from "./pages/auth/IdentityVerification";
import OtpVerification from "./pages/auth/OtpVerification";
import RouteChangeHandler from "./components/RouteChangeHandler";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { getTerceroUser, getUser } from "./api/auth";
import { loginUser, terceroData } from "./features/authSlice";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await getUser(token);
        setIsLoading(false);

        const { success } = response;
        success &&
          dispatch(
            loginUser({
              user: response?.data?.user,
              profileInfo: response?.data?.profileInfo,
              beneficiaries: response?.data?.beneficiaries,
            })
          );
      }

      const { data } = await getTerceroUser(token);
      console.log(data?.terceroData?.Portfolios, "TERCERO DATA");
      dispatch(terceroData(data?.terceroData));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Router>
      <RouteChangeHandler />
      <Routes>
        <Route path="/*" element={<PrivateRoute isLoading={isLoading} />} />

        <Route
          path="/signin"
          element={<PublicRoute element={<SignIn />} isLoading={isLoading} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-password" element={<SetupPassword />} />
        <Route path="/verify-email" element={<VerificationCheckPage />} />
        <Route
          path="/identity-verification"
          element={<IdentityVerification />}
        />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
