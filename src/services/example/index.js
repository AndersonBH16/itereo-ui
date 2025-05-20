import request from "@/services/request";

export default {
  getData() {
    const url = "/users?username=Delphine";
    return request({
      method: "GET",
      url,
      headers: { "Cache-Control": "no-cache" },
    });
  },
};
