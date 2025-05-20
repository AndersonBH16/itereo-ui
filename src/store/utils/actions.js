/* eslint-disable no-unused-vars */
import { DEFAULT_ERROR_MESSAGE } from "@/constants/request";
import { PATH_INFO } from "@/router/path";
import { ToastProgrammatic as Toast } from "buefy";

export default {
  async validateFunctionExecution(
    { dispatch },
    { functionToExecute = null, functionToExecuteOnFail = null }
  ) {
    try {
      return await functionToExecute();
    } catch (error) {
      dispatch("setLoading", false);
      dispatch("itinerary/check_version", {}, { root: true });
      console.error(error);
      if (functionToExecuteOnFail) {
        return functionToExecuteOnFail(error);
      }
      const errorMessage =
        error?.response?.data?.errors?.data || DEFAULT_ERROR_MESSAGE;
      Toast.open({
        duration: 5000,
        message: errorMessage,
        position: "is-top",
        type: "is-danger",
        pauseOnHover: true,
      });
    }
  },
  setHistoryView({ commit, getters }, payload = {}) {
    const isHistoryView = window.location.pathname.includes(
      PATH_INFO.HISTORY.path
    );
    const urlParams = new URLSearchParams(window.location.search);
    const version = urlParams.get("version");
    const currentHistoryView = getters.getHistoryView;
    commit("SET_HISTORY_VIEW", {
      ...currentHistoryView,
      ...payload.historyView,
      isActive: isHistoryView,
      version,
    });
  },
  setLoading({ commit }, payload) {
    commit("SET_LOADING", payload);
  },
  setLoadingText({ commit }, payload) {
    commit("SET_LOADING_TEXT", payload);
  },
  setModalOpenName({ commit }, payload) {
    commit("SET_MODAL_OPEN_NAME", payload);
  },
  setRequestInProgress({ commit }, payload) {
    commit("SET_REQUEST_IN_PROGRESS", payload);
  },
  setServicesAdded({ commit }, payload) {
    commit("SET_SERVICES_ADDED", payload);
  },
  setIsModalOpen({ commit }, payload) {
    commit("SET_IS_MODAL_OPEN", payload);
  },
  setShowSideBar({ commit }, payload) {
    commit("SET_SHOW_SIDE_BAR", payload);
  },
  setDisplayLoadingProgress({ commit }, payload) {
    commit("SET_DISPLAY_LOADING_PROGRESS", payload.display);
    if (!payload.display) {
      commit("SET_LOADING_PROGRESS_VALUE", 0);
      commit("SET_LOADING_PROGRESS_TEXT", "");
    } else {
      commit("SET_LOADING", true);
      commit("SET_LOADING_PROGRESS_VALUE", payload.progress);
      commit("SET_LOADING_PROGRESS_TEXT", payload.text);
    }
  },
  hardRefresh({ commit }, payload) {
    window.location.reload(true);
    const authData = localStorage.getItem("auth-data");
    localStorage.clear();
    if (payload.refreshAuthData) localStorage.setItem("auth-data", authData);
  },
  setServiceActionsModal({ commit }, payload) {
    commit("SET_SERVICE_ACTIONS_MODAL", {
      opened: payload?.opened || false,
      serviceId: payload?.serviceId || null,
    });
  },
  setIsViewContractSalesManualModalOpen({ commit }, payload) {
    commit("SET_IS_VIEW_CONTRACT_SALES_MANUAL_MODAL_OPEN", payload);
  },
};
