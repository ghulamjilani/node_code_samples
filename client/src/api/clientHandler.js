import { handleApiRequest } from "./apiHandler";
import { BACKEND_API_URL } from "./config";

// API function for add a client
export function AddClientByAdvisor(body, accessToken) {
  const config = {
    url: `${BACKEND_API_URL}/adviser/clients`,
    method: "POST",
    data: body,
    headers: {
      Authorization: `${accessToken}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for add a new Beneficiary by advisor
export function addNewBeneficiaryAdvisor(body, clientId, token) {
  const config = {
    url: `${BACKEND_API_URL}/beneficiary?user=${clientId}`,
    method: "POST",
    data: body,
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for delete Beneficiary by advisor
export function deleteBeneficiaryAdvisor(beneficiaryId, clientId, token) {
  const config = {
    url: `${BACKEND_API_URL}/beneficiary/${beneficiaryId}?user=${clientId}`,
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}

// API function for update Beneficiary by advisor
export function updateBeneficiaryAdvisor(beneficiaryId, clientId, body, token) {
  const config = {
    url: `${BACKEND_API_URL}/beneficiary/${beneficiaryId}?user=${clientId}`,
    method: "PUT",
    data: body,
    headers: {
      Authorization: `${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  };
  return handleApiRequest(config);
}
