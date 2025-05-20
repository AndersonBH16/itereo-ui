import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  clients: [],
  client_contracts: [],
  clients_contracts: [],
  destinations: [],
  filteredDestinations: [],
  countries: [],
};

const client = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default client;
