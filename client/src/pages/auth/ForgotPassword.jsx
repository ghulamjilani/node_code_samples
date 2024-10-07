import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Grid,
  Typography,
  Container,
  Stack,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

import { StyledInput } from "../../components/Input";
import { isClientPortal } from "../../utills/authenticationCheck";
import { forgotPasswordRequest } from "../../api/auth";

import auth_logo from "../../assets/auth-logo.png";
import adviser_logo from "../../assets/mes_single_logo.png";

export default function ForgotPassword() {
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const forgotPasswordData = new FormData(event.currentTarget);
    try {
      const response = await forgotPasswordRequest(
        forgotPasswordData.get("email")
      );
      const { message, success } = response;
      setMsg(message);
      setError(!success);
      setShowMsg(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container alignItems="center" py={4} maxHeight="100vh">
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
                p: 5,
                borderRadius: "25px",
                width: { xs: "100%", md: "75%", lg: "50%" },
              }}
            >
              <Stack direction="row" justifyContent="center">
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
              </Stack>
              <Typography
                component="h1"
                variant="h2"
                mt={5}
                sx={{
                  background:
                    "linear-gradient(90deg, #0066A7 0%, #001C31 100%), linear-gradient(to right, #f32170, #ff6b08, #cf23cf, #eedd44)",
                  WebkitTextFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  fontSize: 40,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Forgot Password?
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
                Enter your email below to get a password reset link
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                mt={{ xs: 5, md: 8 }}
              >
                {showMsg &&
                  (error ? (
                    <Alert sx={{ mb: 2 }} severity="error">
                      {msg}
                    </Alert>
                  ) : (
                    <Alert sx={{ mb: 2 }} severity="success">
                      {msg}
                    </Alert>
                  ))}

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
                  placeholder="Enter your email"
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
                  Reset Password
                </Button>

                {isClientPortal() ? (
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
                ) : (
                  <Typography align="center">
                    <Link
                      to="/login"
                      variant="body2"
                      style={{
                        color: "#8A92A6",
                        fontSize: "16px",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      Remember password?{" "}
                      <span style={{ color: "#000000", fontWeight: 600 }}>
                        Login
                      </span>
                    </Link>
                  </Typography>
                )}
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
