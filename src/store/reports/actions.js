/* eslint-disable no-unused-vars */
import reports from "@/services/reports";
import { helpers as adapter } from "@/utils/adapters";

export default {
  async getQuotesByTime({ commit, getters }, payload) {
    const response = await reports.getQuotesByTime(payload);
    commit(
      "SET_QUOTES_BY_TIME",
      adapter.adaptQuotesByTimeResponse(response.data)
    );
  },
  async getQuotesByClients({ commit, getters }, payload) {
    const response = await reports.getQuotesByClients(payload);
    commit(
      "SET_QUOTES_BY_CLIENTS",
      adapter.adaptQuotesByClientsResponse(response.data)
    );
  },
  async loadUserSummary({ commit, getters }) {
    const response = await reports.loadUserSummary();
    commit("SET_USER_SUMMARY", response.data);
  },
  async getRequestsByStages({ commit, getters }, payload) {
    const response = await reports.getRequestsByStages(payload);
    commit(
      "SET_QUOTES_BY_STAGES",
      adapter.adaptRequestsByStagesResponse(response.data)
    );
  },
  async loadQuotesByDestinations({ commit, getters }, payload) {
    const response = await reports.loadQuotesByDestinations(payload);
    commit(
      "SET_QUOTES_BY_DESTINATIONS",
      adapter.adaptQuotesByDestinationsResponse(response.data)
    );
  },
  async loadSalesReport({ commit, getters }, payload) {
    const response = await reports.loadSalesReport(payload);
    commit("SET_SALES_REPORT", response.data);
  },
};
