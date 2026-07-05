import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://wasel-api-production-0719.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("wasel_token") ||
    sessionStorage.getItem("wasel_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("wasel_token");
      localStorage.removeItem("wasel_is_logged_in");
      localStorage.removeItem("wasel_user");
      localStorage.removeItem("wasel_user_role");
      sessionStorage.removeItem("wasel_token");
      sessionStorage.removeItem("wasel_is_logged_in");
      sessionStorage.removeItem("wasel_user");
      sessionStorage.removeItem("wasel_user_role");
    }

    return Promise.reject(error);
  }
);

export default api;
