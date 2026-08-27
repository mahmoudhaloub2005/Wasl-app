  import axios from "axios";
  import { clearAuthStorage, getStoredToken } from "../utils/authStorage";
  import { getApiMessage, getFieldErrors } from "./apiResponse";

  export const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "https://wasel-api-production-0719.up.railway.app/api"
  ).replace(/\/+$/, "");

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = String(getStoredToken() || "").trim();

    config.headers.Accept = "application/json";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      error.status = error.response?.status;
      error.displayMessage = getApiMessage(error);
      error.fieldErrors = getFieldErrors(error);

      if (error.response?.status === 401) {
        clearAuthStorage();

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }

      return Promise.reject(error);
    }
  );

  export default api;
