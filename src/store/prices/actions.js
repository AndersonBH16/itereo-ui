import prices from "@/services/prices";
import { isEqual, cloneDeep } from "lodash";

export default {
  async getServicePrice({ commit, getters }, payload) {
    try {
      const lastPayload = getters.getServicePricePayload;
      const servicePrice = getters.getServicePrice;
      if (lastPayload && servicePrice && isEqual(lastPayload, payload)) {
        commit("SET_SERVICE_PRICE", servicePrice);
        return servicePrice;
      }
      commit("SET_SERVICE_PRICE", null);
      commit("SET_SERVICE_PRICE_PAYLOAD", null);
      const response = await prices.get_service_price(payload);
      if (response.status === 200 && response.data) {
        commit("SET_SERVICE_PRICE", response.data);
        commit("SET_SERVICE_PRICE_PAYLOAD", cloneDeep(payload));
        return response.data;
      }
    } catch (err) {
      console.warn("Service price error:", err);
      throw err;
    }
  },
};
