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
      <header
        class="w-100 mb-2 is-flex is-justify-content-space-between px-5 pt-5"
      >
        <h1 class="is-relative">
          Quote History
          <b-tag
            type="is-info"
            class="px-2"
            style="
              position: absolute;
              top: -0.75rem;
              right: -2.5rem;
              height: fit-content;
            "
          >
            <p>BETA</p>
          </b-tag>
        </h1>
        <h2 style="font-size: 1rem">{{ resultsInfo.results }} results</h2>
      </header>
      <main v-if="displayItineraryHistory" class="w-100 pl-5 pr-3 pb-5">
        <p v-if="quote.data.stable_version !== quote.data.version" class="mb-4">
          The current version {{ quote.data.version }} is unstable. We recommend
          restoring to a stable version. Choose one of the available quote
          versions.
        </p>

        <div
          v-for="itineraryResult in itineraryHistoryResults"
          :key="itineraryResult.version"
          style="position: relative"
          class="my-4 history__item is-flex is-flex-direction-column p-3"
        >
          <div
            class="is-flex is-justify-content-space-between is-align-items-center mb-2"
          >
            <b-taglist attached class="mb-0 is-relative">
              <b-tag
                type="is-dark"
                class="mb-0 mr-2"
                style="border-radius: 0.25rem"
              >
                Version
                <strong style="color: #fff">{{
                  itineraryResult.version
                }}</strong></b-tag
              >
              <b-tag
                rounded
                type="is-dark"
                class="mb-0"
                style="background-color: #444"
              >
                {{ itineraryResult.edition.user.name }} -
                <strong style="color: #fff">{{
                  getItineraryEditionDatetime(itineraryResult)
                }}</strong>
              </b-tag>
            </b-taglist>

            <div
              v-if="quote.data.version !== itineraryResult.version"
              class="is-flex is-align-items-center"
            >
              <BaseButton
                class="m-0 mr-2 ml-4"
                action="secondary"
                @click="() => viewQuoteVersion(itineraryResult.version)"
              >
                <p slot="text">View</p>
              </BaseButton>
              <BaseButton
                v-if="canDisplayRestoreButton"
                action="principal"
                @click="() => restoreItineraryByVersion(itineraryResult)"
              >
                <p slot="text">Restore</p>
              </BaseButton>
            </div>

            <div v-else>
              <b-tag rounded type="is-info" class="mb-0">
                Current Version
              </b-tag>

              <b-tag
                v-if="quote.data.stable_version !== quote.data.version"
                type="is-warning"
                class="px-3 ml-2"
              >
                <b-icon icon="alert" custom-size="mdi-18px" />
                <strong style="top: -0.1rem" class="pb-4 ml-1 is-relative"
                  >Unstable version</strong
                >
              </b-tag>
            </div>
          </div>

          <QuoteHistoryCard :itinerary="itineraryResult" />
        </div>
        <ResultsInfo
          v-if="displayPagination"
          :resultsInfo="resultsInfo"
          :loadMoreItems="loadMoreItineraryHistoryResults"
        />
      </main>
      <div
        v-else
        class="w-100 is-flex is-flex-direction-column px-5 pb-5 pt-4"
        style="gap: 0.5rem"
      >
        <b-skeleton height="3.5rem" :active="loading"></b-skeleton>
        <b-skeleton height="3.5rem" :active="loading"></b-skeleton>
        <b-skeleton height="3.5rem" :active="loading"></b-skeleton>
      </div>
      <div v-if="!displayItineraryHistory && !loading" class="pb-5">
        <p>No quote history found</p>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { PATH } from "@/router/path";
import { datesHelper } from "@/utils/dates";
import QuoteHistoryCard from "@/components/quote-views/_shared/QuoteHistoryCard.vue";
import ResultsInfo from "@/components/_shared/ResultsInfo.vue";
import { helpers as adapters } from "@/utils/adapters";

export default {
  name: "QuoteHistoryModal",
  components: {
    ResultsInfo,
    QuoteHistoryCard,
  },
  props: {
    itineraryId: {
      type: String,
      default: "",
    },
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    getItineraryHistory: {
      type: Function,
      default: () => {},
    },
    setItineraryRestoreVersionModal: {
      type: Function,
      default: () => {},
    },
    restoreItineraryByVersion: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      itineraryHistory: "itinerary/getItineraryHistory",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      datesFormat: "itinerary/getDatesFormat",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      quote: "itinerary/getItinerary",
      quoteServices: "itinerary/getServicesItinerary",
      quotePrices: "itinerary/getPricesItineraries",
    }),
    isModalOpenLocal: {
      get() {
        return this.isModalOpen;
      },
      set(value) {
        if (!value)
          this.setItineraryRestoreVersionModal({
            isOpen: false,
            selectedVersion: null,
          });
        this.$emit("update:setIsServiceHistoryModalOpen", value);
      },
    },
    itineraryHistoryResults() {
      const adaptedQuoteVersion = adapters.adaptQuoteToQuoteVersion(
        this.quote.data,
        this.quoteServices,
        this.quotePrices
      );

      return [adaptedQuoteVersion, ...this.itineraryHistory.data];
    },
    displayItineraryHistory() {
      const hasItineraryHistoryResults =
        this.itineraryHistoryResults && this.itineraryHistoryResults.length > 0;
      if (!hasItineraryHistoryResults) return false;
      const isCurrentItineraryIdMatch =
        this.itineraryHistoryResults[0].id === this.itineraryId;
      return isCurrentItineraryIdMatch;
    },
    displayPagination() {
      return this.itineraryHistoryResults?.length > 0 && !this.loading;
    },
    resultsInfo() {
      return {
        displaying: this.itineraryHistoryResults?.length || 0,
        results: this.itineraryHistory?.meta?.total || 0,
        displayingPercentage: Math.round(
          (this.itineraryHistoryResults?.length /
            this.itineraryHistory?.meta?.total) *
            100
        ),
      };
    },
    canDisplayRestoreButton() {
      return !this.disableQuoteByStatus;
    },
  },
  methods: {
    getItineraryEditionDatetime(itinerary) {
      return `${datesHelper.getDatetimeFromUTC(
        itinerary.updated_date,
        this.datesFormat
      )}`;
    },
    loadMoreItineraryHistoryResults() {
      const payload = {
        page: this.itineraryHistory?.meta?.current_page + 1,
        itineraryId: this.itineraryId,
        accumulate: true,
      };
      this.getItineraryHistory(payload);
    },
    viewQuoteVersion(version) {
      const currentUrl = new URL(window.location.href);

      if (!currentUrl.pathname.includes(PATH.HISTORY)) {
        currentUrl.pathname = `${PATH.HISTORY}${currentUrl.pathname}`;
      }

      currentUrl.searchParams.set("version", version);

      const newUrl = currentUrl.toString();
      window.open(newUrl, "_blank");
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
  width: 54rem;
  height: auto;
  border-radius: 1rem;
  text-align: center;
  font-family: Poppins, sans-serif;
  position: relative;
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
  overflow-x: visible;
}
.history__item {
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 0 30px -15px #0000005b;
}
</style>
