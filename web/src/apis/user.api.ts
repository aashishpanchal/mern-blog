import { api } from "@/lib/axios";
import type { APIResponse, UserState } from "api-states";

const me = async () => await api.get<APIResponse<UserState>>("/user/me");

export default { me };
