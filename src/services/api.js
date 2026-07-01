import axios from "axios";

const api = axios.create({
  baseURL: "https://wasel-api-production-0719.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;