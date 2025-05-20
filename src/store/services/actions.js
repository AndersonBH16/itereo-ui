/* eslint-disable no-unused-vars */
import services from "@/services/services";
import { isEqual, cloneDeep } from "lodash";
import { getLocationCode } from "@/utils/utils";
import { RESPONSE_STATUS } from "@/constants/request";

const buildServiceParams = (payload) => {
  const location = getLocationCode(payload.location);

  return [
    `page=${payload.page ?? 1}`,
    `limit=${payload.limit ?? 10}`,
    `code=${payload.code ?? ""}`,
    `name=${payload.name ?? ""}`,
    `id_type_service=${payload.id_service_type ?? ""}`,
    `category=${payload.category ?? ""}`,
    `location=${location ?? ""}`,
    `country=${payload.country ?? ""}`,
    `info=${payload.info ?? 0}`,
    `contract=${payload.contract ?? ""}`,
    `contract_user=${payload.contract_user ?? ""}`,
    `from=${payload.from ?? ""}`,
    `to=${payload.to ?? ""}`,
    `sm=${payload.sm ?? ""}`,
    `itinerary_uuid=${payload.itinerary ?? ""}`,
    `num_pax=${payload.num_pax ?? ""}`,
    `calculate_prices=${payload.calculate_prices ?? 0}`,
  ].join("&");
};

export default {
  async getServices({ commit, getters }, payload) {
    const params = buildServiceParams(payload);

    if (
      params === localStorage.getItem("LAST_SEARCH_SERVICE_PARAMS") &&
      getters.getServices.data?.length
    ) {
      return getters.getServices;
    }

    return services.getServices(params).then((response) => {
      if (response && response.status === 200) {
        commit("SET_SERVICES_DATA", response.data);
        commit("SET_LAST_SEARCH_SERVICES_PAYLOAD", cloneDeep(payload));
        localStorage.setItem("LAST_SEARCH_SERVICE_PARAMS", params);
        return response.data;
      }
    });
  },
  async setServices({ commit }, payload) {
    commit("SET_SERVICES_DATA", payload);
  },
  async getService({ commit, getters }, payload) {
    const service = getters.getService;
    const lastPayload = getters.getLastSearchServicePayload;
    if (lastPayload && isEqual(lastPayload, payload)) {
      return service;
    }
    return services.getService(payload).then((response) => {
      if (response && response.status === 200 && response.data) {
        commit("SET_SERVICE_DATA", response.data.data);
        commit("SET_LAST_SEARCH_SERVICE_PAYLOAD", cloneDeep(payload));
        return response.data.data;
      }
    });
  },
  async fetchServiceList({ commit, getters }, itinerary) {
    commit("SET_SERVICE_LIST", []);

    let page = 0;
    let serviceList = [];
    let moreRequest = false;
    do {
      const params = buildServiceParams({
        itinerary: itinerary,
        from: "0000-00-00",
        to: "0000-00-00",
        info: 0,
        limit: 5000,
        page: ++page,
      });
      const response = await services.getServices(params);
      const { data, meta } = response.data;
      serviceList = serviceList.concat(data);
      moreRequest = page < meta.last_page;
    } while (moreRequest);

    commit("SET_SERVICE_LIST", serviceList);

    return serviceList;
  },
  async importNewService({ rootState, dispatch }, payload) {
    const response = await services.importNewService(payload);
    if (response && response.status === RESPONSE_STATUS.OK) {
      const itinerary = rootState.itinerary.itinerary;
      const newImportingData = {
        queue: {
          ...itinerary.queue,
          importing: {
            ...itinerary.queue.importing,
            services: [
              ...itinerary.queue.importing.services,
              ...payload.services,
            ],
          },
        },
      };
      dispatch("itinerary/updateEntitiesImportingList", newImportingData, {
        root: true,
      });
    }
    return response.data;
  },
  resetServices({ commit }) {
    commit("SET_SERVICES_DATA", []);
  },
  resetService({ commit }) {
    commit("SET_SERVICE_DATA", {});
    commit("SET_LAST_SEARCH_SERVICE_PAYLOAD", null);
  },
  setSearchServicesPayload({ commit }, payload) {
    commit("SET_SEARCH_SERVICES_PAYLOAD", payload);
  },
  setLastSearchServicesPayload({ commit }, payload) {
    commit("SET_LAST_SEARCH_SERVICES_PAYLOAD", cloneDeep(payload));
  },
};
