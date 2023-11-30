import axios from "axios";
import session from "@/lib/session";
import { api, API_URL } from "@/lib/axios";
import { LoginSchema } from "@/schemas/auth";
import type { APIResponse, UserState } from "api-states";

const login = async (data: LoginSchema) => {
  const res = await axios.post<APIResponse<UserState>>(
    API_URL.concat("/auth/login"),
    data
  );
  // store token in session
  const {
    tokens: { accessToken, refreshToken },
  } = res.data.data;
  // store tokens
  session.store({ accessToken, refreshToken });
  // and return all response
  return res;
};

const logout = async () => api.post("/auth/logout");

export default { login, logout };
