import { fetchUrl } from "@/constants/fetchUrl";
import { fetchGet } from "../generalFetch";

export default {
  async getClients(payload) {
    const url = fetchUrl["clients"];
    const clients = await fetchGet(url, payload, "clients");
    return clients;
  },
  async getClientContracts(payload) {
    const url = `${fetchUrl["clientContracts"]}${payload.id}`;
    const key = `contracts__client__${payload.id}`;
    const contracts = await fetchGet(url, payload, key);
    return contracts;
  },
};
