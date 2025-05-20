import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  services: [],
  serviceList: [],
  service: {},
  searchServicesPayload: {
    id_service_type: "",
    code: "",
    from: "",
    to: "",
    contract_user: "",
    contract: "",
    country: "",
    location: "",
    info: 1,
    sm: "",
    limit: 10,
    page: 1,
    calculate_prices: 1,
    itinerary: "",
    num_pax: 1,
    category: "",
    unformattedCategory: [],
  },
  lastSearchServicePayload: null,
  lastSearchServicesPayload: null,
};

const services = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default services;
