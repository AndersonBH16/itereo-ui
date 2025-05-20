export default {
  SET_LOADING(state, data) {
    state.loading = data;
  },
  SET_LOADING_TEXT(state, data) {
    state.loadingText = data;
  },
  SET_MODAL_OPEN_NAME(state, data) {
    state.modalOpenName = data;
  },
  SET_REQUEST_IN_PROGRESS(state, data) {
    state.requestInProgress = data;
  },
  SET_SHOW_SIDE_BAR(state, data) {
    state.showSideBar = data;
  },
  SET_SERVICES_ADDED(state, data) {
    state.servicesAdded = data;
  },
  SET_IS_MODAL_OPEN(state, data) {
    state.isModalOpen = data;
  },
  SET_DISPLAY_LOADING_PROGRESS(state, data) {
    state.displayLoadingProgress = data;
  },
  SET_LOADING_PROGRESS_VALUE(state, data) {
    state.loadingProgressValue = data;
  },
  SET_LOADING_PROGRESS_TEXT(state, data) {
    state.loadingProgressText = data;
  },
  SET_SERVICE_ACTIONS_MODAL(state, data) {
    state.serviceActionsModal = data;
  },
  SET_IS_VIEW_CONTRACT_SALES_MANUAL_MODAL_OPEN(state, data) {
    state.isViewContractSalesManualModalOpen = data;
  },
  SET_HISTORY_VIEW(state, data) {
    state.historyView = data;
  },
};
