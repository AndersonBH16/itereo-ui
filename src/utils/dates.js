import { parse, format } from "date-fns";
import { DATE_FORMAT_YYYY_MM_DD } from "@/constants";

export const checkDayLimit = (day = "") => {
  const date = new Date();
  const today = date.getUTCDate();
  return day < today;
};

export const checkMonthLimit = (month = "") => {
  const date = new Date();
  const thisMonth = date.getUTCMonth();
  return month < thisMonth;
};

export const checkYearLimit = (year = "") => {
  const date = new Date();
  const thisYear = date.getUTCFullYear();
  return year < thisYear;
};

export const getDateObject = (date = "") => {
  const dateString = `${date}T00:00:00.000Z`;
  const newDate = new Date(dateString);
  return new Date(newDate.toISOString().slice(0, -1));
};

const getDatesDiffByDates = (date_1, date_2) => {
  const date1 = new Date(date_1);
  const date2 = new Date(date_2);
  const difference = date1.getTime() - date2.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
};

const getDatesDiffByDay = (oldDay, newDay) => {
  const newStartDay = `${newDay}`.split("-")[0];
  const oldStartDay = `${oldDay}`.split("-")[0];
  return Number(newStartDay) - Number(oldStartDay);
};

const getDateRangeByDay = (day) => {
  const newStartDay = `${day}`.split("-").at(0);
  const oldStartDay = `${day}`.split("-").at(-1);
  return Number(oldStartDay) - Number(newStartDay);
};

const getEndDateOfServiceList = (services = []) => {
  return services?.reduce((acc, service) => {
    const newEndDate = getDateObject(service.end_date);
    const currentEndDate = getDateObject(acc.end_date);
    return newEndDate > currentEndDate ? service : acc;
  }, services[0]);
};

const getStartDateOfServiceList = (services = []) => {
  return services?.reduce((acc, service) => {
    const newStartDate = getDateObject(service.start_date);
    const currentStartDate = getDateObject(acc.start_date);
    return newStartDate < currentStartDate ? service : acc;
  }, services[0]);
};

const getDateWithAddedDays = (date, daysToMove) => {
  const parsedDate = parse(date);
  parsedDate.setDate(parsedDate.getDate() + daysToMove);
  return format(parsedDate, DATE_FORMAT_YYYY_MM_DD);
};

const getDatetimeFromUTC = (date, dateFormat = "") => {
  const formattedDate = format(date, dateFormat);
  const formattedTime = format(date, "HH:mm");
  return `${formattedDate}-${formattedTime}`;
};

const getDayPosition = (dateRange, specificDateArray) => {
  const generateDatesArray = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Array.from(
      { length: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1 },
      (_, i) => new Date(start.getTime() + i * (1000 * 60 * 60 * 24))
    );
  };

  const initialStartDate = new Date(dateRange[0]);
  const initialEndDate = new Date(dateRange[1]);

  const startSpecificDate = new Date(specificDateArray[0]);
  const endSpecificDate = new Date(specificDateArray[1]);

  const extendedStartDate = new Date(
    Math.min(initialStartDate.getTime(), startSpecificDate.getTime())
  );
  const extendedEndDate = new Date(
    Math.max(initialEndDate.getTime(), endSpecificDate.getTime())
  );

  const allDates = generateDatesArray(extendedStartDate, extendedEndDate);

  const isSingleDate =
    startSpecificDate.getTime() === endSpecificDate.getTime();

  const startPosition =
    allDates.findIndex(
      (date) => date.getTime() === startSpecificDate.getTime()
    ) + 1;
  const endPosition = isSingleDate
    ? startPosition
    : allDates.findIndex(
        (date) => date.getTime() === endSpecificDate.getTime()
      ) + 1;

  return startPosition > 0 && endPosition > 0
    ? isSingleDate
      ? `${startPosition}`
      : `${startPosition}-${endPosition}`
    : "-1";
};

const formatToHourAndMinutes = (timeString = "") => {
  const timeParts = timeString.split(":");
  return `${timeParts[0]}:${timeParts[1]}`;
};

const validateCheckInAndCheckOut = (timeString = "") => {
  const notValidTimeStrings = ["00:00:00", "00:00", "", null];
  return notValidTimeStrings.includes(timeString)
    ? ""
    : formatToHourAndMinutes(timeString);
};

export const datesHelper = {
  checkDayLimit,
  checkMonthLimit,
  checkYearLimit,
  getDatesDiffByDates,
  getDatesDiffByDay,
  getDateRangeByDay,
  getEndDateOfServiceList,
  getStartDateOfServiceList,
  getDateWithAddedDays,
  getDatetimeFromUTC,
  getDayPosition,
  validateCheckInAndCheckOut,
};
