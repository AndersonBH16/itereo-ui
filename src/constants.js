export const MAX_ITINERARY_DAYS = 70;
export const MAX_PROCESS_SERVICES = 3;

export const DEFAULT_ALLOWED = [
  "krodriguez@itereo.travel",
  "lvillacorta@itereo.travel",
  "jgraterol@itereo.travel",
  "areyes@itereo.travel",
  "ccontreras@itereo.travel",
  "demo@itereo.net",
  "adminjenny@ela.travel",
  "support@ela.travel",
];

export const USER_ROLE = {
  ADMIN: "admin",
  CLIENT_ADMIN: "client_admin",
  CLIENT: "client",
  TRAVEL_AGENT: "travel_agent",
};

export const USER_ROLE_IDS = {
  ADMIN: 1,
  TRAVEL_AGENT: 7,
};

export const PERMISSION = {
  VIEW_SALE_PRICE: "view_sale_price",
  VIEW_COST_PRICE: "view_cost_price",
  VIEW_PRICE_SEARCHED: "view_price_searched",
};

export const SERVICE_TYPE = {
  ACCOMMODATION: 2,
  PACKAGE: 9,
  TRANSFER: 5,
};

export const CATEGORY_ASSET = {
  LOCATION: 1,
  SERVICE: 2,
  CLIENT: 3,
};

export const ASSET_TYPE = {
  DAY: "day",
  EXPORT: "export",
};

export const STATUS = {
  DISABLED: -1,
};

export const STORAGE_KEYS = {
  TAGS: "tags",
};

export const TAG_TYPES = {
  SVC: "SVC",
  ITY: "ITY",
  TOD: "TOD",
};

export const SERVICE_STATUS = {
  CANCEL: {
    value: 3,
    text: "Canceled",
    type: "is-danger",
    icon: "close-circle",
  },
  PENDING: {
    value: 1,
    text: "Pending",
    type: "is-warning",
    icon: "dots-horizontal-circle",
  },
  CONFIRM: {
    value: 2,
    text: "Confirmed",
    type: "is-success",
    icon: "check-circle",
  },
};

export const SERVICE_STATUS_OPTIONS = Object.values(SERVICE_STATUS);

export const SERVICE_TABLE_FIELDS_IDS = {
  DATES: "dates",
  VISIBLE: "visible",
  STATUS: "status",
  DAY: "day",
  DESTINATION: "destination",
  NAME: "name",
  LEVEL: "level_text",
  PAX: "num_pax",
  COST: "cost",
  PRICE_UNIT: "price_unit",
  PRICE: "price",
  ACTIONS: "id",
};

export const SERVICE_TABLE_FIELDS = [
  {
    key: "selected",
    label: "Selection",
    type: "text",
    editable: false,
    class: "editable selectionField hidden_field",
  },
  {
    key: "visible",
    label: "Visible",
    type: "checkbox",
    editable: true,
    class: "editable checkboxField",
  },
  // {
  //   key: "status",
  //   label: "Status",
  //   type: "select",
  //   editable: true,
  //   class: "editable levelField",
  //   options: SERVICE_STATUS_OPTIONS,
  // },
  {
    key: "day",
    label: "Day(s)",
    type: "text",
    editable: true,
    class: "editable day",
  },
  {
    key: SERVICE_TABLE_FIELDS_IDS.DATES,
    label: "Dates",
    type: "text",
    editable: false,
    class: "ReadonlyInput datesField",
  },
  {
    key: "destination",
    label: "Destination",
    type: "text",
    editable: false,
    class: "destinationField",
  },
  {
    key: "name",
    label: "Service",
    type: "text",
    editable: false,
    class: "ReadonlyInput InputTitle",
  },
  {
    key: "level_text",
    label: "Level",
    type: "select",
    options: ["All", "Com", "Sup", "Lux"],
    editable: true,
    class: "editable levelField",
  },
  {
    //NO MOVER DE ESTA POSICION ESTE ELEMENTO
    key: SERVICE_TABLE_FIELDS_IDS.PAX,
    label: "Pax(s)",
    type: "select",
    options: [],
    editable: true,
    class: "editable paxField",
  },
  {
    key: "cost",
    label: "Cost",
    type: "number",
    editable: false,
    class: "costField",
  },
  {
    key: "price_unit",
    label: "Price Unit",
    type: "number",
    editable: true,
    class: "editable priceUnitField hidden_field",
  },
  {
    key: "price",
    label: "Sales",
    type: "number",
    editable: true,
    class: "editable priceField shown_field",
  },
  {
    key: "id",
    label: "Actions",
    editable: false,
    class: "actionsField",
  },
];

export const DATE_FORMAT_MMM_DD_YYYY = "MMM DD, YYYY";
export const DATE_FORMAT_YYYY_MM_DD = "YYYY-MM-DD";
