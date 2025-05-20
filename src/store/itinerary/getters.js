import { DATE_FORMAT_MMM_DD_YYYY } from "@/constants";
import cloneDeep from "lodash.clonedeep";

export default {
  getFormItinerary(state) {
    return state.formItinerary;
  },
  getSelectedDay(state) {
    return state.selectedDay;
  },
  getToggleReorderList(state) {
    return state.toggleReorderList;
  },
  getItineraries(state) {
    return state.itineraries;
  },
  getItinerary(state) {
    return cloneDeep(state.itinerary);
  },
  getItineraryById: (state) => (id) => {
    if (state.itinerary.data && state.itinerary.data.id === id) {
      return cloneDeep(state.itinerary);
    }
    return false;
  },
  getServicesItinerary(state) {
    return state.services_itineraries;
  },
  getInitialServicesItinerary(state) {
    return state.initialServicesItinerary;
  },
  getIsItineraryServicesModified(state) {
    return state.isItineraryServicesModified;
  },
  getServiceHistory(state) {
    return state.serviceHistory;
  },
  getItineraryHistory(state) {
    return state.itineraryHistory;
  },
  getPassengersActiveTab(state) {
    return state.activeTab;
  },
  getPricesItineraries(state) {
    return state.prices_itineraries;
  },
  getPaxPrices(state) {
    return state.paxPrices;
  },
  getPricesItinerariesSource(state) {
    return state.prices_itineraries_source;
  },
  getPassengersItineraries(state) {
    return state.passengers_itineraries;
  },
  getReduceNavbarSecondary(state) {
    return state.reduceNavbarSecondary;
  },
  getPublishedConfigAndImages(state) {
    return state.published_images_config;
  },
  getWebTemplates(state) {
    return state.webTemplates;
  },
  getItineraryStatus(state) {
    return state.itineraryStatus;
  },
  getDisableQuoteByStatus(state) {
    return state.disableQuoteByStatus;
  },
  getHideElementByCondition(state) {
    return state.hideElementByCondition;
  },
  getNumPax(state) {
    return state.numPax;
  },
  getRoomPreferableDistribution(state) {
    return state.roomPreferableDistribution;
  },
  getRoomPreferableDistributionJson(state) {
    return state.roomPreferableDistributionJson;
  },
  getItineraryUpdatedStatus(state) {
    return state.itineraryUpdatedStatus;
  },
  getNewServiceItineraryForm(state) {
    return state.newServiceItineraryForm;
  },
  getItineraryServiceRecentlyAdded(state) {
    return state.itineraryServiceRecentlyAdded;
  },
  getErrorMessage(state) {
    return state.errorMessage;
  },
  getItineraryServicesAffected(state) {
    return state.itineraryServicesAffected;
  },
  getItineraryDestinations(state) {
    return state.itineraryDestinations;
  },
  getDatesFormat(state) {
    return (
      state.itinerary?.data?.client?.configuration?.date_format ||
      DATE_FORMAT_MMM_DD_YYYY
    );
  },
  getIsRecentlyExported(state) {
    return state.isRecentlyExported;
  },
  getServiceImportingConfirmationModal(state) {
    return state.serviceImportingConfirmationModal;
  },
  getFilteredItineraryServicesForExport(state) {
    return state.services_itineraries.filter(
      (itineraryService) => itineraryService.visible
    );
  },
  getItineraryPricesMatrix(state) {
    return state.itineraryPricesMatrix;
  },
  getQuoteExportFailed(state) {
    return state.quoteExportFailed;
  },
};
