import {
  checkTimeLimit,
  getLocalStorageData,
  saveInLocalStorage,
} from "../utils/localStorage";
import { AUTH_STORAGE_KEY } from "@/config.js";
import request from "./request";

let headers = () => {
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).token
    }`,
    "Cache-Control": "no-cache",
  };
};

export const fetchGet = async (baseurl, payload, key) => {
  if (checkTimeLimit(key)) {
    const finalUrl = getURL(baseurl, payload);
    const response = await makeRequest(finalUrl);
    if (response && response.data && response.status === 200) {
      const data = response.data.data ?? response.data;
      saveInLocalStorage(key, data);
    }
  }
  return getLocalStorageData(key).data;
};

export const getParams = (payload) => {
  const paramsFromObject = Object.keys(payload).map((key) => {
    return `${key}=${payload[key]}`;
  });
  const defaultParams = [
    `page=${payload.page ? payload.page : 1}`,
    `limit=${payload.limit ? payload.limit : 10}`,
    `search=${payload.search ? payload.search : ""}`,
    `name=${payload.name ? payload.name : ""}`,
  ].join("&");

  return [...paramsFromObject, defaultParams].join("&");
};

export const getURL = (url, payload) => {
  return `${url}?${getParams(payload)}`;
};

export const makeRequest = (finalUrl) => {
  return request({
    method: "GET",
    url: finalUrl,
    headers: headers(),
  });
};
