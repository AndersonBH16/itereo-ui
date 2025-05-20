import request from "@/services/request";
import { AUTH_STORAGE_KEY } from "@/config.js";

let headers = () => {
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).token
    }`,
    "Cache-Control": "no-cache",
  };
};

export default {
  getToken(payload) {
    const url = "/tenant/login";
    const data = { email: payload.email, password: payload.password };
    return request({ method: "POST", url, data });
  },
  logout() {
    const url = "/tenant/logout";
    return request({ method: "POST", url, headers: headers() });
  },
  async getUserData() {
    const url = `/tenant/user`;
    const response = await request({ method: "GET", url, headers: headers() });
    return response.data.user;
  },
};
