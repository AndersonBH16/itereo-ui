import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  servicePrice: null,
  servicePricePayload: null,
};

const prices = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default prices;
