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
  list(payload) {
    const params = [
      `search=${payload.search ? payload.search : ""}`,
      `page=${payload.page ? payload.page : 1}`,
      `order=${payload.order ? payload.order : "desc"}`,
      `path=${payload.path ? "/" + payload.path : ""}`,
      `category=${payload.category ?? ""}`,
    ].join("&");
    return request({
      method: "GET",
      url: `/tenant/assets?${params}`,
      headers: headers(),
    });
  },
  save(data) {
    return request({
      method: "POST",
      url: `/tenant/assets`,
      data,
      headers: headers(),
    });
  },
  thumbnail(data) {
    return request({
      method: "GET",
      url: `/tenant/assets/thumbnail/${data.id}?size=${data.size}`,
      headers: headers(),
    });
  },
};
