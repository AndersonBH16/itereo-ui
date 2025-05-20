import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  serviceTypes: [],
};

const roles = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default roles;
