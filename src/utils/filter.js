export const filterByKey = (array, key, value) => {
  return array.filter((item) => item[key] === value);
};

export const findByKey = (array, key, value) => {
  return array.find((item) => item[key] === value);
};

export const cutArrayToLimit = (array, limitIndex) => {
  return array.filter((el, ind) => ind < limitIndex);
};
