import request from "../request";
import { AUTH_STORAGE_KEY } from "@/config.js";
import { fetchGet } from "../generalFetch";
import { fetchUrl } from "@/constants/fetchUrl";

let headers = () => {
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).token
    }`,
    "Cache-Control": "no-cache",
  };
};

export default {
  async getCurrencies(payload) {
    const url = fetchUrl["currencies"];
    const currencies = await fetchGet(url, payload, "currencies");
    return currencies;
  },
  getCurrency(data) {
    return request({
      method: "GET",
      url: `/tenant/currency/${data.id}`,
      headers: headers(),
    });
  },
};
