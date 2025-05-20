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
    v-bind="$attrs"
  >
    <div class="service_move_massive_modal">
      <GlobalEvents @keydown.enter="keymap" @keydown.49="keymap" />
      <header class="w-100">
        <h1 class="mb-2">Inserting service between different destinations</h1>
        <p style="width: 100%; text-align: left" class="my-4">
          The following services will be moved
          <strong>{{ daysToMove }}</strong> days ahead. Do you want to move
          them?
        </p>
      </header>
      <main>
        <div v-if="previousServiceLocation" class="service_selected">
          <h3 class="mb-1">From</h3>
          <h3>
            <strong>{{ previousServiceLocation }}</strong>
          </h3>
          <ServiceRow
            :service="previousService"
            :fieldsToDisplay="serviceRowFields"
          />
        </div>
        <div class="service_selected">
          <h3>Selected service</h3>
          <h3>
            <strong>{{ selectedServiceLocation }}</strong>
          </h3>
          <ServiceRow
            :highlight="true"
            :service="serviceToSave"
            :fieldsToDisplay="serviceRowFields"
          />
        </div>
        <section class="service_massive_options">
          <header>
            <div>
              <h3 class="mb-1">To</h3>
              <h3>
                <strong>{{ nextServicesLocation }}</strong>
              </h3>
              <h3 class="mt-2">
                {{ updatedNextServices.length }} Services to move
              </h3>
            </div>
            <div class="service_num_days_diff">
              <span>Move</span>
              <h3>
                <IconArrowLeft v-if="!isAhead" />
                <IconArrowRight v-else />
                {{ daysToMove }} days
              </h3>
            </div>
          </header>
          <ul class="service_massive_list">
            <ServiceRow
              v-for="serviceOption in updatedNextServices"
              :key="serviceOption.id"
              :service="serviceOption"
              :fieldsToDisplay="serviceRowFields"
            />
          </ul>
        </section>
      </main>
      <footer class="is-flex is-flex-direction-column">
        <p class="w-100 has-text-left my-2">
          <span
            v-if="
              servicesWithEditedPrices.length > 0 &&
              !maintainServiceManualPrices
            "
          >
            <IconWarningCircle class="mr-1" style="fill: #ff9316" />
            <span style="color: #ff9316; font-size: 0.8rem">
              Edited prices will be overwritten
            </span>
          </span>
          <b-checkbox
            v-model="maintainServiceManualPrices"
            class="mb-2 mt-1 w-100"
          >
            Mantain services prices
          </b-checkbox>
        </p>
        <div class="is-flex w-100" style="gap: 1rem">
          <BaseButton action="secondary" @click="onSecondaryActionClick">
            <p slot="text">No, dont´t move next services</p>
          </BaseButton>
          <BaseButton
            action="principal"
            @click="onContinueClick"
            :idElement="'confirmButton'"
          >
            <p slot="text">Yes, move next services</p>
          </BaseButton>
        </div>
      </footer>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import GlobalEvents from "vue-global-events";
import { addDaysToDate } from "@/utils/utils";
import ServiceRow from "./ServiceRow.vue";
import { SERVICE_ROW_FIELDS } from "@/constants/services";
import { MAX_PROCESS_SERVICES } from "@/constants";
import helpers from "@/helpers";
import { KEYBOARD_KEYS } from "@/constants/shortcuts";
import { serviceHelper } from "@/utils/service";
import { datesHelper } from "@/utils/dates";

export default {
  name: "ServiceInsertBetweenDestinationsModal",
  components: { GlobalEvents, ServiceRow },
  props: {
    showServiceInsertBetweenDestinationsModal: {
      type: Boolean,
      default: false,
    },
    serviceToSave: {
      type: Object,
      default: () => {},
    },
    previousService: {
      type: Object,
      default: () => {},
    },
    serviceMassiveOptions: {
      type: Array,
      default: () => [],
    },
    setNewService: {
      type: Function,
      default: () => {},
    },
    resetServiceEdited: {
      type: Function,
      default: () => {},
    },
    clearServiceInsertBetweenDestinationsModalData: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: { SERVICE_ROW_FIELDS },
      isModalOpen: this.showServiceInsertBetweenDestinationsModal,
      showUpdateItineraryModal: false,
      isAvailableToEnter: false,
      maintainServiceManualPrices: false,
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      itineraryServices: "itinerary/getServicesItinerary",
    }),
    daysToMove() {
      return this.calculateDaysToMove();
    },
    isAhead() {
      return this.daysToMove > 0;
    },
    servicesWithEditedPrices() {
      const servicesToMove = [...this.updatedNextServices];
      return servicesToMove.filter((service) => service.isPriceEdited);
    },
    previousServiceLocation() {
      return this.previousService?.location
        ?.map((location) => location.location_name)
        .join(", ");
    },
    selectedServiceLocation() {
      return this.serviceToSave?.location
        ?.map((location) => location.location_name)
        .join(", ");
    },
    nextServicesLocation() {
      return this.updatedNextServices[0]?.location
        ?.map((location) => location.location_name)
        .join(", ");
    },
    updatedNextServices() {
      return this.serviceMassiveOptions.map((service) => {
        const newStartDate = addDaysToDate(service.start_date, this.daysToMove);
        const newEndDate = addDaysToDate(service.end_date, this.daysToMove);
        return {
          ...service,
          start_date: newStartDate,
          end_date: newEndDate,
          day: datesHelper.getDayPosition(
            [this.itinerary.data.start_date, this.itinerary.data.end_date],
            [newStartDate, newEndDate]
          ),
        };
      });
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
    showServiceInsertBetweenDestinationsModal(newValue = false) {
      this.isModalOpen = newValue;
      this.$store.dispatch("utils/setIsModalOpen", newValue);
      if (!newValue) {
        this.showUpdateItineraryModal = false;
        this.clearServiceInsertBetweenDestinationsModalData();
        this.resetServiceEdited();
        this.isAvailableToEnter = false;
      } else {
        setTimeout(() => {
          this.isAvailableToEnter = true;
        }, 300);
      }
    },
    isModalOpen(newValue) {
      if (this.showServiceInsertBetweenDestinationsModal === newValue) return;
      this.$emit("update:showServiceInsertBetweenDestinationsModal", newValue);
    },
  },
  methods: {
    keymap(e) {
      const code = e.which || e.keyCode;
      if (code === KEYBOARD_KEYS.ENTER && this.isAvailableToEnter)
        this.onContinueClick();
    },
    onContinueClick() {
      this.setNewService(this.serviceToSave, {
        calculate_prices: !Number(this.maintainServiceManualPrices),
      });
      this.maintainServiceManualPrices = false;
      this.$emit("update:serviceMassiveOptions", []);
      this.closeIsModalOpen();
      this.clearServiceInsertBetweenDestinationsModalData();
    },
    onSecondaryActionClick() {
      this.setNewService(this.serviceToSave, {
        calculate_prices: !Number(this.maintainServiceManualPrices),
        disableCheckMovement: true,
      });
      this.maintainServiceManualPrices = false;
      this.$emit("update:serviceMassiveOptions", []);
      this.closeIsModalOpen();
      this.clearServiceInsertBetweenDestinationsModalData();
    },
    getServiceChunks() {
      const serviceRelatedOptions = this.updatedNextServices.flatMap(
        (service) => service.servicesRelated
      );

      const serviceUUIDs = serviceRelatedOptions;

      return {
        chunks: helpers.sliceIntoChunks(serviceUUIDs, MAX_PROCESS_SERVICES),
        serviceUUIDs,
      };
    },
    closeIsModalOpen() {
      this.isModalOpen = false;
    },
    calculateDaysToMove() {
      if (!this.serviceToSave) return 0;
      return serviceHelper.getDaysToMove(this.serviceToSave);
    },
  },
};
</script>
<style scoped>
.service_move_massive_modal .selectContainer {
  display: block;
}
.service_move_massive_modal .btnClose {
  background-color: transparent;
  border: none;
  padding: 0;
}
.animation-content {
  z-index: 999;
}
.service_move_massive_modal .services_results_length {
  position: absolute;
  right: 0;
  bottom: -2rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6d6d6d;
}
.service_move_massive_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40rem;
  height: 46rem;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  font-family: Poppins, sans-serif;
}
.service_move_massive_modal > header > h1 {
  color: #1e1e1e;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: left;
}
.service_selected > h3 {
  color: #6d6d6d;
  font-size: 0.9rem;
  text-align: left;
  margin-bottom: 0.6rem;
  font-weight: 400;
}
.service_massive_options {
  padding: 0 0 1rem 0;
  height: 60%;
  overflow: hidden;
}
.service_massive_options header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 1rem 0;
}
.service_massive_options header > div {
  text-align: left;
}
.service_massive_options div > h3 {
  color: #6d6d6d;
  font-size: 0.9rem;
  font-weight: 600;
}
.service_num_days_diff {
  font-size: 1rem;
}
.service_num_days_diff > span {
  font-size: 0.8rem;
  display: flex;
  justify-content: flex-end;
}
.service_num_days_diff h3 {
  font-size: 1rem;
}
.service_num_days_diff svg {
  transform: rotate(90deg);
  margin-right: 0.5rem;
}
.service_move_massive_modal main {
  min-height: 78%;
  width: 100%;
}
.service_move_massive_modal > footer {
  position: sticky;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  column-gap: 1rem;
  width: 100%;
}
.service_move_massive_modal > footer .field {
  width: 100%;
}
.service_move_massive_modal > footer .field button {
  width: 100% !important;
  font-size: 0.8rem !important;
}
.service_massive_list {
  height: 70%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
