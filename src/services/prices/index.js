/* eslint-disable no-unused-vars */
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
  get_service_price(payload) {
    const { data, num_pax, from, to, sm, contract, info, id } = payload;
    const params = [
      `num_pax=${num_pax ?? 1}`,
      `from=${from || ""}`,
      `to=${to || ""}`,
      `info=${info ?? 1}`,
      `sm=${sm || ""}`,
      `contract=${contract || ""}`,
    ].join("&");
    return request({
      method: "POST",
      url: `/tenant/prices/${id}?${params}`,
      data,
      headers: headers(),
    });
  },
};
