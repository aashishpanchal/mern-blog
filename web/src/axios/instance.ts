import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// interceptors
api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {
            withCredentials: true,
          }
        );
        return api.request(originalRequest);
      } catch (err: any) {}
    }

    throw error;
  }
);
