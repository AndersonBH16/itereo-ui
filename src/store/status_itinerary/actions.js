import status_itinerary from "@/services/status_itinerary";

export default {
  async getStatusesItinerary({ commit, getters }, payload = { page: 1 }) {
    try {
      const statusItinerary = getters.getStatusesItinerary;
      if (statusItinerary.length > 0) {
        commit("SET_STATUSES_ITINERARY_DATA", statusItinerary);
      } else {
        const statuses_itinerary = await status_itinerary.getStatusesItinerary(
          payload
        );
        commit("SET_STATUSES_ITINERARY_DATA", statuses_itinerary);
      }
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async getStatusItinerary(payload) {
    const response = await status_itinerary.getStatusItinerary(payload);
    return response.data.data;
  },
};
