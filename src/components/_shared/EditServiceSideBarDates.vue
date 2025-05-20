<template>
  <div class="px-4 mb-3 mt-4 edit_service_sidebar__dates">
    <!-- <b-field label="Status" class="radioButtonSelector mt-2 mb-4" width="100%">
      <b-radio-button
        v-for="status in CONSTANTS.SERVICE_STATUS_OPTIONS"
        :key="status.value"
        v-model="formItineraryService.status"
        @input="emitUpdateForm('status', status.value)"
        :native-value="status.value"
        :type="`is-outlined is-focused ${status.type}`"
      >
        <span class="mr-1">{{ status.text }}</span>
        <b-icon
          :icon="status.icon"
          :type="`${status.type}-outline`"
          alt="icon"
          size="is-small"
        ></b-icon>
      </b-radio-button>
    </b-field> -->
    <div class="columns">
      <div class="column">
        <BaseDatePicker
          label="Date from"
          :disabled="
            disableQuoteByStatus ||
            loading ||
            hideElementByCondition ||
            disableQuoteByStatus
          "
          :locale="[]"
          :events="event_dates"
          indicators="bars"
          :unselectable-dates="disabled_dates"
          :min="minMaxDate.min"
          :value="formItineraryService.start_date"
          :unselectable-days-of-week="disabled_days"
          @input="handleDatesModified($event, 'start_date')"
          class="editServiceDateFrom"
          :isNotValid="false"
        />
      </div>
      <div class="column is-one-small px-0">
        <IconChevronRight class="mt-2 icon is-small color-4" />
      </div>
      <div class="column">
        <BaseDatePicker
          label="Date to"
          placeholder="Date to"
          icon="calendar-today"
          :locale="[]"
          :events="event_dates"
          indicators="bars"
          :unselectable-dates="disabled_dates"
          :min="minMaxDate.maxmin"
          :value="formItineraryService.end_date"
          :disabled="
            formItineraryService.id_service_type === 9 ||
            loading ||
            hideElementByCondition ||
            disableQuoteByStatus
          "
          :unselectable-days-of-week="disabled_days"
          :isNotValid="false"
          @input="handleDatesModified($event, 'end_date')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addDaysToDate } from "@/utils/utils";
import { SERVICE_STATUS_OPTIONS } from "@/constants";

export default {
  name: "EditServiceSideBarDates",
  data() {
    return {
      edit: false,
      CONSTANTS: { SERVICE_STATUS_OPTIONS },
    };
  },
  props: {
    disabled_dates: {
      type: Array,
      default: () => [],
    },
    formItineraryService: {
      type: Object,
      default: () => {},
    },
    handleAutomaticPriceCalculate: {
      type: Function,
      default: () => {},
    },
    handleServiceFirstTime: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    handleDatesModified(value, key) {
      if (
        new Date(this.formItineraryService.start_date + " 00:00:00") <
        new Date(this.itinerary.data.start_date + " 00:00:00")
      ) {
        this.$buefy.toast.open({
          duration: 5000,
          message:
            "The service start date cannot be less than the itinerary start date.",
          position: "is-top",
          type: "is-danger",
        });
        return false;
      }
      this.$emit("update", [key, value]);
      this.handleAutomaticPriceCalculate(true);
      this.handleServiceFirstTime(false);
    },
    emitUpdateForm(key, value) {
      this.$emit("update", [key, value]);
    },
  },
  computed: {
    minMaxDate() {
      var resp = {
        min: null,
        maxmin: null,
      };

      if (this.itinerary.data && this.formItineraryService) {
        resp.min = new Date(this.itinerary.data.start_date + " 00:00:00");
        var date = new Date(this.formItineraryService.start_date + " 00:00:00");
        resp.maxmin = date ? addDaysToDate(date, 1) : date;
      }
      return resp;
    },
    disabled_days() {
      var disabled = [];
      if (this.service && this.service.days_services) {
        for (let day = 0; day < 7; day++) {
          if (this.service.days_services.indexOf(day) == -1) {
            disabled.push(day);
          }
        }
      }
      return disabled;
    },
    event_dates() {
      var events = this.disabled_dates.map(function (date) {
        return {
          date: date,
          type: "is-danger",
        };
      });

      return events;
    },
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      service: "services/getService",
      loading: "utils/getLoading",
    }),
  },
};
</script>
