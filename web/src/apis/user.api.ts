import { api } from "@/axios/instance";

const me = async () => await api.get<States.UserState>("/user/me");

export default { me };
