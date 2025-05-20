/* eslint-disable no-unused-vars */
import client from "@/services/client";
import { DEFAULT_SERVICE_LOCATION } from "@/constants/utils";

export default {
  async getClients({ commit, getters }, payload = { page: 1 }) {
    const clients = getters.getClients;
    if (clients.length > 0) {
      commit("SET_CLIENTS_DATA", clients);
    } else {
      const clients = await client.getClients(payload);
      commit("SET_CLIENTS_DATA", clients);
      return clients;
    }
  },
  async getClientContracts({ commit, getters, dispatch }, payload) {
    let clientContract = getters.getClientContracts.filter(
      (item) => item.id_user === payload.id
    );
    if (!clientContract.length) {
      const clients_contracts = await client.getClientContracts(payload);
      const currentClientsContracts = getters.getClientsContracts;
      commit("SET_CLIENTS_CONTRACTS", [
        ...currentClientsContracts,
        ...clients_contracts,
      ]);
      clientContract = clients_contracts;
    }
    if (clientContract.length) {
      commit("SET_CLIENT_CONTRACTS_DATA", clientContract);
      const contractLocations = clientContract.filter(
        (contract) => contract.id == payload.contract_id
      );
      if (contractLocations && contractLocations.length) {
        commit("SET_COUNTRIES_FROM_CONTRACT", contractLocations[0].locations);
      } else {
        commit("SET_COUNTRIES_FROM_CONTRACT", clientContract[0].locations);
      }
    } else {
      commit("SET_COUNTRIES_FROM_CONTRACT", []);
    }
    dispatch("getDestinations");
    return clientContract;
  },
  getDestinations({ commit, getters }) {
    const contractCountries = getters.getCountriesFromContract;
    let destinations = contractCountries.flatMap(
      (country) => country.destination ?? []
    );
    if (
      destinations.length > 0 &&
      !destinations.some((item) => item.location_name === "All")
    ) {
      const defaultLocation = {
        location_name: "All",
        location_code: "",
        id: null,
      };
      destinations = [defaultLocation, ...destinations];
    }
    commit("SET_DESTINATIONS_DATA", destinations);
  },
  filterDestinationsByCountry({ commit, getters }, payload = null) {
    const countries = getters.getCountriesFromContract;
    const countrySelected = countries?.find((country) => {
      if (payload?.id === undefined)
        return country.location_name === payload.name;
      return country.id === payload?.id;
    });
    let destinations = countries.flatMap(
      (country) => country.destination ?? []
    );
    if (
      destinations.length > 0 &&
      countrySelected !== undefined &&
      !destinations.some((item) => item.location_name === "All")
    ) {
      const destinationsByCountry =
        payload !== undefined
          ? destinations.filter(
              (destination) => destination.parent === countrySelected.id
            )
          : destinations;
      destinations =
        destinationsByCountry?.length > 0
          ? [DEFAULT_SERVICE_LOCATION, ...destinationsByCountry]
          : [];
    }
    commit("SET_FILTERED_DESTINATIONS", destinations);
  },
  setCountriesFromContract({ commit }, payload) {
    commit("SET_COUNTRIES_FROM_CONTRACT", payload);
  },
};
