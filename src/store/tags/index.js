import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  tags: [],
  servicesTags: [],
  itinerariesTags: [],
};

const tags = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default tags;
