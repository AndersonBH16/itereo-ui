import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  newUser: "",
  users: [],
};

const users = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default users;
