import tenantsService from "@/services/tenants";

export default {
  async list({ commit, getters }, payload = { page: 1 }) {
    try {
      const tenants = getters.getTenants;
      if (tenants.length > 0) {
        commit("SET_TENANTS_DATA", tenants);
      } else {
        const tenants = await tenantsService.listTenants(payload);
        commit("SET_TENANTS_DATA", tenants);
      }
    } catch (err) {
      console.info(err);
      throw err;
    }
  },
};
