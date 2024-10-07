import axios from "axios";

// Generic function to handle API requests
export const handleApiRequest = (config) => {
  return axios(config)
    .then((response) => {
      response.data?.data?.token &&
        localStorage.setItem("token", response.data.data.token);
      return {
        data: response.data.data,
        success: true,
        message: response.data.message,
        status: response.data.status,
      };
    })
    .catch((error) => {
      return {
        data: null,
        success: false,
        message: !error.response ? error.message : error.response.data.message,
        errors: error?.response?.data?.errors,
      };
    });
};
