export default {
  SET_CLIENTS_DATA(state, data) {
    state.clients = data;
  },
  SET_CLIENT_CONTRACTS_DATA(state, data) {
    state.client_contracts = data;
  },
  SET_DESTINATIONS_DATA(state, data) {
    state.destinations = data;
  },
  SET_FILTERED_DESTINATIONS(state, data) {
    state.filteredDestinations = data;
  },
  SET_COUNTRIES_FROM_CONTRACT(state, data) {
    state.countries = data;
  },
  SET_CLIENTS_CONTRACTS(state, data) {
    state.clients_contracts = data;
  },
};
