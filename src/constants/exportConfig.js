import { CATEGORY_ASSET } from "@/constants";

export const EXTERNAL_SOURCES_IDS = {
  OPPEN: "oppen",
  OPEN_ORANGE: "open_orange",
};

export const EXTERNAL_SOURCES = [
  {
    id: EXTERNAL_SOURCES_IDS.OPPEN,
    name: "Oppen",
  },
  // {
  //   id: EXTERNAL_SOURCES_IDS.OPEN_ORANGE,
  //   name: "Open Orange",
  // },
];

export const TEMPLATE_CONFIG = {
  DISPLAY_TRAVEL_DATES: 1,
  DISPLAY_HOTELS_ACCOMMODATIONS: 3,
  DISPLAY_SERVICE_LIST: 2,
  DISPLAY_ITINERARY: 4,
  DISPLAY_SERVICE_LIST_WITH_PRICES: 5,
  DISPLAY_COMFORT_LEVEL: 6,
  DISPLAY_SUPERIOR_LEVEL: 7,
  DISPLAY_LUXURY_LEVEL: 8,
  DISPLAY_CONTACT_US: 9,
  DISPLAY_PRICES: 10,
  ITINERARY_DESCRIPTION: 11,
  DISPLAY_PAYMENT_GATEWAY: 12,
  DISPLAY_OPTIONALS_WITH_PRICES: 13,
};

export const TEMPLATE_CONFIG_PRICES_LEVELS = {
  Comfort: TEMPLATE_CONFIG.DISPLAY_COMFORT_LEVEL,
  Superior: TEMPLATE_CONFIG.DISPLAY_SUPERIOR_LEVEL,
  Luxury: TEMPLATE_CONFIG.DISPLAY_LUXURY_LEVEL,
};

export const TEMPLATES = {
  WHITELABEL: {
    name: "whitelabel",
    title: "Whitelabel",
    path: "whitelabel",
    id: 1,
  },
  ELA: {
    name: "ela",
    title: "Ela",
    path: "ela",
    id: 2,
  },
  SAAS: {
    name: "saas",
    title: "Saas",
    path: "saas",
    id: 3,
  },
  EXPERIENCE: {
    name: "experience",
    title: "Experience",
    path: "experience",
    id: 4,
  },
};

export const TEMPLATES_LIST = Object.values(TEMPLATES);

export const WORD_IMAGES_TYPES = {
  SERVICE_TYPE_ICON: "serviceTypeIcon",
  CLIENT_LOGO: "clientLogo",
};

export const EXPORT_IMAGES_TYPES = {
  LOGO: "logo",
  BACKGROUND: "background",
  COVER_PAGE: "cover_page",
  CONTACT: "contact",
  IMAGES_PAGE: "images_page",
};

export const getTemplateImagesDefault = (isExperience = false) => {
  return [
    {
      category: CATEGORY_ASSET.CLIENT,
      label: "Logo",
      type: "logo",
      images_full: [
        {
          id: null,
          thumbnail_350X240:
            "https://place-hold.it/800x600/DDDDDD/fff.jpg?bold&fontsize=50&text=LOGO IMAGE",
          name: "main",
        },
      ],
    },
    {
      category: isExperience ? CATEGORY_ASSET.SERVICE : CATEGORY_ASSET.LOCATION,
      label: "Background",
      type: "background",
      images_full: [
        {
          id: null,
          thumbnail_350X240:
            "https://place-hold.it/800x600/DDDDDD/fff.jpg?bold&fontsize=50&text=BACKGROUND IMAGE",
          name: "main",
        },
      ],
    },
    {
      category: CATEGORY_ASSET.LOCATION,
      label: "Cover",
      type: "cover_page",
      images_full: [
        {
          id: null,
          thumbnail_350X240:
            "https://place-hold.it/800x600/DDDDDD/fff.jpg?bold&fontsize=50&text=COVER IMAGE",
          name: "main",
        },
      ],
    },
    {
      category: CATEGORY_ASSET.LOCATION,
      label: "Contact",
      type: "contact",
      images_full: [
        {
          id: null,
          thumbnail_350X240:
            "https://place-hold.it/800x600/DDDDDD/fff.jpg?bold&fontsize=50&text=CONTACT IMAGE",
          name: "main",
        },
      ],
    },
    {
      category: CATEGORY_ASSET.LOCATION,
      label: "Print",
      type: "images_page",
      images_full: [
        {
          id: null,
          thumbnail_350X240:
            "https://place-hold.it/800x600/DDDDDD/fff.jpg?bold&fontsize=50&text=PRINT IMAGE",
          name: "main",
        },
      ],
    },
  ];
};

export const TEMPLATE_COLORS = [
  {
    id: null,
    value: "#f9f6f0",
    type: "navBgColor",
    label: "Navbar Background Color",
  },
  {
    id: null,
    value: "#720330",
    type: "mainBgColor",
    label: "Main Background Color",
  },
  {
    id: null,
    value: "#810644",
    type: "mainTextColor",
    label: "Main Text Color",
  },
];

export const SERVICE_LIST_WITH_PRICES_CONDITIONS = {
  NO_HIDDEN_SERVICES: "No hidden services(Check Services section)",
  NO_FEE: "No Fee(Check Prices section)",
  NO_UPSALE: "No Upsales(Check Prices section)",
};

export const defaultImgBase64 =
  "data:image/png;base64,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";
