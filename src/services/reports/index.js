/* eslint-disable no-unused-vars */
import request from "../request";
import { AUTH_STORAGE_KEY } from "@/config.js";

const headers = () => {
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).token
    }`,
    "Cache-Control": "no-cache",
  };
};

export default {
  getQuotesByTime(payload) {
    const params = [
      `client=${payload?.client ? payload?.client : ""}`,
      `from=${payload?.from ? payload?.from : ""}`,
      `to=${payload?.to ? payload?.to : ""}`,
      `user=${payload?.user ? payload?.user : ""}`,
    ].join("&");

    return request({
      method: "GET",
      url: `/tenant/reports/periodic-quotes?${params}`,
      headers: headers(),
    });
  },
  getQuotesByClients(payload) {
    const params = [
      `client=${payload?.client ? payload?.client : ""}`,
      `from=${payload?.from ? payload?.from : ""}`,
      `to=${payload?.to ? payload?.to : ""}`,
      `user=${payload?.user ? payload?.user : ""}`,
    ].join("&");

    return request({
      method: "GET",
      url: `/tenant/reports/clients?${params}`,
      headers: headers(),
    });
  },
  loadUserSummary() {
    return request({
      method: "GET",
      url: `/tenant/reports/summary`,
      headers: headers(),
    });
  },
  getRequestsByStages(payload) {
    const params = [
      `client=${payload?.client ? payload?.client : ""}`,
      `from=${payload?.from ? payload?.from : ""}`,
      `to=${payload?.to ? payload?.to : ""}`,
      `user=${payload?.user ? payload?.user : ""}`,
    ].join("&");

    return request({
      method: "GET",
      url: `/tenant/reports/stages?${params}`,
      headers: headers(),
    });
  },
  loadQuotesByDestinations(payload) {
    const params = [
      `client=${payload?.client ? payload?.client : ""}`,
      `from=${payload?.from ? payload?.from : ""}`,
      `to=${payload?.to ? payload?.to : ""}`,
      `user=${payload?.user ? payload?.user : ""}`,
    ].join("&");

    return request({
      method: "GET",
      url: `/tenant/reports/destinations?${params}`,
      headers: headers(),
    });
  },
  loadSalesReport(payload) {
    const params = [
      `client=${payload?.client ? payload?.client : ""}`,
      `from=${payload?.from ? payload?.from : ""}`,
      `to=${payload?.to ? payload?.to : ""}`,
      `user=${payload?.user ? payload?.user : ""}`,
    ].join("&");

    return request({
      method: "GET",
      url: `/tenant/reports/detail?${params}`,
      headers: headers(),
    });
  },
};
