/* eslint-disable no-unused-vars */
import serviceTypes from "@/services/service_types";

export default {
  async list({ commit, getters }, payload = { page: 1, query: "" }) {
    const servicesTypesFromGetters = getters.list;
    if (servicesTypesFromGetters && servicesTypesFromGetters.length > 0) {
      commit("SET_SERVICE_TYPES_DATA", servicesTypesFromGetters);
    } else {
      const service_types = await serviceTypes.list({
        ...payload,
        limit: 20,
      });
      commit("SET_SERVICE_TYPES_DATA", service_types);
    }
  },
  async read({ commit }, payload) {
    const response = await serviceTypes.read(payload);
    return response.data.data;
  },
};
