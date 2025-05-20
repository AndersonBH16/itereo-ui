import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  locations: [],
  countries: [],
  destinations: [],
};

const locations = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default locations;
