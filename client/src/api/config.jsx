// src/api/config.js
import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL || "https://localhost:5000/api";

// Create axios instance with default config
const config = axios.create({
  baseURL,
  withCredentials: true, // Important for sending cookies and auth headers cross-origin
  headers: {
    // default Accept only; don't force Content-Type globally because
    // multipart/form-data (FormData) must let the browser/axios set the
    // correct Content-Type with boundary.
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token to requests
config.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If the request body is a FormData instance, remove any Content-Type
    // header so the browser/axios can set the correct multipart/form-data
    // header with boundary. Some server setups will return 400 if the
    // Content-Type is incorrectly set to application/json.
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    // Log the request config for debugging (avoid printing large FormData contents)
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      dataType: config.data instanceof FormData ? 'FormData' : typeof config.data
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
config.interceptors.response.use(
  (response) => {
    console.log('Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    return Promise.reject(error);
  }
);

export default config;
