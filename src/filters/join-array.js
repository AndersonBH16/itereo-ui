const customJoin = {};

function joinArray(array, field, separator = ", ") {
  if (array && Array.isArray(array)) {
    return array.map((a) => a[field]).join(separator);
  }
  return "";
}

customJoin.install = function (Vue) {
  Vue.filter("customJoin", (value, field) => {
    return joinArray(value, field);
  });
};

export default customJoin;
