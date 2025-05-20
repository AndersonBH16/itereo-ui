import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  roomDistribution: null,
  roomDistributionPayload: null,
};

const room_distribution = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default room_distribution;
