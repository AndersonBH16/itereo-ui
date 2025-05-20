export const PATH = {
  BASIC_INFO: "/basic-info",
  SERVICES: "/services",
  ITINERARY: "/itinerary",
  EXPORT: "/export",
  BOOK: "/book",
  PAX_INFO: "/pax-info",
  ITINERARIES_OLD: "/itineraries",
  ITINERARIES: "/ex-itineraries",
  EXPERIENCES: "/experiences",
  NOT_FOUND: "/404",
  HOME: "/home",
  QUOTE: "/quote",
  HISTORY: "/history",
  HISTORY_QUOTE: "/history/quote",
  QUOTES: "/quotes",
  PROFILE: "/profile",
  REPORTS: "/reports",
  CONFIGURATION: "/configuration",
  LOGIN: "/",
  SIGN_UP: "/signup",
  SEND_RESET_PASSWORD: "/send-reset-password",
  RESET_PASSWORD: "/reset-password",
  REQUESTS: "/requests",
};

export const PATH_INFO = {
  SEND_RESET_PASSWORD: {
    path: PATH.SEND_RESET_PASSWORD,
    name: "Send resetPassword",
  },
  RESET_PASSWORD: {
    path: PATH.RESET_PASSWORD,
    name: "resetPassword",
  },
  LOGIN: {
    path: PATH.LOGIN,
    name: "login",
  },
  SIGN_UP: {
    path: PATH.SIGN_UP,
    name: "SignUp",
  },
  HOME: {
    path: PATH.HOME,
    name: "home",
  },
  QUOTES: {
    path: PATH.QUOTES,
    name: "Quotes",
  },
  QUOTE: {
    path: PATH.QUOTE,
    name: "Quote",
  },
  HISTORY: {
    path: PATH.HISTORY_QUOTE,
    name: "History",
  },
  PROFILE: {
    path: PATH.PROFILE,
    name: "Profile",
  },
  REPORTS: {
    path: PATH.REPORTS,
    name: "Reports",
  },
  HISTORY_BASIC_INFO: {
    childrenPath: PATH.BASIC_INFO.slice(1),
    path: `${PATH.HISTORY_QUOTE}${PATH.BASIC_INFO}`,
    name: "History Quote Basic Information",
  },
  HISTORY_SERVICES: {
    childrenPath: PATH.SERVICES.slice(1),
    path: `${PATH.HISTORY_QUOTE}${PATH.SERVICES}`,
    name: "History Quote Services",
  },
  HISTORY_ITINERARY: {
    childrenPath: PATH.ITINERARY.slice(1),
    path: `${PATH.HISTORY_QUOTE}${PATH.ITINERARY}`,
    name: "History Quote Itinerary",
  },
  HISTORY_EXPORT: {
    childrenPath: PATH.EXPORT.slice(1),
    path: `${PATH.HISTORY_QUOTE}${PATH.EXPORT}`,
    name: "History Quote Export",
  },
  HISTORY_PAX_INFO: {
    childrenPath: PATH.PAX_INFO.slice(1),
    path: `${PATH.HISTORY_QUOTE}${PATH.PAX_INFO}`,
    name: "History Quote Pax Information",
  },
  BASIC_INFO: {
    childrenPath: PATH.BASIC_INFO.slice(1),
    path: `${PATH.QUOTE}${PATH.BASIC_INFO}`,
    name: "Quote Basic Information",
  },
  SERVICES: {
    childrenPath: PATH.SERVICES.slice(1),
    path: `${PATH.QUOTE}${PATH.SERVICES}`,
    name: "Quote Services",
  },
  ITINERARY: {
    childrenPath: PATH.ITINERARY.slice(1),
    path: `${PATH.QUOTE}${PATH.ITINERARY}`,
    name: "Quote Itinerary",
  },
  EXPORT: {
    childrenPath: PATH.EXPORT.slice(1),
    path: `${PATH.QUOTE}${PATH.EXPORT}`,
    name: "Quote Export",
  },
  BOOK: {
    childrenPath: PATH.BOOK.slice(1),
    path: `${PATH.QUOTE}${PATH.BOOK}`,
    name: "Quote Book",
  },
  PAX_INFO: {
    childrenPath: PATH.PAX_INFO.slice(1),
    path: `${PATH.QUOTE}${PATH.PAX_INFO}`,
    name: "Quote Pax Information",
  },
  ITINERARIES_OLD: {
    path: PATH.ITINERARIES_OLD,
    name: "Ex. Itineraries Old",
  },
  ITINERARIES: {
    path: PATH.ITINERARIES,
    name: "Ex. Itineraries",
  },
  EXPERIENCES: {
    path: PATH.EXPERIENCES,
    name: "Experiences",
  },
  REQUESTS: {
    path: PATH.REQUESTS,
    name: "Requests",
  },
  REQUESTS_CREATION: {
    path: `/request-creation`,
    name: "Request Creation",
  },
  ITINERARIES_BY_DESTINATION_OLD: {
    path: `${PATH.ITINERARIES_OLD}/:destination`,
    name: "Itineraries by destination Old",
  },
  ITINERARIES_BY_DESTINATION: {
    path: `${PATH.ITINERARIES}/:destination`,
    name: "Itineraries by destination",
  },
  NOT_FOUND: {
    path: PATH.NOT_FOUND,
    name: "Not Found",
  },
  CONFIGURATION: {
    path: PATH.CONFIGURATION,
    name: "Configuration",
  },
};

export const QUOTE_SUB_ROUTES = [
  PATH_INFO.BASIC_INFO.path,
  PATH_INFO.SERVICES.path,
  PATH_INFO.ITINERARY.path,
  PATH_INFO.EXPORT.path,
  PATH_INFO.BOOK.path,
  PATH_INFO.PAX_INFO.path,
];

export const OLD_QUOTE_SUB_ROUTES = [
  PATH.BASIC_INFO,
  PATH.SERVICES,
  PATH.ITINERARY,
  PATH.EXPORT,
  PATH.BOOK,
  PATH.PAX_INFO,
];

export const OLD_QUOTE_SUB_ROUTES_QUOTE_SUB_ROUTES_MAP = {
  [PATH.BASIC_INFO]: PATH_INFO.BASIC_INFO.path,
  [PATH.SERVICES]: PATH_INFO.SERVICES.path,
  [PATH.ITINERARY]: PATH_INFO.ITINERARY.path,
  [PATH.EXPORT]: PATH_INFO.EXPORT.path,
  [PATH.BOOK]: PATH_INFO.BOOK.path,
  [PATH.PAX_INFO]: PATH_INFO.PAX_INFO.path,
};
