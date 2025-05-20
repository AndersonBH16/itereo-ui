import request from "@/services/request/index.js";
import { RESPONSE_STATUS } from "@/constants/request";

export default {
  async getRequests({ commit }, payload = { page: 1 }) {
    try {
      const response = await request.getRequests(payload);

      commit("SET_REQUESTS", response.data);

      return response.data.data;
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async getRequestById({ commit }, payload) {
    try {
      const response = await request.getRequestById(payload);
      commit("SET_REQUEST", response.data);
      return response.data;
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async createRequest({ commit }, payload) {
    try {
      const response = await request.createRequest(payload.request);
      commit("SET_REQUEST", response.data);
      return {
        data: response.data,
        type: response.status === RESPONSE_STATUS.CREATED ? "success" : "error",
      };
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async saveRequest({ commit }, payload) {
    try {
      const response = await request.saveRequest(payload.request);
      commit("SET_REQUEST", response.data);
      return {
        data: response.data,
        type: response.status === RESPONSE_STATUS.OK ? "success" : "error",
      };
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async unlinkQuoteFromRequest({ commit, getters }, payload) {
    try {
      const currentRequest = getters.getRequest;

      const updatedEntities = [
        ...currentRequest.items
          .filter((item) => item.id !== payload.quoteToUnlink.id)
          .map((item) => item.id),
      ];

      const adaptedPayload = {
        requestId: payload.requestId,
        data: {
          entities: updatedEntities,
        },
      };

      const response = await request.linkQuoteToRequest(adaptedPayload);

      commit("SET_REQUEST", {
        ...response.data,
        items: [
          ...currentRequest.items.filter(
            (item) => item.id !== payload.quoteToUnlink.id
          ),
        ],
      });

      return {
        data: response.data,
        type: response.status === RESPONSE_STATUS.OK ? "success" : "error",
      };
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async linkQuoteToRequest({ commit, getters }, payload) {
    try {
      const currentRequest = ![null, undefined].includes(payload.currentRequest)
        ? payload.currentRequest
        : getters.getRequest;

      const currentRequestItems = currentRequest?.items || [];

      const currentRequestItemsIds =
        currentRequestItems?.map((item) => item.id) || [];

      const updatedEntities = [
        ...currentRequestItemsIds,
        ...payload.quotesToLink.map((quoteToLink) => quoteToLink.id),
      ];

      const adaptedPayload = {
        requestId: payload.requestId,
        data: {
          entities: updatedEntities,
        },
      };

      const response = await request.linkQuoteToRequest(adaptedPayload);

      commit("SET_REQUEST", response.data);

      return {
        data: response.data,
        type: response.status === RESPONSE_STATUS.OK ? "success" : "error",
      };
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  updateRequestItemById({ commit, getters }, payload) {
    const currentRequest = getters.getRequest;

    const currentRequestItems = currentRequest?.items || [];

    commit("SET_REQUEST", {
      ...currentRequest,
      items: currentRequestItems.map((item) => {
        return item.id === payload.id
          ? { ...item, title: payload.title.value, status: payload.status }
          : item;
      }),
    });
  },
  async deleteRequest({ commit, getters }, payload) {
    try {
      await request.deleteRequest(payload);
      const filteredRequests = getters.getRequests.data.filter(
        (request) => request.id !== payload.id
      );
      commit("SET_REQUESTS", {
        ...getters.getRequests,
        data: filteredRequests,
      });
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async resetRequestState({ commit }) {
    try {
      commit("SET_REQUEST", {
        id: null,
        code: null,
        title: null,
        quotes: [],
      });
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  resetQuoteToLinkToRequest({ commit }) {
    try {
      commit("SET_QUOTE_TO_LINK_TO_REQUEST", null);
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
};
