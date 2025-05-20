import { KEYBOARD_KEYS } from "/src/constants/shortcuts";

export const DATA_TEST_ID_VALUES = {
  NEW_QUOTE_LINK: "new-quote-link",
  NEW_QUOTE_BUTTON: "new-quote-button",
  NEW_QUOTE_BUTTON_SCRATCH: "new-quote-button-scratch",
  NEW_QUOTE_BUTTON_MODULE: "new-quote-button-module",
  NEW_QUOTE_BUTTON_EXPERIENCE: "new-quote-button-experience",
  NEW_QUOTE_BUTTON_EXAMPLE_ITINERARY: "new-quote-button-example-itinerary",
  HOME_QUOTES_TABLE: "home-quotes-table",
  NAVBAR_SECONDARY_LINK: "navbar-secondary-link",
  QUOTES_TABLE: "quotes-table",
  QUOTES_SEARCH_FORM_SEARCH: "quotes-search-form-search",
  QUOTES_SEARCH_FORM_TAGS: "quotes-search-form-tags",
  QUOTES_SEARCH_FORM_TYPE: "quotes-search-form-type",
  QUOTES_SEARCH_FORM_SEARCH_BUTTON: "quotes-search-form-search-button",
  LOAD_MORE_EXPERIENCES_BUTTON: "load-more-experiences-button",
  EXPERIENCES_PAGE: "experiences-page",
  BASIC_INFO_CLIENT_SELECT: "basic-info-client-select",
  BASIC_INFO_PAX_SELECT: "basic-info-pax-select",
  BASIC_INFO_CONTRACT_SELECT: "basic-info-contract-select",
  BASIC_INFO_ROOM_SELECT: "basic-info-room-select",
  BASIC_INFO_ROOM_SELECT_SAVE: "basic-info-room-select-save",
  BASIC_INFO_DATA_FROM_SELECT: "basic-info-data-from-select",
  BASIC_INFO_DATA_TO_SELECT: "basic-info-data-to-select",
  BASIC_INFO_TITLE: "basic-info-title",
  BASIC_INFO_TYPE_SELECT: "basic-info-type-select",
  CREATE_ITINERARY_BUTTON: "create-itinerary-button",
  SERVICES_TABLE: "services-table",
  ADD_SERVICE_BUTTON: "add-service-button",
  QUOTE_ACTIONS_BUTTON: "quote-actions-button",
  SERVICE_ACTIONS_BUTTON: "service-actions-button",
  DELETE_SERVICE_BUTTON: "delete-service-button",
  DUPLICATE_QUOTE_BUTTON: "duplicate-quote-button",
  DUPLICATE_SERVICE_BUTTON: "duplicate-service-button",
  SELECT_SERVICE_MODAL_SELECT_COUNTRY: "select-service-modal-select-country",
  SELECT_SERVICE_MODAL_SELECT_DESTINATION:
    "select-service-modal-select-destination",
  SELECT_SERVICE_MODAL_SELECT_SERVICE_TYPE:
    "select-service-modal-select-service-type",
  SELECT_SERVICE_MODAL_INPUT_SERVICE_SEARCH:
    "select-service-modal-input-service-search",
  SELECT_SERVICE_BUTTON: "select-service-button",
  CLOSE_MODAL_BUTTON: "close-modal-button",
  SEARCH_SERVICES_BUTTON: "search-services-button",
  SERVICE_LIST: "service-list",
  CONFIRM_SERVICES_TO_ADD_BUTTON: "confirm-services-to-add-button",
  SERVICES_TABLE_PLACEHOLDER: "services-table-placeholder",
  COMFORT_PRICE: "comfort_price",
  SUPERIOR_PRICE: "superior_price",
  LUXURY_PRICE: "luxury_price",
  MAINTAIN_SERVICES_PRICES_CONTROL: "maintain_services_prices_control",
  MOVE_ALL_ITINERARY_SERVICES_BUTTON: "move_all_itinerary_services_button",
  ITINERARY_SERVICE_SIDEBAR: "itinerary_service_sidebar",
  ITINERARY_SERVICE_SIDEBAR_PRICE: "itinerary_service_sidebar_price",
  ITINERARY_SERVICE_SIDEBAR_ROOM_PRICE: "itinerary_service_sidebar_room_price",
  ITINERARY_SERVICE_SIDEBAR_ROOM_PRICE_UNIT:
    "itinerary_service_sidebar_room_price_unit",
  ITINERARY_SERVICE_PRICE: "itinerary_service_price",
  ITINERARY_SERVICE_OPEN_SIDEBAR_BUTTON:
    "itinerary_service_open_sidebar_button",
  ITINERARY_SERVICE_SIDEBAR_SAVE_BUTTON:
    "itinerary_service_sidebar_save_button",
  ITINERARY_DAY: "itinerary-day",
  ITINERARY_DAY_EDIT_BUTTON: "itinerary-day-edit-button",
  ITINERARY_DAY_TITLE_EDIT_CONTROL: "itinerary-day-title-edit",
  ITINERARY_DAY_TITLE_VIEW: "itinerary-day-title-view",
  ITINERARY_DAY_DESCRIPTION_VIEW: "itinerary-day-description-view",
  ITINERARY_DAY_DESCRIPTION_EDIT_CONTROL: "itinerary-day-description-edit",
  ITINERARY_DAY_LOCATION_VIEW: "itinerary-day-location-view",
  ITINERARY_DAY_LOCATION_EDIT_CONTROL: "itinerary-day-location-edit",
  ITINERARY_DAY_PHOTOS_CONTROL: "itinerary-day-photos",
  ITINERARY_DAY_SAVE_BUTTON: "itinerary-day-save-button",
  PHOTOS_GALLERY: "photos-gallery",
  SAVE_PHOTO_BUTTON: "save-photo-button",
  ITINERARY_NUM_DAYS: "itinerary-num-days",
  EX_ITINERARY_CUSTOMIZE_BUTTON: "ex-itinerary-customize-button",
  EX_ITINERARY_CUSTOMIZE_BUTTON_CONFIRM:
    "ex-itinerary-customize-button-confirm",
};

export const SELECT_SERVICE_SHORTCUTS = [
  {
    serviceTypeName: "Accommodation",
    complementKey: {
      value: "a",
      code: KEYBOARD_KEYS.KEY_A,
    },
  },
  {
    serviceTypeName: "Excursion",
    complementKey: {
      value: "x",
      code: KEYBOARD_KEYS.KEY_X,
    },
  },
  {
    serviceTypeName: "Transfer",
    complementKey: {
      value: "t",
      code: KEYBOARD_KEYS.KEY_T,
    },
  },
  {
    serviceTypeName: "Transport",
    complementKey: {
      value: "v",
      code: KEYBOARD_KEYS.KEY_V,
    },
  },
  {
    serviceTypeName: "Entrance",
    complementKey: {
      value: "e",
      code: KEYBOARD_KEYS.KEY_E,
    },
  },
  {
    serviceTypeName: "Guide",
    complementKey: {
      value: "g",
      code: KEYBOARD_KEYS.KEY_G,
    },
  },
  {
    serviceTypeName: "Meals",
    complementKey: {
      value: "m",
      code: KEYBOARD_KEYS.KEY_M,
    },
  },
  {
    serviceTypeName: "Package",
    complementKey: {
      value: "p",
      code: KEYBOARD_KEYS.KEY_P,
    },
  },
  {
    serviceTypeName: "Flight",
    complementKey: {
      value: "f",
      code: KEYBOARD_KEYS.KEY_F,
    },
  },
  {
    serviceTypeName: "Other",
    complementKey: {
      value: "o",
      code: KEYBOARD_KEYS.KEY_O,
    },
  },
];
