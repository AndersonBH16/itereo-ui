<template>
  <b-modal
    v-if="isModalOpen"
    v-model="isModalOpen"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Modal"
    aria-modal
    @close="isModalOpen = false"
    :data-test-id="constants.DATA_TEST_ID_VALUES.CLOSE_MODAL_BUTTON"
    v-bind="$attrs"
  >
    <div class="serviceselect_modal">
      <h1 class="header_title" style="text-align: left; width: 100%">
        Selecting a service
      </h1>
      <ServiceModalFilters
        :searchPayload="searchPayload"
        :serviceTypesOptions="serviceTypesOptions"
        :getDestinationsPerCountry="getDestinationsPerCountry"
        :searchServicesByPayload="searchServicesByPayload"
        @update:searchPayload="updateSearchPayload"
        @keydown.native.enter="searchServicesByPayload"
      />
      <p class="services_results_length">{{ resultsLength }} results</p>
      <ServiceSelectModalBody
        :filteredServices="filteredServices"
        :setNewService="setNewService"
        :resultsLength="resultsLength"
      />
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import ServiceModalFilters from "../ServiceModals/ServiceModalFilters.vue";
import ServiceSelectModalBody from "./ServiceSelectModalBody.vue";
import { serviceHelper } from "@/utils/service";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { getLocationCode } from "@/utils/utils";
import { helpers } from "@/utils/adapters";

export default {
  name: "ServiceSelectModal",
  components: {
    ServiceModalFilters,
    ServiceSelectModalBody,
  },
  props: {
    setFullServiceWithPrices: {
      type: Function,
      default: () => {},
    },
    getFullServiceWithPrices: {
      type: Function,
      default: () => {},
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    isServiceSelectModalActive: {
      type: Boolean,
      default: false,
    },
    services: {
      type: Array,
      default: () => [],
    },
    newService: {
      type: Object,
      default: () => {},
    },
    currentRow: {
      type: Object,
      default: () => {},
    },
    handleSearchServicesContract: {
      type: Function,
      default: () => {},
    },
    updateSearchServicesPayload: {
      type: Function,
      default: () => {},
    },
    createItineraryService: {
      type: Function,
      default: () => {},
    },
    validateServiceLocationBeforeAdding: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    newService(newValue) {
      const id_service_type = newValue.id_service_type;
      if (id_service_type?.length) {
        this.searchServicesByServiceType();
      }
    },
    isModalOpen(newValue) {
      if (this.isServiceSelectModalActive === newValue) return;
      this.$emit("update:isServiceSelectModalActive", newValue);
    },
    isServiceSelectModalActive(newValue) {
      this.isModalOpen = newValue;
      this.$store.dispatch("utils/setIsModalOpen", newValue);
      if (newValue) this.onMounted();
      else this.resetComponentState();
    },
  },
  data() {
    return {
      constants: {
        DATA_TEST_ID_VALUES,
      },
      filteredServices: [],
      search: "",
      isModalOpen: this.isServiceSelectModalActive,
      searchPayload: this.buildSearchPayload(),
    };
  },
  computed: {
    ...mapGetters({
      serviceTypes: "service_types/list",
      serviceList: "services/getServiceList",
      serviceCountries: "client/getCountriesFromContract",
      destinations: "client/getFilteredDestinations",
      itinerary: "itinerary/getItinerary",
    }),
    serviceTypesOptions() {
      return [{ id: "", name: "All" }, ...this.serviceTypes];
    },
    serviceCountriesOptions() {
      return [
        { id: "", name: "All" },
        ...this.serviceCountries.map((country) => ({
          id: country.id,
          name: country.location_name,
        })),
      ];
    },
    serviceDestinationsOptions() {
      return serviceHelper.formatDestinationsTextForServiceTable(
        this.destinations
      );
    },
    resultsLength() {
      return this.filteredServices.length || 0;
    },
  },
  methods: {
    buildSearchPayload() {
      const destination = getLocationCode(this.newService.location);
      return {
        country: this.newService.country || "All",
        destination: destination || "All",
        serviceType: this.newService.id_service_type || "",
        text: "",
      };
    },
    updateSearchPayload(payload) {
      this.searchPayload = payload;
      this.newService.country = payload.country;
      this.newService.location = payload.destination;
      this.newService.id_service_type = payload.serviceType;
      this.filterServices();
    },
    closeServiceSelectModal() {
      this.isModalOpen = false;
    },
    async searchServicesByPayload() {
      const { country, destination, serviceType, text, formattedServiceTags } =
        this.searchPayload;
      this.updateSearchServicesPayload("", "", {
        id_service_type: serviceType,
        category: formattedServiceTags,
        country: country === "All" ? "" : country,
        location: destination === "All" ? "" : destination,
        from: this.currentRow?.start_date,
        to: this.currentRow?.end_date,
        code: text || "",
        name: text || "",
        page: 1,
      });
      await this.handleSearchServicesContract();
      this.filteredServices = this.services;
    },
    filterServices() {
      this.filteredServices = serviceHelper.filterServicesOnModals(
        this.serviceList,
        this.searchPayload
      );
    },
    async setNewService(service) {
      this.setLoading(true);

      const stopServiceSaving = this.validateServiceLocationBeforeAdding({
        start_date: this.currentRow.start_date,
        end_date: this.currentRow.end_date,
        ...service,
      });

      if (stopServiceSaving) {
        this.setLoading(false);
        this.closeServiceSelectModal();
        return;
      }

      this.currentRow.service = service.id;
      this.currentRow.code = service.code;
      this.currentRow.id_service_type = service.id_service_type;
      this.currentRow.location = service.location;
      this.setFullServiceWithPrices(service);

      const parentService = await this.$store.dispatch("services/getService", {
        id: service.id,
        itinerary: this.$route.query.itinerary,
        calculate_prices: 0,
        info: 1,
        from: this.itinerary.data.start_date,
        to: this.itinerary.data.end_date,
        num_pax: this.itinerary.data.num_pax,
      });

      await this.$store.dispatch("services/resetService");

      const adaptedServiceToAdd = helpers.adaptServiceToAdd(
        {
          ...this.currentRow,
          ...service,
        },
        parentService
      );

      await this.createItineraryService(adaptedServiceToAdd);
      this.closeServiceSelectModal();
    },
    getDestinationsPerCountry(country) {
      this.$store
        .dispatch("client/filterDestinationsByCountry", { name: country })
        .catch((error) => {
          throw error;
        });
    },
    onMounted() {
      this.searchPayload = this.buildSearchPayload();
      this.filterServices();
      this.getDestinationsPerCountry(this.searchPayload.country);
      this.$store.dispatch("services/resetService");
    },
    resetComponentState() {
      this.$store.dispatch("services/resetServices");
      this.filteredServices = [];
      this.searchPayload = {
        serviceType: "",
        country: "All",
        destination: "All",
      };
    },
  },
};
</script>
<style>
.serviceselect_modal .selectContainer {
  display: block;
}
.serviceselect_modal .btnClose {
  background-color: transparent;
  border: none;
  padding: 0;
}
.animation-content {
  z-index: 999;
}
.serviceselect_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 36rem;
  height: 40rem;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: center;
}
.serviceselect_modal .services_results_length {
  display: block;
  width: 100%;
  text-align: right;
  margin-top: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6d6d6d;
}
.header_title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
}
@media screen and (max-width: 480px) {
  .serviceselect_modal {
    padding: 1rem;
    height: 100%;
  }
}
</style>
