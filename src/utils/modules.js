import { SERVICE_TYPE } from "../constants";
import { isAccommodationDay } from "./day";
import {
  containsServiceById,
  filterServicesWithId,
  filterServicesWithoutId,
  getOrderedServicesByRange,
  isPackageService,
} from "./service";

export const getArrayWithInsertedDays = (
  totalDays,
  newDayIndex,
  daysToInsert
) => {
  const partOne = [...totalDays.slice(0, newDayIndex), ...daysToInsert];
  const daysWithDefault = [...totalDays, {}];
  const partTwo = daysWithDefault.slice(newDayIndex + 1, -1);
  const finalPart = [...partOne, ...partTwo];
  return finalPart;
};

export const getGroupedDays = (days) => {
  const groupedDays = days.map((day) => {
    const orderServicesByRange = getOrderedServicesByRange(day.services);
    const serviceFound = orderServicesByRange.find((dSer) => {
      const { day, id_service_type } = dSer;
      return day.length > 2 && isPackageService(id_service_type);
    });
    const isGrouped = serviceFound !== undefined;
    const groupCode = isGrouped && serviceFound.itinerary_service;
    return {
      ...day,
      isGrouped,
      groupCode,
      groupServiceType: serviceFound?.id_service_type,
    };
  });
  const groupedDaysWithFirstAndLast =
    getGroupedDaysWithFirstAndLast(groupedDays);
  const splitedGroups = splitGroupsDays(groupedDaysWithFirstAndLast);
  const joinedGroups = joinGroupsDays(splitedGroups);
  return getGroupedDaysWithFirstAndLast(joinedGroups);
};

export const getGroupedDaysWithFirstAndLast = (groupedDays) => {
  const formatttedDays = groupedDays.map((cDay) => {
    const firstGroupedDay = groupedDays.find(
      (day) => day.groupCode === cDay.groupCode
    );
    const isFirstGroupedDay = cDay.isGrouped && firstGroupedDay.id === cDay.id;
    const lastGroupedDay = groupedDays.findLast(
      (day) => day.groupCode === cDay.groupCode
    );
    const isLastGroupedDay = cDay.isGrouped && lastGroupedDay.id === cDay.id;
    return { ...cDay, isLastGroupedDay, isFirstGroupedDay };
  });
  return formatttedDays;
};

export const splitGroupsDays = (days) => {
  const groupedDays = days.reduce((acc, day) => {
    const { start_day, services, groupCode = "" } = day;
    const isNotGroupAdded =
      acc?.find((group) => group.groupCode === groupCode) === undefined;
    if (isNotGroupAdded) {
      const groupDays = days.filter((gDay) => gDay.groupCode === groupCode);
      const concatWithPrev =
        services.find((ser) => getStartDay(ser.day) < start_day) !== undefined;
      return [...acc, { groupCode: day.groupCode, groupDays, concatWithPrev }];
    }
    return acc;
  }, []);
  const newGroupedDays = groupedDays.map((group, ind) => {
    const { concatWithPrev = false } = group;
    const newConcatWithPrev =
      ind === 0 || ind === groupedDays.length - 1 ? false : concatWithPrev;
    return { ...group, concatWithPrev: newConcatWithPrev };
  });
  return newGroupedDays;
};

export const joinGroupsDays = (splitedGroups = []) => {
  const newGroupedDays = splitedGroups.reduce((acc, group, ind) => {
    const { groupDays, concatWithPrev, groupCode } = group;
    const nextGroup = splitedGroups[ind + 1];
    if (concatWithPrev) return acc;
    if (nextGroup !== undefined && nextGroup.concatWithPrev) {
      const nextGroupDays = nextGroup.groupDays;
      const newGroupDays = [...groupDays, ...nextGroupDays].map((day) => {
        return { ...day, groupCode: `${groupCode}-${nextGroup.groupCode}` };
      });
      return [...acc, ...newGroupDays];
    }
    return [...acc, ...groupDays];
  }, []);
  return newGroupedDays;
};

export const getGroupRange = (newDay = {}) => {
  if (newDay?.groupCode === undefined) return null;
  const { services, groupServiceType: service_type } = newDay;
  const serviceFound = services.find(
    (ser) => ser.id_service_type === service_type
  );
  if (serviceFound === undefined) return null;
  const groupRange = serviceFound.day + ".";
  return groupRange;
};

export const getStartDay = (day = "") => {
  const start_day = day.split("-")[0];
  return parseInt(start_day);
};

export const filterDaysByOrder = (filteredDays, fromDay, toDay) => {
  const filteredDaysByOrder = filteredDays.filter(
    (day, ind) => ind + 1 > fromDay && ind + 1 < toDay
  );
  return filteredDaysByOrder;
};

export const getDiffDay = (secondArray, mainArray, allElements = false) => {
  const filter = mainArray.filter((el2) => {
    const elFound = secondArray.find((el1) => el1.id === el2.id);
    if (elFound === undefined) return el2;
  });
  return allElements ? filter : filter[0];
};

export const getRelatedDaysByAcco = (
  templateDays = [],
  day = {},
  services = []
) => {
  const from = day.start_day;
  const servicesIds = services.map((ser) => ser.itinerary_service);

  const templateDaysFrom = [...templateDays.slice(from)];
  return templateDaysFrom.filter((day) => {
    const { contains = false } = containsServiceById(day.services, servicesIds);
    if (contains) return day;
  });
};

export const getRelatedDaysByLocation = (
  relatedDays = [],
  itineraryDays = [],
  newDayIndex = 0
) => {
  let stopValidating = false;

  const newRelatedDays = relatedDays.filter((relatedDay, index) => {
    if (stopValidating) return false;
    const matchDayIndex = index + newDayIndex + 1;
    const matchDay = itineraryDays[matchDayIndex];

    const dayLocations =
      matchDay?.location?.map((location) => location?.id) || [];

    const relatedDayLocations =
      relatedDay?.location?.map((location) => {
        return location?.id;
      }) || [];

    const isRelatedLocation = relatedDayLocations?.some((location) => {
      return dayLocations.includes(location);
    });

    if (matchDay === undefined) return relatedDay;
    if (isRelatedLocation || dayLocations.length === 0) return relatedDay;
    stopValidating = true;
  });
  return newRelatedDays;
};

export const getItineraryDaysWithNestedAccommodations = (
  days = [],
  relatedDays = [],
  newDayIndex = 0,
  fromNestDay = false
) => {
  const value = days.reduce(
    (acc, day, index) => {
      const relatedDayIndex = index - newDayIndex - 1;
      const relatedDay = relatedDays[relatedDayIndex];
      const relatedDayServices = relatedDay?.services ?? [];
      const relatedDayAccoServices = filterServicesWithId(
        relatedDayServices,
        SERVICE_TYPE.ACCOMMODATION
      );
      const blockedServicesIds = relatedDayAccoServices.map(
        (service) => service.itinerary_service
      );

      const isAddedToLastDay = newDayIndex === days.length - 1;
      const isLastDay = index === days.length - 1;
      const isNewDay = index === newDayIndex;

      const services =
        relatedDays.length > 0 || !isNewDay
          ? day.services
          : filterServicesWithoutId(day.services, SERVICE_TYPE.ACCOMMODATION);

      if (fromNestDay && isNewDay) {
        const nestedDay = day?.nestedDays?.at(-1);
        const nestedServices =
          relatedDays.length > 0
            ? nestedDay.services
            : filterServicesWithoutId(
                nestedDay.services,
                SERVICE_TYPE.ACCOMMODATION
              );
        const filteredNestedDays = day.nestedDays.filter((nDay) => {
          if (nDay.id !== nestedDay.id) return nDay;
        });
        const newDay = {
          ...day,
          nestedDays: [
            ...filteredNestedDays,
            { ...nestedDay, services: nestedServices },
          ],
        };
        return {
          ...acc,
          itineraryDays: [...acc.itineraryDays, newDay],
          blockedServices: [...acc.blockedServices, ...blockedServicesIds],
        };
      }

      if (isLastDay && isAddedToLastDay) {
        const formattedRelatedDays = relatedDays.reduce(
          (acc, relatedDay, ind) => {
            const relatedDayAccoServices = filterServicesWithId(
              relatedDay.services,
              SERVICE_TYPE.ACCOMMODATION
            );
            const cloneDayId = `${relatedDay.id}-copy-${ind}`;
            const isClonedDay =
              relatedDayAccoServices.length !== relatedDay.services.length;
            const newSubBlockedServicesIds = relatedDayAccoServices.map(
              (service) => service.itinerary_service
            );
            return {
              ...acc,
              relatedDays: [
                ...acc.relatedDays,
                {
                  ...relatedDay,
                  id: isClonedDay ? cloneDayId : relatedDay.id,
                  nestedDays: [],
                  services: relatedDayAccoServices,
                },
              ],
              subBlockedServicesIds: [
                ...acc.subBlockedServicesIds,
                ...newSubBlockedServicesIds,
              ],
            };
          },
          { relatedDays: [], subBlockedServicesIds: [] }
        );

        const { relatedDays: newRelatedDays, subBlockedServicesIds } =
          formattedRelatedDays;

        return {
          ...acc,
          itineraryDays: [...acc.itineraryDays, day, ...newRelatedDays],
          blockedServices: [...acc.blockedServices, ...subBlockedServicesIds],
        };
      }
      if (relatedDay === undefined)
        return {
          ...acc,
          itineraryDays: [
            ...acc.itineraryDays,
            {
              ...day,
              services: services,
            },
          ],
        };

      const cloneDayId = `${relatedDay.id}-copy-${index}`;
      const isClonedDay =
        relatedDayAccoServices.length !== relatedDayServices.length;

      const finalRelatedDay = {
        ...relatedDay,
        id: isClonedDay ? cloneDayId : relatedDay.id,
        services: relatedDayAccoServices,
      };

      const newNestedDays =
        day?.nestedDays === undefined
          ? [finalRelatedDay]
          : [...day.nestedDays, finalRelatedDay];

      const allNestedDays = [day, ...day.nestedDays, ...newNestedDays];

      const filteredNestedDays = Array.from(
        new Set(allNestedDays.map((obj) => obj.entity_uuid))
      ).map((entity_uuid) =>
        allNestedDays.find((obj) => obj.entity_uuid === entity_uuid)
      );

      return {
        ...acc,
        itineraryDays: [
          ...acc.itineraryDays,
          {
            ...day,
            nestedDays: filteredNestedDays.slice(1),
          },
        ],
        blockedServices: [...acc.blockedServices, ...blockedServicesIds],
      };
    },
    { itineraryDays: [], blockedServices: [] }
  );
  return value;
};

export const getDaysWithAccommodationValidations = (
  newDay = {},
  templateDays = [],
  newValue = [],
  fromNestDay = false,
  newDayIndex = 0
) => {
  const { services = [] } = isAccommodationDay(newDay);

  const relatedDays = getRelatedDaysByAcco(templateDays, newDay, services);
  const relatedDaysByLocation = getRelatedDaysByLocation(
    relatedDays,
    newValue,
    newDayIndex
  );
  return getItineraryDaysWithNestedAccommodations(
    newValue,
    relatedDaysByLocation,
    newDayIndex,
    fromNestDay
  );
};

export const getItineraryItemsWithUpdatedNumDay = (currentDays = []) => {
  return currentDays.reduce(
    (accumulator, day) => {
      const updatedDay = updateDayNumDay(day, accumulator.currentNumDay);
      const updatedAccumulator = updateAccumulator(
        accumulator,
        day,
        updatedDay
      );
      return updatedAccumulator;
    },
    {
      currentNumDay: 0,
      days: [],
    }
  ).days;
};

const updateDayNumDay = (day, currentNumDay) => {
  if (!day.isModule) return { ...day, start_day: currentNumDay + 1 };
  const updatedModuleDays = updateModuleDays(day.moduleDays, currentNumDay);
  const firstModuleDay = currentNumDay + 1;
  const lastModuleDay = firstModuleDay + updatedModuleDays.length - 1;
  return {
    ...day,
    moduleDays: updatedModuleDays,
    start_day: firstModuleDay,
    end_day: lastModuleDay,
  };
};

const updateModuleDays = (moduleDays, currentNumDay) => {
  return moduleDays.map((mDay, index) => ({
    ...mDay,
    start_day: currentNumDay + index + 1,
  }));
};

const updateAccumulator = (accumulator, day, updatedDay) => {
  const updatedNumDay = day.isModule
    ? accumulator.currentNumDay + day.moduleDays.length
    : accumulator.currentNumDay + 1;
  const updatedDays = [...accumulator.days, updatedDay];
  return { currentNumDay: updatedNumDay, days: updatedDays };
};

export const helpers = {
  getArrayWithInsertedDays,
  getGroupedDays,
  getGroupedDaysWithFirstAndLast,
  getGroupRange,
  filterDaysByOrder,
  getDiffDay,
  getRelatedDaysByAcco,
  getRelatedDaysByLocation,
  getItineraryDaysWithNestedAccommodations,
  getDaysWithAccommodationValidations,
  containsServiceById,
  getItineraryItemsWithUpdatedNumDay,
};
