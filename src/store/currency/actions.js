import currency from "@/services/currency";

export default {
  async getCurrencies({ commit, getters }, payload = { page: 1 }) {
    try {
      const currencyFound = getters.getCurrencies;
      if (currencyFound.length > 0) {
        commit("SET_CURRENCY_DATA", currencyFound);
      } else {
        const currencies = await currency.getCurrencies(payload);
        commit("SET_CURRENCY_DATA", currencies);
        return currencies;
      }
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async getCurrency(payload) {
    const response = await currency.getCurrency(payload);
    return response.data.data;
  },
};
