import {
  MAX_PROCESS_SERVICES,
  PERMISSION,
  SERVICE_STATUS_OPTIONS,
  SERVICE_TABLE_FIELDS_IDS,
  SERVICE_TYPE,
} from "../constants";
import helpers from "@/helpers";
import { calculateDays, transformTextArrayToArray } from "@/utils/utils";
import { cloneDeep } from "lodash";
import servicesTypes from "@/data/servicesTypes.json";
import { isAllLocation } from "./utils";
import {
  EDIT_SERVICE_SIDEBAR_TABS,
  ROOM_FIELDS,
  SERVICE_LEVELS,
  SERVICE_LEVELS_OPTIONS,
} from "../constants/services";
import roomPreferableDistributionJson from "@/data/roomPreferableDistribution.json";
import { PATH_INFO } from "@/router/path";

export const isAccommodationPackageService = (id_service_type) => {
  return (
    id_service_type === SERVICE_TYPE.ACCOMMODATION ||
    id_service_type === SERVICE_TYPE.PACKAGE
  );
};
export const isAccommodationService = (id_service_type) => {
  return id_service_type === SERVICE_TYPE.ACCOMMODATION;
};

export const isPackageService = (id_service_type) => {
  return id_service_type === SERVICE_TYPE.PACKAGE;
};

export const filterServicesWithoutId = (services = [], serviceType = 0) => {
  return services.filter((ser) => ser.id_service_type !== serviceType);
};

export const filterServicesWithId = (services = [], serviceType = 0) => {
  return services.filter((ser) => ser.id_service_type === serviceType);
};

export const containsServiceById = (services = [], servicesIds = []) => {
  const filteredServices = services.filter((ser) =>
    servicesIds.includes(ser.itinerary_service)
  );
  return {
    contains: filteredServices.length > 0,
    dayServices: filteredServices,
  };
};

export const getOrderedServicesByRange = (services = []) => {
  const orderedServices = services.map((service) => {
    const endDay = service.day.split("-")[1];
    return { ...service, endDay: parseInt(endDay) };
  });
  orderedServices.sort((a, b) => b.endDay - a.endDay);
  return orderedServices;
};

export const getLargestService = (services = []) => {
  const largestService = services.reduce(
    (acc, service) => {
      const { day } = service;
      const endDay = day.split("-")[1];
      const diff = parseInt(endDay) - parseInt(day);
      if (diff > acc.max) return { max: diff, service };
      return acc;
    },
    { max: 0, service: {} }
  );
  return largestService;
};

export const getComplementTextByServiceType = (serviceType = 0) => {
  const isAccoPackService = isAccommodationPackageService(serviceType);
  return isAccoPackService ? "Night(s)" : "Day(s)";
};

const getStatus = (status = 0) => {
  const statusFound = SERVICE_STATUS_OPTIONS.find(
    (option) => option.value === status
  );
  return [statusFound];
};

const hasViewPermission = (authData, itinerary, permission) => {
  if (!itinerary || !itinerary.permissions) return false;

  return (
    helpers.hasPermission(authData, permission) ||
    itinerary.permissions.some((p) => p.name === permission)
  );
};

const hasAnyViewPermissions = (authData, itinerary, permissions = []) => {
  for (const permission of permissions) {
    if (hasViewPermission(authData, itinerary, permission)) return true;
  }
  return false;
};

const hasViewCostPricePermission = (authData, itinerary) => {
  return hasViewPermission(authData, itinerary, PERMISSION.VIEW_COST_PRICE);
};

const hasViewSalePricePermission = (authData, itinerary) => {
  return hasViewPermission(authData, itinerary, PERMISSION.VIEW_SALE_PRICE);
};

const loadOptionsForTableFields = (fields = [], numPax = 1) => {
  return fields.map((field) => {
    return SERVICE_TABLE_FIELDS_IDS.PAX === field.key
      ? {
          ...field,
          options: helpers.getArrayFromNumber(numPax + 1),
        }
      : field;
  });
};

const formatDestinationsTextForServiceTable = (destinations = []) => {
  return destinations?.map((destination) => {
    return {
      ...destination,
      text: `${destination.location_name}${
        destination.location_code ? ` (${destination.location_code})` : ""
      }`,
    };
  });
};

const adaptServiceToServiceRow = (service = {}) => {
  return {
    id: service.id,
    name: service.name,
    code: service.code,
    location: service.location,
    day: service.day,
    start_date: service.start_date,
    end_date: service.end_date,
    id_service_type: service.id_service_type,
    service_price: service.service_price,
    servicesRelated: service.servicesRelated,
    price: service.price,
    isPriceEdited: service.isPriceEdited,
    optional: service.optional,
    visible: service.visible,
  };
};

const getParentLocation = (countryId = "", countries = []) => {
  const location = countries.find((location) => location.id === countryId);
  return location !== undefined ? location : null;
};

const calculateTotalRoom = (price, qty) => {
  return Number(price) * Number(qty)
    ? (Number(price) * Number(qty)).toFixed(2)
    : 0;
};

const getUpdatedUsedRooms = (usedRooms = [], roomOptions = [], nights = 0) => {
  if (!usedRooms?.length) return [];
  return usedRooms?.map((servicePrice) => {
    const roomFound = roomOptions?.find(
      (room) => room.id === servicePrice.romm_id
    );
    const newRoomQty = roomFound?.qty || 0;
    const newStatus = newRoomQty > 0 ? 1 : -1;
    const newPrice = roomFound?.price ? roomFound.price * nights : 0;
    const newPriceUnit = roomFound?.price_unit
      ? roomFound.price_unit * newRoomQty
      : 0;
    const updatedPassengers =
      roomFound?.passengers?.map((passenger) => passenger.id) || [];

    return {
      ...servicePrice,
      status: newStatus,
      room_qty: newRoomQty,
      price: newPrice,
      price_unit: newPriceUnit,
      passengers: updatedPassengers,
    };
  });
};

const getNewAddedRooms = (usedRooms = [], roomOptions = [], nights = 0) => {
  if (!roomOptions?.length) return [];
  const roomIsNew = (room) =>
    !usedRooms.some((usedRoom) => usedRoom.romm_id === room.id);
  return roomOptions
    ?.filter((room) => room?.qty > 0 && roomIsNew(room))
    ?.map((room) => {
      return {
        id: null,
        prices_ranges_id:
          room?.price_service_sm?.[0]?.price_service?.[0]?.prices_ranges?.[0]
            ?.id || null,
        prices:
          Number(
            calculateTotalRoom(
              room?.price_service_sm?.[0]?.price_service?.[0]
                ?.prices_ranges?.[0]?.price,
              room?.qty
            )
          ) || 0,
        romm_id: room?.id,
        romm_name: room?.name,
        sales_manual_id: room?.price_service_sm?.[0]?.sales_manual_id || null,
        room_qty: room?.qty || 1,
        price: room?.price ? room.price * nights : 0,
        price_unit: room?.price_unit ? room.price_unit * room.qty : 0,
        status: 1,
        passengers: room.passengers?.map((passenger) => passenger.id) || [],
      };
    });
};

const getServiceAccumulatePaxsByRooms = (rooms = []) => {
  if (!rooms?.length) return 0;
  return rooms.reduce((pax, room) => pax + room.qty * room.max_passengers, 0);
};

const getProgressBarInfoWhenMovingServices = (
  index,
  chunksLength,
  servicesLength
) => {
  const progressValue = Math.round((index / chunksLength) * 100);
  const progressText = `${
    index * MAX_PROCESS_SERVICES
  } of ${servicesLength} services updated`;
  return { progressValue, progressText, displayProgress: true };
};

const getHashCode = (string) => {
  return `hash${Math.abs(
    string.split("").reduce((acc, letter) => {
      acc = (acc << 5) - acc + letter.charCodeAt(0);
      return acc & acc;
    }, 0)
  )}`;
};

const getServiceHash = (service) => {
  const idNonAccommodationPackageService = !isAccommodationPackageService(
    service.id_service_type
  )
    ? service.id
    : 0;
  const name = service.name?.value?.trim() || "";
  const code = service.code?.trim() || "";
  const description = service.description?.value?.trim() || "";
  const notes = service.notes?.value?.trim() || "";
  const recommendations = service.reccomendations?.value?.trim() || "";
  const location = Array.isArray(service.location)
    ? service.location?.reduce((acc, location) => {
        return acc + location.location_name;
      }, "")
    : service.location || "";
  const images =
    service.images_full
      ?.map((image) => image.id)
      .sort((a, b) => a - b)
      .join("") || "";
  return getHashCode(
    `${name}${description}${notes}${recommendations}${code}${location}${images}${service.level}-${service.day}${idNonAccommodationPackageService}`
  );
};

const groupServicesRoomsByServiceId = (itinerary, services = []) => {
  const newServices = {};
  services.forEach((service) => {
    const hash = getServiceHash(service);
    const currentService = newServices[hash];
    if (currentService === undefined || isDraftService(service)) {
      newServices[hash] = [service];
    } else {
      currentService.push(service);
    }
  });

  return Object.values(newServices)
    .map((services) => {
      const splitServices = [];

      let curService = {
        ...cloneDeep(services[0]),
        isGrouped: false,
        servicesRelated: [services[0]],
      };

      services.slice(1).forEach((service) => {
        const curPassengers = transformTextArrayToArray(curService.passengers);
        const passengers = transformTextArrayToArray(service.passengers);
        const commonPassengers = curPassengers.filter((passenger) =>
          passengers.includes(passenger)
        );

        if (
          commonPassengers.length > 0 ||
          curService.num_pax + service.num_pax > itinerary.num_pax
        ) {
          splitServices.push(curService);

          curService = {
            ...cloneDeep(service),
            isGrouped: false,
            servicesRelated: [service],
          };
        } else {
          curService.num_pax += service.num_pax;
          curService.price += service.price;
          curService.calculated_price += service.calculated_price;
          curService.cost += service.cost;

          service.service_price.forEach((newServicePrice) => {
            const foundServicePrice = curService.service_price.find(
              (curServicePrice) =>
                curServicePrice.romm_id === newServicePrice.romm_id
            );

            if (foundServicePrice) {
              foundServicePrice.room_qty += newServicePrice.room_qty;
              foundServicePrice.price_unit *= foundServicePrice.room_qty;
              foundServicePrice.price *= foundServicePrice.room_qty;
              foundServicePrice.passengers =
                foundServicePrice.passengers.concat(newServicePrice.passengers);
            } else {
              curService.service_price.push(newServicePrice);
            }
          });

          service.service_supplier.forEach((newServiceSupplier) => {
            const foundServiceSupplier = curService.service_supplier.find(
              (curServiceSupplier) =>
                curServiceSupplier.romm_id === newServiceSupplier.romm_id
            );
            const foundServicePrice = curService.service_price.find(
              (curServicePrice) =>
                curServicePrice.romm_id === newServiceSupplier.romm_id
            );

            if (foundServiceSupplier) {
              foundServiceSupplier.cost_unit *= foundServicePrice?.room_qty;
              foundServiceSupplier.cost *= foundServicePrice?.room_qty;
            } else {
              curService.service_supplier.push(newServiceSupplier);
            }
          });

          curService.servicesRelated.push(service);
          curService.isGrouped = true;
        }
      });

      splitServices.push(curService);

      return splitServices;
    })
    .flat()
    .sort((a, b) => a.order - b.order);
};

const getGroupedServicePriceToUpdate = (
  newServicePrice = 0,
  oldServicePrice = 0,
  servicesLength = 0
) => {
  const excess = newServicePrice - oldServicePrice;
  return excess !== 0 ? excess / servicesLength : 0;
};

const transformTimeToHourMinuteSecondFormat = (time = "") => {
  const dateTime = new Date(time);
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  return dateTime
    ? (hours < 10 ? "0" : "") +
        hours +
        ":" +
        (minutes < 10 ? "0" : "") +
        minutes +
        ":00"
    : "00:00:00";
};

const getRoomNightQty = (room) => {
  const priceService = room.price_service_sm[0].price_service[0];
  return priceService.prices_ranges[0].night_qty;
};

const isRoomAllowed = (num_pax = 1, rooms = [], room = {}, service = {}) => {
  const qtySelected = rooms?.reduce((acc, room) => {
    return acc + room.qty * room.max_passengers;
  }, 0);

  if (
    isPackageService(service.id_service_type) &&
    service.nights !== getRoomNightQty(room) &&
    qtySelected
  )
    return false;

  const { max_passengers = 1 } = room;
  return num_pax - qtySelected >= max_passengers;
};

const getRoomRowClass = (num_pax = 1, rooms = [], room = {}, service = {}) => {
  if (room.qty > 0) return "is_selected_room";

  if (!isRoomAllowed(num_pax, rooms, room, service))
    return "is_not_allowed_room";

  return "";
};

const getIsRoomSelectionCompleted = (num_pax = 1, rooms = []) => {
  const qtySelected = rooms?.reduce((acc, room) => {
    return acc + room.qty * room.max_passengers;
  }, 0);
  return qtySelected >= num_pax;
};

const getUpdatedRoomQtyOptions = (num_pax = 1, rooms = [], room = {}) => {
  const { max_passengers = 1 } = room;
  const qtySelected = rooms.reduce((acc, room) => {
    return acc + room.qty * (room.max_passengers || 1);
  }, 0);
  if (num_pax < qtySelected || !max_passengers) return 0;
  const qtyAvailable =
    room.qty === 0
      ? num_pax - qtySelected
      : num_pax - qtySelected + room.qty * max_passengers;
  return Math.floor(qtyAvailable / max_passengers);
};

const compareObjects = (obj1, obj2, { withDot = false }) => {
  const modifiedFields = [];

  const compare = (obj1, obj2, path = "") => {
    for (const key in obj1) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (typeof value1 === "object" && typeof value2 === "object") {
        compare(value1, value2, `${path}.${key}`);
      } else if (value1 != value2) {
        modifiedFields.push(`${path}.${key}`);
      }
    }
  };

  compare(obj1, obj2);

  if (!withDot) {
    return modifiedFields.map((field) => field.replace(".", ""));
  }

  return modifiedFields;
};

const deleteRepeatedElements = (array = []) => {
  return array.filter((value, index) => array.indexOf(value) === index);
};

const getRoomPricesByFinalPrice = (room, factor) => {
  const roundedFinalPrice = Math.round(room.finalPrice);
  const price = Number((roundedFinalPrice / factor).toFixed(2));
  return {
    finalPrice: roundedFinalPrice,
    price,
    price_unit: Number((price / room.qty).toFixed(2)),
  };
};

const getRoomPricesByPrice = (room, factor) => {
  const price = room.price;
  return {
    finalPrice: Math.round(price * factor),
    price,
    price_unit: price / room.qty,
  };
};

const getRoomPricesByUnitPrice = (key, room, factor) => {
  const price_unit =
    key === ROOM_FIELDS.NEW_PRICE_UNIT ? room.new_price_unit : room.price_unit;
  const price = price_unit * room.qty;
  return {
    finalPrice: Math.round(price * factor),
    price,
    price_unit,
  };
};

const getRoomPricesByKey = (key, room, factor) => {
  return key === ROOM_FIELDS.PRICE
    ? getRoomPricesByPrice(room, factor)
    : key === ROOM_FIELDS.FINAL_PRICE
    ? getRoomPricesByFinalPrice(room, factor)
    : getRoomPricesByUnitPrice(key, room, factor);
};

const updateRoomPrices = (serviceRooms = [], key, item = null, factor = 1) => {
  return serviceRooms.map((room) => {
    if (item && room.id !== item.id) return room;

    const { price_unit, price, finalPrice } = getRoomPricesByKey(
      key,
      room,
      factor
    );

    return {
      ...room,
      price_unit,
      price,
      finalPrice,
    };
  });
};

const getServiceIconByServiceType = (id) => {
  const serviceType = servicesTypes.filter(
    (service) => service.entity_id === id
  );
  return serviceType.length !== 0
    ? serviceType[0].icon
    : "check-circle-outline";
};

const isDraftService = (service) => {
  return [null, 0, undefined].includes(service.id);
};

const validateSyncServicePriceAndSupplierForRestServices = (service) => {
  const isRestService = !isAccommodationPackageService(service.id_service_type);
  if (!isRestService) return service;

  const servicePrice = service.service_price || [];
  const serviceSupplier = service.service_supplier || [];

  return {
    validatedServicePrice: servicePrice.map((price, index) => ({
      ...price,
      status: index > 0 ? -1 : price.status,
    })),
    validatedServiceSupplier: serviceSupplier.map((supplier, index) => ({
      ...supplier,
      status: index > 0 ? -1 : supplier.status,
    })),
  };
};

const filterServicesOnModals = (services = [], payload = {}) => {
  const { country, destination, serviceType, text, serviceTags = [] } = payload;
  const serviceTagsIds = serviceTags.map((tag) => tag.acronym);

  return services.filter((service) => {
    if (serviceType && service.id_service_type !== serviceType) return false;

    const serviceCategory = service?.category?.acronym || "";
    if (serviceTagsIds.length > 0 && !serviceTagsIds.includes(serviceCategory))
      return false;

    if (!isAllLocation(country)) {
      if (!isAllLocation(destination)) {
        const foundDestination = service.location.find((location) => {
          return location.location_code === destination;
        });
        if (!foundDestination) return false;
      } else {
        const foundCountry = service.location.find((location) => {
          return location.location_name === country;
        });
        if (!foundCountry) return false;
      }
    }

    const serviceCategoryName = service?.category?.name || "";
    const codeWithName = `${service.code} ${service.name.value} ${serviceCategoryName}`;
    return codeWithName.toLowerCase().includes(text.trim().toLowerCase());
  });
};

const getServicesWithIsPriceEditedField = (services = []) => {
  return services.map((service) => {
    const isPriceEdited = service.calculated_price !== service.price;
    return {
      ...service,
      isPriceEdited,
    };
  });
};

const getRoomMaxPax = (room_name) => {
  if (room_name.includes("_SGL")) return 1;
  if (room_name.includes("_DBL")) return 2;
  if (room_name.includes("_TWI")) return 2;
  if (room_name.includes("_TRP")) return 3;
  if (room_name.includes("_QUA")) return 4;
  return 1;
};

const generateServicePrice = (service, newPrice, factor) => {
  return [
    {
      romm_id: 0,
      romm_name: "",
      prices_ranges_id: 0,
      prices: 0,
      sales_manual_id: "",
      room_qty: service.num_pax,
      currency_id: 1,
      price_unit: Number((newPrice / factor).toFixed(2)),
      price: Number(newPrice),
      passengers: [],
      external_id: 0,
      id: null,
    },
  ];
};

const calculateServicePrice = (service, newPrice) => {
  const newServicePrice = service.service_price ?? [];

  const nights = calculateDays(service.start_date, service.end_date) - 1;
  const factor = isAccommodationService(service.id_service_type)
    ? nights
    : isPackageService(service.id_service_type)
    ? 1
    : (nights + 1) * service.num_pax;

  if (newServicePrice.length === 0)
    return generateServicePrice(service, newPrice, factor);

  const totalPrice = newServicePrice.reduce((acc, item) => acc + item.price, 0);
  const totalPax = newServicePrice.reduce(
    (acc, item) => acc + getRoomMaxPax(item.romm_name) * item.room_qty,
    0
  );
  return newServicePrice.map((servicePrice) => {
    let price;
    if (totalPrice > 0) {
      price = (newPrice * servicePrice.price) / totalPrice;
    } else if (totalPax > 0) {
      price =
        (newPrice *
          getRoomMaxPax(servicePrice.romm_name) *
          servicePrice.room_qty) /
        totalPax;
    }
    return {
      ...servicePrice,
      price_unit: Math.round(price / factor),
      price: Math.round(price),
    };
  });
};

const getServiceSuppliers = (service) => {
  const uniqueSuppliers = service?.service_supplier?.filter(
    (supplier, index, self) =>
      index ===
      self.findIndex((t) => t.supplier_code === supplier.supplier_code)
  );
  return (
    uniqueSuppliers.map((supplier) => supplier.name).join(", ") ||
    "This service has no provider"
  );
};

const getServiceFirstDestination = (service) => {
  return service.location.find(
    (location) => ![0, null].includes(location.parent)
  );
};

const validateServiceLocationsWhenInserting = (
  services,
  days,
  serviceToInsert
) => {
  const pastServices =
    services.filter(
      (si) =>
        si.id &&
        si.end_date <= serviceToInsert.start_date &&
        si.start_date < serviceToInsert.start_date
    ) || [];

  if (pastServices.length === 0)
    return { isDifferentLocation: false, nextServices: [] };

  const lastPastService = pastServices?.at(-1);

  const prevDestination =
    lastPastService?.location?.find((l) => l.parent !== 0) || "";

  const nextServices = services
    .filter((si) => si.id)
    .filter(
      (si) =>
        si.start_date > serviceToInsert.start_date ||
        (si.start_date === serviceToInsert.start_date &&
          prevDestination?.location_code !==
            getServiceFirstDestination(si)?.location_code)
    );

  const destinationToInsert = serviceToInsert.location?.find(
    (l) => l?.parent !== 0
  );

  const currentDay = days.find(
    (day) =>
      day.services.length === 0 &&
      serviceToInsert.start_date.localeCompare(day.start_date) <= 0 &&
      day.end_date.localeCompare(serviceToInsert.end_date) <= 0 &&
      day.location.length > 0 &&
      destinationToInsert &&
      destinationToInsert.location_code !== day.location[0].location_code
  );

  if (currentDay) {
    return {
      isDifferentLocation: true,
      nextServices,
      day_date: currentDay.start_date,
    };
  }

  const nextService = nextServices[0];

  if (!nextService || !lastPastService)
    return { isDifferentLocation: false, nextServices };
  if (nextService?.id === lastPastService?.id)
    return { isDifferentLocation: false, nextServices };

  const previousServiceDestination = lastPastService?.location?.find(
    (l) => l.parent !== 0
  );
  const nextServiceDestination = nextService?.location?.find(
    (l) => l.parent !== 0
  );

  const isLastPastServiceDifferentLocation =
    previousServiceDestination?.location_code !==
    destinationToInsert?.location_code;

  const isBetweenDifferentDestinations =
    previousServiceDestination?.location_code !==
    nextServiceDestination?.location_code;

  if (!isLastPastServiceDifferentLocation)
    return { isDifferentLocation: false, nextServices };

  if (!isBetweenDifferentDestinations)
    return { isDifferentLocation: false, nextServices };

  if (serviceToInsert.end_date.localeCompare(nextService.start_date) < 0) {
    return { isDifferentLocation: false, nextServices };
  }

  const hasThisDateTheSameLocation = nextServices
    .filter(
      (nextService) => nextService.start_date === serviceToInsert.start_date
    )
    .some(
      (nextService) =>
        getServiceFirstDestination(nextService)?.location_code ===
        destinationToInsert?.location_code
    );

  if (hasThisDateTheSameLocation)
    return { isDifferentLocation: false, nextServices };

  const nextDestination = nextService.location?.find((l) => l.parent !== 0);

  const isNextServiceDifferentLocation =
    destinationToInsert?.location_code !== nextDestination?.location_code;

  return {
    isDifferentLocation: isNextServiceDifferentLocation,
    nextServices,
  };
};

const getDaysToMove = (service) => {
  const same_date = service.start_date === service.end_date;
  const days = calculateDays(service.start_date, service.end_date);
  const daysToMove =
    isAccommodationPackageService(service.id_service_type) && !same_date
      ? days - 1
      : days;
  return daysToMove < 0 ? 1 : daysToMove;
};

const getServiceLevelText = (service) => {
  if (service.level === SERVICE_LEVELS.COMFORT.id)
    return SERVICE_LEVELS.COMFORT.type;
  if (service.level === SERVICE_LEVELS.SUPERIOR.id)
    return SERVICE_LEVELS.SUPERIOR.type;
  if (service.level === SERVICE_LEVELS.LUXURY.id)
    return SERVICE_LEVELS.LUXURY.type;
  return SERVICE_LEVELS.ALL.type;
};

const getServicesWithLevelText = (services) => {
  return services.map((service) => ({
    ...service,
    level_text: getServiceLevelText(service),
  }));
};

const getRoomAcronymByRoomType = (id_room_type) => {
  return roomPreferableDistributionJson.find((roomType) => {
    return roomType.id_room_type === id_room_type;
  })?.acronym;
};

const filterHotelsByDay = (services = [], day = "") => {
  return services.filter((service) => {
    const serviceEndDay = service.day.split("-").at(-1);
    if (!isAccommodationPackageService(service.id_service_type)) return true;
    return Number(serviceEndDay) !== day;
  });
};

const filterServicesByLevelConfig = (contents = [], services = []) => {
  if (contents === null) return services;
  const filteredLevelsByConfig = SERVICE_LEVELS_OPTIONS.filter((level) => {
    const existsLevelInConfig = contents.find(
      (content) => content.id_content === level.id_content
    );
    return existsLevelInConfig !== undefined;
  });
  return services.filter((service) => {
    const existsLevelInConfig = filteredLevelsByConfig.find(
      (level) =>
        level.id === service.level || SERVICE_LEVELS.ALL.id === service.level
    );
    return existsLevelInConfig !== undefined;
  });
};

const adaptServiceExportErrors = (errorData, quoteId) => {
  const result = [];

  const getServiceSidebarLink = (serviceId) => {
    const origin = window.location.origin;

    return `${origin}${PATH_INFO.SERVICES.path}?itinerary=${quoteId}&service=${serviceId}&tab=${EDIT_SERVICE_SIDEBAR_TABS.PRICING.urlParam}`;
  };

  if (errorData.services) {
    for (const [id, messages] of Object.entries(errorData.services)) {
      messages.forEach((message) => {
        result.push({
          id: id,
          message: message,
          link: getServiceSidebarLink(id),
        });
      });
    }
  }

  return result;
};

const compareServicesOrderByCode = (initialServices, newServices) => {
  const originalServicesCodes = initialServices.map((service) => service.code);

  const newServicesCodes = newServices.map((service) => service.code);

  const isTheSameArray = originalServicesCodes.every(
    (value, index) => value === newServicesCodes[index]
  );

  return isTheSameArray;
};

export const serviceHelper = {
  isAccommodationPackageService,
  isAccommodationService,
  isPackageService,
  getLargestService,
  getComplementTextByServiceType,
  getStatus,
  hasViewPermission,
  hasAnyViewPermissions,
  hasViewCostPricePermission,
  hasViewSalePricePermission,
  loadOptionsForTableFields,
  formatDestinationsTextForServiceTable,
  adaptServiceToServiceRow,
  getParentLocation,
  getUpdatedUsedRooms,
  getNewAddedRooms,
  getServiceAccumulatePaxsByRooms,
  getProgressBarInfoWhenMovingServices,
  groupServicesRoomsByServiceId,
  getGroupedServicePriceToUpdate,
  transformTimeToHourMinuteSecondFormat,
  getRoomRowClass,
  getIsRoomSelectionCompleted,
  getUpdatedRoomQtyOptions,
  compareObjects,
  deleteRepeatedElements,
  updateRoomPrices,
  isDraftService,
  validateSyncServicePriceAndSupplierForRestServices,
  getServiceIconByServiceType,
  filterServicesOnModals,
  getRoomNightQty,
  getServicesWithIsPriceEditedField,
  calculateServicePrice,
  getServiceSuppliers,
  validateServiceLocationsWhenInserting,
  getDaysToMove,
  getServicesWithLevelText,
  getServiceLevelText,
  getRoomAcronymByRoomType,
  filterHotelsByDay,
  filterServicesByLevelConfig,
  adaptServiceExportErrors,
  compareServicesOrderByCode,
};
