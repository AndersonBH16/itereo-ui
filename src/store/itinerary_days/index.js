import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  isLoading: true,
  itineraryDays: [],
  totalItineraryDays: null,
  templateItineraryDays: [],
  generatedDays: [],
};

const itineraryDays = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default itineraryDays;
