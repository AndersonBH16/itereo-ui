import { AUTH_STORAGE_KEY } from "@/config.js";

export default {
  SET_AUTH_DATA(state, data) {
    state.authData = data;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  },
  CLEAR_AUTH_DATA() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
