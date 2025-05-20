/* eslint-disable */
import itineraryDays from "@/services/itinerary_days";
import { ITINERARY_TYPES } from "@/constants/itinerary";
import { RESPONSE_STATUS } from "@/constants/request";

export default {
  async getItineraryDays({ commit, getters, rootGetters, dispatch }, payload = { uuid: "", type: 1 }) {
    commit("SET_IS_LOADING", true);
    try {
      const currentItineraryDays = getters.getItineraryDays;
      const itineraryServicesModified = rootGetters['itinerary/getIsItineraryServicesModified']
      dispatch("itinerary/setIsItineraryServicesModified", false, { root: true });
      if (currentItineraryDays.length > 0 && !payload?.reload && payload?.type === undefined && !itineraryServicesModified) return currentItineraryDays;
      const response = await itineraryDays.getItineraryDays(payload);
      if (
        response &&
        response.status === RESPONSE_STATUS.OK &&
        response.data
      ) {
        dispatch("saveItineraryDaysAndRelatedData", { type: payload.type, data: response.data })
      }
    } catch (err) {
      await commit("SET_IS_LOADING", false);
      commit("SET_TOTAL_ITINERARY_DAYS", "NotFound");
      console.info(err);
      throw err;
    }
  },
  async saveItineraryDaysAndRelatedData({ commit, dispatch }, payload = { data: {}, type: 1 }) {
    if ([ITINERARY_TYPES.MODULE.id].includes(payload?.type)) {
      await commit("SET_TEMPLATE_ITINERARY_DAYS_DATA", payload.data);
    } else {
      dispatch("setItineraryDays", payload.data)
    }
    commit("SET_GENERATED_DAYS", []);
    await commit("SET_IS_LOADING", false);
  },
  async processItineraryDays(
    { state, commit, dispatch },
    payload = { uuid: "", data: [] }
  ) {
    const response = await itineraryDays.processItineraryDays(payload);
    if (response.data?.length && response.status === RESPONSE_STATUS.OK) {
      dispatch("setItineraryDays", response.data);
      return response.data;
    }
  },
  async mergeItineraryDays(
    { state, commit, dispatch },
    payload = { uuid: "", data: [] }
  ) {
    const response = await itineraryDays.mergeItineraryDays(payload);
    if (response.data?.length && response.status === RESPONSE_STATUS.OK) {
      dispatch("setItineraryDays", response.data);
      return response.data;
    }
  },
  async deleteItineraryDays({ state, commit }, payload = { id: "" }) {
    const response = await itineraryDays.deleteItineraryDays(payload);
    return response.data.data;
  },
  async generateItineraryDays({ state, commit }, payload = { data: {} }) {
    const { data } = payload;
    const response = await itineraryDays.generateItineraryDays({ data });
    return response.data.data;
  },
  async generate({ state, commit, getters }, payload = {}) {
    const response = await itineraryDays.generate(payload);
    commit("SET_GENERATED_DAYS", response.data);
    return response.data;
  },
  async updateItineraryDays({ state, commit, dispatch }, payload = { data: {} }) {
    const response = await itineraryDays.updateItineraryDays(payload);
    if (response) {
      dispatch("setItineraryDays", response.data);
      dispatch("itinerary/check_version", payload, { root: true });
      return response.data;
    }
  },
  async moveItineraryDays({ state, commit, dispatch }, payload = { data: {} }) {
    const response = await itineraryDays.moveItineraryDays(payload);
    if (response) {
      dispatch("setItineraryDays", response.data);
      dispatch("itinerary/check_version", payload, { root: true });
      return response.data;
    }
  },
  setItineraryDays({ rootState, commit }, payload = []) {
    const itineraryServices = rootState.itinerary.services_itineraries;

    const itineraryDaysWithMappedServices = payload.map((itineraryDay) => {
      const services = itineraryDay.services.map((service) => {
        const serviceData = itineraryServices.find(
          (itineraryService) => itineraryService.id === service.itinerary_service
        );
        return {
          ...serviceData,
          ...service,
        };
      });
      return {
        ...itineraryDay,
        services,
      };
    });
    commit("SET_ITINERARY_DAYS_DATA", itineraryDaysWithMappedServices);
    commit("SET_TOTAL_ITINERARY_DAYS", itineraryDaysWithMappedServices.length);
  },
  clearTemplateItineraryDays({ commit }) {
    commit("SET_TEMPLATE_ITINERARY_DAYS_DATA", []);
  },
  resetItineraryDays({ dispatch }) {
    dispatch("setItineraryDays", []);
  }
};
