import { format } from "date-fns";
import { DATE_FORMAT_YYYY_MM_DD } from "@/constants";
import {
  QUOTES_SEARCH_PARAM_SEPARATOR,
  DEFAULT_FORM_ITINERARY,
} from "@/constants/itinerary";
import { pricesHelper } from "./prices";
import { deleteObjectProperties } from "@/utils/utils";

export const parseDayImagesToString = (dayImages = []) => {
  if (typeof dayImages === "string") return dayImages;
  if (dayImages?.length === 0 || dayImages === null) return null;
  const imagesId = dayImages.map((img) => img.id);
  const newImageField = "{" + imagesId.join(",") + "}";
  return newImageField;
};

export const adapterReorderedDayToFetch = (day) => {
  const adaptedDay = {
    ...day,
    images:
      parseDayImagesToString(
        day.nestedDays?.flatMap((nDay) => nDay.images_full)
      ) || day.images,
    images_full:
      day.nestedDays?.flatMap((nDay) => nDay.images_full) || day.images_full,
    description: {
      ...day.description,
    },
    services: day.nestedDays?.flatMap((nDay) => nDay.services) || [],
    location: day.nestedDays?.flatMap((nDay) => nDay.location) || day.location,
    title: {
      ...day.title,
    },
    id: day.isTemplateDay ? null : day.id,
  };
  deleteObjectProperties(adaptedDay, ["servicesToDisplay", "nestedDays"]);
  return adaptedDay;
};

export const adapterItineraryDaysToSave = (itineraryDays) => {
  const newReorderedDays = itineraryDays.map((day) => {
    return adapterReorderedDayToFetch(day);
  });
  return newReorderedDays;
};

const validatedPriceLevelsOrder = (priceSellers = []) => {
  return priceSellers.map((priceSeller) => {
    return {
      ...priceSeller,
      prices: priceSeller.prices.sort((a, b) => a.level - b.level),
    };
  });
};

const adaptPricesToPaxPrices = (allSellersTypes = []) => {
  const allPricesLevels = allSellersTypes.flatMap((seller) => {
    return seller.prices.map((price) => {
      return { ...price, sellerType: seller.type, priceId: seller.entity_id };
    });
  });
  const allPaxs = allPricesLevels.flatMap((price) => {
    return price.pax_prices.map((pax) => {
      return {
        ...pax,
        level: pricesHelper.getPriceLevelId(price),
        sellerType: price.sellerType,
        priceId: price.priceId,
      };
    });
  });

  const filteredPaxsBySameId = allPaxs.reduce((acc, pax) => {
    const paxFound = acc.find((item) => item.pax_id === pax.pax_id);
    if (paxFound) return acc;
    return [...acc, pax];
  }, []);

  return filteredPaxsBySameId.map((pax) => {
    return {
      passenger: null,
      pax_id: pax.pax_id,
      price_levels: allSellersTypes.map((sellerType) => {
        return {
          type: sellerType.type,
          id: sellerType.id,
          prices: allPaxs.filter((price) => {
            return (
              price.pax_id === pax.pax_id &&
              price.sellerType === sellerType.type
            );
          }),
        };
      }),
    };
  });
};

const mapPaxsPricesAndPassengers = (paxsPrices = [], passengers = []) => {
  return paxsPrices.map((pax) => {
    return {
      ...pax,
      passenger: passengers?.find((passenger) => passenger.id === pax.pax_id),
    };
  });
};

const adaptItineraryToFormItinerary = (itinerary = null) => {
  return {
    id: itinerary.id,
    title: itinerary.title,
    code: itinerary.code,
    client_id: itinerary.client.id,
    status: itinerary.status.id,
    start_date: itinerary.start_date,
    end_date: itinerary.end_date,
    language_id: itinerary.language.id,
    currency_id: itinerary.currency.id,
    num_pax: itinerary.num_pax,
    num_day: itinerary.num_day,
    description: itinerary.description,
    location: itinerary.location,
    version: itinerary.version,
    contract_id: itinerary.contract_id,
    itinerary_type_id: itinerary.itinerary_type_id,
    tags: itinerary.tags,
  };
};

export const getNumberOfStepsParamsFromPayload = (payload) => {
  const params = [
    `cur_step=${payload.cur_step ? payload.cur_step : 1}`,
    `last_step=${payload.last_step ? payload.last_step : 1}`,
  ].join("&");
  return `?${params}`;
};

const adaptedSortingPriorityToParamsFormat = (sortingPriority = []) => {
  return sortingPriority.reduce((acc, priority, index) => {
    const postText = index === sortingPriority.length - 1 ? "" : ",";
    return acc + `${priority.field}.${priority.order}${postText}`;
  }, "");
};

const adaptServiceToAdd = (service, parentService) => {
  return {
    code: service.code,
    name: service.name,
    end_date_inactivity: service.end_date_inactivity,
    start_date_inactivity: service.start_date_inactivity,
    name_type_service: service.name_type_service,
    location: service.location,
    id_service_type: service.id_service_type,
    days_services: service.days_services,
    service_price: [],
    service_supplier: [],
    contract_user: null,
    contract: null,
    notes: parentService.notes,
    description: parentService.description,
    recommendations: parentService.recommendations,
    images: parentService.images,
    calculate_room_distribution: 1,
    calculate_prices: 1,
    info: 1,
    service: service.id,
    id: null,
    start_date: service.start_date,
    end_date: service.end_date,
    level: service.level,
    num_pax: service.num_pax,
    day: service.day,
    status: service.status,
    visible: service.visible,
  };
};

const adaptPayloadToGetQuotes = (payload) => {
  return {
    ...payload,
    from: payload.from ? format(payload.from, DATE_FORMAT_YYYY_MM_DD) : "",
    to: payload.to ? format(payload.to, DATE_FORMAT_YYYY_MM_DD) : "",
    creation: payload.creation
      ? format(payload.creation, DATE_FORMAT_YYYY_MM_DD)
      : "",
    tags:
      payload?.tags?.length > 0
        ? payload.tags.map((tag) => tag.id)?.join(",")
        : "",
    title: payload?.title?.join(QUOTES_SEARCH_PARAM_SEPARATOR) || "",
    code: payload?.title?.join(QUOTES_SEARCH_PARAM_SEPARATOR) || "",
    type:
      payload.itinerary_type_id || DEFAULT_FORM_ITINERARY[0].itinerary_type_id,
  };
};

const adaptQuotesByTimeResponse = (response) => {
  return {
    labels: response.labels.slice(0, 9).reverse(),
    datasets: response.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.slice(0, 9).reverse(),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    })),
  };
};

const adaptRequestsByStagesResponse = (response) => {
  return {
    labels: response.labels,
    datasets: [
      {
        label: "Requests By Stages",
        data: response.datasets[0].data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
};

const adaptQuotesByClientsResponse = (response) => {
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#0F7343", "#FF9316"];

  return {
    labels: response.labels,
    datasets: [
      {
        label: "Requests By Clients",
        data: response.datasets[0].data,
        backgroundColor: colors.slice(0, response.labels.length),
        hoverBackgroundColor: colors.slice(0, response.labels.length),
      },
    ],
  };
};

const adaptQuotesByDestinationsResponse = (response) => {
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#0F7343", "#FF9316"];

  return {
    labels: response.labels,
    datasets: [
      {
        label: "Requests By Destinations",
        data: response.datasets[0].data,
        backgroundColor: colors.slice(0, response.labels.length),
        hoverBackgroundColor: colors.slice(0, response.labels.length),
      },
    ],
  };
};

const imagesStringToArray = (imagesString) => {
  if (!imagesString || typeof imagesString !== "string") return [];

  return imagesString
    .slice(1, -1)
    .split(",")
    .map(function (id) {
      return id.trim();
    });
};

const adaptQuoteToQuoteVersion = (quote, services, prices) => {
  return {
    ...quote,
    services,
    service_itinerary: services,
    prices,
  };
};

export const helpers = {
  adapterItineraryDaysToSave,
  adapterReorderedDayToFetch,
  parseDayImagesToString,
  adaptPricesToPaxPrices,
  mapPaxsPricesAndPassengers,
  adaptItineraryToFormItinerary,
  getNumberOfStepsParamsFromPayload,
  adaptedSortingPriorityToParamsFormat,
  validatedPriceLevelsOrder,
  adaptServiceToAdd,
  adaptPayloadToGetQuotes,
  adaptQuotesByTimeResponse,
  adaptQuotesByClientsResponse,
  adaptRequestsByStagesResponse,
  adaptQuotesByDestinationsResponse,
  imagesStringToArray,
  adaptQuoteToQuoteVersion,
};
