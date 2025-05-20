import { MAX_PROCESS_SERVICES } from "../constants";
import {
  ITINERARY_STATUS,
  ITINERARY_TYPES,
  QUOTES_STATUS,
  REQUEST_STAGES,
} from "../constants/itinerary";

import globalHelper from "@/helpers";

export const getLocationsPath = (locations = []) => {
  const newLocationPath = locations.reduce((acc, location, ind) => {
    if (!location.id) return acc;
    const pathSign = ind === locations.length - 1 ? "" : ",/";
    return `${acc}${location.location_code}${pathSign}`;
  }, "");

  return newLocationPath;
};

const getLocationString = (location = []) => {
  return location.reduce((acc, location) => {
    return `${acc} ${location.location_name}`;
  }, "");
};

const getServiceSearchString = (service = {}) => {
  return `${service.code} ${service.name.value} ${
    service.level_text
  } ${getLocationString(service.location)}`;
};

const setPageTitle = (title = "") => {
  document.title = title;
};

const resetPageTitle = () => {
  const title = process.env.VUE_APP_TITLE;
  setPageTitle(title);
};

const getItineraryTypesMapped = () => {
  return Object.keys(ITINERARY_TYPES).map((key) => ({
    id: ITINERARY_TYPES[key].id,
    name: ITINERARY_TYPES[key].name,
    type: ITINERARY_TYPES[key].type,
  }));
};

const getItineraryTypeById = (itineraryTypeId = "") => {
  const itineraryTypes = getItineraryTypesMapped();
  return itineraryTypes.find(
    (itineraryType) => itineraryType.id === itineraryTypeId
  );
};

const getQuoteStatusPhases = (quoteStatus = "") => {
  const defaultQuoteStatuses = [
    {
      id: ITINERARY_STATUS.QUOTE.value,
      label: "In Preparation",
      completed: false,
    },
    {
      id: ITINERARY_STATUS.SENT.value,
      label: "Sent",
      completed: false,
    },
    {
      id: ITINERARY_STATUS.CONFIRM.value,
      label: "Confirmed",
      completed: false,
    },
  ];
  const currentQuoteStatusIndex = defaultQuoteStatuses.findIndex(
    (status) => status.id === quoteStatus
  );
  return defaultQuoteStatuses.map((status, index) => {
    const isConfirmed = quoteStatus === ITINERARY_STATUS.CONFIRM.value;
    return {
      ...status,
      completed: index < currentQuoteStatusIndex || isConfirmed,
      active: index <= currentQuoteStatusIndex,
    };
  });
};

const getRoomPreferableDistributionHash = (roomPreferableDistJson) => {
  const sortedRoomPreferableDistributionJson = [...roomPreferableDistJson].sort(
    (a, b) => a.id_room_type - b.id_room_type
  );

  const currentRoomDistribution = sortedRoomPreferableDistributionJson.reduce(
    (acc, item) => {
      if (item.qty === 0) return acc;
      return acc + `${item.id_room_type}-${item.qty}`;
    },
    ""
  );

  return currentRoomDistribution;
};

const getItineraryRowClass = (row = {}) => {
  if (row.isDeleting) return "itinerary__row is-deleting";
  if (row.isExporting) return "itinerary__row is-exporting";
  if (row.isUpdating) return "itinerary__row is-updating";
  return "itinerary__row";
};

const generateList = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, index) => ({
    value: start + index,
  }));
};

const getFullRequestStage = (requestStage) => {
  const requestStages = Object.values(REQUEST_STAGES);
  return requestStages.find((stage) => stage.id === requestStage);
};

const getFullQuoteStatus = (quoteStatus) => {
  const quoteStatuses = Object.values(QUOTES_STATUS);
  return quoteStatuses.find((status) => status.id === quoteStatus);
};

const getServicesChunks = (services) => {
  const serviceUUIDs = services.map((service) => service.id);

  return globalHelper.sliceIntoChunks(serviceUUIDs, MAX_PROCESS_SERVICES);
};

export const helper = {
  getLocationsPath,
  getLocationString,
  getServiceSearchString,
  setPageTitle,
  resetPageTitle,
  getItineraryTypesMapped,
  getItineraryTypeById,
  getQuoteStatusPhases,
  getRoomPreferableDistributionHash,
  getItineraryRowClass,
  generateList,
  getFullRequestStage,
  getFullQuoteStatus,
  getServicesChunks,
};
