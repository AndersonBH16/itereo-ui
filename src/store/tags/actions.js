/* eslint-disable no-unused-vars */
import services from "@/services/tags";
import { saveInLocalStorage } from "@/utils/localStorage";
import { STORAGE_KEYS } from "@/constants";

export default {
  async list({ commit }, payload = { page: 1, query: "" }) {
    return services.getTags(payload).then((response) => {
      commit("SET_TAGS", response);
      return response.data;
    });
  },
  async save({ commit }, payload = { page: 1, query: "" }) {
    return services.save(payload).then((response) => {
      commit("SET_TAGS", response.data);
      saveInLocalStorage(STORAGE_KEYS.TAGS, response.data);
      return response.data;
    });
  },
  async getServicesTags({ commit }, payload = { page: 1, query: "" }) {
    return services.getServicesTags(payload).then((response) => {
      commit("SET_SERVICES_TAGS", response);
      return response.data;
    });
  },
  async getItinerariesTags({ commit }, payload = { page: 1, query: "" }) {
    return services.getItinerariesTags(payload).then((response) => {
      commit("SET_ITINERARIES_TAGS", response);
      return response.data;
    });
  },
};
