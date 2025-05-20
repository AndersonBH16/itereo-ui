import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  language: [],
};

const language = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default language;
