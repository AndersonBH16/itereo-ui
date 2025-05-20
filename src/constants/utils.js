import { PATH_INFO } from "@/router/path";
import { KEYBOARD_KEYS } from "@/constants/shortcuts";

export const DEFAULT_SERVICE_LOCATION = {
  location_name: "All",
  location_code: "",
  id: null,
};

export const PUSHER_TASK_TYPES = {
  ITINERARY_EXPORT: "itinerary_export",
  SERVICE_IMPORT: "service_import",
  SERVICE_UDPATE: "service_update",
};

export const SHORTCUT_ROUTE_MAP = {
  [KEYBOARD_KEYS.NUM_1]: PATH_INFO.BASIC_INFO.path,
  [KEYBOARD_KEYS.NUM_2]: PATH_INFO.SERVICES.path,
  [KEYBOARD_KEYS.NUM_3]: PATH_INFO.ITINERARY.path,
  [KEYBOARD_KEYS.NUM_4]: PATH_INFO.BOOK.path,
  [KEYBOARD_KEYS.NUM_5]: PATH_INFO.EXPORT.path,
  [KEYBOARD_KEYS.NUM_6]: PATH_INFO.PAX_INFO.path,
  [KEYBOARD_KEYS.KEY_Q]: PATH_INFO.HOME.path,
};
