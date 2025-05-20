import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  loading: true,
  loadingText: "Loading content, please wait...",
  displayLoadingProgress: false,
  loadingProgressValue: 0,
  loadingProgressText: "",
  modalOpenName: "",
  requestInProgress: "",
  servicesAdded: 0,
  isModalOpen: false,
  serviceActionsModal: {
    opened: false,
    serviceId: null,
  },
  historyView: {
    isActive: false,
    version: null,
    isModalOpen: false,
    restoreModal: {
      isOpen: false,
      selectedVersion: null,
    },
  },
  isViewContractSalesManualModalOpen: false,
  showSideBar: false,
};

const assets = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default assets;
