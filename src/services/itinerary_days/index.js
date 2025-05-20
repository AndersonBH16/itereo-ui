import { getNumberOfStepsParamsFromPayload } from "@/utils/adapters";
import request, { post } from "../request";
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
  async getItineraryDays(payload) {
    const uuid = payload.uuid;
    const params = [`limit=${payload.limit ?? 10}`];
    return request({
      method: "GET",
      url: `/tenant/itinerary/days/${uuid}?${params}`,
      headers: headers(),
    });
  },
  processItineraryDays(payload = { uuid: "", data: [] }) {
    const uuid = payload.uuid;
    const data = payload.data;
    const url = `/tenant/itinerary/days/${uuid}${getNumberOfStepsParamsFromPayload(
      payload
    )}`;
    return request({ method: "POST", url, data, headers: headers() });
  },
  mergeItineraryDays(payload = { uuid: "", data: [] }) {
    const uuid = payload.uuid;
    const data = payload.data;
    const url = `/tenant/itinerary/days/merge/${uuid}${getNumberOfStepsParamsFromPayload(
      payload
    )}`;
    return request({ method: "POST", url, data, headers: headers() });
  },
  deleteItineraryDays(payload = { id: "" }) {
    const { id } = payload;
    const url = `/tenant/itinerary/day/${id}${getNumberOfStepsParamsFromPayload(
      payload
    )}`;
    return request({ method: "DELETE", url, headers: headers() });
  },
  generateItineraryDays(payload = { data: {} }) {
    const data = payload.data;
    const url = `/tenant/days/by-itinerary`;
    return request({ method: "POST", url, data, headers: headers() });
  },
  generate(data = {}) {
    const url = `/tenant/itinerary/${data.id}/days/generate`;
    return post(url, data);
  },
  updateItineraryDays(payload = { data: {} }) {
    const data = payload.data;
    const url = `/tenant/days/by-itinerary${getNumberOfStepsParamsFromPayload(
      payload
    )}`;
    return request({ method: "PUT", url, data, headers: headers() });
  },
  moveItineraryDays(data = {}) {
    const url = `/tenant/itinerary/${
      data.id
    }/days/move${getNumberOfStepsParamsFromPayload(data)}`;
    return request({ method: "POST", url, data, headers: headers() });
  },
};
