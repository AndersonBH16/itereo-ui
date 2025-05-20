// ////////////////////////////////////////////////////////////////////////////
// Utils
// ////////////////////////////////////////////////////////////////////////////

import { USER_ROLE } from "@/constants";
import { LANGUAGES_CODES } from "@/constants/itinerary";

export default {
  preventHTMLEscaping(value) {
    return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  },
  sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  },
  isProUser(authData) {
    if (!authData) return false;
    return authData.user_type.name === "pro";
  },
  hasAnyRoles(user, roles = [], includeAdmin = true) {
    if (includeAdmin) {
      roles.push(USER_ROLE.ADMIN);
      roles.push(USER_ROLE.CLIENT_ADMIN);
    }
    return user.roles.data.some((role) => roles.includes(role.name));
  },
  hasAllPermissions(authData, permissions = [], includeAdmin = true) {
    if (!authData) return false;
    if (includeAdmin && this.hasAnyRoles(authData.user, [])) return true;

    return permissions.every((permission) =>
      authData.permissions.some((p) => p.name === permission)
    );
  },
  hasPermission(authData, permission, includeAdmin = true) {
    return this.hasAllPermissions(authData, [permission], includeAdmin);
  },
  printCopyright() {
    const styles = [
      "background:#30a8de;padding:1px;border-radius:3px;color: #fff",
      "background:transparent;",
    ];
    const message =
      "Powered by ITEREO Travel Planner - All rights reserved: ©Global Encounters™ 1999-";
    console.log(`%c ${message}${new Date().getFullYear()} `, styles[0]);
  },
  backgroundImage(url) {
    const bgUrl = url;
    const bgPosition = "background-position: center top;";
    const bgSize = "background-size: cover;";
    const bgRepeat = "background-repeat: no-repeat;";
    const bgImage = `background-image: url(${bgUrl});`;
    return `${bgPosition}${bgSize}${bgRepeat}${bgImage}`;
  },
  filterPriceType(type, prices) {
    //filter prices by type (comfort, luxury or superior)
    return prices.filter((price) => price.type == type);
  },
  calculateSubTotalServices(services, prices, type) {
    var level = 0;
    switch (type) {
      case "Comfort":
        level = 1;
        break;
      case "Superior":
        level = 2;
        break;
      case "Luxury":
        level = 3;
        break;
    }
    return Number(
      services.length
        ? services.reduce((a, b) => {
            var sum =
              b.id_service_type != 9 &&
              b.id_service_type != 2 &&
              (b.level == 0 || b.level == level)
                ? b.price
                  ? Number(b.price)
                  : 0
                : 0;
            return a + sum;
          }, 0)
        : prices.length
        ? Number(prices[0].sub_total_service)
        : 0
    );
  },
  getPercentPerService(data) {
    return data.length ? Number(data[0].margin_percentage_service) / 100 : 0;
  },
  calculateSubTotalHotel(services, prices, type) {
    var level = 0;
    switch (type) {
      case "Comfort":
        level = 1;
        break;
      case "Superior":
        level = 2;
        break;
      case "Luxury":
        level = 3;
        break;
    }
    return Number(
      services.length
        ? services.reduce((a, b) => {
            var sum =
              (b.id_service_type == 9 || b.id_service_type == 2) &&
              (b.level == 0 || b.level == level)
                ? b.price
                  ? Number(b.price)
                  : 0
                : 0;
            return a + sum;
          }, 0)
        : prices.length
        ? Number(prices[0].sub_total_hotel)
        : 0
    );
  },
  getPercentPerHotel(data) {
    return data.length ? Number(data[0].margin_percentage_hotel) / 100 : 0;
  },
  formatDate(date) {
    var date_split = date.split("-");
    var date_formatted = new Date(
      date_split[0],
      date_split[1] - 1,
      date_split[2]
    );
    return date_formatted;
  },
  runPromisesInSeries(promise) {
    return promise.reduce((p, next) => p.then(next), Promise.resolve());
  },
  addDaysToDate() {
    return (Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    });
  },
  getArrayFromNumber(number = 1) {
    return Array.from(Array(number).keys()).filter((item) => item > 0);
  },
  getArrayFromNumbersRange(start, end) {
    const rangeArray = [];
    for (let i = start; i <= end; i++) {
      rangeArray.push(i);
    }
    return rangeArray;
  },
  kebabCase(string = "") {
    return string
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();
  },
  revertKebabCase(string = "") {
    const newString = string
      .replace(/-/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase();
    return this.toPascalCase(newString);
  },
  toPascalCase(string = "") {
    return string
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  },
  applyTranslation(language_code, field, value) {
    const translations = field.translate ?? [];
    if (language_code !== LANGUAGES_CODES.EN) {
      const translation = translations.find((t) => t.lang === language_code);
      if (translation) {
        translation.value = value;
      } else {
        translations.push({
          id: null,
          value: value,
          lang: language_code,
        });
      }
    }
    field.value = value;
    field.translate = translations;
  },
};
