import { getNumberOfStepsParamsFromPayload } from "@/utils/adapters";
import request, { post } from "../request";
import { AUTH_STORAGE_KEY } from "@/config.js";
import { fetchUrl } from "@/constants/fetchUrl";

const headers = () => {
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)).token
    }`,
    "Cache-Control": "no-cache",
  };
};

export default {
  list(payload) {
    const params = [
      `page=${payload.page ? payload.page : 1}`,
      `limit=${payload.limit ? payload.limit : 5}`,
      `code=${payload.code ? payload.code : ""}`,
      `title=${payload.title ? payload.title : ""}`,
      `client=${payload.client ? payload.client : ""}`,
      `location=${payload.location ? payload.location : ""}`,
      `country=${payload.country ? payload.country : ""}`,
      `from=${payload.from ? payload.from : ""}`,
      `to=${payload.to ? payload.to : ""}`,
      `creation=${payload.creation ? payload.creation : ""}`,
      `status=${payload.status ? payload.status : ""}`,
      `type=${payload.type ? payload.type : ""}`,
      `filter=${payload.filter ? payload.filter : ""}`,
      `sort=${payload.sort ? payload.sort : ""}`,
      `num_day=${payload.num_day ? payload.num_day : ""}`,
      `tag=${payload.tags ? payload.tags : ""}`,
    ].join("&");
    return request({
      method: "GET",
      url: `/tenant/itinerary?${params}`,
      headers: headers(),
    });
  },
  async read(data) {
    return request({
      method: "GET",
      url: `/tenant/itinerary/${data}`,
      headers: headers(),
    });
  },
  save(data) {
    return request({
      method: "POST",
      url: `/tenant/itinerary${getNumberOfStepsParamsFromPayload(data)}`,
      data,
      headers: headers(),
    });
  },
  update(data) {
    return request({
      method: "PUT",
      url: `/tenant/itinerary/${data.id}${getNumberOfStepsParamsFromPayload(
        data
      )}`,
      data,
      headers: headers(),
    });
  },
  update_description(data) {
    return request({
      method: "PATCH",
      url: `/tenant/itinerary/description/${
        data.uuid
      }${getNumberOfStepsParamsFromPayload(data)}`,
      data,
      headers: headers(),
    });
  },
  delete(data) {
    return request({
      method: "DELETE",
      url: `/tenant/itinerary/${data.id}`,
      data,
      headers: headers(),
    });
  },
  generate_description(data) {
    return post(`/tenant/itinerary/${data.id}/generate-description`, data);
  },
  duplicate(data) {
    return post(
      `/tenant/itinerary/duplicate${getNumberOfStepsParamsFromPayload(data)}`,
      data
    );
  },
  change_status(data) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/status/${data.id}/${
        data.status
      }${getNumberOfStepsParamsFromPayload(data)}`,
      data,
      headers: headers(),
    });
  },
  change_status_services(data) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/${data.id}/services_status/${
        data.status
      }${getNumberOfStepsParamsFromPayload(data)}`,
      data,
      headers: headers(),
    });
  },
  add_service(payload) {
    const { calculate_prices, sm, uuid, data } = payload;
    const params = [
      `calculate_prices=${calculate_prices ?? 1}`,
      `sm=${sm || ""}`,
    ].join("&");
    return request({
      method: "POST",
      url: `/tenant/itinerary/services/${uuid}${getNumberOfStepsParamsFromPayload(
        payload
      )}&${params}`,
      data,
      headers: headers(),
    });
  },
  process(payload) {
    const { calculate_prices, calculate_room_distribution, uuid, data } =
      payload;
    const params = [
      `calculate_prices=${calculate_prices ?? 1}`,
      `calculate_room_distribution=${calculate_room_distribution ?? 0}`,
    ].join("&");
    return request({
      method: "POST",
      url: `/tenant/itinerary/process/${uuid}${getNumberOfStepsParamsFromPayload(
        payload
      )}&${params}`,
      data,
      headers: headers(),
    });
  },
  move_services(payload) {
    const {
      uuid,
      calculate_prices,
      sm,
      num_pax,
      calculate_room_distribution,
      data,
    } = payload;
    const params = [
      `calculate_prices=${calculate_prices ?? 1}`,
      `sm=${sm || ""}`,
      `num_pax=${num_pax || 0}`,
      `calculate_room_distribution=${calculate_room_distribution || 0}`,
    ].join("&");

    return request({
      method: "POST",
      url: `/tenant/itinerary/${uuid}/services/move${getNumberOfStepsParamsFromPayload(
        payload
      )}&${params}`,
      data,
      headers: headers(),
    });
  },
  list_services(data) {
    const params = [
      `from=${data.from ? data.from : ""}`,
      `to=${data.to ? data.to : ""}`,
    ].join("&");
    return request({
      method: "GET",
      url: `/tenant/itinerary/services/${data.id}?${params}`,
      headers: headers(),
    });
  },
  delete_service(payload) {
    const { data, params } = payload;
    return request({
      method: "DELETE",
      url: `/tenant/itinerary/service/${
        data.id
      }${getNumberOfStepsParamsFromPayload(params)}`,
      data,
      headers: headers(),
    });
  },
  replace_service(payload) {
    const { itineraryId, itineraryServiceId, serviceId } = payload;
    const params = [`num_pax=${payload.numPax ? payload.numPax : 1}`].join("&");
    return request({
      method: "POST",
      url: `/tenant/itinerary/${itineraryId}/service/${itineraryServiceId}/replace/${serviceId}${getNumberOfStepsParamsFromPayload(
        payload
      )}&${params}`,
      headers: headers(),
    });
  },
  duplicate_service(payload) {
    const { data, params } = payload;
    return request({
      method: "POST",
      url: `/tenant/itinerary/${
        data.id
      }/services/duplicate${getNumberOfStepsParamsFromPayload(params)}`,
      data,
      headers: headers(),
    });
  },
  get_passengers(payload) {
    return request({
      method: "GET",
      url: `/tenant/itinerary/passengers/${payload}`,
      headers: headers(),
    });
  },
  save_passenger(data) {
    return request({
      method: "PUT",
      url: `/tenant/passengers/${
        data.id_itinerary
      }${getNumberOfStepsParamsFromPayload(data)}`,
      data,
      headers: headers(),
    });
  },
  change_status_service(data) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/service/status/${data.id}/${data.status}`,
      data,
      headers: headers(),
    });
  },
  list_prices(uuid) {
    return request({
      method: "GET",
      url: `/tenant/itinerary/prices/${uuid}`,
      headers: headers(),
    });
  },
  check_prices(payload) {
    return request({
      method: "PUT",
      url: `/tenant/itinerary/check_prices/${payload.uuid}`,
      headers: headers(),
      data: payload,
    });
  },
  add_prices(data, uuid) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/prices/${uuid}`,
      data,
      headers: headers(),
    });
  },
  getPaxPrices(id) {
    return request({
      method: "GET",
      url: `/tenant/itinerary/pax-prices/${id}`,
      headers: headers(),
    });
  },
  savePaxPrices(payload) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/pax-prices/${
        payload.id
      }${getNumberOfStepsParamsFromPayload(payload)}`,
      data: payload.paxs_prices,
      headers: headers(),
    });
  },
  list_passengers(uuid) {
    return request({
      method: "GET",
      url: `/tenant/itinerary/passengers/${uuid}`,
      headers: headers(),
    });
  },
  async publish(payload) {
    const params = [`lang=${payload.lang ? payload.lang : ""}`].join("&");
    return request({
      method: "POST",
      url: `/tenant/itinerary/publish/${
        payload.data.id
      }${getNumberOfStepsParamsFromPayload(payload)}&${params}`,
      data: payload.data,
      headers: headers(),
    });
  },
  async publishConfigAndImages(payload) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/publish/config/${
        payload.id
      }${getNumberOfStepsParamsFromPayload(payload)}`,
      data: payload.data,
      headers: headers(),
    });
  },
  async getPublishedConfigAndImages(uuid) {
    return request({
      method: "GET",
      url: `/tenant/itinerary/publish/config/${uuid}`,
      headers: headers(),
    });
  },
  async getWebTemplates() {
    const url = `/tenant/itineraries/web-templates`;
    const webTemplates = await request({
      method: "GET",
      url: url,
      headers: headers(),
    });
    return webTemplates.data;
  },
  send_notification(data) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/publish/notification/${data.uuid}`,
      data,
    });
  },
  async exportToExternal(payload) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/${payload.itineraryId}/export?source=${payload.externalSource}`,
      headers: headers(),
    });
  },
  async listItineraryDestinations() {
    return request({
      method: "GET",
      url: `${fetchUrl["itineraryDestinations"]}`,
      headers: headers(),
    });
  },
  async getServiceHistory(payload) {
    const params = [
      `page=${payload.page ? payload.page : 1}`,
      `limit=${payload.limit ? payload.limit : 30}`,
      `entity=${payload.serviceId}`,
    ].join("&");
    return request({
      method: "GET",
      url: `/tenant/itinerary/${payload.itineraryId}/history?${params}`,
      headers: headers(),
    });
  },
  async getItineraryHistory(payload) {
    const params = [
      `page=${payload.page ? payload.page : 1}`,
      `limit=${payload.limit ? payload.limit : 20}`,
    ].join("&");
    return request({
      method: "GET",
      url: `/tenant/itinerary/${payload.itineraryId}/history?${params}`,
      headers: headers(),
    });
  },
  async getItineraryVersion(payload) {
    return request({
      method: "GET",
      url: `/tenant/itinerary/${payload.itineraryId}/versions/${payload.version}`,
      headers: headers(),
    });
  },
  async restoreItineraryByVersion(payload) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/${payload.itineraryId}/versions/${
        payload.version
      }/restore${getNumberOfStepsParamsFromPayload(payload)}`,
      headers: headers(),
    });
  },
  async importService(payload) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/${payload.itineraryId}/services/${payload.serviceId}/import`,
      headers: headers(),
    });
  },
  async generateItineraryPricesMatrix(payload) {
    return request({
      method: "POST",
      url: `/tenant/itinerary/${payload.itineraryId}/generate-matrix`,
      headers: headers(),
      data: payload.data,
    });
  },
  async getItineraryPricesMatrix(payload) {
    return request({
      method: "GET",
      url: `/tenant/itinerary/${payload.itineraryId}/matrix`,
      headers: headers(),
    });
  },
};
