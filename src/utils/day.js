import { isAccommodationService } from "./service";

export const isAccommodationDay = (day = {}) => {
  const { services = [] } = day;
  const containsAccommodation = services?.some((ser) => {
    return isAccommodationService(ser?.id_service_type);
  });
  return {
    isAccommodation: containsAccommodation,
    services: services?.filter((ser) =>
      isAccommodationService(ser?.id_service_type)
    ),
  };
};

export const dayHelpers = {
  isAccommodationDay,
};
