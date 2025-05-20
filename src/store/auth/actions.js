import auth from "@/services/auth";

export default {
  async getToken({ commit }, payload) {
    const response = await auth.getToken(payload);
    if (response.status === 200) {
      commit("CLEAR_AUTH_DATA");
      const authData = {
        ...response.data,
        tenant: payload.tenant,
      };
      commit("SET_AUTH_DATA", authData);
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  },
  async logout({ commit, dispatch }) {
    return await dispatch("utils/validateFunctionExecution", {
      functionToExecute: async () => {
        await auth.logout();
        localStorage.removeItem("clients");
        for (let key in localStorage) {
          if (key.startsWith("contracts__client")) localStorage.removeItem(key);
        }
        commit("CLEAR_AUTH_DATA");
        location.reload();
      },
      functionToExecuteOnFail: async (error) => {
        console.info(error);
        commit("CLEAR_AUTH_DATA");
      },
    });
  },
  async getUserData({ commit, getters }) {
    const currentAuthData = getters.getAuthData;
    const data = await auth.getUserData();
    const newAuthData = { ...currentAuthData, user: data };
    commit("SET_AUTH_DATA", newAuthData);
  },
};
