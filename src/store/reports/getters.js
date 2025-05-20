export default {
  getQuotesByTime(state) {
    return state.quotesByTime;
  },
  getQuotesByClients(state) {
    return state.quotesByClients;
  },
  getUserSummary(state) {
    return state.userSummary;
  },
  getRequestsByStages(state) {
    return state.requestsByStages;
  },
  getRequestsByDestinations(state) {
    return state.requestsByDestinations;
  },
  getSalesReport(state) {
    return state.salesReport;
  },
};
