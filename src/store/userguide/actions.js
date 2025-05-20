/* eslint-disable no-unused-vars */
export default {
  setIsGuideActive({ commit }, data) {
    commit("SET_IS_USER_GUIDE_ACTIVE", data);
    if (!data) commit("SET_STEP", 0);
  },
  getIsUserGuideActive({ commit, getters }) {
    const isUserGuideActive = getters.getIsUserGuideActive;
    return isUserGuideActive;
  },
  nextStep({ commit, getters }) {
    const step = getters.getStep;
    commit("SET_STEP", step + 1);
  },
  prevStep({ commit, getters }) {
    const step = getters.getStep;
    commit("SET_STEP", step - 1);
    if (step === 1) {
      commit("SET_IS_USER_GUIDE_ACTIVE", false);
    }
  },
};
