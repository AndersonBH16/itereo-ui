import request from "../request";
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
  async getRequests(payload) {
    const params = [
      `page=${payload.page ? payload.page : 1}`,
      `limit=${payload.limit ? payload.limit : 100}`,
      `code=${payload.code ? payload.code : ""}`,
      `title=${payload.title ? payload.title : ""}`,
      `stage=${payload.stage ? payload.stage : ""}`,
      `client=${payload.client ? payload.client : ""}`,
      // `contract=${payload.client ? payload.contract : ""}`,
      `creation=${payload.creation ? payload.creation : ""}`,
    ].join("&");
    return request({
      method: "GET",
      url: `/tenant/files?${params}`,
      headers: headers(),
    });
  },
  async getRequestById(payload) {
    return request({
      method: "GET",
      url: `/tenant/files/${payload.id}`,
      headers: headers(),
    });
  },
  async createRequest(payload) {
    return request({
      method: "POST",
      url: "/tenant/files",
      headers: headers(),
      data: payload,
    });
  },
  async deleteRequest(payload) {
    return request({
      method: "DELETE",
      url: `/tenant/files/${payload.id}`,
      headers: headers(),
      data: payload,
    });
  },
  async saveRequest(payload) {
    return request({
      method: "PUT",
      url: `/tenant/files/${payload.id}`,
      headers: headers(),
      data: payload,
    });
  },
  async linkQuoteToRequest(payload) {
    return request({
      method: "POST",
      url: `/tenant/files/${payload.requestId}/quotes`,
      data: payload.data,
      headers: headers(),
    });
  },
};
