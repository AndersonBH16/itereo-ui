/* eslint-disable no-unused-vars */
import assets from "@/services/assets";

export default {
  async list({ commit }, payload = { page: 1 }) {
    try {
      commit("SET_ASSETS_DATA", []);
      const response = await assets.list(payload);
      if (response && response.status === 200) {
        commit("SET_ASSETS_DATA", response.data);
        return response.data;
      }
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async save({ commit }, payload) {
    const response = await assets.save(payload);
    return response.data;
  },
  async thumbnail({ commit }, payload) {
    const response = await assets.thumbnail(payload);
    return response.data;
  },
  resetAssetsData({ commit }) {
    commit("SET_ASSETS_DATA", []);
  },
};
