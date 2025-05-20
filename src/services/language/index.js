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
  async getLanguages(payload) {
    const url = fetchUrl["languages"];
    const languages = await fetchGet(url, payload, "languages");
    return languages;
  },
  getLanguage(data) {
    return request({
      method: "GET",
      url: `/tenant/language/${data.id}`,
      headers: headers(),
    });
  },
};
