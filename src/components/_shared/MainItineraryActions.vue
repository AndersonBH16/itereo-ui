<template>
  <div class="is-inline-flex is-relative">
    <button
      @click="onShowMoreButtonClick"
      class="upAndDownButton"
      :disabled="loading"
      :data-test-id="DATA_TEST_ID_VALUES.QUOTE_ACTIONS_BUTTON"
    >
      <IconMore class="icon color-13"></IconMore>
    </button>
    <b-message
      ref="popup"
      class="PopoverActions"
      title="Choose an Action"
      v-model="isActive"
      aria-close-label="Close message"
    >
      <div v-if="!hideElementByCondition" @click="handleDuplicateClick">
        <button
          :disabled="loading || historyView.isActive"
          :data-test-id="DATA_TEST_ID_VALUES.DUPLICATE_QUOTE_BUTTON"
        >
          <IconDuplicate class="icon color-8 is-xsmall mr-1" /> Duplicate
        </button>
      </div>

      <div
        v-if="!hideElementByCondition && !isLinkedToRequest"
        @click="openLinkToRequestModal"
      >
        <button
          :disabled="loading || historyView.isActive"
          class="is-flex is-align-items-center is-justify-content-center w-100"
        >
          <b-icon
            icon="link"
            custom-size="mdi-24px"
            class="mr-2 color-8"
          ></b-icon>
          Link to Request
        </button>
      </div>

      <div
        v-if="!hideElementByCondition && isLinkedToRequest"
        @click="unlinkQuoteFromRequest"
      >
        <button
          :disabled="loading || historyView.isActive"
          class="is-flex is-align-items-center is-justify-content-center w-100"
        >
          <b-icon
            icon="link-off"
            custom-size="mdi-24px"
            class="mr-2 color-8"
          ></b-icon>
          Unlink Request
        </button>
      </div>

      <div
        v-if="!historyView.isActive"
        @click="
          () => {
            onShowMoreButtonClick();
            displayIsViewContractSalesManualModal();
          }
        "
      >
        <button :disabled="loading">
          <IconEye class="icon color-8 is-xsmall mr-1" /> View Sales Manuals
        </button>
      </div>

      <div @click="switchTagModal">
        <button :disabled="loading">
          <IconTag class="icon color-8 is-xsmall mr-1" /> Tags
        </button>
      </div>

      <div
        v-if="!hideElementByCondition"
        class="is-relative import_service_option__container"
        @click="
          () => {
            onShowMoreButtonClick();
            openImportServiceModal();
          }
        "
      >
        <button :disabled="loading || historyView.isActive">
          <b-icon
            size="is-small"
            custom-size="mdi-24px"
            icon="swap-vertical-bold"
            class="mr-1 color-8"
          ></b-icon>
          Import new Service
        </button>
        <b-tag
          type="is-info"
          class="px-2"
          style="
            position: absolute;
            top: -0.5rem;
            right: -1rem;
            height: fit-content;
          "
        >
          <p>BETA</p>
        </b-tag>
      </div>

      <b-tooltip
        v-if="canDisplayItineraryHistory"
        :label="`This feature is not available for Quotes created before ${helper.format(
          '2024-09-23',
          datesFormat
        )}`"
        class="is-relative w-100 quote_history_option__container"
        type="is-warning"
        :active="blockItineraryHistory"
      >
        <div
          :disabled="blockItineraryHistory"
          @click="() => setItineraryHistoryModal(true)"
        >
          <button :disabled="loading">
            <IconInfo class="icon color-8 is-xsmall" /> Quote History
          </button>
          <b-tag
            type="is-info"
            class="px-2"
            style="
              position: absolute;
              top: -0.5rem;
              right: -1rem;
              height: fit-content;
            "
          >
            <p>BETA</p>
          </b-tag>
        </div>
      </b-tooltip>

      <div
        v-if="canDisplayItineraryPricesMatrix"
        class="is-relative matrix_calculation__container"
        @click="onViewItineraryPricesMatrixClick"
      >
        <button class="is-flex is-align-items-center" :disabled="loading">
          <b-icon icon="chart-line" custom-size="mdi-18px" class="mr-1" /> View
          Matrix Calculation
        </button>
        <b-tag
          type="is-info"
          class="px-2"
          style="
            position: absolute;
            top: -0.5rem;
            right: -1rem;
            height: fit-content;
          "
        >
          <p>BETA</p>
        </b-tag>
      </div>

      <div class="mt-2">
        <div style="font-size: 0.9rem; max-width: 9rem">
          Current Version: <strong>{{ itinerary.data.version }}</strong>
        </div>
      </div>
    </b-message>
    <ImportNewServiceModal
      :isModalOpen="isImportServiceModalOpen"
      :closeModal="closeImportServiceModal"
      :onContinue="importNewService"
    />
    <ItineraryPricesMatrix
      v-if="isItineraryPricesMatrixModalOpen"
      :loading="loading"
      :isFirstStepModalOpen="isItineraryPricesMatrixModalOpen"
      :closeFirstStepModal="() => setIsItineraryPricesMatrixModalOpen(false)"
    />
    <LinkToRequestModal
      :quotesToLink="[itinerary.data]"
      :setLoading="setLoading"
      :isLinkToRequestModalOpen="isLinkToRequestModalOpen"
      @update:isLinkToRequestModalOpen="isLinkToRequestModalOpen = $event"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";
import * as Sentry from "@sentry/vue";
import { DATE_FORMAT_YYYY_MM_DD, DEFAULT_ALLOWED } from "@/constants";
import { PATH_INFO } from "@/router/path";
import ImportNewServiceModal from "@/components/quote-views/_shared/ImportNewServiceModal.vue";
import ItineraryPricesMatrix from "@/components/quote-views/_shared/ItineraryPricesMatrix.vue";
import LinkToRequestModal from "@/components/requests/LinkToRequestModal.vue";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { datesHelper } from "@/utils/dates";

export default {
  name: "MainItineraryActions",
  components: {
    ItineraryPricesMatrix,
    ImportNewServiceModal,
    LinkToRequestModal,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    itinerary: {
      type: Object,
      default: () => {},
    },
    switchTagModal: {
      type: Function,
      default: () => {},
    },
    loadPricesItinerary: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      helper: {
        format,
      },
      isActive: false,
      isImportServiceModalOpen: false,
      isItineraryPricesMatrixModalOpen: false,
      isLinkToRequestModalOpen: false,
    };
  },
  computed: {
    ...mapGetters({
      historyView: "utils/getHistoryView",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      authUser: "auth/getAuthUserData",
      datesFormat: "itinerary/getDatesFormat",
      request: "request/getRequest",
      quoteServices: "itinerary/getServicesItinerary",
    }),
    canDisplayFeatureByUsers() {
      if (process.env.NODE_ENV !== "production") return true;

      const allowed = DEFAULT_ALLOWED.concat([
        "jstivelman@encounterlatinamerica.com",
        "ecuador-commercial1@encounterlatinamerica.com",
        "noyola@encounterlatinamerica.com",
        "jloaiza@encounterlatinamerica.com",
      ]);

      return allowed.includes(this.authUser.email);
    },
    canDisplayItineraryHistory() {
      return !this.historyView.isActive;
    },
    blockItineraryHistory() {
      const creationDateIsValid = datesHelper.getDatesDiffByDates(
        this.itinerary.data.created,
        "2024-09-23"
      );
      return creationDateIsValid < 0;
    },
    canDisplayItineraryPricesMatrix() {
      return (
        !this.disableQuoteByStatus &&
        !this.historyView.isActive &&
        this.canDisplayFeatureByUsers
      );
    },
    DATA_TEST_ID_VALUES() {
      return DATA_TEST_ID_VALUES;
    },
    isLinkedToRequest() {
      return ![null, undefined].includes(
        this.request?.items?.find(
          (requestItem) => requestItem.id === this.itinerary?.data?.id
        )
      );
    },
  },
  methods: {
    openLinkToRequestModal() {
      this.isLinkToRequestModalOpen = true;
    },
    onViewItineraryPricesMatrixClick() {
      this.setIsActive(false);
      this.setIsItineraryPricesMatrixModalOpen(true);
    },
    setIsActive(newValue = false) {
      this.isActive = newValue;
    },
    closeImportServiceModal() {
      this.isImportServiceModalOpen = false;
    },
    setIsItineraryPricesMatrixModalOpen(newValue = false) {
      this.isItineraryPricesMatrixModalOpen = newValue;
    },
    openImportServiceModal() {
      this.isImportServiceModalOpen = true;
    },
    async importNewService(serviceCode = "") {
      try {
        this.closeImportServiceModal();
        this.setLoading(true);
        this.setLoadingText("Importing a new Service");
        await this.$store.dispatch("services/importNewService", {
          itineraryId: this.itinerary.data.id,
          services: [serviceCode],
        });
        this.$buefy.toast.open({
          duration: 5000,
          message: `The import of the service ${serviceCode} is in progress`,
          position: "is-top",
          type: "is-success",
        });
        this.setLoadingText("Loading content, please wait...");
        this.setLoading(false);
      } catch (error) {
        this.setLoading(false);
        this.$buefy.snackbar.open({
          duration: 30000,
          message: error.response?.data?.message || "",
          type: "is-danger",
          cancelText: "OK",
          actionText: "",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    setItineraryHistoryModal(newValue = false) {
      this.$store.dispatch("utils/setHistoryView", {
        historyView: {
          isModalOpen: newValue,
        },
      });
      if (newValue) this.getItineraryHistory();
    },
    displayIsViewContractSalesManualModal() {
      this.$store.dispatch("utils/setIsViewContractSalesManualModalOpen", true);
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
    onShowMoreButtonClick() {
      this.setIsActive(!this.isActive);
    },
    async handleDuplicateClick() {
      const initialQuoteServicesCodes = this.quoteServices.map(
        (service) => service.code
      );

      const initialQuoteId = this.itinerary.data.id;

      this.$store.dispatch("itinerary/resetItineraryAndRelatedData");
      const response = await this.handleDuplicate();

      const newQuoteServicesCodes = this.quoteServices.map(
        (service) => service.code
      );

      const newQuoteId = this.$route.query.itinerary;

      const isTheSameArray = initialQuoteServicesCodes.every(
        (value, index) => value === newQuoteServicesCodes[index]
      );

      if (!isTheSameArray) {
        Sentry.withScope((scope) => {
          scope.setTags({
            initial_quote_id: initialQuoteId,
            initial_services: JSON.stringify(initialQuoteServicesCodes),
            new_quote_id: newQuoteId,
            new_services: JSON.stringify(newQuoteServicesCodes),
          });

          console.log("ORIGINAL SERVICES", initialQuoteServicesCodes);
          console.log("NEW SERVICES", newQuoteServicesCodes);

          setTimeout(() => console.clear(), 0);

          Sentry.captureMessage(
            `TEST - Quote duplicated with different services order: ${initialQuoteId} -> ${newQuoteId}`,
            "error"
          );
        });
      }

      await this.validateLinkQuoteToRequest(response);
    },
    async validateLinkQuoteToRequest(quote) {
      if (!this.request.id) return;

      this.setLoading(true);

      await this.$store.dispatch("request/linkQuoteToRequest", {
        requestId: this.request.id,
        quotesToLink: [
          {
            ...quote.quote.data,
            title: quote.quote.data.title.value,
          },
        ],
      });

      this.setLoading(false);
    },
    async handleDuplicate() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          return await this.duplicateItinerary(this.itinerary.data);
        },
        functionToExecuteOnFail: async (error) => {
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message:
              "Error trying to duplicate the itinerary, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });
    },
    async duplicateItinerary(data) {
      const payload = {
        code: data.code,
        uuid: data.id,
        start_date: format(data.start_date, DATE_FORMAT_YYYY_MM_DD),
        name: data.name,
        onlyDuplicate: true,
      };
      this.setLoading(true);
      this.setIsActive(false);
      const response = await this.$store.dispatch(
        "itinerary/duplicate",
        payload
      );
      this.$buefy.toast.open({
        duration: 5000,
        message: response.message,
        position: "is-top",
        type: "is-success",
      });
      this.$router.push({
        path: PATH_INFO.BASIC_INFO.path,
        query: { itinerary: response.itinerary },
      });
      this.loadPricesItinerary({ reload: true });
      this.setLoading(false);

      return response;
    },
    async getItineraryHistory(payload = null) {
      this.setLoading(true);
      await this.$store.dispatch("itinerary/getItineraryHistory", payload);
      this.setLoading(false);
    },
    handleClickOutside(event) {
      const popup = this.$refs.popup;
      if (this.isActive && popup && !popup.$el.contains(event.target)) {
        this.setIsActive(false);
      }
    },
    async unlinkQuoteFromRequest() {
      this.setLoading(true);

      const response = await this.$store.dispatch(
        "request/unlinkQuoteFromRequest",
        {
          requestId: this.request.id,
          quoteToUnlink: this.itinerary.data,
        }
      );

      if (response.type === "success") {
        this.$store.dispatch("request/resetRequestState");
      }

      this.$buefy.toast.open({
        duration: 5000,
        message:
          response.type == "success"
            ? "Quote unlinked from request successfully"
            : "Error unlinking quote from request",
        position: "is-top",
        type: response.type == "success" ? "is-success" : "is-danger",
        pauseOnHover: true,
      });

      this.isLinkToRequestAlertOpen = false;
      this.setLoading(false);
    },
  },
  watch: {
    isActive(newValue) {
      if (newValue) {
        setTimeout(() => {
          document.addEventListener("click", this.handleClickOutside);
        }, 1);
      } else document.removeEventListener("click", this.handleClickOutside);
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
<style scoped>
.PopoverActions {
  width: 14rem;
  z-index: 10;
}
.PopoverActions .message-body .media .media-content > div:not(:last-child) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.PopoverActions
  .message-body
  .media
  .media-content
  > div:not(:last-child):hover {
  background-color: rgba(0, 0, 0, 0.075);
  border-radius: 5px;
  cursor: pointer;
}
.PopoverActions .message-body .media .media-content div button {
  background-color: transparent;
  border: none;
}
.upAndDownButton {
  margin: 0;
  padding: 0;
  border-color: transparent;
  height: max-content;
  background: transparent;
  border-radius: 0;
}
.upAndDownButton:focus {
  outline: none !important;
}
.upAndDownButton .icon:hover {
  color: var(--info-color) !important;
}
@media screen and (max-width: 480px) {
  .PopoverActions {
    top: 2.5rem;
    right: 0;
  }
  .matrix_calculation__container,
  .quote_history_option__container,
  .import_service_option__container {
    display: none;
  }
}
</style>
