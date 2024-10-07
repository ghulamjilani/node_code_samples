import { handleApiRequest } from "./apiHandler";
import { BACKEND_API_URL } from "./config";

// API function for login
export function loginUserRequest(email, password) {
  const config = {
    url: `${BACKEND_API_URL}/login`,
    method: "POST",
    data: {
      email: email,
      password: password,
    },
  };
  return handleApiRequest(config);
}

// API function for Sign up
export function SignUpRequest(body) {
  const config = {
    url: `${BACKEND_API_URL}/signup`,
    method: "POST",
    data: body,
  };
  return handleApiRequest(config);
}

// API function to get user data
export function getUser(token) {
  const config = {
    url: `${BACKEND_API_URL}/get-user`,
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `${token}`,
    },
  };
  return handleApiRequest(config);
}

export function verifyOtpRequest(data, token) {
  const config = {
    url: `${BACKEND_API_URL}/verify-contact-number`,
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return handleApiRequest(config);
}

export function resendOTP(number) {
  const config = {
    url: `${BACKEND_API_URL}/resend-otp/${number}`,
    method: "GET",
    headers: { "ngrok-skip-browser-warning": "skip-browser-warning" },
  };
  return handleApiRequest(config);
}
