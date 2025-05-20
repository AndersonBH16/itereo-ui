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
  async getStatusesItinerary(payload) {
    const url = fetchUrl["statuses_itinerary"];
    const statuses_itinerary = await fetchGet(
      url,
      payload,
      "statuses_itinerary"
    );
    return statuses_itinerary;
  },
  getStatusItinerary(data) {
    return request({
      method: "GET",
      url: `/tenant/statuses_itinerary/${data.id}`,
      headers: headers(),
    });
  },
};
