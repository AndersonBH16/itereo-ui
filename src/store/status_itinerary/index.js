import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  status_itinerary: [],
};

const status_itinerary = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default status_itinerary;
