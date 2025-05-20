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
        <h1 class="mb-2">
          Do you want to move the following services as well?
        </h1>
        <p style="width: 100%; text-align: left" class="my-4">
          <span class="has-text-weight-bold">Tip</span>: Press 1 to move only
          this one
        </p>
      </header>
      <main>
        <div class="service_selected">
          <h3 style="font-weight: 500">Service Edited</h3>
          <div style="overflow-x: auto">
            <ServiceRow
              :highlight="true"
              :service="updatedServiceEdited"
              :fieldsToDisplay="serviceEditedRowFields"
            />
          </div>
        </div>
        <section class="service_massive_options">
          <header>
            <div>
              <h3>{{ updatedNextServices.length }} Services to move</h3>
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
              :fieldsToDisplay="serviceOptionsFields"
            />
          </ul>
        </section>
      </main>
      <footer
        class="is-flex is-flex-direction-column service_move_massive_modal__footer"
      >
        <p class="w-100 has-text-left my-2">
          <span
            v-if="
              servicesWithEditedPrices.length > 0 &&
              !maintainServiceManualPrices &&
              !isServiceEditedDatesRangeModified
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
            :data-test-id="
              constants.DATA_TEST_ID_VALUES.MAINTAIN_SERVICES_PRICES_CONTROL
            "
            :disabled="isServiceEditedDatesRangeModified"
          >
            Mantain the total prices of the
            {{ updatedNextServices.length + 1 }} services
          </b-checkbox>
          <span v-if="isServiceEditedDatesRangeModified">
            <IconWarningCircle class="ml-1 mb-1" style="fill: #ff9316" />

            <span style="color: #ff9316; font-size: 0.8rem">
              {{
                "Cannot maintain prices of the services, as the nights of the service edited have been modified"
              }}
            </span>
          </span>
        </p>
        <div class="is-flex w-100" style="gap: 1rem">
          <BaseButton action="secondary" @click="onMoveOnlyOneServiceClick">
            <p slot="text">No, move edited</p>
          </BaseButton>
          <BaseButton
            action="principal"
            @click="onMoveAllServicesClick"
            :idElement="'confirmButton'"
            :data-test-id="
              constants.DATA_TEST_ID_VALUES.MOVE_ALL_ITINERARY_SERVICES_BUTTON
            "
          >
            <p slot="text">Yes, move all</p>
          </BaseButton>
        </div>
      </footer>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import GlobalEvents from "vue-global-events";
import { datesHelper } from "@/utils/dates";
import ServiceRow from "./ServiceRow.vue";
import { SERVICE_ROW_FIELDS } from "@/constants/services";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { KEYBOARD_KEYS } from "@/constants/shortcuts";
import { addDaysToDate } from "@/utils/utils";

export default {
  name: "ServiceMoveMassiveModal",
  components: { GlobalEvents, ServiceRow },
  props: {
    showServiceMassiveModal: {
      type: Boolean,
      default: false,
    },
    serviceEdited: {
      type: Object,
      default: () => {},
    },
    serviceMassiveOptions: {
      type: Array,
      default: () => [],
    },
    handleEditMultipleRows: {
      type: Function,
      default: () => {},
    },
    getServiceChunks: {
      type: Function,
      default: () => {},
    },
    resetServiceEdited: {
      type: Function,
      default: () => {},
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    handleChangeTimerCount: {
      type: Function,
      default: () => {},
    },
    showServiceAlertsModal: {
      type: Function,
      default: () => {},
    },
    onContinueClick: {
      type: Function,
      default: () => {},
    },
    onSecondaryActionClick: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: {
        DATA_TEST_ID_VALUES,
        SERVICE_ROW_FIELDS,
      },
      isModalOpen: this.showServiceMassiveModal,
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
      const servicesToMove = [
        ...this.serviceEdited.item.servicesRelated,
        ...this.updatedNextServices,
      ];
      return servicesToMove.filter((service) => service.isPriceEdited);
    },
    isServiceEndDateFieldModified() {
      return this.serviceEdited.field.key === SERVICE_ROW_FIELDS.END_DATE;
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
    updatedServiceEdited() {
      const startDate = this.serviceEdited.item.start_date;
      const endDate =
        this.serviceEdited.item.end_date.localeCompare(startDate) < 0
          ? startDate
          : this.serviceEdited.item.end_date;

      return {
        ...this.serviceEdited.item,
        start_date: startDate,
        end_date: endDate,
        day:
          SERVICE_ROW_FIELDS.DAY === this.serviceEdited.field.key
            ? this.serviceEdited.value
            : datesHelper.getDayPosition(
                [this.itinerary.data.start_date, this.itinerary.data.end_date],
                [startDate, endDate]
              ),
      };
    },
    previousServiceDatesRange() {
      const isDayFieldModified =
        this.serviceEdited.field.key === SERVICE_ROW_FIELDS.DAY;

      return isDayFieldModified
        ? datesHelper.getDateRangeByDay(this.serviceEdited.previousValue)
        : datesHelper.getDatesDiffByDates(
            this.serviceEdited.previousDatesValue.endDate,
            this.serviceEdited.previousDatesValue.startDate
          );
    },
    currentServiceDatesRange() {
      return datesHelper.getDatesDiffByDates(
        this.serviceEdited.item.end_date,
        this.serviceEdited.item.start_date
      );
    },
    isServiceEditedDatesRangeModified() {
      return this.previousServiceDatesRange !== this.currentServiceDatesRange;
    },
    serviceEditedRowFields() {
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
          text: this.isServiceEditedDatesRangeModified
            ? "⏱︎ Pending Recalculation"
            : "",
        },
      ];
    },
    serviceOptionsFields() {
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
          text: this.isServiceEditedDatesRangeModified
            ? "⏱︎ Pending Recalculation"
            : "",
        },
      ];
    },
  },
  watch: {
    showServiceMassiveModal(newValue = false) {
      this.isModalOpen = newValue;
      this.$store.dispatch("utils/setIsModalOpen", newValue);
      if (!newValue) {
        this.showUpdateItineraryModal = false;
        this.isAvailableToEnter = false;
        this.maintainServiceManualPrices = false;
      } else {
        setTimeout(() => {
          this.isAvailableToEnter = true;
        }, 300);
      }
    },
    isModalOpen(newValue) {
      if (this.showServiceMassiveModal === newValue) return;
      this.$emit("update:showServiceMassiveModal", newValue);
    },
  },
  methods: {
    keymap(e) {
      const code = e.which || e.keyCode;
      if (code === KEYBOARD_KEYS.NUM_1) this.onMoveOnlyOneServiceClick();
      if (code === KEYBOARD_KEYS.ENTER && this.isAvailableToEnter)
        this.onMoveAllServicesClick();
    },
    onMoveOnlyOneServiceClick() {
      this.onSecondaryActionClick(this.maintainServiceManualPrices);
    },
    onMoveAllServicesClick() {
      this.onContinueClick(true, 0, 0, this.maintainServiceManualPrices);
    },
    closeIsModalOpen() {
      this.isModalOpen = false;
    },
    calculateDaysToMove() {
      if (!this.serviceEdited) return 0;
      return this.getDiffDays();
    },
    getDiffDays() {
      if (this.serviceEdited.field.key === SERVICE_ROW_FIELDS.START_DATE) {
        return datesHelper.getDatesDiffByDates(
          this.serviceEdited.item.start_date,
          this.serviceEdited.previousValue
        );
      } else if (this.isServiceEndDateFieldModified) {
        return datesHelper.getDatesDiffByDates(
          this.serviceEdited.value,
          this.serviceEdited.previousDatesValue.endDate
        );
      } else {
        return datesHelper.getDatesDiffByDay(
          this.serviceEdited.previousValue,
          this.serviceEdited.value
        );
      }
    },
  },
};
</script>
<style>
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
  padding: 2rem 2rem 2rem;
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
  font-weight: 600;
  text-align: left;
  margin-bottom: 0.6rem;
}
.service_massive_options {
  padding: 0 0 1rem 0;
  height: 80%;
  overflow: hidden;
}
.service_massive_options header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}
.service_massive_options header > div {
  text-align: left;
}
.service_massive_options div > h3 {
  color: #444;
  font-size: 1rem;
  font-weight: 700;
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
  min-height: 72%;
  width: 100%;
}
.service_move_massive_modal > footer {
  width: 100%;
}
.service_move_massive_modal > footer .field {
  width: 50%;
}
.service_move_massive_modal > footer .field button {
  width: 100% !important;
  font-size: 0.8rem !important;
}
.service_massive_list {
  height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}
.service_move_massive_modal__footer {
  position: sticky;
  bottom: 0;
  left: 0;
  background-color: #fff;
}
@media screen and (max-width: 480px) {
  .service_massive_list {
    overflow-x: auto;
    height: 18rem;
  }
  .service_move_massive_modal {
    padding: 1.25rem 1.25rem 0 1.25rem;
  }
}
</style>
