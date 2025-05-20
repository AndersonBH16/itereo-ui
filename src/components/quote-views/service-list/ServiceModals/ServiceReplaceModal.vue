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
    @close="closeServiceSelectModal"
    v-bind="$attrs"
  >
    <div class="service_replace_modal">
      <h1 class="header_title" style="text-align: left; width: 100%">
        Replace service
      </h1>
      <p class="mb-4" style="text-align: left; width: 100%">
        Please, search and select a service to replace the current one
      </p>
      <p v-if="serviceToReplace.isPriceEdited" class="w-100 has-text-left">
        <IconWarningCircle class="mr-1" style="fill: #ff9316" />
        <span style="color: #ff9316"
          >Services with edited prices will be overwritten</span
        >
      </p>
      <div style="width: 100%">
        <div class="is-flex mb-2" style="color: var(--gray-dark) !important">
          <div v-if="!isMobileView" style="flex: 1">Day</div>
          <div v-if="!isMobileView" style="flex: 1">Dates</div>
          <div v-if="!isMobileView" style="flex: 1">Location</div>
          <div style="flex: 3">Service</div>
          <div v-if="!isMobileView" style="flex: 1">Price</div>
        </div>
        <ServiceRow
          :service="serviceToReplace"
          :fieldsToDisplay="isMobileView ? [] : serviceRowFields"
        />
      </div>
      <ServiceModalFilters
        :searchPayload="searchPayload"
        :serviceTypesOptions="serviceTypesOptions"
        :getDestinationsPerCountry="getDestinationsPerCountry"
        :searchServicesByPayload="searchServicesByPayload"
        @update:searchPayload="updateSearchPayload"
        @keydown.native.enter="searchServicesByPayload"
      />
      <span class="services_results_length">{{ resultsLength }} result(s)</span>
      <ServiceModalList
        :filteredServices="filteredServices"
        :onServiceClick="onServiceClick"
        :resultsLength="resultsLength"
      />
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import ServiceModalFilters from "./ServiceModalFilters.vue";
import ServiceModalList from "./ServiceModalList.vue";
import { SERVICE_TYPE } from "@/constants";
import { SERVICE_ROW_FIELDS } from "@/constants/services";
import { datesHelper } from "@/utils/dates";
import { serviceHelper } from "@/utils/service";

import ServiceRow from "./ServiceRow.vue";

export default {
  name: "ServiceReplaceModal",
  components: {
    ServiceModalFilters,
    ServiceModalList,
    ServiceRow,
  },
  props: {
    isServiceModalOpen: {
      type: Boolean,
      default: false,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    updateSearchServicesPayload: {
      type: Function,
      default: () => {},
    },
    handleSearchServicesContract: {
      type: Function,
      default: () => {},
    },
    serviceToReplace: {
      type: Object,
      default: () => {},
    },
    handleChangeTimerCount: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: {
        SERVICE_ROW_FIELDS,
      },
      filteredServices: [],
      isModalOpen: this.isServiceModalOpen,
      searchPayload: {
        serviceType: "",
        country: "All",
        destination: "All",
        text: "",
      },
    };
  },
  watch: {
    isModalOpen(newValue) {
      if (this.isServiceModalOpen === newValue) return;
      this.$emit("update:isOpenModal", newValue);
    },
    isServiceModalOpen(newValue) {
      this.isModalOpen = newValue;
      this.$store.dispatch("utils/setIsModalOpen", newValue);
      if (newValue) this.onMounted();
      else this.resetComponentState();
    },
  },
  computed: {
    ...mapGetters({
      initialServices: "services/getServices",
      serviceList: "services/getServiceList",
      serviceTypes: "service_types/list",
      countries: "client/getCountriesFromContract",
      destinations: "client/getFilteredDestinations",
      itinerary: "itinerary/getItinerary",
    }),
    isAvailableToAddAccommodation() {
      return (
        Math.abs(
          datesHelper.getDatesDiffByDates(
            this.serviceToReplace?.start_date,
            this.serviceToReplace?.end_date
          )
        ) > 0
      );
    },
    services() {
      if (!this.initialServices?.data) return [];
      return this.initialServices?.data?.filter(
        (service) => service.id_service_type !== SERVICE_TYPE.PACKAGE
      );
    },
    serviceTypesOptions() {
      return [
        { id: "", name: "All" },
        ...this.serviceTypes.filter(({ id }) => {
          if (!this.isAvailableToAddAccommodation)
            return ![SERVICE_TYPE.PACKAGE, SERVICE_TYPE.ACCOMMODATION].includes(
              id
            );
          return ![SERVICE_TYPE.PACKAGE].includes(id);
        }),
      ];
    },
    resultsLength() {
      return this.filteredServices.length;
    },
    isMobileView() {
      return window.innerWidth <= 480;
    },
    serviceRowFields() {
      return [
        {
          label: this.constants.SERVICE_ROW_FIELDS.DAY,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.DATES,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.LOCATION,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.PRICE,
          text: "",
        },
      ];
    },
  },
  methods: {
    buildSearchPayload() {
      const serviceToReplaceCountry = this.serviceToReplace?.location.find(
        (location) => [null, 0].includes(location.parent)
      );
      const serviceToReplaceDestination = this.serviceToReplace?.location.find(
        (location) => ![null, 0].includes(location.parent)
      );
      const countryByDestination =
        serviceToReplaceCountry ||
        serviceHelper.getParentLocation(
          serviceToReplaceDestination?.parent,
          this.countries
        );

      this.getDestinationsPerCountry(countryByDestination?.location_name);

      this.searchPayload = {
        serviceType: this.serviceToReplace?.id_service_type,
        country: countryByDestination?.location_name,
        destination: serviceToReplaceDestination?.location_code || "",
        text: "",
      };
    },
    updateSearchPayload(payload) {
      this.searchPayload = payload;
      this.filterServices();
    },
    async onServiceClick(service = {}) {
      try {
        this.closeServiceSelectModal();
        this.setLoading(true);
        const servicesToDelete = this.serviceToReplace.servicesRelated?.filter(
          (service) => service.id !== this.serviceToReplace.id
        );
        if (servicesToDelete.length > 0)
          this.$emit("update:updateServiceTableSkeleton", true);
        const TOTAL_STEPS_TO_PERFORM = servicesToDelete.length + 2;

        await this.handleReplaceService(service, 1, TOTAL_STEPS_TO_PERFORM);
        for (let index = 0; index < servicesToDelete.length; index++) {
          const service = servicesToDelete[index];
          await this.$store.dispatch("itinerary/delete_service", {
            id: service.id,
            itinerary: this.itinerary.data.id,
            cur_step: 2 + index,
            last_step: TOTAL_STEPS_TO_PERFORM,
          });
        }

        await this.$store.dispatch("itineraryDays/updateItineraryDays", {
          data: { itinerary_uuid: this.itinerary.data.id },
          cur_step: TOTAL_STEPS_TO_PERFORM,
          last_step: TOTAL_STEPS_TO_PERFORM,
        });

        this.setLoading(false);
        if (servicesToDelete.length > 0)
          this.$emit("update:updateServiceTableSkeleton", false);
      } catch (error) {
        this.setLoading(false);
        console.error("Error", error);
      }
    },
    async handleReplaceService(service = {}, cur_step, last_step) {
      try {
        const payload = {
          itineraryServiceId: this.serviceToReplace.id,
          itineraryId: this.itinerary.data.id,
          serviceId: service.id,
          numPax:
            this.serviceToReplace.servicesRelated.reduce(
              (acc, service) => acc + service.num_pax,
              0
            ) || this.serviceToReplace.num_pax,
        };
        await this.replaceService(payload, cur_step, last_step);
        this.handleChangeTimerCount(30);
      } catch (error) {
        console.error("Error", error);
      }
    },
    async replaceService(payload, cur_step, last_step) {
      const response = await this.$store.dispatch("itinerary/replace_service", {
        ...payload,
        cur_step,
        last_step,
      });
      const toast = { message: "", type: "" };
      if (response.status === "rejected") {
        toast.message = "Error replacing service";
        toast.type = "is-danger";
      } else {
        toast.message = "Service replaced successfully";
        toast.type = "is-success";
      }
      this.$buefy.toast.open({
        duration: 5000,
        message: toast.message,
        position: "is-top",
        type: toast.type,
      });
    },
    closeServiceSelectModal() {
      this.isModalOpen = false;
    },
    filterServices() {
      this.filteredServices = serviceHelper.filterServicesOnModals(
        this.serviceList,
        this.searchPayload
      );
    },
    async searchServicesByPayload() {
      const { country, destination, serviceType, text, formattedServiceTags } =
        this.searchPayload;
      this.updateSearchServicesPayload("", "", {
        id_service_type: serviceType,
        category: formattedServiceTags,
        country: country === "All" ? "" : country,
        location: destination === "All" ? "" : destination,
        from: this.serviceToReplace?.start_date,
        to: this.serviceToReplace?.end_date,
        code: text || "",
      });
      await this.handleSearchServicesContract();
      this.filteredServices = this.services;
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
    onMounted() {
      this.buildSearchPayload();
      this.filterServices();
    },
    getDestinationsPerCountry(country) {
      this.$store
        .dispatch("client/filterDestinationsByCountry", { name: country })
        .catch((error) => {
          throw error;
        });
    },
  },
};
</script>
<style scoped>
.service_replace_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40rem;
  height: 48rem;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: center;
}
.service_replace_modal .services_results_length {
  margin: 1rem 0 0;
  text-align: right;
  width: 100%;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6d6d6d;
}
@media screen and (max-width: 480px) {
  .service_replace_modal {
    height: 100%;
  }
}
</style>
