import { TEMPLATE_CONFIG_PRICES_LEVELS } from "./exportConfig";

export const SERVICE_ROW_FIELDS = {
  PRICE_UNIT: "price_unit",
  PRICE: "price",
  COST: "cost",
  LEVEL: "level",
  NUM_PAX: "num_pax",
  END_DATE: "end_date",
  START_DATE: "start_date",
  DAY: "day",
  DATES: "dates",
  LOCATION: "location",
  ORDER: "order",
  IS_GROUPED: "isGrouped",
  LEVEL_TEXT: "level_text",
  SELECTED: "selected",
  OPTIONAL: "optional",
  VISIBLE: "visible",
  ACTIONS: "actions",
  NOTES: "notes",
};

export const SERVICE_LEVELS = {
  ALL: {
    id: 0,
    type: "All",
    name: "All",
    id_content: 0,
  },
  SUPERIOR: {
    id: 2,
    type: "Sup",
    name: "Superior",
    id_content: TEMPLATE_CONFIG_PRICES_LEVELS.Superior,
  },
  LUXURY: {
    id: 3,
    type: "Lux",
    name: "Luxury",
    id_content: TEMPLATE_CONFIG_PRICES_LEVELS.Luxury,
  },
  COMFORT: {
    id: 1,
    type: "Com",
    name: "Comfort",
    id_content: TEMPLATE_CONFIG_PRICES_LEVELS.Comfort,
  },
};

export const SERVICE_LEVELS_BY_NAMES = Object.values(SERVICE_LEVELS).reduce(
  (acc, level) => {
    acc[level.name] = level;
    return acc;
  },
  {}
);

export const SERVICE_LOCATION_TYPES = {
  COUNTRY: 0,
};

export const SERVICE_LEVELS_OPTIONS = Object.values(SERVICE_LEVELS);

export const FORM_ITINERARY_SERVICE_DEFAULT = {
  id: null,
  code: null,
  name: {
    id: null,
    value: null,
    translate: null,
  },
  price: 0,
  cost: 0,
  images: null,
  margin: 0,
  percentage_margin: 0,
  status: null,
  num_pax: 0,
  service: null,
  id_service_type: null,
  visible: null,
  end_date: null,
  passengers: null,
  start_date: null,
  service_price: [],
  service_supplier: [],
  price_unit: 0,
  cost_unit: 0,
  level: null,
  description: {
    id: null,
    value: null,
    translate: null,
  },
  recommendations: {
    id: null,
    value: null,
    translate: null,
  },
  check_in: null,
  check_out: null,
  check_in_without_format: null,
  check_out_without_format: null,
  room: null,
};

export const EDIT_SERVICE_SIDEBAR_TABS_IDS = {
  INFO: 0,
  ROOM_TYPES: 1,
  PRICING: 2,
  PAX_ASSIGN: 3,
};

export const EDIT_SERVICE_SIDEBAR_TABS = {
  INFO: {
    id: EDIT_SERVICE_SIDEBAR_TABS_IDS.INFO,
    urlParam: "info",
  },
  ROOM_TYPES: {
    id: EDIT_SERVICE_SIDEBAR_TABS_IDS.ROOM_TYPES,
    urlParam: "room_types",
  },
  PRICING: {
    id: EDIT_SERVICE_SIDEBAR_TABS_IDS.PRICING,
    urlParam: "pricing",
  },
  PAX_ASSIGN: {
    id: EDIT_SERVICE_SIDEBAR_TABS_IDS.PAX_ASSIGN,
    urlParam: "pax_assign",
  },
};

export const SERVICE_OPTIONAL_TYPES = {
  REGULAR: 0,
  OPTIONAL: 1,
  CONFIRMED: 2,
};

export const SERVICE_TAGS_TYPES = {
  TOD: "TOD",
  CAT_AC: "CAT_AC",
};

export const QUOTE_ACTION_TYPES = {
  SAVE_SINGLE_SERVICE: "SAVE_SINGLE_SERVICE",
  SAVE_MULTIPLE_SERVICES: "SAVE_MULTIPLE_SERVICES",
  ADDING_NEW_SERVICE: "ADDING_NEW_SERVICE",
};

export const ROOM_FIELDS = {
  PRICE_UNIT: "fromPriceUnit",
  QTY: "fromQty",
  NEW_PRICE_UNIT: "fromNewPriceUnit",
  FINAL_PRICE: "fromFinalPrice",
  PRICE: "fromPrice",
};
