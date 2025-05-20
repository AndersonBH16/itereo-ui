import { format, parse } from "date-fns";
import { DATE_FORMAT_YYYY_MM_DD } from "@/constants";
// // https://date-fns.org/v1.30.1/docs/format

const customDate = {};

function formatDate(date, formatString = "ddd, MMM DD, YYYY") {
  const parseString = DATE_FORMAT_YYYY_MM_DD;
  if (date === "") {
    return "";
  }
  const parseDate = parse(date, parseString, new Date());
  return format(parseDate, formatString);
}

customDate.install = function (Vue) {
  Vue.filter("customDate", (value, format) => {
    return formatDate(value, format);
  });
};

export default customDate;
