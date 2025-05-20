import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  quotesByTime: {},
  quotesByClients: {},
  userSummary: {
    quotes: [],
    confirmed: [],
  },
  requestsByStages: [],
  requestsByDestinations: [],
  salesReport: [],
};

const assets = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default assets;
