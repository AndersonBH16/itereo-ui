import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
import roomPreferableDistributionJson from "@/data/roomPreferableDistribution.json";
import { DEFAULT_FORM_ITINERARY } from "@/constants/itinerary";

const state = {
  selectedDay: null,
  toggleReorderList: false,
  itineraries: [],
  itinerary: {
    exporting: [],

    // check initial itinerary attrs
    id: null,
    title: {
      id: null,
      value: null,
    },
    code: null,
    client_id: null,
    status: 1,
    start_date: null,
    end_date: null,
    language_id: 1,
    currency_id: 1,
    num_pax: null,
    description: {
      id: null,
      value: null,
    },
    location: [],
    quote_creation: new Date(),
    contract_id: null,
    checkboxGroup: false,
    version: 1,
    trip_type: null,
  },
  itineraryStatus: null,
  disableQuoteByStatus: false,
  hideElementByCondition: false,
  services_itineraries: [],
  initialServicesItinerary: [],
  serviceHistory: [],
  itineraryHistory: {
    data: [],
  },
  prices_itineraries: [],
  paxPrices: [],
  prices_itineraries_source: [],
  activeTab: 0,
  passengers_itineraries: [],
  published_images_config: {},
  webTemplates: [],
  reduceNavbarSecondary: false,
  numPax: 1,
  roomPreferableDistribution: [],
  roomPreferableDistributionJson,
  itineraryUpdatedStatus: "",
  newServiceItineraryForm: {},
  itineraryServiceRecentlyAdded: null,
  isItineraryServicesModified: false,
  errorMessage: {
    status: 0,
    message: "",
  },
  formItinerary: DEFAULT_FORM_ITINERARY,
  itineraryServicesAffected: [],
  itineraryDestinations: [],
  isRecentlyExported: false,
  serviceImportingConfirmationModal: {
    isOpen: false,
    alertContent: {
      title: "Service Imported!",
      message: "",
    },
  },
  itineraryPricesMatrix: [],
  quoteExportFailed: {
    isOpen: false,
    title: "",
    items: [],
  },
};

const STATUS_ITINERARY = {
  ID_STATUS_CONFIRM: 4,
  ID_STATUS_CANCELLED: 5,
  ID_STATUS_CLOSED: 6,
};

const itinerary = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  STATUS_ITINERARY,
};

export default itinerary;
