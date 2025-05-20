import axios from "axios";
import { getLocalStorageData } from "../utils/localStorage";
import { RESPONSE_STATUS } from "@/constants/request";
import { AUTH_STORAGE_KEY } from "@/config";

const envURL = process.env.VUE_APP_END_POINT_V1;
const data = getLocalStorageData("auth-data");
const baseURL = data?.tenant?.baseURL || envURL;

export const setBaseUrlByTenant = (baseURL) => {
  instance.defaults.baseURL = baseURL;
};

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL,
  headers,
  timeout: 0,
  withCredentials: true,
  maxRedirects: 0,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === RESPONSE_STATUS.UNAUTHORIZED &&
      localStorage.getItem(AUTH_STORAGE_KEY)
    ) {
      localStorage.clear();
      location.reload();
    }
    return Promise.reject(error);
  }
);

const authHeaders = () => {
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).token
    }`,
    "Cache-Control": "no-cache",
  };
};

export const post = (endpoint, data) => {
  return instance({
    method: "POST",
    url: endpoint,
    data,
    headers: authHeaders(),
  });
};

export default instance;
