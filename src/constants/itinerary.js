export const EXAMPLE_TYPE_ITINERARY = 2;

export const TYPE = {
  NORMAL: 1,
};

export const UPDATE_MODULES_ACTION_TYPE = {
  UPDATE_ITINERARY_DAYS: "UPDATE_ITINERARY_DAYS",
  UPDATE_BLOCKED_SERVICES: "UPDATE_BLOCKED_SERVICES",
};

export const ITINERARY_STATUS_OPTIONS = {
  QUOTE: {
    id: 1,
    text: "In Preparation",
  },
  CANCEL: {
    id: 3,
    text: "Rejected",
  },
  CONFIRM: {
    id: 2,
    text: "Confirmed",
  },
  SENT: {
    id: 4,
    text: "Sent",
  },
};

export const ITINERARY_STATUS = {
  QUOTE: {
    value: 1,
    name: "Quote",
    alertText:
      "You are changing the itinerary status from SENT to In Preparation, this action will unlock the services prices",
  },
  CANCEL: {
    value: 3,
    text: "Pending",
  },
  CONFIRM: {
    value: 2,
    text: "Confirm",
  },
  SENT: {
    value: 4,
    text: "Sales Quote Sent",
    alertText:
      "You are changing the itinerary status from In Preparation to Sent, this action will lock the services prices",
  },
};

export const ITINERARY_STATUS_BY_ID = Object.values(ITINERARY_STATUS).reduce(
  (acc, status) => {
    acc[status.value] = status;
    return acc;
  },
  {}
);

export const ITINERARY_STATUS_TO_DISABLE_QUOTE = [
  ITINERARY_STATUS.CANCEL.value,
  ITINERARY_STATUS.CONFIRM.value,
  ITINERARY_STATUS.SENT.value,
];

export const ITINERARY_STATUS_TO_HIDE_ACTIONS = [
  ITINERARY_STATUS.CONFIRM.value,
];

export const ITINERARY_STATUS_TO_PUBLISH_QUOTE = [
  ITINERARY_STATUS.CONFIRM.value,
  ITINERARY_STATUS.SENT.value,
];

export const ITINERARY_TYPES = {
  NO_TEMPLATE: {
    id: 1,
    name: "Quote",
    type: "quote",
  },
  TEMPLATE: {
    id: 2,
    name: "Ex. Itinerary",
    type: "ex-itinerary",
  },
  MODULE: {
    id: 3,
    name: "Module",
    type: "module",
  },
  EXPERIENCE: {
    id: 4,
    name: "Experience",
    type: "experience",
  },
};

export const DEFAULT_FORM_ITINERARY = [
  {
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
    itinerary_type_id: "",
    trip_type: null,
    num_day: null,
    room_preferable_dist: [],
  },
];

export const QUOTES_FILTERS = {
  STATUS: "status",
  CREATION: "creation",
  FROM: "from",
  TO: "to",
  CODE: "code",
  TITLE: "title",
  CLIENT: "client",
  DESTINATION: "destination",
  COUNTRY: "country",
  ITINERARY_TYPE_ID: "itinerary_type_id",
};

export const DEFAULT_SEARCH_QUOTES_PAYLOAD = {
  code: [],
  client: null,
  title: [],
  country: null,
  location: null,
  from: null,
  to: null,
  creation: null,
  status: 0,
  page: 1,
  limit: 10,
  tags: [],
  itinerary_type_id: ITINERARY_TYPES.NO_TEMPLATE.id,
};

export const QUOTE_TABLE_FIELDS = {
  CODE: "code",
  CLIENT: "client",
  TITLE: "title",
  COUNTRY: "country",
  LOCATION: "location",
  FROM: "from",
  TO: "to",
  CREATION: "creation",
  STATUS: "status",
  ACTIONS: "actions",
};

export const DESTINATIONS_WITH_FIXED_IMAGES = [
  {
    id: 183,
    countryName: "Peru",
    asset:
      "https://cdn.itereo.net/tenancy/tenantela/thumbnails/PE/PE-MFT/1200X725/mapi_thumbnail_1200X725.jpeg",
  },
  {
    id: 61,
    countryName: "Costa Rica",
    asset:
      "https://cdn.itereo.net/tenancy/tenantela/thumbnails/CR/CR-MVR/1200X725/monteverde2_thumbnail_1200X725.jpeg",
  },
  {
    id: 35,
    countryName: "Bolivia",
    asset:
      "https://cdn.itereo.net/tenancy/tenantela/thumbnails/BO/BO-UYU/1200X725/Uyuni%20Bolivia_thumbnail_1200X725.jpeg",
  },
  {
    id: 72,
    countryName: "Ecuador",
    asset:
      "https://cdn.itereo.net/tenancy/tenantela/thumbnails/EC/EC-AYO/1200X725/seymour-full-day-wlight-lunch-on-board-sczjpg_thumbnail_1200X725.jpeg",
  },
  {
    id: 19,
    countryName: "Argentina",
    asset:
      "https://cdn.itereo.net/tenancy/tenantela/thumbnails/AR/AR-BRC/1200X725/horse-riding-bariloche_thumbnail_1200X725.jpeg",
  },
  {
    id: 39,
    countryName: "Brazil",
    asset:
      "https://cdn.itereo.net/tenancy/tenantela/thumbnails/BR/BR-IGU/1200X725/17-cataratas-lado-brasileiro-824601_thumbnail_1200X725.jpeg",
  },
  {
    id: 52,
    countryName: "Chile",
    asset:
      "https://cdn.itereo.net/tenancy/tenantela/thumbnails/CL/CL-TDP/1200X725/torres-del-paine-chile_thumbnail_1200X725.jpeg",
  },
  {
    id: 56,
    countryName: "Colombia",
    asset:
      "https://cdn.itereo.net/tenancy/tenantela/assets/CO/CO-CTG/cartagena-26jpg.jpeg",
  },
];

export const LANGUAGES_CODES = {
  EN: "EN",
  NL: "NL",
  DE: "DE",
};

export const QUOTES_SEARCH_PARAM_SEPARATOR_INTERSECTION = "*";
export const QUOTES_SEARCH_PARAM_SEPARATOR = "|";

// export const REQUEST_STAGES_IDS = {
//   NEW: 1,
//   IN_PROGRESS: 2,
//   WAITING_RESPONSE: 3,
//   NEGOTIATION: 4,
//   WON: 5,
//   LOST: 6,
//   CANCELLED: 7,
// }

// export const REQUEST_STAGES = {
//   NEW: {
//     id: REQUEST_STAGES_IDS.NEW,
//     name: "New",
//     acronym: "N",
//     color: "#FFFFFF"
//   },
//   IN_PROGRESS: {
//     id: REQUEST_STAGES_IDS.IN_PROGRESS,
//     name: "In Progress",
//     acronym: "I",
//     color: "#FFF698"
//   },
//   WAITING_RESPONSE: {
//     id: REQUEST_STAGES_IDS.WAITING_RESPONSE,
//     name: "Waiting Response",
//     acronym: "WR",
//     color: "#ADE4FF"
//   },
//   NEGOTIATION: {
//     id: REQUEST_STAGES_IDS.NEGOTIATION,
//     name: "Negotiation",
//     acronym: "N",
//     color: "#FFCF97"
//   },
//   WON: {
//     id: REQUEST_STAGES_IDS.WON,
//     name: "Won",
//     acronym: "W",
//     color: "#8ED793"
//   },
//   LOST: {
//     id: REQUEST_STAGES_IDS.LOST,
//     name: "Lost",
//     acronym: "L",
//     color: "#C5C5C5"
//   },
//   CANCELLED: {
//     id: REQUEST_STAGES_IDS.CANCELLED,
//     name: "Cancelled",
//     acronym: "C",
//     color: "#F29E9E"
//   },
// }

export const REQUEST_STAGES = {
  IN_PREPARATION: {
    id: 1,
    name: "In Preparation",
    acronym: "I",
    color: "#FFF698",
  },
  SENT: {
    id: 2,
    name: "Sent",
    acronym: "S",
    color: "#ADE4FF",
  },
  NEGOTIATION: {
    id: 5,
    name: "Negotiation",
    acronym: "N",
    color: "#FFCF97",
  },
  WON: {
    id: 3,
    name: "Won",
    acronym: "W",
    color: "#8ED793",
  },
  LOST: {
    id: 4,
    name: "Lost",
    acronym: "L",
    color: "#F29E9E",
  },
};

export const REQUEST_STAGES_ARRAY = Object.values(REQUEST_STAGES);

export const QUOTES_STATUS = {
  IN_PREPARATION: {
    id: 1,
    name: "In Preparation",
    acronym: "I",
    color: "#FFF698",
  },
  SENT: {
    id: 4,
    name: "Sent",
    acronym: "S",
    color: "#ADE4FF",
  },
  CONFIRMED: {
    id: 2,
    name: "Confirmed",
    acronym: "C",
    color: "#8ED793",
  },
  REJECTED: {
    id: 3,
    name: "Rejected",
    acronym: "R",
    color: "#F29E9E",
  },
};
