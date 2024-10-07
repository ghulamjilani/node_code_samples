import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Grid,
  Typography,
  Container,
  Stack,
  Alert,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import { StyledInput } from "../../components/Input";
import { resetPasswordRequest } from "../../api/auth";
import { isClientPortal } from "../../utills/authenticationCheck";

import auth_logo from "../../assets/auth-logo.png";
import adviser_logo from "../../assets/mes_single_logo.png";

export default function ResetPassword() {
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState([]);
  const [msg, setMsg] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get("resetToken");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const resetPasswordData = new FormData(event.currentTarget);
    let password = resetPasswordData.get("password");
    let passwordConfirmation = resetPasswordData.get("passwordConfirmation");

    let lErrors = [];
    if (!password || !passwordConfirmation) {
      lErrors.push("Both password fields are required.");
    }
    if (password !== passwordConfirmation) {
      lErrors.push("Passwords do not match.");
    }

    if (lErrors.length > 0) {
      setErrors(lErrors);
      setError(true);
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/;

    if (!passwordRegex.test(password)) {
      setError(true);
      setMsg(
        "Password must be 12 characters with minimum 1 uppercase, 1 lowercase, 1 number and 1 special character"
      );
      return;
    }

    try {
      const response = await resetPasswordRequest(password, resetToken);
      const { message, success, errors } = response;

      setMsg(message);
      setError(!success);
      if (success) {
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setError(true);
        setMsg(errors[0].message);
      }
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
                px: { xs: 3, sm: 3, md: 7 },
                py: { xs: 3, sm: 5, md: 4 },
                boxShadow: "6",
                borderRadius: "25px",
                width: { xs: "100%", md: "75%", lg: "50%" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
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
                Reset password
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
                Reset your current password
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                mt={{ xs: 5, md: 8 }}
              >
                {error ? (
                  <>
                    {msg && (
                      <Alert sx={{ mb: 2 }} severity="error">
                        {msg}
                      </Alert>
                    )}
                    {errors.length > 0 && (
                      <>
                        {errors.map((error, index) => (
                          <Alert key={index} sx={{ mb: 2 }} severity="error">
                            {error}
                          </Alert>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  msg && (
                    <Alert sx={{ mb: 2 }} severity="success">
                      {msg}
                    </Alert>
                  )
                )}

                <Typography
                  sx={{
                    fontSize: "19px",
                    fontWeight: 500,
                    color: "#001C32",
                  }}
                >
                  New Password
                </Typography>
                <StyledInput
                  name="password"
                  type="password"
                  placeholder="*************"
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

                <Typography
                  sx={{
                    fontSize: "19px",
                    fontWeight: 500,
                    color: "#001C32",
                  }}
                >
                  Confirm New Password
                </Typography>
                <StyledInput
                  name="passwordConfirmation"
                  type="password"
                  placeholder="*************"
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
                  Change Password
                </Button>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
