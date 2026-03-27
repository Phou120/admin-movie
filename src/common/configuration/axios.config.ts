import axios from "axios";
import router from "../../router";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token and language automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language header from localStorage or default to 'lo'
    const locale = localStorage.getItem("locale") || "lo";
    config.headers["lang"] = locale;

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status;

    // Handle 401 Unauthorized - redirect to login
    if (statusCode === 401) {
      console.error("401 Unauthorized - redirecting to login");

      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user_roles");

      // Redirect to login page (only if not already there)
      if (router.currentRoute.value.name !== "login") {
        router.push({ name: "login" });
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;