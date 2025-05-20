import language from "@/services/language";

export default {
  async getLanguages({ commit, getters }, payload = { page: 1 }) {
    try {
      const languages = getters.getLanguages;
      if (languages.length > 0) {
        commit("SET_LANGUAGE_DATA", languages);
      } else {
        const languages = await language.getLanguages(payload);
        commit("SET_LANGUAGE_DATA", languages);
        return languages;
      }
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
  async getLanguage(payload) {
    const response = await language.getLanguage(payload);
    return response.data.data;
  },
};
