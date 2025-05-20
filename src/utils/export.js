import servicesTypes from "@/data/servicesTypes.json";
import axios from "axios";
import { TEMPLATE_CONFIG_PRICES_LEVELS } from "@/constants/exportConfig";

export const adaptBase64ImgToJPG = (base64 = "") => {
  const base64WithOutPrefix = base64.split(";")[1];
  return `data:image/jpg;${base64WithOutPrefix}`;
};

export const parseHtmlToPlainText = (html = "") => {
  const htmlDom = new DOMParser().parseFromString(html, "text/html");
  return htmlDom.documentElement.textContent;
};

export const base64DataURLToArrayBuffer = (dataURL) => {
  const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
  if (!base64Regex.test(dataURL)) {
    return false;
  }
  const stringBase64 = dataURL.replace(base64Regex, "");
  let binaryString;
  if (typeof window !== "undefined") {
    binaryString = window.atob(stringBase64);
  } else {
    binaryString = new Buffer(stringBase64, "base64").toString("binary");
  }
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes.buffer;
};

export const getBase64Image = async (imgUrl = "") => {
  const response = await Promise.allSettled([
    axios.get(imgUrl, {
      responseType: "arraybuffer",
      withCredentials: false,
    }),
  ]);
  if (!response?.[0]?.value?.data || response?.[0]?.status === "rejected")
    return null;
  const imageBuffer = Buffer.from(response[0].value.data, "binary").toString(
    "base64"
  );
  return "data:image/jpg;base64," + imageBuffer;
};

export let servicesTypesWithIcons = [];

export const getServicesTypesWithIcons = async () => {
  if (servicesTypesWithIcons.length > 0) return servicesTypesWithIcons;

  const data = await Promise.allSettled(
    servicesTypes.map(async (serviceType) => {
      const serviceTypeUrl = getIconPathByServiceType(serviceType.entity_id);
      return {
        iconBase64: await getBase64Image(serviceTypeUrl),
        ...serviceType,
      };
    })
  );
  servicesTypesWithIcons = data.map(({ value }) => value);
  return servicesTypesWithIcons;
};

const getCurrentPath = () => {
  return window.location.origin;
};

const getDefaultLogoImage = () => {
  return `${window.location.origin}/img/blank-logo.png`;
};

export const getIconPathByServiceType = (id) => {
  const serviceType = servicesTypes.find((service) => service.entity_id === id);
  const acronym = serviceType.service_acronym.toLowerCase();
  return `${window.location.origin}/img/service_type_${acronym}.png`;
};

const getColorsWithoutDuplicated = (colors = []) => {
  return colors?.filter(
    (color, index, array) =>
      index === array.findIndex((el) => el.type === color.type)
  );
};

const getImageResolutionFromBase64 = (imageSrc = "") => {
  return new Promise((resolve) => {
    let image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const resolution = {
        width: image.width,
        height: image.height,
      };
      resolve(resolution);
    };
  });
};

const getTemplateContentsTypes = (contentsSelected) => {
  const pricesLevelsConfig = contentsSelected?.flatMap(
    (content) => content.id_content
  );
  return pricesLevelsConfig ?? [];
};

const getPricesLevelByType = (
  itineraryPricesLevels,
  pricesLevelsConfig,
  PRICES_LEVEL_IDS
) => {
  const pricesLevelsFiltered = itineraryPricesLevels?.filter((priceLevel) => {
    const levelPriceId = PRICES_LEVEL_IDS[priceLevel.type];
    return pricesLevelsConfig.includes(levelPriceId);
  });
  return pricesLevelsFiltered ?? [];
};

const getPricesLevelByTotal = (pricesLevelsFiltered) => {
  const filteredByTotalPrice = pricesLevelsFiltered?.filter((price) => {
    return price.total > 0;
  });
  return filteredByTotalPrice;
};

const getPricesLevelFiltered = (contentsSelected, itineraryPricesLevels) => {
  const pricesLevelsConfig = getTemplateContentsTypes(contentsSelected);
  const pricesLevelsFiltered = getPricesLevelByType(
    itineraryPricesLevels,
    pricesLevelsConfig,
    TEMPLATE_CONFIG_PRICES_LEVELS
  );
  const filteredByTotalPrice = getPricesLevelByTotal(pricesLevelsFiltered);

  return filteredByTotalPrice ?? [];
};

const isSectionDisplayed = (contentsSelected, idSection) => {
  const isNotConfig = contentsSelected?.find(
    (section) => section.id_content === idSection
  );
  return isNotConfig !== undefined;
};

export const exportHelper = {
  adaptBase64ImgToJPG,
  parseHtmlToPlainText,
  base64DataURLToArrayBuffer,
  getBase64Image,
  getServicesTypesWithIcons,
  getColorsWithoutDuplicated,
  getCurrentPath,
  getDefaultLogoImage,
  getImageResolutionFromBase64,
  getPricesLevelFiltered,
  isSectionDisplayed,
};
