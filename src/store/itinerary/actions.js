/* eslint-disable no-unused-vars */
import itinerary from "@/services/itinerary";
import { parse, format } from "date-fns";
import { helper } from "@/utils/itinerary";
import { helpers } from "@/utils/adapters";
import { RESPONSE_STATUS, REQUEST_STATUS } from "@/constants/request";
import { serviceHelper } from "@/utils/service";
import {
  ITINERARY_STATUS,
  DEFAULT_FORM_ITINERARY,
  ITINERARY_STATUS_TO_DISABLE_QUOTE,
  ITINERARY_STATUS_TO_HIDE_ACTIONS,
} from "@/constants/itinerary";
import {
  DATE_FORMAT_YYYY_MM_DD,
  MAX_PROCESS_SERVICES,
  USER_ROLE,
} from "@/constants";
import { datesHelper } from "@/utils/dates";
import globalHelper from "@/helpers";
import { TEMPLATES } from "@/constants/exportConfig";
import { PATH_INFO } from "@/router/path";

export default {
  async list({ commit, getters }, payload = { page: 1 }) {
    try {
      const response = await itinerary.list(payload);
      const { status = 0, data = [] } = response;
      if (response && status === 200) {
        if (!payload.accumulate) commit("SET_ITINERARIES_DATA", []);
        const formattedData = data?.data?.map((itinerary) => {
          const isExporting = data.queue.exporting.includes(itinerary.id);
          const isDeleting = data.queue.deleting.includes(itinerary.id);
          const isUpdating = data.queue.refreshing.includes(itinerary.id);
          return {
            ...itinerary,
            isDeleting,
            isExporting,
            isUpdating,
            status: isExporting
              ? {
                  id: ITINERARY_STATUS.CONFIRM.value,
                  name: ITINERARY_STATUS.text,
                }
              : itinerary.status,
          };
        });
        const newData = { ...data, data: formattedData };
        if (payload.accumulate !== undefined && payload.accumulate) {
          const pastItineraries = getters.getItineraries?.data || [];
          commit("SET_ITINERARIES_DATA", {
            ...newData,
            data: [...pastItineraries, ...newData.data],
          });
        } else commit("SET_ITINERARIES_DATA", newData);
        return newData;
      }
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async read({ commit, getters, dispatch }, { uuid, force }) {
    dispatch("setHideElementByCondition");
    const itineraryFound = getters.getItineraryById(uuid);
    if (itineraryFound && !force) {
      commit("SET_ITINERARY_DATA", itineraryFound);
      dispatch("setPageTitle");
      if (itineraryFound.data) {
        if (itineraryFound.data.status) {
          dispatch(
            "setItineraryStatusAndRelatedState",
            itineraryFound.data.status.id
          );
        }
        if (
          itineraryFound.data.room_preferable_dist &&
          itineraryFound.data.room_preferable_dist.length > 0
        ) {
          commit(
            "SET_ROOM_PREFERABLE_DISTRIBUTION",
            itineraryFound.data.room_preferable_dist
          );
        }
      }
    } else {
      const response = await itinerary.read(uuid);
      if (response && response.status === 200) {
        if (response.data && response.data.data) {
          dispatch("saveItineraryAndRelatedData", response.data);
        }
      }
      return response;
    }
  },
  async getItineraryVersion({ commit, dispatch }, payload) {
    dispatch("setHideElementByCondition");
    const response = await itinerary.getItineraryVersion(payload);
    if (response && response.status === RESPONSE_STATUS.OK) {
      const itineraryToSave = {
        data: response.data,
        exporting: false,
        importing: [],
        permissions: [],
      };
      dispatch("saveItineraryAndRelatedData", itineraryToSave);
      dispatch(
        "setItineraryServicesAndRelatedState",
        itineraryToSave.data.service_itinerary
      );
      dispatch("updatePricesData", itineraryToSave.data.prices);
      dispatch(
        "itineraryDays/saveItineraryDaysAndRelatedData",
        { data: itineraryToSave.data.days },
        { root: true }
      );
      dispatch(
        "saveItineraryPassengersAndRelatedData",
        itineraryToSave.data.passengers
      );
      dispatch("setItineraryPublishedAndRelatedData", {
        config: itineraryToSave.data.config,
        images: itineraryToSave.data.cover,
      });
    }
    return response;
  },
  async restoreItineraryByVersion({ commit }, payload) {
    const response = await itinerary.restoreItineraryByVersion(payload);
    return response.data;
  },
  saveItineraryPassengersAndRelatedData({ getters, commit }, passengers) {
    commit("SET_PASSENGERS_ITINERARIES_DATA", passengers);
    const paxPricesMapped = helpers.mapPaxsPricesAndPassengers(
      getters.getPaxPrices,
      passengers
    );
    commit("SET_PAX_PRICES", paxPricesMapped);
  },
  saveItineraryAndRelatedData({ commit, getters, dispatch }, itinerary) {
    commit("SET_ITINERARY_DATA", itinerary);
    dispatch(
      "udpateFormItinerary",
      helpers.adaptItineraryToFormItinerary(itinerary.data)
    );
    dispatch("setPageTitle");
    if (itinerary.data.status) {
      dispatch("setItineraryStatusAndRelatedState", itinerary.data.status.id);
    }
    commit("SET_NUM_PAX", itinerary.data.num_pax);
    if (itinerary.data.room_preferable_dist) {
      commit(
        "SET_ROOM_PREFERABLE_DISTRIBUTION",
        itinerary.data.room_preferable_dist
      );
    }
    const roomPreferableDistJson = getters.getRoomPreferableDistributionJson;
    if (roomPreferableDistJson && roomPreferableDistJson.length > 0) {
      let acumPax = 0;

      // se asigna la cantidad en las habitaciones seleccionadas.
      roomPreferableDistJson.forEach((room) => {
        const roomSelected =
          itinerary.data.room_preferable_dist &&
          itinerary.data.room_preferable_dist.length > 0
            ? itinerary.data.room_preferable_dist.filter(
                (item) => item.id_room_type === room.id_room_type
              )
            : null;
        if (roomSelected && roomSelected.length > 0) {
          room.qty = roomSelected[0].qty;
          acumPax += room.qty * room.max_pax;
        } else {
          room.qty = 0;
        }
      });

      // se asigna el máximo permitido por habitación según la cantidad de pasajeros del itinerario.
      const numPax = itinerary.data.num_pax;
      const remainingPassengers = numPax - acumPax;

      roomPreferableDistJson.forEach((room) => {
        let { id_room_type, qty, max_pax } = room;
        if (id_room_type === 1) {
          if (remainingPassengers + qty <= numPax) {
            room.max_qty = remainingPassengers + qty;
          } else {
            room.max_qty = numPax;
          }
        } else if (remainingPassengers >= max_pax) {
          room.max_qty = Math.ceil(remainingPassengers / max_pax) + qty;
        } else {
          room.max_qty = qty;
        }
      });
      commit("SET_ROOM_PREFERABLE_DISTRIBUTION_JSON", roomPreferableDistJson);
    }
  },
  async save({ commit }, payload) {
    try {
      commit("utils/SET_REQUEST_IN_PROGRESS", "itinerary", { root: true });
      const response = await itinerary.save(payload);
      return new Promise((resolve, reject) => {
        if (
          response.data &&
          response.data.messages &&
          response.data.messages[0].errors
        ) {
          commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
          reject(response.data.messages[0].errors);
        } else {
          commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
          resolve(response.data);
        }
      });
    } catch (error) {
      commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
      throw error;
    }
  },
  async update({ commit, getters, dispatch }, payload) {
    commit("SET_ITINERARY_UPDATED_STATUS", "");
    commit("utils/SET_REQUEST_IN_PROGRESS", "itinerary", { root: true });
    const response = await itinerary.update(payload);
    if (
      response &&
      response.status === 200 &&
      response.data &&
      response.data.itinerary &&
      response.data.itinerary.id
    ) {
      commit("SET_NUM_PAX", payload.num_pax);
      const currentPassengers = getters.getPassengersItineraries;
      if (response.data.itinerary.num_pax !== currentPassengers.length) {
        dispatch("list_passengers", { uuid: payload.id, reload: true });
      }

      const itinerary = getters.getItineraryById(payload.id);

      if (itinerary && itinerary.data && payload) {
        itinerary.data.itinerary_type_id =
          response.data.itinerary.itinerary_type_id;
        itinerary.data.client = response.data.itinerary.client;
        itinerary.data.version = response.data.itinerary.version;
        itinerary.data.stable_version = response.data.itinerary.stable_version;
        itinerary.data.language = response.data.itinerary.language;
        itinerary.data.tags = response.data.itinerary.tags;
        itinerary.data.contract_id = response.data.itinerary.contract_id;
        itinerary.data.description.value =
          response.data.itinerary.description.value;
        itinerary.data.start_date = payload.start_date
          ? format(parse(payload.start_date), DATE_FORMAT_YYYY_MM_DD)
          : itinerary.data.start_date;
        itinerary.data.title = payload.title
          ? payload.title
          : itinerary.data.title;
        itinerary.data.code = payload.code;
        itinerary.data.end_date = payload.end_date
          ? format(parse(payload.end_date), DATE_FORMAT_YYYY_MM_DD)
          : itinerary.data.end_date;
        itinerary.data.num_pax = payload.num_pax
          ? payload.num_pax
          : itinerary.data.num_pax;
        itinerary.data.status.id = payload.status
          ? payload.status
          : itinerary.data.status;
        itinerary.data.room_preferable_dist =
          payload.room_preferable_dist || [];

        dispatch("setItineraryStatusAndRelatedState", itinerary.data.status.id);
        commit("SET_ITINERARY_UPDATED_STATUS", "updated");
        commit("SET_ITINERARY_DATA", itinerary);
        commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
        dispatch(
          "udpateFormItinerary",
          helpers.adaptItineraryToFormItinerary(response.data.itinerary)
        );

        dispatch("itineraryDays/setItineraryDays", response.data.days, {
          root: true,
        });

        dispatch(
          "request/updateRequestItemById",
          {
            ...itinerary.data,
          },
          {
            root: true,
          }
        );
      }
    } else {
      commit("SET_NUM_PAX", 1);
      commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
    }
    return response.data;
  },
  udpateFormItineraryByKey({ commit, getters }, payload) {
    const currentFormItinerary = getters.getFormItinerary;
    const newValue = [
      { ...currentFormItinerary[0], [payload.key]: payload.value },
    ];
    commit("SET_FORM_ITINERARY", newValue);
  },
  udpateFormItinerary({ commit, getters }, payload) {
    const currentFormItinerary = getters.getFormItinerary;
    const newValue = [
      {
        ...currentFormItinerary[0],
        id: payload.id,
        title: payload.title,
        code: payload.code,
        client_id: payload.client_id,
        status: payload.status,
        start_date: payload.start_date,
        end_date: payload.end_date,
        language_id: payload.language_id,
        currency_id: payload.currency_id,
        num_day: payload.num_day,
        num_pax: payload.num_pax,
        description: payload.description,
        location: payload.location,
        version: payload.version,
        contract_id: payload.contract_id,
        itinerary_type_id: payload.itinerary_type_id,
        tags: payload.tags,
      },
    ];
    commit("SET_FORM_ITINERARY", newValue);
  },
  async update_description({ commit, getters }, payload) {
    commit("SET_ITINERARY_UPDATED_STATUS", "");
    commit("utils/SET_REQUEST_IN_PROGRESS", "itinerary", { root: true });
    const response = await itinerary.update_description(payload);
    if (response && response.status === 200) {
      const itinerary = getters.getItineraryById(payload.uuid);
      if (itinerary && itinerary.data && payload) {
        itinerary.data.description = payload.description;
        commit("SET_ITINERARY_UPDATED_STATUS", "updated");
        commit("SET_ITINERARY_DATA", itinerary);
      }
    }
    commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
    return response.data;
  },
  async delete({ commit, getters, dispatch }, payload) {
    const response = await itinerary.delete(payload);

    const itineraries = getters.getItineraries;
    commit("SET_ITINERARIES_DATA", {
      ...itineraries,
      data: itineraries.data.map((itinerary) => {
        const isDeleting = itinerary.id === payload.id || itinerary.isDeleting;
        return {
          ...itinerary,
          isDeleting,
        };
      }),
    });

    dispatch("setItineraryServicesAffected", []);

    return response.data;
  },
  async duplicate({ dispatch, commit }, payload) {
    await dispatch(
      "utils/setLoadingText",
      "We are duplicating the itinerary, please wait...",
      { root: true }
    );

    const originalInfo =
      payload?.originalServices === undefined
        ? await dispatch("list_services", {
            id: payload.uuid,
          })
        : { data: payload.originalServices };

    commit("utils/SET_LOADING", true, { root: true });

    const originalServices = originalInfo?.data || [];

    const originalServiceUUIDs = originalServices.map((service) => service.id);

    let chunks = globalHelper.sliceIntoChunks(
      originalServiceUUIDs,
      MAX_PROCESS_SERVICES
    );

    const TOTAL_STEPS_TO_PERFORM = payload?.onlyDuplicate
      ? 1
      : chunks.length + 2;

    const response = await itinerary.duplicate({
      ...payload,
      last_step: TOTAL_STEPS_TO_PERFORM,
    });

    let updatedServices = [];

    if (response && response.status === RESPONSE_STATUS.CREATED) {
      dispatch("resetItineraryAndRelatedData");

      const itinerary = response.data.itinerary;

      const quote = await dispatch("read", { uuid: itinerary });

      const info = await dispatch("list_services", {
        id: itinerary,
        reload: true,
      });

      const services = info.data;

      const daysToMove = datesHelper.getDatesDiffByDates(
        payload.start_date,
        services?.[0]?.start_date
      );

      if (daysToMove !== 0) {
        const response = await dispatch("moveServices", {
          ...payload,
          itinerary: itinerary,
          services,
          daysToMove,
          cur_step: 2,
          last_step: TOTAL_STEPS_TO_PERFORM,
          reverting: daysToMove >= 0,
        });

        updatedServices = response.updatedServices;
      }

      return {
        ...response.data,
        quote: quote.data,
        updatedServices,
      };
    }

    return response;
  },
  async change_status({ commit, dispatch }, payload) {
    const response = await itinerary.change_status(payload);
    if (response && response.status === 200) {
      dispatch("setItineraryStatusAndRelatedState", payload.status);
      dispatch("updateItineraryData", response.data.itinerary);
      dispatch("setExportingData", {
        exporting: response.data.exporting,
      });
    }
    return response.data;
  },
  async changeQuoteStatus({ commit }, payload) {
    const response = await itinerary.change_status(payload);
    return response.data;
  },
  async change_status_services({ commit }, payload) {
    const response = await itinerary.change_status_services(payload);
    return response.data;
  },
  async generate_description({ commit }, payload) {
    const response = await itinerary.generate_description(payload);
    return response.data;
  },
  async add_service({ commit, getters, dispatch }, payload) {
    commit("SET_ITINERARY_SERVICE_RECENTLY_ADDED", null);
    commit("utils/SET_REQUEST_IN_PROGRESS", "itineraryServices", {
      root: true,
    });
    if (payload.data && payload.data.length) {
      payload.data.forEach((service) => {
        service.visible = service.visible ? 1 : 0;
      });
    }
    const response = await itinerary.add_service(payload);
    if (response && response.data && response.data.itinerary) {
      const itinerary = getters.getItineraryById(response.data.itinerary.id);
      itinerary.data.start_date = response.data.itinerary.start_date;
      itinerary.data.end_date = response.data.itinerary.end_date;
      itinerary.data.num_day = response.data.itinerary.num_day;
      commit("SET_ITINERARY_DATA", itinerary);
      if (
        response.data.messages &&
        response.data.messages.length &&
        response.data.messages[0].service
      ) {
        commit(
          "SET_ITINERARY_SERVICE_RECENTLY_ADDED",
          response.data.messages[0].service
        );
      }
      commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
      dispatch("setItineraryServicesAffected", {
        services: response.data.messages,
      });
    } else {
      commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
    }
    return response.data;
  },
  updatePricesData({ commit, getters }, payload = []) {
    const validatedPrices = helpers.validatedPriceLevelsOrder(payload);
    const paxPrices = helpers.adaptPricesToPaxPrices(validatedPrices);
    const currentPassengers =
      getters.getPassengersItineraries?.status === REQUEST_STATUS.FETCHING
        ? []
        : getters.getPassengersItineraries;
    const paxPricesMapped = helpers.mapPaxsPricesAndPassengers(
      paxPrices,
      currentPassengers
    );
    commit("SET_PAX_PRICES", paxPricesMapped);
    commit("SET_PRICES_ITINERARIES_DATA", validatedPrices);
    commit("SET_PRICES_ITINERARIES_DATA_SOURCE", validatedPrices);
  },
  async process({ commit, getters, dispatch }, payload) {
    commit("SET_ITINERARY_SERVICE_RECENTLY_ADDED", null);
    commit("utils/SET_REQUEST_IN_PROGRESS", "itineraryServices", {
      root: true,
    });
    if (payload?.data?.length) {
      payload.data.forEach((service) => {
        service.visible = service.visible ? 1 : 0;
      });
    }
    const response = await itinerary.process(payload);
    if (response?.data) {
      const itinerary = getters.getItineraryById(payload.uuid);
      const {
        services,
        prices,
        messages,
        days,
        itinerary: newItineraryData,
      } = response.data;
      services[0].itinerary = payload.uuid;
      prices[0].itinerary = payload.uuid;
      itinerary.data.start_date = newItineraryData.start_date;
      itinerary.data.end_date = newItineraryData.end_date;
      itinerary.data.num_day = newItineraryData.num_day;
      itinerary.data.version = newItineraryData.version;
      itinerary.data.stable_version = newItineraryData.stable_version;
      commit("SET_ITINERARY_DATA", itinerary);
      dispatch(
        "udpateFormItinerary",
        helpers.adaptItineraryToFormItinerary(newItineraryData)
      );

      dispatch("setItineraryServicesAndRelatedState", services);

      dispatch("updatePricesData", prices);

      dispatch("setItineraryServicesAffected", {
        services: messages,
        accumulate: payload.accumulateHighlight,
      });

      dispatch("itineraryDays/setItineraryDays", days, { root: true });

      if (response.data.messages?.length && response.data.messages[0].service) {
        commit(
          "SET_ITINERARY_SERVICE_RECENTLY_ADDED",
          response.data.messages[0].service
        );
      }
    }
    commit("utils/SET_REQUEST_IN_PROGRESS", "", { root: true });
    return response.data;
  },
  async check_prices({ dispatch }, payload) {
    const response = await itinerary.check_prices(payload);
    const data = response.data;
    if (response && response.status === 200 && data !== undefined) {
      dispatch("updatePricesData", data.prices);
    }
  },
  async list_services({ commit, getters, dispatch }, payload) {
    const services = getters.getServicesItinerary;
    if (services && services.length > 0 && !payload.reload) {
      const servicesExpanded = services?.reduce((acc, service) => {
        return service.isGrouped
          ? [...acc, ...service.servicesRelated]
          : [...acc, service];
      }, []);
      dispatch("setItineraryServicesAndRelatedState", servicesExpanded);
    } else {
      commit("utils/SET_LOADING", true, { root: true });
      const response = await itinerary.list_services(payload);
      if (response && response.status === 200) {
        dispatch("setItineraryServicesAndRelatedState", response.data);
        commit("utils/SET_LOADING", false, { root: true });
      }
      return response;
    }
  },
  setItineraryServicesAndRelatedState({ commit, getters }, payload) {
    if (Array.isArray(payload)) {
      const itinerary = getters.getItinerary.data;
      const servicesWithIsPriceEditedField =
        serviceHelper.getServicesWithIsPriceEditedField(payload);
      const groupedServices = serviceHelper.groupServicesRoomsByServiceId(
        itinerary,
        servicesWithIsPriceEditedField
      );
      const servicesWithLevelText =
        serviceHelper.getServicesWithLevelText(groupedServices);
      commit("SET_SERVICES_ITINERARIES_DATA", servicesWithLevelText);
      commit("SET_INITIAL_SERVICES_ITINERARY", servicesWithLevelText);
      commit("SET_BOOLEAN_VALUE_TO_VISIBLE_KEY", servicesWithLevelText);
    }
  },
  setItineraryStatusAndRelatedState({ commit, dispatch }, payload) {
    commit("SET_ITINERARY_STATUS", payload);
    dispatch("setDisableQuoteByCondition", payload);
  },
  setDisableQuoteByCondition({ commit }, payload) {
    commit(
      "SET_DISABLE_QUOTE_BY_STATUS",
      ITINERARY_STATUS_TO_DISABLE_QUOTE.includes(payload)
    );
  },
  setHideElementByCondition({ commit }, payload) {
    const isHistoryMode = window.location.pathname.includes(
      PATH_INFO.HISTORY.path
    );
    if (isHistoryMode) {
      const iconUrl = "/favicon_history.svg";
      const link = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = iconUrl;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = iconUrl;
        document.head.appendChild(newLink);
      }
    }
    commit(
      "SET_HIDE_ELEMENT_BY_CONDITION",
      ITINERARY_STATUS_TO_HIDE_ACTIONS.includes(payload) || isHistoryMode
    );
  },
  setGroupedServicesItinerary({ commit, getters }, payload) {
    if (Array.isArray(payload)) {
      commit("SET_SERVICES_ITINERARIES_DATA", payload);
    }
  },
  async delete_service({ commit, dispatch }, payload) {
    const adaptedPayload = {
      data: {
        id: payload.id,
        itinerary: payload.itinerary,
      },
      params: {
        ...payload,
      },
    };
    const response = await itinerary.delete_service(adaptedPayload);
    const data = response.data;

    dispatch("setItineraryServicesAndRelatedState", data.services);

    dispatch("updatePricesData", data.prices);

    dispatch("setItineraryServicesAffected", {
      services: data.messages,
      accumulate: payload.accumulateHighlight || false,
    });
    return data;
  },
  async replace_service({ commit, dispatch }, payload) {
    try {
      const response = await itinerary.replace_service(payload);
      if (response && response.status === RESPONSE_STATUS.OK) {
        dispatch("setItineraryServicesAndRelatedState", response.data.services);

        dispatch("updatePricesData", response.data.prices);

        dispatch("setItineraryServicesAffected", {
          services: response.data.messages,
        });
      }
      return response;
    } catch (error) {
      throw error;
    }
  },
  async duplicate_service({ commit, dispatch }, payload) {
    const adaptedPayload = {
      data: {
        id: payload.id,
        services: payload.services,
      },
      params: {
        ...payload,
      },
    };
    const response = await itinerary.duplicate_service(adaptedPayload);
    const data = response.data;

    dispatch("setItineraryServicesAndRelatedState", data.services);

    dispatch("updatePricesData", data.prices);

    dispatch("setItineraryServicesAffected", { services: data.messages });

    dispatch("itineraryDays/setItineraryDays", data.days, {
      root: true,
    });

    return data;
  },
  async save_passenger({ commit, dispatch }, payload) {
    const response = await itinerary.save_passenger(payload);

    commit("SET_PASSENGERS_ITINERARIES_DATA", response.data.passengers);
    dispatch("updatePricesData", response.data.prices);

    return response.data;
  },
  async get_passengers({ commit, getters }, payload) {
    const response = await itinerary.get_passengers(payload);
    return response.data;
  },
  async change_status_service({ commit }, payload) {
    const response = await itinerary.change_status_service(payload);
    return response.data;
  },
  async list_prices({ getters, dispatch }, { uuid, reload = false }) {
    if (uuid === undefined || uuid === null) return;
    try {
      const prices = getters.getPricesItineraries;
      if (!prices.length || reload) {
        const response = await itinerary.list_prices(uuid);
        if (
          response &&
          response.status === 200 &&
          response.data[0] !== undefined
        ) {
          dispatch("updatePricesData", response.data);
        }
      }
    } catch (err) {
      dispatch("updatePricesData", []);
      console.info(err);
      throw err;
    }
  },
  async add_prices({ commit }, payload) {
    const response = await itinerary.add_prices(payload.form, payload.uuid);
    return response.data;
  },
  async check_version({ commit, dispatch }, payload = {}) {
    if (payload.cur_step === payload.last_step) {
      const urlParams = new URLSearchParams(window.location.search);
      const uuid = urlParams.get("itinerary");
      if (uuid) {
        dispatch("read", {
          uuid: uuid,
          force: true,
        });
      }
    }
  },
  async savePaxPrices({ commit, dispatch }, payload) {
    try {
      const response = await itinerary.savePaxPrices(payload);
      if (response.status === 200 && response.data) {
        commit("SET_PAX_PRICES", response.data);
        dispatch("check_version", payload);
        return response.data;
      }
    } catch (err) {
      console.warn("Fetch pax prices error:", err);
      throw err;
    }
  },
  resetPaxPrices({ commit }) {
    commit("SET_PAX_PRICES", []);
    commit("SET_PRICES_ITINERARIES_DATA", []);
    commit("SET_PRICES_ITINERARIES_DATA_SOURCE", []);
  },
  async list_passengers({ commit, getters }, { uuid, reload = false }) {
    try {
      const passengers = getters.getPassengersItineraries;
      if (
        (passengers &&
          passengers.length > 0 &&
          passengers[0].itinerary === uuid &&
          !reload) ||
        passengers?.status === REQUEST_STATUS.FETCHING
      ) {
        commit("SET_PASSENGERS_ITINERARIES_DATA", passengers);
        return passengers;
      } else {
        commit("SET_PASSENGERS_ITINERARIES_DATA", {
          status: REQUEST_STATUS.FETCHING,
        });
        const response = await itinerary.list_passengers(uuid);
        const paxPricesMapped = helpers.mapPaxsPricesAndPassengers(
          getters.getPaxPrices,
          response.data.data
        );
        commit("SET_PAX_PRICES", paxPricesMapped);
        if (
          response &&
          response.status === 200 &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          response.data.data[0].itinerary = uuid;
          commit("SET_PASSENGERS_ITINERARIES_DATA", response.data.data);
          return response.data.data;
        } else {
          commit("SET_PASSENGERS_ITINERARIES_DATA", []);
        }
      }
    } catch (err) {
      commit("SET_PASSENGERS_ITINERARIES_DATA", []);
      console.info(err);
    }
  },
  async publish({ commit, dispatch }, payload) {
    const response = await itinerary.publish(payload);
    dispatch("check_version", payload);
    return response.data;
  },
  async publishConfigAndImages({ commit, dispatch }, payload) {
    const response = await itinerary.publishConfigAndImages(payload);
    commit("SET_PUBLISHED_IMAGES_ITINERARY_DATA", response.data);
    dispatch("check_version", payload);
    return response.data;
  },
  async getPublishedConfigAndImages({ dispatch }, payload) {
    const response = await itinerary.getPublishedConfigAndImages(payload);
    if (response && response.status === 200) {
      dispatch("setItineraryPublishedAndRelatedData", response.data);
    }
  },
  setItineraryPublishedAndRelatedData({ commit, getters }, data) {
    commit("SET_PUBLISHED_IMAGES_ITINERARY_DATA", data);
  },
  async getWebTemplates({ commit, getters, rootGetters }) {
    const webTemplates = getters.getWebTemplates;
    if (webTemplates.length > 0) {
      commit("SET_WEB_TEMPLATES_DATA", webTemplates);
    } else {
      const webTemplates = await itinerary.getWebTemplates();
      const currentAuthData = rootGetters["auth/getAuthData"];
      const hasViewSaasElaTemplatesPermission = !globalHelper.hasAnyRoles(
        currentAuthData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
      const filteredWebTemplates = webTemplates.filter((webTemplate) => {
        if (hasViewSaasElaTemplatesPermission) return webTemplate;
        if (webTemplate.id === TEMPLATES.WHITELABEL.id) return webTemplate;
        return ![TEMPLATES.SAAS.id, TEMPLATES.ELA.id].includes(webTemplate.id);
      });
      commit("SET_WEB_TEMPLATES_DATA", filteredWebTemplates);
      return webTemplates;
    }
  },
  async send_notification({ commit }, payload) {
    const response = await itinerary.send_notification(payload);
    return response.data;
  },
  updateItineraryData({ commit, getters, dispatch }, payload) {
    const currentItineraryData = getters.getItinerary;
    commit("SET_ITINERARY_DATA", {
      ...currentItineraryData,
      data: { ...payload },
    });
    dispatch(
      "udpateFormItinerary",
      helpers.adaptItineraryToFormItinerary(payload)
    );
  },
  async moveItineraryServices({ commit, dispatch }, payload) {
    const response = await itinerary.move_services(payload);
    if (response && response.status === RESPONSE_STATUS.OK) {
      dispatch("updateItineraryData", response.data.itinerary);

      dispatch("setItineraryServicesAndRelatedState", response.data.services);

      dispatch("updatePricesData", response.data.prices);
    }
    return response.data;
  },
  async moveServices({ dispatch }, payload) {
    const {
      itinerary,
      services,
      sm,
      reverting = false,
      num_pax = 0,
      calculate_room_distribution = 0,
      calculate_prices = 0,
      daysToMove = 0,
      day_date = null,
      cur_step = 0,
      last_step = 0,
    } = payload;

    await dispatch(
      "utils/setLoadingText",
      "We are updating the Service List with prices, please wait...",
      { root: true }
    );

    const servicesToUpdate = services.filter((service) => !service.delete);
    const servicesToDelete = services.filter((service) => service.delete);

    const serviceUUIDs = servicesToUpdate.map((service) => service.id);
    let chunks = globalHelper.sliceIntoChunks(
      serviceUUIDs,
      MAX_PROCESS_SERVICES
    );

    if (reverting) {
      chunks = chunks.reverse();
    }

    await Promise.allSettled(
      servicesToDelete.map(async (service) => {
        return await dispatch("delete_service", {
          id: service.id,
          itinerary: itinerary,
        });
      })
    );

    let updatedServices = [];

    for (const uuids of chunks) {
      const index = chunks.indexOf(uuids);

      const { progressValue, progressText, displayProgress } =
        serviceHelper.getProgressBarInfoWhenMovingServices(
          index,
          chunks.length,
          chunks.flatMap((subArray) => subArray).length
        );

      await dispatch(
        "utils/setDisplayLoadingProgress",
        {
          display: displayProgress,
          progress: progressValue,
          text: progressText,
        },
        { root: true }
      );

      const response = await dispatch("moveItineraryServices", {
        uuid: itinerary,
        calculate_prices,
        num_pax,
        calculate_room_distribution,
        sm,
        data: {
          days_to_move: daysToMove,
          services: uuids,
          last_batch: index === chunks.length - 1,
        },
        cur_step: cur_step + index,
        last_step,
      });

      updatedServices = response.services;
    }

    const moved_date =
      day_date ??
      servicesToUpdate.reduce((acc, service) => {
        if (acc) {
          if (service.start_date.localeCompare(acc) > 0) return acc;
        }
        return service.start_date;
      }, null);

    if (moved_date) {
      await dispatch(
        "utils/setLoadingText",
        "We are updating the Day List, please wait...",
        { root: true }
      );

      await dispatch(
        "itineraryDays/moveItineraryDays",
        {
          id: itinerary,
          moved_date: moved_date,
          days_to_move: daysToMove,
          cur_step: cur_step + chunks.length,
          last_step: last_step,
        },
        { root: true }
      );
    }

    await dispatch(
      "utils/setDisplayLoadingProgress",
      { display: false },
      { root: true }
    );

    return {
      updatedServices,
    };
  },
  async exportToExternal({ commit, getters, dispatch }, payload) {
    const response = await itinerary.exportToExternal(payload);
    if (response && response.status === RESPONSE_STATUS.OK) {
      dispatch("setExportingData", {
        exporting: [payload.itineraryId],
      });
    }
    return response.data;
  },
  async listItineraryDestinations({ commit, getters }, payload) {
    const response = await itinerary.listItineraryDestinations(payload);
    if (response && response.status === RESPONSE_STATUS.OK) {
      commit("SET_ITINERARY_DESTINATIONS", response.data);
    }
    return response.data;
  },
  async getServiceHistory({ commit, getters }, payload) {
    const currentItinerary = getters.getItinerary;
    const response = await itinerary.getServiceHistory({
      itineraryId: currentItinerary?.data?.id,
      ...payload,
    });
    if (response && response.status === RESPONSE_STATUS.OK) {
      const accumulate = payload.accumulate || false;
      const pastServiceHistory = getters.getServiceHistory;
      const newServiceHistory = {
        ...response.data,
        data: accumulate
          ? [...pastServiceHistory.data, ...response.data.data]
          : response.data.data,
      };
      commit("SET_SERVICE_HISTORY", newServiceHistory);
    }
    return response.data;
  },
  async getItineraryHistory({ commit, getters }, payload) {
    const currentItinerary = getters.getItinerary;
    const response = await itinerary.getItineraryHistory({
      itineraryId: currentItinerary?.data?.id,
      ...payload,
    });
    if (response && response.status === RESPONSE_STATUS.OK) {
      const accumulate = payload?.accumulate || false;
      const pastItineraryHistory = getters.getItineraryHistory;
      const newItineraryHistory = {
        ...response.data,
        data: accumulate
          ? [...pastItineraryHistory.data, ...response.data.data]
          : response.data.data,
      };
      commit("SET_ITINERARY_HISTORY", newItineraryHistory);
    }
    return response.data;
  },
  async importService({ commit }, payload) {
    const response = await itinerary.importService(payload);
    return response.data;
  },
  async updateQuoteServices({ dispatch, getters }, payload) {
    return await dispatch(
      "utils/validateFunctionExecution",
      {
        functionToExecute: async () => {
          const itinerary = getters.getItinerary;
          const currentQuoteServices = payload.services;
          const serviceUUIDs = currentQuoteServices.map(
            (service) => service.id
          );
          let chunks = globalHelper.sliceIntoChunks(
            serviceUUIDs,
            MAX_PROCESS_SERVICES
          );
          const TOTAL_STEPS_TO_PERFORM = chunks.length + 1;

          await dispatch("moveServices", {
            itinerary: itinerary.data.id,
            services: currentQuoteServices,
            cur_step: 1,
            last_step: TOTAL_STEPS_TO_PERFORM,
            calculate_prices: payload.calculate_prices,
          });

          await dispatch("utils/setLoading", false, { root: true });
        },
        functionToExecuteOnFail: async (error) => {
          console.info(error);
          await dispatch("utils/setLoading", false, { root: true });
          return error;
        },
      },
      { root: true }
    );
  },
  async generateItineraryPricesMatrix({ commit }, payload) {
    const response = await itinerary.generateItineraryPricesMatrix(payload);
    if (response.status && response.status === RESPONSE_STATUS.OK) {
      commit("SET_ITINERARY_PRICES_MATRIX", [
        {
          data: response.data,
        },
      ]);
    }
    return response.data;
  },
  async getItineraryPricesMatrix({ commit }, payload) {
    const response = await itinerary.getItineraryPricesMatrix(payload);
    if (response.status && response.status === RESPONSE_STATUS.OK) {
      commit("SET_ITINERARY_PRICES_MATRIX", response.data);
    }
    return response.data;
  },
  async generateCode({ getters, dispatch }) {
    const formItinerary = getters.getFormItinerary;
    if (!formItinerary[0].id) {
      await dispatch("utils/setLoading", true, { root: true });

      const clientId = formItinerary[0].client_id;

      const prefix = `I${clientId < 9 ? `0${clientId}` : clientId}`;

      const startTime = new Date("2022-09-27 00:00:00").getTime();
      const finishTime = new Date().getTime();

      let time = (finishTime - startTime) / 1000;
      let result = "";

      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const charactersLength = characters.length;
      while (time > 0) {
        result += characters.charAt(time % charactersLength);
        time = Math.floor(time / charactersLength);
      }

      await dispatch("utils/setLoading", false, { root: true });

      dispatch("udpateFormItineraryByKey", {
        key: "code",
        value: `${prefix}-${result}`,
      });
    }
  },
  setNumPax({ commit }, payload) {
    commit("SET_NUM_PAX", payload);
  },
  setRoomPreferableDistribution({ commit }, payload) {
    commit("SET_ROOM_PREFERABLE_DISTRIBUTION", payload);
  },
  setRoomPreferableDistributionJson({ commit }, payload) {
    commit("SET_ROOM_PREFERABLE_DISTRIBUTION_JSON", payload);
  },
  setItineraryUpdatedStatus({ commit }, payload) {
    commit("SET_ITINERARY_UPDATED_STATUS", payload);
  },
  setNewServiceItineraryForm({ commit }, payload) {
    commit("SET_NEW_SERVICE_ITINERARY_FORM", payload);
  },
  setItineraryServiceRecentlyAdded({ commit }, payload) {
    commit("SET_ITINERARY_SERVICE_RECENTLY_ADDED", payload);
  },
  closeQuoteExportFailedAlert({ commit }) {
    commit("SET_QUOTE_EXPORT_FAILED", {
      isOpen: false,
      title: "",
      items: [],
    });
  },
  setQuoteExportFailedAlert({ commit }, payload) {
    commit("SET_QUOTE_EXPORT_FAILED", payload);
  },
  resetCurrentItinerary({ commit, getters, dispatch }) {
    const INITIAL_ITINERARY = {
      id: null,
      title: {
        id: null,
        value: null,
      },
      code: null,
      client_id: null,
      status: ITINERARY_STATUS.QUOTE.value,
      start_date: null,
      end_date: null,
      language_id: 1,
      currency_id: 1,
      num_pax: null,
      description: {
        id: null,
        value: null,
      },
      tags: [],
      location: [],
      quote_creation: new Date(),
      contract_id: null,
      checkboxGroup: false,
      version: 1,
      trip_type: null,
    };
    helper.resetPageTitle();
    commit("SET_ITINERARY_DATA", INITIAL_ITINERARY);
    commit("SET_SERVICES_ITINERARIES_DATA", []);
    commit("SET_INITIAL_SERVICES_ITINERARY", []);
    commit("SET_PASSENGERS_ITINERARIES_DATA", []);
    commit("SET_ITINERARY_PRICES_MATRIX", []);
    commit("SET_NUM_PAX", 1);
    dispatch("updatePricesData", []);
    commit("SET_PUBLISHED_IMAGES_ITINERARY_DATA", {});
    commit("SET_FORM_ITINERARY", DEFAULT_FORM_ITINERARY);
    dispatch("setItineraryStatusAndRelatedState", INITIAL_ITINERARY.status);
  },
  setPageTitle({ getters, rootState }) {
    const itinerary = getters.getItinerary;
    const historyView = rootState.utils.historyView;
    const itineraryTitle = itinerary?.data?.title?.value ?? "";
    const itineraryCode = itinerary?.data?.code ?? "";
    const prefix = historyView?.isActive ? "ITP | HISTORY" : "ITP";
    helper.setPageTitle(`${prefix} | ${itineraryCode} | ${itineraryTitle}`);
  },
  setIsItineraryServicesModified({ commit }, payload = false) {
    commit("SET_ITINERARY_SERVICES_MODIFIED", payload);
  },
  setErrorMessage({ commit }, payload) {
    const newErrorMessage = {
      status: payload.status,
      message: payload.message,
    };
    commit("SET_ERROR_MESSAGE", newErrorMessage);
  },
  setItineraryServicesAffected({ getters, commit, dispatch }, payload = {}) {
    const servicesAffected = payload.services || [];
    const accumulateServicesAffected = payload.accumulate || false;
    if (!accumulateServicesAffected)
      commit("SET_ITINERARY_SERVICES_AFFECTED", []);
    const accumulatedServicesAffected = getters.getItineraryServicesAffected;
    const newServicesAffected = [
      ...accumulatedServicesAffected,
      ...servicesAffected.filter((s) => s.affected),
    ];
    dispatch("setIsItineraryServicesModified", true);
    commit("SET_ITINERARY_SERVICES_AFFECTED", newServicesAffected);
    setTimeout(() => {
      if (!accumulateServicesAffected)
        commit("SET_ITINERARY_SERVICES_AFFECTED", []);
    }, 10000);
  },
  resetItineraryAndRelatedData({ commit, dispatch }) {
    dispatch("itineraryDays/resetItineraryDays", "", { root: true });
    dispatch("resetCurrentItinerary");
    dispatch("resetPaxPrices");
    dispatch("assets/resetAssetsData", "", { root: true });
  },
  setIsRecentlyExported({ commit }, payload) {
    commit("SET_IS_RECENTLY_EXPORTED", payload);
  },
  setExportingData({ commit, getters }, payload) {
    const itinerary = getters.getItinerary;
    commit("SET_ITINERARY_DATA", {
      ...itinerary,
      exporting: payload.exporting,
    });
  },
  setServiceImportingConfirmationModal({ commit }, payload) {
    commit("SET_SERVICE_IMPORTING_CONFIRMATION_MODAL", payload);
  },
  resetServiceImportingConfirmationModal({ commit }) {
    commit("SET_SERVICE_IMPORTING_CONFIRMATION_MODAL", {
      isOpen: false,
      alertContent: {
        title: "",
        message: "",
      },
    });
  },
  postServiceImportingConfirmation({ getters, dispatch }, payload) {
    dispatch("setServiceImportingConfirmationModal", payload);
    const currentItinerary = getters.getItinerary;
    const listServicesPayload = {
      id: currentItinerary.data.id,
      reload: true,
      from: currentItinerary.data.start_date,
      to: currentItinerary.data.end_date,
    };
    dispatch("list_services", listServicesPayload);
  },
  updateEntitiesImportingList({ commit, getters, dispatch }, payload) {
    const currentItineraryData = getters.getItinerary;
    commit("SET_ITINERARY_DATA", {
      ...currentItineraryData,
      ...payload,
    });
    dispatch(
      "udpateFormItinerary",
      helpers.adaptItineraryToFormItinerary(currentItineraryData.data)
    );
  },
};
