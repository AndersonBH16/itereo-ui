/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import room_distribution from "@/services/room_distribution";

export default {
  async setRoomDistribution({ commit, getters }, payload) {
    try {
      commit("SET_ROOM_DISTRIBUTION", null);
      const response = await room_distribution.set_room_distribution(payload);
      if (response.status === 200 && response.data) {
        commit("SET_ROOM_DISTRIBUTION", response.data);
        commit("SET_ROOM_DISTRIBUTION_PAYLOAD", payload);
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  },
};
