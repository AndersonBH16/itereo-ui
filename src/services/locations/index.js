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
    const url = fetchUrl["locations"];
    const locations = await fetchGet(url, payload, "locations");
    return locations;
  },
  async listCountry(payload) {
    const url = fetchUrl["countries"];
    const countries = await fetchGet(url, payload, "countries");
    return countries;
  },
  async listDestinations() {
    const url = fetchUrl["destinations"];
    const destinations = await request({
      method: "GET",
      url: url,
      headers: headers(),
    });
    return destinations.data;
  },
  async listDestinationsByCountry(payload) {
    const url = fetchUrl["destinations"];
    const key = `destinations_${payload.country}`;
    const response = await fetchGet(url, payload, key);
    return response;
  },
  read(data) {
    return request({
      method: "GET",
      url: `/tenant/locations/${data.id}`,
      headers: headers(),
    });
  },
};
