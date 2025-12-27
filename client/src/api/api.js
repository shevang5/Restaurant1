import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL || "https://new-website-bakery-nc1.onrender.com/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});


// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
