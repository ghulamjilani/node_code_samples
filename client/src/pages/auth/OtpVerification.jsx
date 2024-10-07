import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Button,
  Box,
  Grid,
  Typography,
  Container,
  Stack,
  Alert,
  TextField,
  Skeleton,
} from "@mui/material";

import { loginUser, terceroData } from "../../features/authSlice";
import {
  getTerceroUser,
  getUser,
  resendOTP,
  verifyOtpRequest,
} from "../../api/auth";
import { isClientPortal } from "../../utills/authenticationCheck";
import { Roles } from "../../utills/constants";

import auth_logo from "../../assets/auth-logo.png";
import adviser_logo from "../../assets/mes_single_logo.png";

export default function OtpVerification() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpInputs, setOTPInputs] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  if (inputRefs.current.length !== otpInputs.length) {
    inputRefs.current = Array(otpInputs.length)
      .fill()
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }

  const handleChange = (index, value) => {
    if (!isNaN(value)) {
      const newInputs = [...otpInputs];
      newInputs[index] = value;
      setOTPInputs(newInputs);

      setError(false);
      setMsg("");

      if (value.length === 1 && index < otpInputs.length - 1) {
        inputRefs.current[index + 1].current.focus();
      }
    } else {
      setError(true);
      setMsg("Please enter numbers only");
    }
  };
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && otpInputs[index] === "") {
      const newInputs = [...otpInputs];
      newInputs[index - 1] = "";
      setOTPInputs(newInputs);
      inputRefs.current[index - 1].current.focus();
    }
  };

  const resendOtpFunction = async () => {
    const response = await resendOTP(location?.state?.id);

    if (response?.status) {
      setMsg(response?.message);
      setSuccess(true);
    } else {
      setMsg(response?.errors[0]?.message);
      setError(true);
      setSuccess(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.removeItem("lastActivityTime");
    if (otpInputs.some((input) => input === "") || otpInputs.length < 6) {
      setMsg("OTP must be 6 digits");
      setError(true);
      setSuccess(false);
      return;
    }

    setLoading(true);
    const response = await verifyOtpRequest(
      { code: otpInputs?.join("") },
      location?.state?.verifyToken
    );
    const { message, success, data, errors } = response;

    if (success === false) {
      setMsg(message);
      setLoading(false);
    } else if (errors?.length) {
      setMsg(errors[0].message);
      setLoading(false);
    }
    setSuccess(false);
    setError(!success);

    if (data?.isLogin) {
      const token = localStorage.getItem("token");
      const userResponse = await getUser(token);

      userResponse?.success &&
        dispatch(
          loginUser({
            user: userResponse?.data?.user,
            profileInfo: userResponse?.data?.profileInfo,
            beneficiaries: userResponse?.data?.beneficiaries,
          })
        );

      const { data: terceroUserData } = await getTerceroUser(token);
      dispatch(terceroData(terceroUserData?.terceroData));
      navigate("/");
      setLoading(false);
    } else if (data?.identityDecision) {
      localStorage.setItem(data?.verifToken, "verifToken");
      navigate("/verify-email", { state: { user: data?.user } });
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container alignItems="center" py={4} maxHeight="100vh">
        <Grid item xs={12} sm={12}>
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
                width: { xs: "100%", sm: "75%", md: "50%", lg: "45%" },
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
                OTP Verification
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
                Enter the One Time Passcode (OTP) that has been sent to{" "}
                {location?.state?.userRole === Roles.CLIENT
                  ? location?.state?.contactNumber
                  : location?.state?.userEmail}
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                mt={{ xs: 5, md: 8 }}
              >
                {error && (
                  <Alert sx={{ mb: 2 }} severity="error">
                    {msg}
                  </Alert>
                )}
                {success && (
                  <Alert sx={{ mb: 2 }} severity="success">
                    {msg}
                  </Alert>
                )}

                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    sx={{ height: "170px", borderRadius: "20px", my: 2 }}
                  />
                ) : (
                  <>
                    <Grid container spacing={2} justifyContent="center">
                      {otpInputs.map((input, index) => (
                        <Grid item xs={2} key={index}>
                          <TextField
                            variant="standard"
                            style={{
                              width: "40px",
                              textAlign: "center",
                              fontSize: "2rem",
                              outline: "none",
                              border: "none",
                            }}
                            inputProps={{
                              maxLength: 1,
                              pattern: "[0-9]*",
                              style: {
                                color: "#001C32",
                                fontWeight: "700",
                                fontSize: "33px",
                                textAlign: "center",
                                font: "Inter",
                                lineHeight: "42.9px",
                              },
                              ref: inputRefs.current[index],
                            }}
                            value={input}
                            onChange={(e) =>
                              handleChange(index, e.target.value?.trim(), e)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            required
                            error={error}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    <Button
                      type="submit"
                      fullWidth
                      disableRipple={true}
                      sx={{
                        padding: "12px",
                        borderRadius: "10px",
                        my: 5,
                        textAlign: "center",
                        background: "#001C32",
                        color: "white",
                        "&:hover": {
                          background: "#001C32",
                        },
                      }}
                      onClick={handleSubmit}
                    >
                      Verify
                    </Button>
                  </>
                )}

                <Typography
                  align="center"
                  sx={{
                    marginTop: "3rem",
                    color: "#8A92A6",
                    fontSize: { xs: "14px", sm: "16px" },
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Didn’t you receive the OTP?{" "}
                  <span
                    style={{
                      color: "#000000",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                    onClick={resendOtpFunction}
                  >
                    Resend OTP
                  </span>
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
