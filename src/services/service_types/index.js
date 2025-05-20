import request from "../request";
import { AUTH_STORAGE_KEY } from "@/config.js";
import { fetchGet } from "../generalFetch";
import { fetchUrl } from "@/constants/fetchUrl";

let headers = () => {
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).token
    }`,
    "Cache-Control": "no-cache",
  };
};

export default {
  async list(payload) {
    const url = fetchUrl["service_types"];
    const service_types = await fetchGet(url, payload, "service_types");
    return service_types;
  },
  read(payload) {
    return request({
      method: "GET",
      url: `/tenant/service_types/${payload.id}`,
      headers: headers(),
    });
  },
};
