import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import { StyledInput } from "../../components/Input";
import { loginUser, terceroData } from "../../features/authSlice";
import { getTerceroUser, getUser, loginUserRequest } from "../../api/auth";
import { checkRole, isClientPortal } from "../../utills/authenticationCheck";
import { Roles } from "../../utills/constants";

import auth_logo from "../../assets/auth-logo.png";
import adviser_logo from "../../assets/mes_single_logo.png";

export default function SignIn() {
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginData = new FormData(event.currentTarget);
    if (!loginData.get("email") || !loginData.get("password")) {
      setMsg("Please provide both email and  password");
      setError(true);
      return;
    }
    try {
      const response = await loginUserRequest(
        loginData.get("email"),
        loginData.get("password")
      );
      const { data, message, status, errors } = response;

      if (data?.user?.role && !checkRole(data?.user?.role)) {
        setMsg("Invalid user role!");
        setError(true);
        return;
      }
      // Skip Phone number verification if it is advised client
      if (data?.user?.role === Roles.ADVISED_CLIENT) {
        const token = localStorage.getItem("token");
        const userResponse = await getUser(token);

        userResponse?.success &&
          dispatch(
            loginUser({
              user: userResponse?.data?.user,
              profileInfo: userResponse?.data?.profileInfo,
            })
          );

        const { data: terceroUserData } = await getTerceroUser(token);
        dispatch(terceroData(terceroUserData?.terceroData));
        navigate("/");
        setLoading(false);

        return;
      }

      if (status) {
        navigate("/otp-verification", {
          state: {
            verifyToken: data?.verifyToken,
            contactNumber: data?.user?.contactNumber,
            id: data?.user?.id,
            userEmail: data?.user?.email,
            userRole: data?.user?.role,
          },
        });
      }
      if (message) {
        setMsg(message);
      } else if (errors.length) {
        setMsg(errors[0].message);
      }
      setError(!status);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (location?.state?.message) {
      setMsg(location?.state?.message);
      setError(false);
    }
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container py={4}>
        <Grid item xs={12} sm={12} md={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            height="100%"
            mb={2}
          >
            <Box
              sx={{
                px: { xs: 2, sm: 4, md: 7 },
                py: { xs: 3, sm: 5, md: 4 },
                boxShadow: "6",
                borderRadius: "25px",
                width: { xs: "100%", md: "75%", lg: "50%" },
              }}
            >
              <Box textAlign="center">
                {isClientPortal() ? (
                  <Box
                    component="img"
                    src={auth_logo}
                    width={{ xs: "52%", sm: "42%" }}
                    alt="Mes  Logo"
                  />
                ) : (
                  <Box
                    component="img"
                    src={adviser_logo}
                    width={{ xs: "22%", sm: "18%" }}
                    alt="Mes  Logo"
                  />
                )}
              </Box>
              {!location?.state?.message && (
                <>
                  <Typography
                    component="h1"
                    variant="h2"
                    mt={{ xs: 3, sm: 5 }}
                    sx={{
                      background:
                        "linear-gradient(90deg, #0066A7 0%, #001C31 100%), linear-gradient(to right, #f32170, #ff6b08, #cf23cf, #eedd44)",
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                      fontSize: { xs: 28, sm: 40 },
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Welcome Back!
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                      fontWeight: 400,
                      color: "#8A92A6",
                      textAlign: "center",
                      mt: 1,
                    }}
                  >
                    To log in to your account, enter your email address and full
                    password below
                  </Typography>
                </>
              )}
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                mt={{ xs: 5, md: 8 }}
              >
                {msg && (
                  <Alert
                    sx={{
                      fontSize: 14,
                      mb: location?.state?.message ? 5 : 1,
                      "& .MuiAlert-icon ": {
                        display: "flex !important",
                        alignItems: "center !important",
                      },
                    }}
                    severity={error ? "error" : "success"}
                  >
                    {msg}
                  </Alert>
                )}
                {!location?.state?.message && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "19px",
                        fontWeight: 500,
                        color: "#001C32",
                      }}
                    >
                      Email
                    </Typography>

                    <StyledInput
                      name="email"
                      placeholder="xyz@gmail.com"
                      required
                      icon={
                        <EmailIcon
                          style={{
                            color: "#001C32",
                            fontSize: "30px",
                            marginRight: "10px",
                          }}
                        />
                      }
                    />
                    <Typography
                      sx={{
                        fontSize: "19px",
                        fontWeight: 500,
                        color: "#001C32",
                      }}
                    >
                      Password
                    </Typography>
                    <StyledInput
                      name="password"
                      type="password"
                      placeholder="*************"
                      required
                      icon={
                        <LockOpenIcon
                          style={{
                            color: "#001C32",
                            fontSize: "30px",
                            marginRight: "10px",
                          }}
                        />
                      }
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        to="/forgot-password"
                        align="center"
                        sx={{
                          color: "#001C32",
                          fontSize: { xs: "15px", md: "16px" },
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Forgot password?
                      </Link>
                    </Box>
                    <Button
                      type="submit"
                      fullWidth
                      disableRipple={true}
                      sx={{
                        padding: "12px",
                        borderRadius: "10px",
                        my: 5,
                        background: "#001C32",
                        color: "white",
                        "&:hover": {
                          background: "#001C32",
                        },
                      }}
                    >
                      Sign In
                    </Button>

                    {isClientPortal() && (
                      <Typography align="center">
                        <Link
                          to="/signup"
                          variant="body2"
                          style={{
                            color: "#8A92A6",
                            fontSize: "16px",
                            fontWeight: 500,
                            textDecoration: "none",
                          }}
                        >
                          Don't have an account?{" "}
                          <span style={{ color: "#000000", fontWeight: 600 }}>
                            Sign Up
                          </span>
                        </Link>
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
