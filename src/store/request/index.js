import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  requests: [],
  request: {
    id: null,
    code: null,
    title: null,
    quotes: [],
  },
  quoteToLinkToRequest: null,
};

const request = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default request;
