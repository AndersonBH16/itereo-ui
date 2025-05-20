<template>
  <b-modal
    v-if="isModalOpenLocal"
    v-model="isModalOpenLocal"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Modal"
    aria-modal
    @close="isModalOpenLocal = false"
    v-bind="$attrs"
  >
    <div class="service_modal">
      <header class="w-100 mb-5 is-flex is-justify-content-space-between">
        <h1>Service changes history</h1>
        <h2 style="font-size: 1rem">{{ resultsInfo.results }} results</h2>
      </header>
      <main v-if="displayServiceHistory" class="w-100">
        <div
          class="is-flex w-100 mb-5"
          style="color: var(--gray-dark) !important"
        >
          <div style="flex: 1">Visible</div>
          <div style="flex: 1">Day</div>
          <div style="flex: 1">Dates</div>
          <div style="flex: 1">Location</div>
          <div style="flex: 3">Service</div>
          <div style="flex: 1">Level</div>
          <div style="flex: 1">Pax(s)</div>
          <div style="flex: 1">Cost</div>
          <div style="flex: 1">Price</div>
        </div>
        <div
          v-for="serviceRecord in serviceHistoryRecords"
          :key="serviceRecord.updated_date"
          style="position: relative"
          class="my-4 history__item is-flex"
        >
          <b-tag rounded style="position: absolute; left: 0; top: -0.5rem">
            <strong>{{ serviceRecord.edition.user.name }}</strong> -
            {{ getServiceEditionDatetime(serviceRecord) }}
          </b-tag>
          <ServiceRow
            :service="serviceRecord"
            :fieldsToDisplay="serviceRowFields"
          />
        </div>
        <ResultsInfo
          v-if="displayPagination"
          :resultsInfo="resultsInfo"
          :loadMoreItems="loadMoreServiceHistoryRecords"
        />
      </main>
      <div
        v-else
        class="w-100 is-flex is-flex-direction-column"
        style="gap: 0.5rem"
      >
        <b-skeleton height="3.5rem" :active="loading"></b-skeleton>
        <b-skeleton height="3.5rem" :active="loading"></b-skeleton>
        <b-skeleton height="3.5rem" :active="loading"></b-skeleton>
      </div>
      <div v-if="!displayServiceHistory && !loading">
        <p>No service history found</p>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { SERVICE_ROW_FIELDS } from "@/constants/services";
import { datesHelper } from "@/utils/dates";
import ServiceRow from "../ServiceRow.vue";
import ResultsInfo from "@/components/_shared/ResultsInfo.vue";

export default {
  name: "ServiceHistoryModal",
  components: {
    ServiceRow,
    ResultsInfo,
  },
  props: {
    serviceId: {
      type: String,
      default: "",
    },
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    getServiceHistory: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: {
        SERVICE_ROW_FIELDS,
      },
    };
  },
  computed: {
    ...mapGetters({
      serviceHistory: "itinerary/getServiceHistory",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      datesFormat: "itinerary/getDatesFormat",
    }),
    isModalOpenLocal: {
      get() {
        return this.isModalOpen;
      },
      set(value) {
        this.$emit("update:setIsServiceHistoryModalOpen", value);
      },
    },
    serviceHistoryRecords() {
      return this.serviceHistory.data;
    },
    displayServiceHistory() {
      const hasServiceHistoryRecords =
        this.serviceHistoryRecords && this.serviceHistoryRecords.length > 0;
      if (!hasServiceHistoryRecords) return false;
      const isCurrentServiceIdMatch =
        this.serviceHistoryRecords[0].id === this.serviceId;
      return isCurrentServiceIdMatch;
    },
    displayPagination() {
      return this.serviceHistoryRecords?.length > 0 && !this.loading;
    },
    resultsInfo() {
      return {
        displaying: this.serviceHistoryRecords?.length || 0,
        results: this.serviceHistory?.meta?.total || 0,
        displayingPercentage: Math.round(
          (this.serviceHistoryRecords?.length /
            this.serviceHistory?.meta?.total) *
            100
        ),
      };
    },
    serviceRowFields() {
      return [
        {
          label: this.constants.SERVICE_ROW_FIELDS.VISIBLE,
          text: "",
        },
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
          label: this.constants.SERVICE_ROW_FIELDS.LEVEL,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.NUM_PAX,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.COST,
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
    getServiceEditionDatetime(service) {
      return `${datesHelper.getDatetimeFromUTC(
        service.updated_date,
        this.datesFormat
      )}`;
    },
    loadMoreServiceHistoryRecords() {
      const payload = {
        page: this.serviceHistory?.meta?.current_page + 1,
        serviceId: this.serviceId,
        accumulate: true,
      };
      this.getServiceHistory(payload);
    },
  },
};
</script>
<style scoped>
.service_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60rem;
  height: auto;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  font-family: Poppins, sans-serif;
}
.service_modal > header > h1 {
  color: #1e1e1e;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: left;
}
.service_modal > main {
  max-height: 70vh;
  overflow-y: auto;
}
.history__item::before {
  position: absolute;
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  top: 1px;
  right: 0;
  background-color: #eee;
}
</style>
