import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  shortcuts: null,
};

const shortcuts = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default shortcuts;
