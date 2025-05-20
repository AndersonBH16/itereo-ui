import request from "@/services/request";
import { AUTH_STORAGE_KEY } from "@/config.js";

const headers = () => {
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).token
    }`,
    "Cache-Control": "no-cache",
  };
};

export default {
  async registerUser(data) {
    try {
      const url = "/tenant/users";
      const admin = { email: "admin@ela.travel", password: "password" };
      const response = await request({
        method: "POST",
        url: "/tenant/login",
        data: admin,
      });
      if (response.data && response.data.token) {
        const token = response.data.token;
        return await request({
          method: "POST",
          url,
          data,
          headers: headers(token),
        });
      }
      return false;
    } catch (err) {
      return false;
    }
  },
  async getUsers(payload) {
    const params = [
      `page=${payload.page}`,
      `role=${payload.role ?? ""}`,
      `name=${payload.name ?? ""}`,
    ].join("&");

    const url = `/tenant/users?${params}`;

    return await request({ method: "GET", url, headers: headers() });
  },
  async sendResetPasswordLink(data) {
    const url = "/tenant/user/reset/password";
    return await request({ method: "POST", url, data });
  },
  async resetPassword(data) {
    const url = "/tenant/user/reset/link";
    return await request({ method: "POST", url, data });
  },
  async savePhoto(payload) {
    const url = "/tenant/user/photo";
    const finalHeaders = {
      ...headers(),
      "Content-Type": `multipart/form-data`,
    };

    const data = new FormData();
    data.append("photo", payload.data);

    const response = await request({
      method: "POST",
      url,
      headers: finalHeaders,
      data,
    });
    if (response && response.status === 200 && response.data) {
      return response.data;
    }
  },
  async sendContactUs(data) {
    const url = "/tenant/contactus";
    return await request({
      method: "POST",
      url,
      data,
    });
  },
};
