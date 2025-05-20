export default {
  SET_FORM_ITINERARY(state, payload) {
    state.formItinerary = payload;
  },
  SET_SELECTED_DAY(state, payload) {
    state.selectedDay = payload;
  },
  SET_TOGGLE_REORDER_LIST(state, payload) {
    state.toggleReorderList = payload;
  },
  SET_ITINERARIES_DATA(state, payload) {
    state.itineraries = payload;
  },
  SET_ITINERARY_DATA(state, payload) {
    state.itinerary = payload;
  },
  SET_SERVICES_ITINERARIES_DATA(state, payload) {
    state.services_itineraries = payload;
  },
  SET_ITINERARY_SERVICES_MODIFIED(state, payload) {
    state.isItineraryServicesModified = payload;
  },
  SET_INITIAL_SERVICES_ITINERARY(state, payload) {
    state.initialServicesItinerary = payload;
  },
  SET_SERVICE_HISTORY(state, payload) {
    state.serviceHistory = payload;
  },
  SET_ITINERARY_HISTORY(state, payload) {
    state.itineraryHistory = payload;
  },
  SET_ACTIVE_TAB(state, payload) {
    state.activeTab = payload;
  },
  SET_PRICES_ITINERARIES_DATA(state, payload) {
    state.prices_itineraries = payload;
  },
  SET_PAX_PRICES(state, payload) {
    state.paxPrices = payload;
  },
  SET_PRICES_ITINERARIES_DATA_SOURCE(state, payload) {
    state.prices_itineraries_source = payload;
  },
  SET_PASSENGERS_ITINERARIES_DATA(state, payload) {
    state.passengers_itineraries = payload;
  },
  SET_REDUCE_NAVBAR_SECONDARY(state, payload) {
    state.reduceNavbarSecondary = payload;
  },
  SET_PUBLISHED_IMAGES_ITINERARY_DATA(state, payload) {
    state.published_images_config = {
      code: state.published_images_config.code ?? payload.code ?? null,
      ...payload,
    };
  },
  SET_WEB_TEMPLATES_DATA(state, payload) {
    state.webTemplates = payload;
  },
  SET_ITINERARY_STATUS(state, payload) {
    state.itineraryStatus = payload;
  },
  SET_DISABLE_QUOTE_BY_STATUS(state, payload) {
    state.disableQuoteByStatus = payload;
  },
  SET_HIDE_ELEMENT_BY_CONDITION(state, payload) {
    state.hideElementByCondition = payload;
  },
  SET_NUM_PAX(state, payload) {
    state.numPax = payload;
  },
  SET_ROOM_PREFERABLE_DISTRIBUTION(state, payload) {
    state.roomPreferableDistribution = payload;
  },
  SET_ROOM_PREFERABLE_DISTRIBUTION_JSON(state, payload) {
    state.roomPreferableDistributionJson = payload;
  },
  SET_ITINERARY_UPDATED_STATUS(state, payload) {
    state.itineraryUpdatedStatus = payload;
  },
  SET_NEW_SERVICE_ITINERARY_FORM(state, payload) {
    state.newServiceItineraryForm = payload;
  },
  SET_ITINERARY_SERVICE_RECENTLY_ADDED(state, payload) {
    state.itineraryServiceRecentlyAdded = payload;
  },
  SET_BOOLEAN_VALUE_TO_VISIBLE_KEY(state, payload) {
    if (payload && payload.length) {
      payload.forEach((service) => {
        service.visible = isNaN(service.visible)
          ? service.visible
          : Boolean(service.visible);
      });
    }
    state.services_itineraries = payload;
  },
  SET_ERROR_MESSAGE(state, data) {
    state.errorMessage = data;
  },
  SET_ITINERARY_SERVICES_AFFECTED(state, payload) {
    state.itineraryServicesAffected = payload;
  },
  SET_ITINERARY_DESTINATIONS(state, payload) {
    state.itineraryDestinations = payload;
  },
  SET_IS_RECENTLY_EXPORTED(state, payload) {
    state.isRecentlyExported = payload;
  },
  SET_SERVICE_IMPORTING_CONFIRMATION_MODAL(state, payload) {
    state.serviceImportingConfirmationModal = payload;
  },
  SET_ITINERARY_PRICES_MATRIX(state, payload) {
    state.itineraryPricesMatrix = payload;
  },
  SET_QUOTE_EXPORT_FAILED(state, payload) {
    state.quoteExportFailed = payload;
  },
};
