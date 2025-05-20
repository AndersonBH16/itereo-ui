import locations from "@/services/locations";

export default {
  async list({ commit, getters }, payload = { page: 1 }) {
    const getLocations = getters.list;
    if (
      getLocations.data &&
      getLocations.data[0].location_name === payload.name
    ) {
      commit("SET_LOCATIONS_DATA", getLocations);
    } else {
      const response = await locations.list(payload);
      commit("SET_LOCATIONS_DATA", response.data);
    }
  },
  async listCountry({ commit }, payload = { page: 1 }) {
    const countries = await locations.listCountry({
      ...payload,
      limit: 500,
    });
    commit("SET_COUNTRIES_DATA", countries);
  },
  async listDestinations({ commit }) {
    const destinations = await locations.listDestinations();
    commit("SET_DESTINATIONS_DATA", destinations);
  },
  async listDestinationsByCountry({ commit, getters }, payload) {
    const currentDestinations = getters.listDestinations;
    const areDestinationsRepeated = currentDestinations.find(
      (destination) => destination.parent === payload?.countryId
    );
    if (areDestinationsRepeated !== undefined) return currentDestinations;
    const response = await locations.listDestinationsByCountry({
      limit: 500,
      country: payload.countryId,
    });
    const newDestinations =
      response?.data !== undefined ? response.data : response;
    commit("SET_DESTINATIONS_DATA", [
      ...currentDestinations,
      ...newDestinations,
    ]);
  },
  async listDestinationsOfMultipleCountries({ commit }, payload) {
    const response = await Promise.all(
      payload.countriesIds.map(async (country) => {
        return await locations.listDestinationsByCountry({
          limit: 500,
          country: country,
        });
      })
    );
    const allDestinations = response.flatMap((destinations) =>
      destinations.data !== undefined ? destinations.data : destinations
    );
    commit("SET_DESTINATIONS_DATA", allDestinations);
  },
  async read(payload) {
    const response = await locations.read(payload);
    return response.data.data;
  },
};
