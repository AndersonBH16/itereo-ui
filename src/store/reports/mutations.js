export default {
  SET_QUOTES_BY_TIME(state, payload) {
    state.quotesByTime = payload;
  },
  SET_QUOTES_BY_CLIENTS(state, payload) {
    state.quotesByClients = payload;
  },
  SET_USER_SUMMARY(state, payload) {
    state.userSummary = payload;
  },
  SET_QUOTES_BY_STAGES(state, payload) {
    state.requestsByStages = payload;
  },
  SET_QUOTES_BY_DESTINATIONS(state, payload) {
    state.requestsByDestinations = payload;
  },
  SET_SALES_REPORT(state, payload) {
    state.salesReport = payload;
  },
};
