import axios from "axios";
import { authHeaders, handleUnauthorized } from "@/lib/session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const { Authorization } = authHeaders();
  if (Authorization) config.headers.Authorization = Authorization;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clears the Zustand blob too. Clearing only `lms_token` used to leave the app
      // rehydrating as signed-in with no usable token, i.e. a 401 loop.
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default api;
