export default {
  SET_SERVICES_DATA(state, data) {
    state.services = data;
  },
  SET_SERVICE_LIST(state, data) {
    state.serviceList = data;
  },
  SET_SERVICE_DATA(state, data) {
    state.service = data;
  },
  SET_SEARCH_SERVICES_PAYLOAD(state, data) {
    state.searchServicesPayload = data;
  },
  SET_LAST_SEARCH_SERVICE_PAYLOAD(state, data) {
    state.lastSearchServicePayload = data;
  },
  SET_LAST_SEARCH_SERVICES_PAYLOAD(state, data) {
    state.lastSearchServicesPayload = data;
  },
};
