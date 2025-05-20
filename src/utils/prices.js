import { SERVICE_ROW_FIELDS } from "@/constants/services";

export const getPriceLevelId = (priceLevel) => {
  if (priceLevel.level !== undefined) return priceLevel.level;
  const pricesLevelsTypes = ["Comfort", "Superior", "Luxury"];
  const currentPriceLevel =
    pricesLevelsTypes.findIndex((type) => type === priceLevel.type) + 1;
  return currentPriceLevel;
};

export const calculatePriceLevels = (pricesLevels = [], paxsPrices = []) => {
  return pricesLevels.map((priceLevel) => {
    const currentPriceLevel = getPriceLevelId(priceLevel);
    const totalPriceLevel = paxsPrices?.reduce((acc, pax) => {
      const paxPriceLevelFound =
        pax.price_levels.find(
          (paxPriceLevel) => paxPriceLevel.level === currentPriceLevel
        ) || {};
      return acc + (paxPriceLevelFound?.total_price || 0);
    }, 0);
    return {
      ...priceLevel,
      total: totalPriceLevel,
    };
  });
};

export const calculatePricesParam = (
  fieldUpdated = "",
  forcedCalculatePricesValue = null
) => {
  if (forcedCalculatePricesValue !== null) return forcedCalculatePricesValue;
  const isCoRelatedFieldUpdated = [
    SERVICE_ROW_FIELDS.NUM_PAX,
    SERVICE_ROW_FIELDS.END_DATE,
    SERVICE_ROW_FIELDS.START_DATE,
    SERVICE_ROW_FIELDS.DAY,
  ].includes(fieldUpdated);

  return isCoRelatedFieldUpdated ? 1 : 0;
};

export const calculatePaxLevelsPrices = ({
  paxsPrices,
  valueType = "",
  value = 0,
  paxLevel = {},
}) => {
  return paxsPrices.map((pax) => {
    if (pax.pax_id !== paxLevel.pax_id) return pax;
    const newPricesLevels = pax.price_levels.map((priceLevel) => {
      return getNewPriceLevelCloned(valueType, value, priceLevel);
    });
    return { ...pax, price_levels: newPricesLevels };
  });
};

export const calculateLevelPaxsPrices = ({
  paxsPrices,
  valueType = "",
  value = 0,
  paxLevel = {},
}) => {
  return paxsPrices.map((pax) => {
    const newPricesLevels = pax.price_levels.map((priceLevel) => {
      if (priceLevel.level !== Number(paxLevel.level)) return priceLevel;
      return getNewPriceLevelCloned(valueType, value, priceLevel);
    });
    return { ...pax, price_levels: newPricesLevels };
  });
};

export const calculateAllPaxPrices = ({
  paxsPrices,
  valueType = "",
  value = 0,
}) => {
  return paxsPrices.map((pax) => {
    const newPricesLevels = pax.price_levels.map((priceLevel) => {
      return getNewPriceLevelCloned(valueType, value, priceLevel);
    });
    return { ...pax, price_levels: newPricesLevels };
  });
};

const getNewPriceLevelCloned = (valueType = "", value = 0, priceLevel = {}) => {
  let newPriceLevel = { ...priceLevel };
  if (valueType === "Upsales") {
    newPriceLevel.mkt_percentage = value;
    newPriceLevel.mkt_coin =
      (newPriceLevel.price * newPriceLevel.mkt_percentage) / 100;
  } else if (valueType === "Fee") {
    newPriceLevel.fee = value;
  }
  newPriceLevel.total_price =
    priceLevel.price + newPriceLevel.mkt_coin + newPriceLevel.fee;
  return formatPaxPriceTo2Decimals(newPriceLevel);
};

export const calculatePaxPricesByActionType = (
  paxsPrices,
  actionType = "",
  valueType = "",
  value = 0,
  paxLevel = {}
) => {
  const props = { paxsPrices, valueType, value, paxLevel };
  return copyPaxPricesFunctions[actionType](props);
};

export const copyPaxPricesFunctions = {
  row: calculatePaxLevelsPrices,
  column: calculateLevelPaxsPrices,
  all: calculateAllPaxPrices,
};

const formatPaxPriceTo2Decimals = (paxPrice = {}) => {
  return {
    ...paxPrice,
    mkt_coin: Number((paxPrice.mkt_coin || 0)?.toFixed(2)),
    mkt_percentage: Number((paxPrice.mkt_percentage || 0)?.toFixed(2)),
    fee: Number((paxPrice.fee || 0)?.toFixed(2)),
    total_price: Math.ceil(paxPrice.total_price || 0),
  };
};

export const pricesHelper = {
  calculatePricesParam,
  calculatePaxLevelsPrices,
  calculateLevelPaxsPrices,
  calculateAllPaxPrices,
  calculatePaxPricesByActionType,
  calculatePriceLevels,
  getPriceLevelId,
  formatPaxPriceTo2Decimals,
};
