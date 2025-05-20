import request from "@/services/request";

const headers = () => {
  return {
    "Cache-Control": "no-cache",
  };
};

export default {
  async listTenants() {
    return request({
      method: "GET",
      url: `/tenant/list`,
      headers: headers(),
    });
  },
};
