import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
import { AUTH_STORAGE_KEY } from "@/config.js";

const authData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || null;

const state = {
  authData,
};

const auth = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default auth;
