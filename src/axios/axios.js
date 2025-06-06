import axios from "axios";

// Creating a Custom Axios Instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (before request is sent)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (after response comes back)
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API Error : ", error);
    return Promise.reject(error);
  }
);

// Centralized Request Function
const handleRequest = async (method, url, data = null, isMultipart = false) => {
  try {
    const headers = isMultipart
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

    const config = {
      method,
      url,
      headers,
    };

    if (data && method !== "GET") {
      config.data = data;
    }
    const response = await axiosInstance.request(config);
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    if (error.response?.status === 404) {
      window.location.href = "/not-found";
    }
    console.error(`${method} Error :`, error);
    throw error;
  }
};

export default handleRequest;
