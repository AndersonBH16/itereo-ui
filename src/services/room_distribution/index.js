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
  set_room_distribution(payload) {
    const {
      services,
      room_prefered_dist,
      service_price = [],
      num_pax,
      from,
      to,
      calculate_prices,
    } = payload;
    const params = [
      `num_pax=${num_pax ?? ""}`,
      `from=${from || ""}`,
      `to=${to || ""}`,
      `calculate_prices=${calculate_prices || 0}`,
    ].join("&");
    return request({
      method: "POST",
      url: `/tenant/room_distribution?${params}`,
      data: { services, room_prefered_dist, service_price },
      headers: headers(),
    });
  },
};
