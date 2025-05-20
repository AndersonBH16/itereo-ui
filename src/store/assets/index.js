import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  assets: [],
};

const assets = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default assets;
