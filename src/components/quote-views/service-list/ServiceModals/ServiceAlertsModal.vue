<template>
  <b-modal
    title="Do you want to import it again?"
    :width="600"
    v-model="isOpen"
    @close="closeModal()"
  >
    <div class="service_replace_modal p-4">
      <h1 class="has-text-left mb-2">
        {{ alertTitle }}
      </h1>
      <p class="has-text-left mb-4" v-html="alertContent"></p>
      <div
        v-if="displaySelectedService"
        class="is-flex mb-1"
        style="color: var(--gray-dark) !important"
      >
        <div style="width: 6%">Day</div>
        <div style="width: 26%">Dates</div>
        <div style="width: 22%">Location</div>
        <div style="width: 40%">Service</div>
      </div>
      <ServiceRow
        v-if="displaySelectedService"
        :highlight="true"
        :service="validatedSelectedService"
        :fieldsToDisplay="serviceRowFields"
      />
      <slot name="footer"> </slot>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import ServiceRow from "./ServiceRow.vue";
import { SERVICE_ROW_FIELDS } from "@/constants/services";
import { datesHelper } from "@/utils/dates";

export default {
  name: "ServiceAlertsModal",
  components: { ServiceRow },
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    alertTitle: {
      type: String,
      default: "",
    },
    alertContent: {
      type: String,
      default: "",
    },
    selectedService: {
      type: Object,
      default: () => ({}),
    },
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      helpers: { ...datesHelper },
      isOpen: this.isModalOpen,
      constants: { SERVICE_ROW_FIELDS },
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
    }),
    validatedSelectedService() {
      if (!this.selectedService?.item) return {};
      const startDate = this.selectedService.item.start_date;
      const endDate =
        this.selectedService.item.end_date.localeCompare(startDate) < 0
          ? startDate
          : this.selectedService.item.end_date;
      return {
        ...this.selectedService.item,
        day: datesHelper.getDayPosition(
          [this.itinerary.data.start_date, this.itinerary.data.end_date],
          [startDate, endDate]
        ),
      };
    },
    displaySelectedService() {
      return this.selectedService?.code;
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
      ];
    },
  },
  watch: {
    isModalOpen(newValue) {
      this.isOpen = newValue;
    },
  },
};
</script>
<style scoped>
.service_replace_modal {
  width: 100%;
}
.service_replace_modal h1 {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
  color: #000;
}
</style>
