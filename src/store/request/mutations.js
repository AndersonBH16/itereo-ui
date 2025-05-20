export default {
  SET_REQUESTS(state, data) {
    state.requests = data;
  },
  SET_REQUEST(state, data) {
    state.request = data;
  },
  SET_QUOTE_TO_LINK_TO_REQUEST(state, data) {
    state.quoteToLinkToRequest = data;
  },
};
