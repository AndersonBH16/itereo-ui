export default {
  getClients(state) {
    return state.clients;
  },
  getClientContracts(state) {
    return state.client_contracts;
  },
  getDestinations(state) {
    return state.destinations;
  },
  getFilteredDestinations(state) {
    return state.filteredDestinations;
  },
  getCountriesFromContract(state) {
    return state.countries;
  },
  getClientsContracts(state) {
    return state.clients_contracts;
  },
};
