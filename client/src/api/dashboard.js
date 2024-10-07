import { handleApiRequest } from "./apiHandler";
import { BACKEND_API_URL } from "./config";

// API function for get payment
export function GetDashboardStats(token, portfolioId) {
  const config = {
    url: `${BACKEND_API_URL}/dashboard/${portfolioId}`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

export function GetUpdatedDashboardStats(token, portfolioId) {
  const config = {
    url: `${BACKEND_API_URL}/dashboard/updated-stats/${portfolioId}`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for get performance graph data
export function getPerformanceDetail(token, terceroId, portfolioId) {
  const config = {
    url: `${BACKEND_API_URL}/performance/${terceroId}/${portfolioId}`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for get Tercero user by finanical advisor
export function getTerceroUserInfo(token, terceroId) {
  const config = {
    url: `${BACKEND_API_URL}/advisor/get-tercero-user/${terceroId}`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}
