import { handleApiRequest } from "./apiHandler";
import { BACKEND_API_URL } from "./config";

// API function for add financial advisor
export function AddNewFinancialAdvisorHandler(body) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${BACKEND_API_URL}/mes-administrator/advisor`,
    method: "POST",
    data: body,
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for getting the firms options while adding advisor
export function getAdviceFirms() {
  const token = localStorage.getItem("token");

  const config = {
    url: `${BACKEND_API_URL}/mes-administrator/advice_firm/options`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function to get clients data by Firm
export function getClientDataByFirm(page, searchTerm, limit) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${BACKEND_API_URL}/advice_firm/clients?page=${page}&limit=${limit}&search=${searchTerm}`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for add a new administrator by firm
export function addNewAdministrator(body) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${BACKEND_API_URL}/advice_firm/administrator`,
    method: "POST",
    data: body,
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for get all administrators by advisor
export function getAdministratorDataByFirm(page, limit) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${BACKEND_API_URL}/advice_firm/administrators?page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for add a new model portfolio by firm
export function addNewModelPortfolio(body) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${BACKEND_API_URL}/advice_firm/model_portfolio`,
    method: "POST",
    data: body,
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for get all model portfolios
export function getAllModelPortfolio(page, limit) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${BACKEND_API_URL}/advice_firm/model_portfolio?page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}
