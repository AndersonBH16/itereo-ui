<template>
  <div class="is-flex">
    <BaseModal
      :isComponentModalActive="modalPreventExitService"
      :closeModal="closeModalExitService"
      :cancel="cancel"
    >
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title"
        >Are you sure you want to
        <span class="has-text-weight-semibold">exit</span>?
      </span>
      <span slot="paragraph">Your current changes wonn´t be saved.</span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="closeModalExitService"
          action="secondary"
          size="medium"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton @click="goToNextView" action="tercery" size="medium">
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>
    <BaseModal
      :isComponentModalActive="localSaving.isPreventReloadModalActive"
      :closeModal="() => (localSaving.isPreventReloadModalActive = false)"
    >
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title"
        >Your current local changes will be lost if you refresh</span
      >
      <span slot="paragraph"
        >Are you sure to
        <span class="has-text-weight-semibold">refresh the page?</span>
      </span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="() => (localSaving.isPreventReloadModalActive = false)"
          action="secondary"
          size="medium"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton @click="reloadPage" action="tercery" size="medium">
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>
    <div style="width: 100%">
      <div class="columns">
        <div class="column">
          <ServicesTable
            :localSaving="localSaving"
            :setLoading="setLoading"
            :rootEditServiceModal="editServiceModal"
            :defaultOpenedTab="defaultOpenedTab"
            :editServiceSidebarFocusedElement="editServiceSidebarFocusedElement"
            :rootServiceIdToEdit="serviceIdToEdit"
            :rootServiceEdited="serviceEdited"
            :handleModalEditServiceModal="handleModalEditServiceModal"
            :loadingSkeleton="loadingSkeleton"
            red
            :updateSearchServicesPayload="updateSearchServicesPayload"
            :handleSearchServicesContract="handleSearchServicesContract"
            :services="services"
            :passengers_itinerary="passengers_itinerary"
            :getDestinationsPerCountry="getDestinationsPerCountry"
            :handleItineraryServiceRecentlyAdded="
              handleItineraryServiceRecentlyAdded
            "
            :timerCount="timerCount"
            :deleteServices="deleteServices"
            :handleChangeTimerCount="handleChangeTimerCount"
            :handleSearchService="handleSearchService"
            :modalPreventExitService="modalPreventExitService"
            :handleModalExitService="handleModalExitService"
            :validateIsEditing="validateIsEditing"
            :handleValidateIsEditing="handleValidateIsEditing"
            :handleRemoveService="handleRemoveService"
            :removeService="removeService"
            :getServicePrice="getServicePrice"
            :getServices="getServices"
            :getParentLocation="getParentLocation"
            :saveItineraryServiceWithPrices="saveItineraryServiceWithPrices"
            :createItineraryServiceForm="createItineraryServiceForm"
            :validateFunctionExecution="validateFunctionExecution"
            :dispatchServicesItinerary="dispatchServicesItinerary"
            :cancelItineraryServicesReordering="
              cancelItineraryServicesReordering
            "
            @update:updateServiceTableSkeleton="loadingSkeleton = $event"
            @update:updateServiceViewState="updateServiceViewState"
            @update:localSaving="localSaving = $event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
import { parse } from "date-fns";
import helpers from "@/helpers";
import ServicesTable from "@/components/quote-views/service-list/ServicesTable.vue";
import { mapGetters } from "vuex";
import { serviceHelper } from "@/utils/service";
import {
  deleteObjectProperties,
  disableScroll,
  getSalesManualUUID,
  setItemToLocalStorage,
  setDay,
} from "@/utils/utils";
import { PATH_INFO } from "@/router/path";
import { EDIT_SERVICE_SIDEBAR_TABS } from "@/constants/services";
import globalHelper from "@/helpers";
import { MAX_PROCESS_SERVICES } from "@/constants";

export default {
  name: "ServicesView",
  components: {
    ServicesTable,
  },
  props: {
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    loadClientContracts: {
      type: Function,
      default: () => {},
    },
    loadServiceTypes: {
      type: Function,
      default: () => {},
    },
    loadServicesTags: {
      type: Function,
      default: () => {},
    },
    loadPassengersItinerary: {
      type: Function,
      default: () => {},
    },
    loadItinerary: {
      type: Function,
      default: () => {},
    },
    loadItineraryDays: {
      type: Function,
      default: () => {},
    },
    loadPublishedItinerary: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      paths: { ...PATH_INFO },
      loadingSkeleton: false,
      timerCount: 0,
      timerCountVar: null,
      payload: {
        from: null,
        to: null,
        id: null,
      },
      localSaving: {
        isActive: false,
        payload: null,
        isPreventReloadModalActive: false,
      },
      validateIsEditing: false,
      removeService: false,
      modalPreventExitService: false,
      cancel: ["x", "outside"],
      nextView: null,
      editServiceModal: false,
      defaultOpenedTab: 0,
      editServiceSidebarFocusedElement: "",
      serviceIdToEdit: "",
      serviceEdited: null,
    };
  },
  beforeRouteLeave(to, from, next) {
    if (
      from.path === PATH_INFO.SERVICES.path &&
      from.query.itinerary &&
      (this.validateIsEditing || this.localSaving.isActive) &&
      !this.nextView
    ) {
      this.handleModalExitService(true);
      this.nextView = to;
    } else {
      next();
    }
  },
  computed: {
    ...mapGetters({
      authData: "auth/getAuthData",
      currencies: "currency/getCurrencies",
      language: "language/getLanguages",
      countries: "locations/listCountry",
      contractCountries: "client/getCountriesFromContract",
      clients: "client/getClients",
      client_contracts: "client/getClientContracts",
      itinerary: "itinerary/getItinerary",
      services: "services/getServices",
      service: "services/getService",
      prices_itinerary: "itinerary/getPricesItineraries",
      passengers_itinerary: "itinerary/getPassengersItineraries",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      numPax: "itinerary/getNumPax",
      services_itinerary: "itinerary/getServicesItinerary",
      itineraryDays: "itineraryDays/getItineraryDays",
      searchServicesPayload: "services/getSearchServicesPayload",
      servicesAdded: "utils/getServicesAdded",
      itineraryServiceRecentlyAdded:
        "itinerary/getItineraryServiceRecentlyAdded",
      itineraryServicesAffected: "itinerary/getItineraryServicesAffected",
      initialServicesItinerary: "itinerary/getInitialServicesItinerary",
      historyView: "utils/getHistoryView",
    }),
    backgroundImage() {
      return helpers.backgroundImage(
        "https://305c511294116d47a2eb-8984c8bf4382d773df005374b9639769.ssl.cf2.rackcdn.com/itereo/ttc/background_app.jpg"
      );
    },
  },
  methods: {
    async handleDeleteServiceItinerary(serviceId = "", cur_step, last_step) {
      return await this.$store
        .dispatch("itinerary/delete_service", {
          id: serviceId,
          itinerary: this.itinerary.data.id,
          cur_step,
          last_step,
        })
        .then((response) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: response.message,
            position: "is-top",
            type: "is-success",
          });
        })
        .catch((error) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: error.message,
            position: "is-top",
            type: "is-success",
          });
        });
    },
    async deleteServices(serviceToDelete = []) {
      this.setLoadingText("Deleting services, please wait...");
      this.setLoading(true);

      const serviceIds = serviceToDelete
        .flatMap((service) => service.servicesRelated)
        .map((service) => service.id);

      const TOTAL_STEPS_TO_PERFORM = serviceIds.length;
      for (let index = 0; index < serviceIds.length; index++) {
        await this.handleDeleteServiceItinerary(
          serviceIds[index],
          1 + index,
          TOTAL_STEPS_TO_PERFORM
        );
      }
      this.setLoading(false);
    },
    reloadPage() {
      window.location.reload(true);
    },
    updateServiceViewState(key, value) {
      this[key] = value;
    },
    addInfoToPayload() {
      this.payload.id = this.itinerary.data?.id;
      this.payload.from = this.itinerary
        ? this.itinerary.data?.start_date
        : null;
      this.payload.to = this.itinerary.data
        ? this.itinerary.data.end_date >= this.itinerary.data.start_date
          ? this.itinerary.data.end_date
          : this.itinerary.data.start_date
        : null;
    },
    closeModalExitService() {
      this.handleModalExitService(false);
      this.nextView = null;
    },
    async checkMovement(serviceItinerary, disableCheckMovement = false) {
      if (serviceItinerary.id === null && !disableCheckMovement) {
        const { isDifferentLocation, nextServices, day_date } =
          serviceHelper.validateServiceLocationsWhenInserting(
            this.services_itinerary,
            this.itineraryDays,
            serviceItinerary
          );
        if (nextServices.length) {
          if (isDifferentLocation) {
            const daysToMove = serviceHelper.getDaysToMove(serviceItinerary);
            const chunks = globalHelper.sliceIntoChunks(
              nextServices.map((ns) => ns.id),
              MAX_PROCESS_SERVICES
            );
            const last_step = chunks.length + 2;

            await this.$store.dispatch("itinerary/moveServices", {
              itinerary: this.$route.query.itinerary,
              calculate_prices: 0,
              calculate_room_distribution: 0,
              services: nextServices,
              daysToMove,
              cur_step: 1,
              last_step: last_step,
              day_date: day_date,
            });

            return {
              cur_step: last_step,
              last_step: last_step,
            };
          }
        } else {
          const ranges = serviceItinerary.day.toString().split("-");
          const start_day = parseInt(ranges[0]);
          const end_day = parseInt(ranges[1] ?? ranges[0]);
          const destination =
            serviceItinerary.location?.find((l) => l?.parent !== 0) || null;
          const diffDay = this.itineraryDays.find((day) => {
            if (start_day <= day.start_day && day.start_day <= end_day) {
              const oldServices = day.services.filter((service) => {
                const ranges = service.day.toString().split("-");
                const start_day = parseInt(ranges[0]);
                return start_day < day.start_day;
              });
              return (
                destination &&
                oldServices.length === 0 &&
                day.location.length > 0 &&
                destination?.location_code !== day.location[0]?.location_code
              );
            }
            return false;
          });

          if (diffDay) {
            const last_step = 2;
            const daysToMove = end_day - diffDay.start_day + 1;

            await this.$store.dispatch("itineraryDays/moveItineraryDays", {
              id: this.$route.query.itinerary,
              moved_date: diffDay.start_date,
              days_to_move: daysToMove,
              cur_step: 1,
              last_step: last_step,
            });

            return {
              cur_step: last_step,
              last_step: last_step,
            };
          }
        }
      }
      return {
        cur_step: 1,
        last_step: 1,
      };
    },
    async createItineraryServiceForm(serviceForm, params) {
      try {
        this.setLoading(true);
        disableScroll();
        const { from, sm = "", country = "" } = this.searchServicesPayload;
        const {
          serviceItineraryId = null,
          id,
          calculate_prices = 1,
          calculate_room_distribution = 0,
          prices_costs_margins,
          num_pax = 1,
          level = 0,
          level_text = "All",
          start_date = from,
          end_date = from,
          service_price,
          service_supplier,
        } = serviceForm;
        const serviceItinerary = cloneDeep(serviceForm);
        serviceItinerary.id = serviceItineraryId;
        serviceItinerary.start_date = start_date;
        serviceItinerary.end_date = end_date;
        serviceItinerary.level = level;
        serviceItinerary.num_pax = num_pax;
        serviceItinerary.service_supplier =
          service_supplier ??
          (prices_costs_margins && prices_costs_margins.service_supplier
            ? prices_costs_margins.service_supplier
            : null);
        serviceItinerary.service_price =
          service_price ??
          (prices_costs_margins && prices_costs_margins.service_price
            ? prices_costs_margins.service_price
            : null);
        serviceItinerary.service = id;
        serviceItinerary.day = setDay(
          start_date,
          end_date,
          this.itinerary.data
        );
        serviceItinerary.images =
          "{" + serviceForm.images.map((image) => image.id).join(",") + "}";
        serviceItinerary.passengers = "{}";
        serviceItinerary.status = 1;
        serviceItinerary.visible = 1;
        serviceItinerary.servicesRelated = [];
        let countryName = serviceForm.country || country;
        if (Array.isArray(serviceItinerary.location)) {
          if (countryName.length === 0 && serviceItinerary.location.length) {
            countryName = this.getParentLocation(
              serviceItinerary.location[0].parent,
              "location_name"
            );
          }
        } else if (
          serviceItinerary.location &&
          typeof serviceItinerary.location === "object"
        ) {
          serviceItinerary.location = [serviceItinerary.location];
        } else {
          serviceItinerary.location = this.contractCountries
            .find((country) => country.location_name === countryName)
            ?.destination.filter(
              (destination) =>
                destination.location_code === serviceForm.location
            );
        }

        if (calculate_prices === 1) {
          deleteObjectProperties(serviceItinerary, [
            "price",
            "price_unit",
            "cost_unit",
            "cost",
            "margin",
            "percentage_margin",
          ]);
        }
        deleteObjectProperties(serviceItinerary, [
          "prices_costs_margins",
          "calculate_prices",
          "level_text",
          "room",
          "price_service_sm",
          "supplier_service",
        ]);

        const { cur_step, last_step } = await this.checkMovement(
          serviceItinerary,
          params?.disableCheckMovement
        );

        const payload = {
          calculate_prices,
          calculate_room_distribution,
          data: [serviceItinerary],
          sm,
          uuid: this.$route.query.itinerary,
          cur_step,
          last_step,
        };

        const serviceItineraryResponse = await this.$store.dispatch(
          "itinerary/process",
          payload
        );
        if (serviceItineraryResponse) {
          let num = this.servicesAdded;
          num++;
          this.$store.dispatch("utils/setServicesAdded", num);
          let type = "success";
          if (
            typeof serviceItineraryResponse["messages"][0]["errors"] !==
            "undefined"
          ) {
            type = "error";
          }
          this.$buefy.toast.open({
            duration: 5000,
            message: serviceItineraryResponse.messages[0].message,
            position: "is-top",
            type: type == "success" ? "is-success" : "is-danger",
          });
          this.handleChangeTimerCount(20);
          this.setLoading(false);
          this.handleValidateIsEditing(false);
          setItemToLocalStorage(this.$route.query.itinerary, {
            level,
            level_text,
            from: start_date,
            to: end_date,
            country: countryName,
          });
          return serviceItineraryResponse;
        }
      } catch (err) {
        this.setLoading(false);
        console.info(err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong please try again.",
          position: "is-top",
          type: "is-danger",
        });
        throw err;
      }
    },
    getDestinationsPerCountry(name = "") {
      if (name) {
        this.$store
          .dispatch("client/filterDestinationsByCountry", { name })
          .catch((error) => {
            throw error;
          });
      }
    },
    getServicePrice(payload) {
      return this.$store.dispatch("prices/getServicePrice", {
        contract: this.itinerary.data.contract_id,
        ...payload,
      });
    },
    async getServices() {
      try {
        this.setLoading(true);
        this.updateSearchServicesPayload("", "", {
          itinerary: this.$route.query.itinerary,
          sm: getSalesManualUUID(this.itinerary, this.client_contracts),
          num_pax: this.numPax,
        });
        const response = await this.$store.dispatch(
          "services/getServices",
          this.searchServicesPayload
        );
        this.setLoading(false);
        return response;
      } catch (error) {
        this.setLoading(false);
        console.info(error);
        this.$buefy.toast.open({
          duration: 5000,
          message:
            error.response.data && error.response.data.message
              ? error.response.data.message
              : "Ups! An unexpected error has occurred, please try again!",
          position: "is-top",
          type: "is-danger",
        });
        throw error;
      }
    },
    getParentLocation(countryId, key) {
      if (this.countries && this.countries.length && countryId) {
        const location = this.countries.filter(
          (location) => location.id === countryId
        );
        return location && location.length ? location[0][key] : "";
      }
      return "";
    },
    goToNextView() {
      this.handleModalExitService(false);

      const servicesItinerary = this.services_itinerary;
      servicesItinerary.splice(servicesItinerary.length - 1, 1);
      this.$store.dispatch(
        "itinerary/setGroupedServicesItinerary",
        servicesItinerary
      );
      this.handleRemoveService();
      this.handleValidateIsEditing(false);
      this.cancelItineraryServicesReordering();
    },
    cancelItineraryServicesReordering() {
      this.localSaving = {
        isActive: false,
        payload: null,
      };
      this.dispatchServicesItinerary(this.initialServicesItinerary);
    },
    handleModalExitService(value = false) {
      this.modalPreventExitService = value;
      if (value) {
        this.setModalOpenName("modalPreventExitService");
      } else {
        this.setModalOpenName();
      }
    },
    handleRemoveService(value = false) {
      disableScroll();
      this.removeService = value;
      if (value) {
        this.setModalOpenName("servicesRemoveServiceModal");
      } else {
        this.setModalOpenName();
      }
    },
    handleValidateIsEditing(value) {
      this.validateIsEditing = value;
    },
    handleItineraryServiceRecentlyAdded(value = null) {
      this.$store.dispatch("itinerary/setItineraryServiceRecentlyAdded", value);
    },
    handleChangeTimerCount(time) {
      this.timerCount = 0;
      this.timerCount += time;
    },
    async handleSearchService(payload = {}) {
      try {
        if (this.$route.query.itinerary) {
          this.setLoading(true);
          const service = await this.$store.dispatch("services/getService", {
            ...payload,
            sm: getSalesManualUUID(this.itinerary, this.client_contracts),
            info: 1,
            itinerary: payload.itinerary ?? this.$route.query.itinerary,
            calculate_prices: payload.calculate_prices ?? 1,
          });
          if (service) {
            this.setLoading(false);
            if (
              this.services &&
              this.services.data &&
              this.services.data.length
            ) {
              var idx = this.services.data.findIndex(
                (service) => service.id === payload.id
              );
              this.services.data[idx] = service;
            }
            return service;
          }
        }
        throw new Error(
          "Ups! something went wrong, please refresh the window."
        );
      } catch (error) {
        this.setLoading(false);
        console.info(error, error.response);
        this.$buefy.toast.open({
          duration: 5000,
          message:
            error ?? "Ups! An unexpected error has occurred, please try again!",
          position: "is-top",
          type: "is-danger",
        });
        throw error;
      }
    },
    async handleSearchServicesContract() {
      try {
        const typePayload = this.searchServicesPayload.all;
        if (typePayload == 1 && !this.searchServicesPayload.code) {
          this.$buefy.toast.open({
            duration: 5000,
            message: "Please write a service code to continue.",
            position: "is-top",
            type: "is-danger",
          });
          return;
        }
        if (
          parse(this.searchServicesPayload.from) >
          parse(this.searchServicesPayload.to)
        ) {
          this.$buefy.toast.open({
            duration: 5000,
            message:
              "Invalid dates, end date cannot be earlier than start date.",
            position: "is-top",
            type: "is-danger",
          });
          return;
        }
        this.setLoading(true);
        this.updateSearchServicesPayload("", "", {
          info: 0,
          limit: 1500,
        });
        const response = await this.getServices();
        if (response) {
          this.setLoading(false);
          if (typePayload == 1 && !this.services.data) {
            this.$buefy.toast.open({
              duration: 5000,
              message: "Services not found, please try again",
              position: "is-top",
              type: "is-warning",
            });
          }
        }
      } catch (error) {
        this.setLoading(false);
        console.info(error);
        this.$buefy.toast.open({
          duration: 5000,
          message:
            error.response.data && error.response.data.message
              ? error.response.data.message
              : "Ups! An unexpected error has occurred, please try again!",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    async loadItineraryServicesAndHighlightRows() {
      if (this.itinerary.data) {
        await this.loadServicesItinerary(this.payload);
        this.handleChangeTimerCount(15);
      }
    },
    async loadItineraryByRouteQuery() {
      this.loadingSkeleton = true;
      await this.loadItinerary();
      await this.makePostItineraryFetchs();
      this.loadingSkeleton = false;
    },
    async makePostItineraryFetchs() {
      this.updateSearchServicesPayload(
        "contract_user",
        this.itinerary.data.client.id
      );
      this.updateSearchServicesPayload(
        "contract",
        this.itinerary.data.contract_id
      );
      await Promise.all([
        this.loadPublishedItinerary(),
        this.addInfoToPayload(),
        this.loadClientContracts(this.itinerary.data.client.id),
        this.loadItineraryServicesAndHighlightRows(),
        this.loadItineraryDays(false),
        this.loadServiceTypes(),
        this.loadServicesTags(),
        this.loadPassengersItinerary({ uuid: this.$route.query.itinerary }),
      ]).catch((err) => {
        console.info(err);
      });
    },
    async loadItineraryWithoutRouteQuery() {
      this.loadingSkeleton = true;
      this.addInfoToPayload();
      if (this.itinerary.data.client && this.itinerary.data.client.id) {
        await this.loadClientContracts(this.itinerary.data.client.id);
        this.updateSearchServicesPayload(
          "contract_user",
          this.itinerary.data.client.id
        );
      }
      if (this.itinerary.data && this.itinerary.data.contract_id) {
        this.updateSearchServicesPayload(
          "contract",
          this.itinerary.data.contract_id
        );
      }
      try {
        await Promise.all([
          this.loadItineraryServicesAndHighlightRows(),
          this.loadItineraryDays(false),
          this.loadServiceTypes(),
          this.loadServicesTags(),
          this.loadPassengersItinerary({ uuid: this.$route.query.itinerary }),
        ]);
        this.loadingSkeleton = false;
      } catch (error) {
        console.info(error);
        this.$router.push(this.paths.NOT_FOUND.path);
      }
    },
    saveItineraryServiceWithPrices(payload) {
      return this.$store.dispatch("itinerary/add_service", payload);
    },
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) {
        this.setLoadingText("Loading content, please wait...");
      }
    },
    setLoadingText(value) {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    setModalOpenName(value = "") {
      this.$store.dispatch("utils/setModalOpenName", value);
    },
    updateSearchServicesPayload(key = "", value = "", payloadUpdated = null) {
      let payload = { ...this.searchServicesPayload };
      if (payloadUpdated) {
        payload = { ...payload, ...payloadUpdated };
      } else {
        payload[key] = value;
      }
      this.$store.dispatch("services/setSearchServicesPayload", payload);
    },
    async loadOnlyItineraryServicesData() {
      this.loadingSkeleton = true;
      this.addInfoToPayload();
      await this.loadItineraryServicesAndHighlightRows();
      await this.loadItineraryDays(false);
      await this.loadServiceTypes();
      await this.loadServicesTags();
      if (
        this.itinerary.data &&
        this.itinerary.data.client &&
        this.itinerary.data.client.id
      ) {
        this.updateSearchServicesPayload(
          "contract_user",
          this.itinerary.data.client.id
        );
      }
      if (this.itinerary.data && this.itinerary.data.contract_id) {
        this.updateSearchServicesPayload(
          "contract",
          this.itinerary.data.contract_id
        );
      }
      this.loadingSkeleton = false;
    },
    async loadItineraryVersion(itineraryId) {
      this.setLoading(true);
      this.loadingSkeleton = true;
      if (!this.itinerary?.data?.id) {
        await this.$store.dispatch("itinerary/getItineraryVersion", {
          itineraryId: itineraryId,
          version: this.historyView.version,
        });
      }
      this.loadingSkeleton = false;
      this.setLoading(false);
    },
    async initialLoad() {
      const itineraryRouteQuery = this.$route.query.itinerary;
      this.$store.dispatch("utils/setHistoryView");
      if (this.historyView.isActive) {
        await this.loadItineraryVersion(itineraryRouteQuery);
        return this.syncUrlWithSidebar();
      } else if (!helpers.isProUser(this.authData)) {
        this.$router.push({
          path: PATH_INFO.HOME.path,
        });
      } else if (itineraryRouteQuery && !this.itinerary.data) {
        await this.loadItineraryByRouteQuery();
      } else if (!itineraryRouteQuery && this.itinerary.data) {
        this.$router.push({
          path: PATH_INFO.SERVICES.path,
          query: { itinerary: this.itinerary.data.id },
        });
        await this.loadItineraryWithoutRouteQuery();
      } else await this.loadOnlyItineraryServicesData();
      await this.$store.dispatch("locations/listCountry");
      this.syncUrlWithSidebar();
      this.fetchServiceList();
    },
    syncUrlWithSidebar() {
      const { query } = this.$route;
      if (query.tab || query.service) {
        const tab = EDIT_SERVICE_SIDEBAR_TABS[(query.tab || "").toUpperCase()];
        const itineraryServiceFound = this.services_itinerary.find(
          ({ servicesRelated }) =>
            servicesRelated.some(
              ({ short_code }) => short_code === query.service
            )
        );
        if (!tab || !itineraryServiceFound) {
          const newQuery = {
            itinerary: query.itinerary,
            version: query?.version,
          };
          if (!query?.version) deleteObjectProperties(newQuery, ["version"]);
          return this.$router.push({ query: newQuery });
        }
        this.serviceEdited = itineraryServiceFound;
        this.handleModalEditServiceModal(itineraryServiceFound, tab.id);
      }
    },
    handleModalEditServiceModal(
      serviceSelected = null,
      defaultOpenedTab = null,
      focusedElement = ""
    ) {
      if (this.serviceEdited === null) {
        this.serviceEdited = serviceSelected;
      }
      this.serviceEdited = serviceSelected === null ? null : this.serviceEdited;
      this.editServiceModal = !this.editServiceModal;
      this.serviceIdToEdit = serviceSelected?.id ?? "";
      this.defaultOpenedTab = defaultOpenedTab;
      this.editServiceSidebarFocusedElement = focusedElement;
    },
    updateUrlFromEditServiceSidbar(value = null) {
      const { query } = this.$route;
      if (value === null && !this.editServiceModal && !this.serviceEdited?.id) {
        const newQuery = {
          itinerary: query.itinerary,
          version: query?.version,
        };
        if (!query?.version) deleteObjectProperties(newQuery, ["version"]);
        if (query.service || query.tab)
          return this.$router.push({ query: newQuery });
        return;
      }
      if (!this.serviceEdited?.id) return;
      const newTab = value || this.defaultOpenedTab;
      const editServiceSideBarTabs = Object.values(EDIT_SERVICE_SIDEBAR_TABS);
      const tab = editServiceSideBarTabs.find(
        (tab) => tab.id === newTab
      )?.urlParam;
      const newQuery = {
        ...query,
        service: this.serviceEdited.short_code,
        tab,
      };
      if (JSON.stringify(query) === JSON.stringify(newQuery)) return;
      this.$router.push({ query: newQuery });
    },
    dispatchServicesItinerary(data) {
      this.$store.dispatch("itinerary/setGroupedServicesItinerary", data);
    },
    fetchServiceList() {
      if (this.$route.query.itinerary) {
        this.$store.dispatch(
          "services/fetchServiceList",
          this.$route.query.itinerary
        );
      }
    },
  },
  watch: {
    timerCount: {
      handler(value) {
        if (document.querySelector(".recentlyAffected")) {
          document.querySelectorAll(".recentlyAffected").forEach((e) => {
            const notProcessed = e
              .getAttribute("data-highlight")
              ?.includes("not_processed");
            const processed = e
              .getAttribute("data-highlight")
              ?.includes("processed");

            if (notProcessed) {
              e.parentElement.parentElement.parentElement.classList.add(
                "not_processed"
              );
            }
            if (processed) {
              e.parentElement.parentElement.parentElement.classList.add(
                "bg-added"
              );
            }
            if (!notProcessed && !processed) {
              e.parentElement.parentElement.parentElement.classList.remove(
                "bg-added"
              );
            }
          });
        }
        if (value <= 0 || this.itineraryServicesAffected.length === 0) {
          this.timerCount = 0;
          clearTimeout(this.timerCountVar);
          this.handleItineraryServiceRecentlyAdded(null);
          document.querySelectorAll("tr.bg-added").forEach((e) => {
            e.classList.value = "";
          });
        }
        if (value > 0) {
          this.timerCountVar = setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
    serviceEdited: {
      handler() {
        this.updateUrlFromEditServiceSidbar(this.defaultOpenedTab);
      },
      immediate: true,
    },
    defaultOpenedTab: {
      handler(value) {
        this.updateUrlFromEditServiceSidbar(value);
      },
      immediate: true,
    },
  },
  beforeMount() {
    this.initialLoad();
  },
};
</script>

<style>
tr {
  transition: 1s ease;
  -moz-transition: 1s ease;
  -webkit-transition: 1s ease;
  background: initial;
}
tr.danger {
  background: #ff001128;
}
tr.bg-added {
  background: #fefeda;
}
tr.bg-added.not_processed {
  background: #f65c66;
}
.editable-table tbody tr {
  position: relative;
  width: 100%;
}

.editable-table tbody tr .loading__cell {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.692);
  z-index: 1;
}
</style>
