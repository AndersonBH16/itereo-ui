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
  getServices(params) {
    return request({
      method: "GET",
      url: `/tenant/services?${params}`,
      headers: headers(),
    });
  },
  getService(payload) {
    const params = [
      `info=${payload.info ?? 0}`,
      `from=${payload.from ?? ""}`,
      `to=${payload.to ?? ""}`,
      `sm=${payload.sm ?? ""}`,
      `itinerary_uuid=${payload.itinerary ?? ""}`,
      `num_pax=${payload.num_pax ?? ""}`,
      `calculate_prices=${payload.calculate_prices ?? 0}`,
    ].join("&");
    return request({
      method: "GET",
      url: `/tenant/services/${payload.id}?${params}`,
      headers: headers(),
    });
  },
  importNewService(payload) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/${payload.itineraryId}/service-import`,
      headers: headers(),
      data: {
        services: payload.services,
      },
    });
  },
};
