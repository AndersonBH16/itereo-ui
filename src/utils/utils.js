import { format, parse, addDays } from "date-fns";
import servicesTypes from "@/data/servicesTypes.json";
import { DATE_FORMAT_YYYY_MM_DD } from "@/constants";

export const addDaysToDate = (date, count = 1) => {
  const parsedDate = parse(date, DATE_FORMAT_YYYY_MM_DD, new Date());
  const newDate = addDays(new Date(parsedDate), count);
  const formattedDate = format(new Date(newDate), DATE_FORMAT_YYYY_MM_DD);
  return formattedDate;
};

export const addPropertiesToObject = (objectPrincipal, objectToUpdate) => {
  Object.entries(objectPrincipal).forEach((principalEntries) => {
    const keyExists = Object.entries(objectToUpdate).findIndex(
      (entriesToUpdate) => entriesToUpdate[0] === principalEntries[0]
    );
    if (keyExists >= 0) {
      objectToUpdate[principalEntries[0]] =
        objectToUpdate[principalEntries[0]] || principalEntries[1];
    } else {
      objectToUpdate[principalEntries[0]] = principalEntries[1];
    }
  });
  return objectToUpdate;
};

export const calculateDays = (startDate, endDate) => {
  const time = new Date(endDate) - new Date(startDate);
  return time >= 0 ? time / (1000 * 60 * 60 * 24) + 1 : 1;
};

export const calculateDuration = (string) => {
  const days = string.replace(/\s+/g, "").split("-");
  let duration = 0;
  if (days && days.length > 0 && days[1]) {
    duration = Number(days[1]) - Number(days[0]);
  }
  return duration;
};

export const calculateMax = (ranges, qty) => {
  //actualizo el maximo de personas permitidos
  const calculated_max = Math.max.apply(
    Math,
    ranges.map((item) => item.to_qty)
  );
  return calculated_max < qty ? calculated_max : qty;
};

export const deleteObjectProperties = (data, properties) => {
  if (Array.isArray(properties) && properties.length) {
    properties.forEach((property) => {
      delete data[property];
    });
  } else {
    throw new Error(
      "Properties must be an array, and have at least one element."
    );
  }
};

export const disableScroll = () => {
  // disable scroll
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop + 10);
  };
  // enable scroll
  setTimeout(() => {
    window.onscroll = function () {};
  }, 200);
};

export const formatNumber = (number) => {
  let numberFormated = String(number);
  if (numberFormated.length) {
    const numbers = numberFormated.split(".");
    if (numbers.length) {
      const entires = numbers[0];
      if (entires.length > 3) {
        const thousands = entires.slice(0, -3);
        const hundreds = entires.slice(-3);
        numberFormated = `${thousands},${hundreds}${
          numbers.length > 1 ? `.${numbers[1]}` : ""
        }`;
      } else {
        numberFormated = `${numbers[0]}${
          numbers.length > 1 ? `.${numbers[1]}` : ""
        }`;
      }
    }
  }
  return numberFormated;
};

export const getMaxDateInArray = (data, key) => {
  if (Array.isArray(data) && data.length) {
    let maxDate = data[0][key];
    data.forEach((item) => {
      if (parse(item[key]) > parse(maxDate)) {
        maxDate = item[key];
      }
    });
    return maxDate;
  }
};

export const getFirstDayFromString = (string) => {
  const days = string.replace(/\s+/g, "").split("-");
  let firstDayFromString = 0;
  if (days && days.length > 0 && days[0]) {
    firstDayFromString = Number(days[0]);
  }
  return firstDayFromString;
};

export const getSalesManualUUID = (itinerary, client_contracts) => {
  let salesManualUUID = "";
  if (
    itinerary &&
    itinerary.data &&
    client_contracts &&
    client_contracts.length
  ) {
    const itineraryContractId = itinerary.data.contract_id || "";
    const clientContract = client_contracts.filter(
      (contract) => contract.id === itineraryContractId
    );
    if (clientContract && clientContract.length) {
      // set Sales Manual UUID from client contract, for now this will be the first in array of client contract
      salesManualUUID =
        clientContract[0].sales_manual_contract &&
        clientContract[0].sales_manual_contract.data &&
        clientContract[0].sales_manual_contract.data.length
          ? clientContract[0].sales_manual_contract.data[0].id_sales_manual
          : "";
    }
  }
  return salesManualUUID;
};

export const getServiceTypeNameById = (id) => {
  const serviceType = servicesTypes.filter(({ entity_id }) => entity_id === id);
  return serviceType && serviceType.length > 0
    ? serviceType[0].service_type_name
    : "";
};

export const maxDate = (servicesItinerary, itinerary) => {
  let max_date = Math.max.apply(
    Math,
    servicesItinerary.map((service) => {
      return service.end_date ? new Date(service.end_date + " 00:00:00") : 0;
    })
  );
  max_date =
    max_date != "-Infinity"
      ? new Date(max_date)
      : new Date(itinerary.start_date + " 00:00:00");
  return max_date;
};

export const openToast = (buefy, messsage, type = "is-danger") => {
  return buefy.toast.open({
    duration: 5000,
    message: messsage,
    position: "is-top",
    type,
  });
};

export const setDay = (startDate, endDate, itinerary, newStartDate = null) => {
  let days = 0;
  let itineraryStartDate = itinerary.start_date;
  if (newStartDate) {
    itineraryStartDate = newStartDate;
  }
  if (itinerary.numDay) {
    days = itinerary.numDay;
  } else {
    days = calculateDays(itineraryStartDate, itinerary.end_date);
  }
  const itineraryDates = [];
  const daysFromStartDate = calculateDays(itineraryStartDate, startDate);
  const daysFromEndDate = calculateDays(itineraryStartDate, endDate);

  for (let i = 0; i < days; i++) {
    const startDateItinerary = parse(itineraryStartDate);
    const parseDate = parse(
      startDateItinerary.setDate(startDateItinerary.getDate() + i)
    );
    const date = format(parseDate, DATE_FORMAT_YYYY_MM_DD);
    itineraryDates.push({ date, day: i + 1 });
  }

  if (startDate == endDate) {
    const day = itineraryDates.filter((e) => e.date === startDate)[0]?.day;
    return day ? day : daysFromStartDate;
  } else {
    const startDay = itineraryDates.filter((e) => e.date === startDate)[0]?.day;
    const endDay =
      itineraryDates.filter((e) => e.date === endDate)[0]?.day ?? "";
    if (startDay && endDay) {
      return `${startDay}-${endDay}`;
    } else if (startDay && !endDay) {
      return `${startDay}-${daysFromEndDate}`;
    } else if (!startDay && endDay) {
      return `${daysFromStartDate}-${endDay}`;
    } else {
      return `${daysFromStartDate}-${daysFromEndDate}`;
    }
  }
};

export const setItemToLocalStorage = (id, data) => {
  localStorage.setItem(`${id}`, JSON.stringify(data));
};

export const setLevel = (value) => {
  let level = 0;
  switch (value) {
    case "All":
      level = 0;
      break;
    case "Com":
      level = 1;
      break;
    case "Sup":
      level = 2;
      break;
    case "Lux":
      level = 3;
      break;
    default:
      level = 0;
  }
  return level;
};

export const setDatesFromDay = (
  value,
  id_service_type,
  itineraryStartDate = ""
) => {
  let day = value;
  let startDate = itineraryStartDate;
  let endDate = itineraryStartDate;

  const days = day.replace(/^[0-9]{3,4}(-[0-9]{3,4})?$]/g, "").split(/[, -]+/);
  if (days && days.length > 0 && days[0] !== "") {
    const firstDay = Number(days[0]) || null;
    const secondDay = Number(days[1]) || null;

    if (firstDay > 0) {
      const parseItineraryStartDate = parse(new Date(itineraryStartDate));
      const newStartDate = parse(
        parseItineraryStartDate.setDate(
          parseItineraryStartDate.getDate() + firstDay
        )
      );
      if ((firstDay && !secondDay) || firstDay === secondDay) {
        startDate = endDate = format(newStartDate, DATE_FORMAT_YYYY_MM_DD);
        day = `${firstDay}`;
      } else if (firstDay && secondDay && secondDay < firstDay) {
        startDate = endDate = format(newStartDate, DATE_FORMAT_YYYY_MM_DD);
        day = `${firstDay}`;
      } else if (firstDay && secondDay && secondDay > firstDay) {
        //only for accommodations
        startDate = format(newStartDate, DATE_FORMAT_YYYY_MM_DD);
        const newParseItineraryStartDate = parse(new Date(itineraryStartDate));
        const newEndDate = parse(
          newParseItineraryStartDate.setDate(
            newParseItineraryStartDate.getDate() + Number(days[1])
          )
        );
        endDate = format(newEndDate, DATE_FORMAT_YYYY_MM_DD);
        day = `${firstDay}-${secondDay}`;
      } else {
        //rest of services
        day = `${firstDay}`;
        startDate = endDate = format(newStartDate, DATE_FORMAT_YYYY_MM_DD);
      }
    } else if (Number(days[0]) === 0 || Number(days[1]) === 0) {
      return {
        error: true,
        message: "Day must be upper than 0.",
        day: 1,
      };
    } else {
      return {
        error: true,
        message: "Incorrect value. Day must be a number.",
        day: 1,
      };
    }
  } else {
    //empty value
    startDate = endDate = format(startDate, DATE_FORMAT_YYYY_MM_DD);
  }
  return {
    startDate,
    endDate,
    day,
  };
};

export const showIconByServiceType = (id) => {
  const serviceType = servicesTypes.filter(
    (service) => service.entity_id === id
  );
  return serviceType.length !== 0 ? serviceType[0].icon : "";
};

export const scrollTo = (element, index) => {
  const elementSelected = element[index];
  if (elementSelected === undefined) return;
  const elementRect = element[index].getBoundingClientRect();
  window.scroll({
    top: elementRect.top + 3000,
    left: 0,
    behavior: "smooth",
  });
};

export const transformTextArrayToArray = (text) => {
  if (text.replace(/[{}]/g, "").trim().length === 0) return [];
  return text.replace(/[{}]/g, "").trim().split(",");
};

export const getObjectWithDefinedKeys = (object = {}) => {
  return Object.keys(object).reduce((acc, key) => {
    if (object[key] !== undefined) acc[key] = object[key];
    return acc;
  }, {});
};

export const isAllLocation = (location) => {
  return !location || location === "All" || location === "";
};

export const getLocationCode = (location) => {
  return typeof location === "object" && location != null
    ? location.location_code
    : location;
};

const pointCursorAtTheEnd = (inputElementPath) => {
  const inputElement = document.querySelector(inputElementPath);
  inputElement.focus();
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(inputElement);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);

  inputElement.scrollTop += 100000;
};

export const utilsHelper = {
  pointCursorAtTheEnd,
};
