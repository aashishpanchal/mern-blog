import axios from "axios";
import session from "./session";
import { APIResponse } from "api-states";

export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (!config.headers.Authorization)
    config.headers.Authorization = `Bearer ${session.getToken("accessToken")}`;
  return config;
});

// response interceptor
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
        // fetch new access token with help of refresh token
        const res = await axios.patch<APIResponse<{ accessToken: string }>>(
          `${API_URL}/auth/refresh-token`,
          {
            token: session.getToken("refreshToken"),
          }
        );
        const {
          data: { accessToken },
        } = res.data;
        // change the access token of current user
        session.update("accessToken", accessToken);
        // set new access token to axios
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        // after resolve request
        return api(originalRequest);
      } catch (err: any) {}
    }

    throw error;
  }
);
