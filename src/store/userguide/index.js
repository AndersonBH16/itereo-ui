import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  isUserGuideActive: false,
  step: 0,
};

const userguide = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default userguide;
