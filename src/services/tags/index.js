import { fetchGet } from "../generalFetch";
import { fetchUrl } from "@/constants/fetchUrl";
import { post } from "@/services/request";
import { STORAGE_KEYS } from "@/constants";
import { getNumberOfStepsParamsFromPayload } from "@/utils/adapters";

export default {
  async getTags(payload) {
    const url = fetchUrl[STORAGE_KEYS.TAGS];
    return await fetchGet(url, payload, STORAGE_KEYS.TAGS);
  },
  async getServicesTags(payload) {
    const url = fetchUrl["services_tags"];
    const servicesTags = await fetchGet(url, payload, "services_tags");
    return servicesTags;
  },
  async save(payload) {
    return post(
      `/tenant/tags/save${getNumberOfStepsParamsFromPayload(payload)}`,
      payload.data
    );
  },
  async getItinerariesTags(payload) {
    const url = fetchUrl["itineraries_tags"];
    const itinerariesTags = await fetchGet(url, payload, "itineraries_tags");
    return itinerariesTags;
  },
};
