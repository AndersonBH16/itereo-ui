<template>
  <div class="is-flex pax_prices_modal">
    <div>
      <div class="is-flex is-justify-content-space-between" style="gap: 0.5rem">
        <a
          v-for="price in pricesLevels[0].prices"
          :key="price.id"
          href="#"
          class="levelComfort is-relative"
          @click="handleModal()"
          :disabled="isLevelDisabled({ price })"
        >
          <DotAlert
            :displayAlert="getDotAlertConfig(price).displayAlert"
            :tooltip="getDotAlertConfig(price).tooltip"
          >
            <template #baseText>
              <div
                :class="[
                  'card cardItineraryContent',
                  disableQuoteByStatus || hideElementByCondition
                    ? 'level-disabled'
                    : '',
                ]"
              >
                <div class="card-content has-text-centered">
                  <div class="content">
                    <p class="is-h3 is-price PriceComfort mb-0 is-relative">
                      <strong v-if="!loadingSelfSkeleton">
                        {{ getTotalPriceCurrency() }}
                      </strong>
                      <strong
                        v-if="!loadingSelfSkeleton"
                        :data-test-id="getPriceLevelDataTestId(price)"
                      >
                        {{ price ? price.total : 0 }}
                      </strong>
                      <b-skeleton
                        height="20px"
                        :active="loadingSelfSkeleton"
                      ></b-skeleton>
                    </p>
                    <small class="small">{{ price.type }}</small>
                    <IconLock
                      v-if="disableQuoteByStatus || hideElementByCondition"
                      class="arrowCardContent icon lock"
                    />
                    <IconChevronRight
                      v-else
                      class="arrowCardContent icon is-small color-10"
                    />
                  </div>
                </div>
              </div>
            </template>
          </DotAlert>
        </a>
      </div>
      <b-tooltip
        v-if="!hideElementByCondition"
        class="w-100"
        label="This action will recalculate the prices of the services"
        type="is-warning"
        :active="!disableQuoteByStatus && !loading"
      >
        <b-button
          class="w-100 mt-2 recalulate_prices__container"
          size="is-small"
          :disabled="loading || disableQuoteByStatus"
          @click="() => updateQuoteServices(false)"
          style="border-radius: 0.5rem"
        >
          <div class="is-flex is-align-items-center">
            Recalculate Quote Prices
            <b-icon
              icon="refresh"
              size="is-small"
              custom-size="mdi-24px"
              class="ml-2"
            />
          </div>
        </b-button>
      </b-tooltip>
    </div>

    <b-modal
      v-model="isUpdateQuotePricesAlertOpen"
      :width="450"
      @close="closeUpdateQuotePricesAlert"
    >
      <div class="pax_prices_section" style="height: 12rem">
        <div class="card-content">
          <div class="content">
            <p class="is-h2 has-text-weight-bold">Recalculate Quote Prices</p>
            <p class="has-text-weight-light">
              This action will recalculate the prices of the services. Are you
              sure you want to continue?
            </p>

            <b-checkbox
              v-model="maintainServiceManualPrices"
              class="mb-2 mt-1 w-100"
            >
              Mantain services prices edited manually
            </b-checkbox>
          </div>
        </div>
        <footer class="card-footer is-flex is-justify-content-center">
          <BaseButton
            size="large"
            @click="closeUpdateQuotePricesAlert"
            action="secondary"
            class="mr-2"
          >
            <p slot="text">No, cancel</p>
          </BaseButton>
          <BaseButton
            size="large"
            @click="
              () => {
                this.closeUpdateQuotePricesAlert();
                this.updateQuoteServices(true);
              }
            "
            action="tercery"
            :loading="loading"
          >
            <p slot="text">Yes, continue</p>
          </BaseButton>
        </footer>
      </div>
    </b-modal>

    <b-modal
      v-model="modalLevel"
      :width="850"
      @close="handleModal()"
      :can-cancel="false"
      class="pax_prices_modal__container"
    >
      <div class="card pt-5 px-6 pb-0 pax_prices_section">
        <header class="pt-2">
          <p class="is-h2 has-text-weight-bold">Total Prices</p>
          <p class="has-text-weight-light">
            {{ paxsPrices && paxsPrices.length }} Paxs
          </p>
        </header>
        <b-tabs
          v-model="activeTab"
          position="is-right"
          class="block mb-0"
          :is-nav-hidden="isOnlyOneType"
        >
          <b-tab-item
            v-for="priceArray in pricesLevels"
            :key="priceArray.id"
            :label="priceArray.label"
          >
            <PriceTab
              :priceArray="priceArray"
              :paxsPrices="paxsPrices"
              :levelsUpsalesAlert="levelsUpsalesAlert"
              :getDotAlertConfig="getDotAlertConfig"
              @update="updateProps"
            />
          </b-tab-item>
        </b-tabs>

        <footer class="card-footer is-flex is-justify-content-center">
          <BaseButton
            size="large"
            @click="
              handleModal();
              resetPaxsPrices();
            "
            action="secondary"
            :disabled="loading"
            class="mr-2"
            ><p slot="text">Close & Discard</p></BaseButton
          >
          <b-tooltip
            v-if="!disableQuoteByStatus && !hideElementByCondition"
            :active="somePaxPriceHasNegativeValue"
            label="Some pax prices have negative values"
            type="is-danger"
          >
            <BaseButton
              size="large"
              @click="savePaxsPrices"
              action="tercery"
              :loading="loading"
              :disabled="loading || somePaxPriceHasNegativeValue"
            >
              <p slot="text">Save changes</p>
            </BaseButton>
          </b-tooltip>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import helpers from "@/helpers";
import { pricesHelper } from "@/utils/prices";
import { PRICE_LEVELS, PRICES_ALERT_MESSAGES } from "@/constants/prices";
import PriceTab from "../quote-views/paxPrices/PriceTab.vue";
import DotAlert from "./DotAlert.vue";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "MainItineraryContentModalLevel",
  components: { PriceTab, DotAlert },
  data() {
    return {
      isUpdateQuotePricesAlertOpen: false,
      modalLevel: false,
      paxsPrices: [],
      levelsUpsalesAlert: [],
      pricesLevels: [{ id: null, prices: PRICE_LEVELS }],
      constants: { DATA_TEST_ID_VALUES },
      helper: { ...helpers, ...pricesHelper },
      loadingSelfSkeleton: false,
      activeTab: 0,
      currentPriceType: null,
      maintainServiceManualPrices: false,
    };
  },
  computed: {
    ...mapGetters({
      services_itinerary: "itinerary/getServicesItinerary",
      itinerary: "itinerary/getItinerary",
      itineraryStatus: "itinerary/getItineraryStatus",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      prices_itinerary: "itinerary/getPricesItineraries",
      prices_itinerary_source: "itinerary/getPricesItinerariesSource",
      loading: "utils/getLoading",
      initialPaxsPrices: "itinerary/getPaxPrices",
      historyView: "utils/getHistoryView",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    isOnlyOneType() {
      return this.pricesLevels?.length === 1;
    },
    somePaxPriceHasNegativeValue() {
      return this.paxsPrices.some((paxPrice) =>
        paxPrice.price_levels.some((priceLevel) =>
          priceLevel.prices.some(
            (price) =>
              price.total_price < 0 || price.mkt_coin < 0 || price.fee < 0
          )
        )
      );
    },
  },
  watch: {
    initialPaxsPrices(newPaxsPrices = []) {
      this.paxsPrices = newPaxsPrices;
    },
    paxsPrices() {
      this.levelsUpsalesAlert = this.getLevelsUpSalesAlert();
    },
    prices_itinerary_source() {
      if (!this.loadingSelfSkeleton) {
        this.pricesLevels = this.prices_itinerary_source;
      }
      if (this.paxsPrices.length === 0) {
        this.pricesLevels = [{ id: null, prices: PRICE_LEVELS }];
      }
    },
    activeTab(newValue = 0) {
      this.currentPriceType = this.pricesLevels.find(
        (priceLevel, index) => index === newValue
      ).type;

      this.levelsUpsalesAlert = this.getLevelsUpSalesAlert();
    },
    modalLevel(newValue = false) {
      this.$store.dispatch("utils/setIsModalOpen", newValue);
    },
  },
  props: {
    loadPricesItinerary: {
      type: Function,
      default: () => {},
    },
    loadItineraryPassengers: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    closeUpdateQuotePricesAlert() {
      this.isUpdateQuotePricesAlertOpen = false;
    },
    openUpdateQuotePricesAlert() {
      this.isUpdateQuotePricesAlertOpen = true;
    },
    async updateQuoteServices(avoidAlert = false) {
      if (!avoidAlert) return this.openUpdateQuotePricesAlert();

      const servicesToUpdate = this.services_itinerary.filter((service) => {
        if (this.maintainServiceManualPrices) {
          return !service.isPriceEdited;
        }
        return true;
      });

      await Promise.allSettled([
        await this.$store.dispatch("itinerary/updateQuoteServices", {
          services: servicesToUpdate,
          calculate_prices: 1,
        }),
      ]);

      this.$buefy.toast.open({
        message: "Prices has been successfully recalculated",
        type: "is-success",
        position: "is-top",
        duration: 5000,
      });

      this.maintainServiceManualPrices = false;
    },
    getDotAlertConfig(price) {
      const hasUpsalesAlert = this.levelsUpsalesAlert.includes(price.level);
      const priceIsNegative = price.total < 0;
      return {
        displayAlert: hasUpsalesAlert || priceIsNegative,
        tooltip: priceIsNegative
          ? PRICES_ALERT_MESSAGES.PRICE_IS_NEGATIVE
          : hasUpsalesAlert
          ? PRICES_ALERT_MESSAGES.MISSING_UPSALES
          : "",
      };
    },
    getPriceLevelDataTestId(priceLevel) {
      if (priceLevel.type === PRICE_LEVELS.COMFORT.type) {
        return DATA_TEST_ID_VALUES.COMFORT_PRICE;
      }
      if (priceLevel.type === PRICE_LEVELS.SUPERIOR.type) {
        return DATA_TEST_ID_VALUES.SUPERIOR_PRICE;
      }
      if (priceLevel.type === PRICE_LEVELS.LUXURY.type) {
        return DATA_TEST_ID_VALUES.LUXURY_PRICE;
      }
    },
    getLevelsUpSalesAlert() {
      if (!this.paxsPrices?.at(-1)) return [];
      const paxs = this.paxsPrices?.reduce((acc, paxPrice) => {
        const priceLevel =
          paxPrice?.price_levels.find(
            (priceLevel) => priceLevel.type === this.currentPriceType
          ) || paxPrice?.price_levels.at(0);
        return [...acc, ...priceLevel?.prices] || [];
      }, []);
      const levelsUpsalesEdited = paxs?.reduce((acc, pax) => {
        return {
          ...acc,
          [pax?.level]: acc?.[pax?.level] || pax?.mkt_coin === 0,
        };
      }, {});

      return Object.keys(levelsUpsalesEdited)
        ?.filter((level) => levelsUpsalesEdited?.[level])
        .map((level) => Number(level));
    },
    isLevelDisabled({ price = {} }) {
      return (
        this.disableQuoteByStatus ||
        price === undefined ||
        this.paxsPrices.length === 0
      );
    },
    updateProps(newValues = {}) {
      this.paxsPrices = newValues.paxsPrices;
      this.priceArray = newValues.priceArray;
    },
    getTotalPriceCurrency() {
      const currency_sign = this.itinerary?.data?.currency?.currency_sign || "";
      return currency_sign;
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
    resetPaxsPrices() {
      this.paxsPrices = this.initialPaxsPrices;
    },
    handleModal() {
      this.modalLevel = !this.modalLevel;
    },
    async savePaxsPrices() {
      const uuid = this.$route.query.itinerary;
      const payload = {
        id: uuid,
        paxs_prices: this.paxsPrices,
      };
      this.handleModal();
      this.setLoading(true);
      try {
        await this.$store.dispatch("itinerary/savePaxPrices", payload);
        await this.$store.dispatch("itinerary/list_prices", {
          uuid,
          reload: true,
        });
      } catch (error) {
        console.log("Save Pax Prices Error", error);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
    async initialFetchings() {
      await Promise.allSettled([
        this.loadPricesItinerary({ reload: false }),
        this.loadItineraryPassengers(false),
      ]);
    },
    async loadInitialData() {
      this.loadingSelfSkeleton = true;
      try {
        this.$store.dispatch("utils/setHistoryView");
        if (!this.historyView.isActive) {
          await this.initialFetchings();
        }
        this.pricesLevels =
          this.prices_itinerary_source.length > 0
            ? this.prices_itinerary_source
            : this.pricesLevels;
        this.paxsPrices = this.initialPaxsPrices;
        this.loadingSelfSkeleton = false;
      } catch (error) {
        this.loadingSelfSkeleton = false;
        console.warn("Prices Error", error);
        throw error;
      }
    },
  },
  mounted() {
    this.loadInitialData();
  },
};
</script>
<style>
.pax_prices_modal .modal-content {
  max-width: fit-content !important;
  overflow: hidden;
  border-radius: 1rem;
}
.pax_prices_section {
  max-width: fit-content;
  max-height: 100%;
  margin: 0 auto;
  background-color: var(--quote-bg-color);
}
.pax_prices_section :is(.b-tabs) {
  top: -2rem;
  position: relative;
}
.pax_prices_section :is(.b-tabs[is-nav-hidden="true"] > nav) {
  opacity: 0;
  pointer-events: none;
}
.pax_prices_section .b-tabs .tabs :is(li, a) {
  color: #1d3b83;
  border-color: #1d3b83;
}
.pax_prices_section .b-tabs .tabs li.is-active a {
  background: #1d3b83;
  color: #fff;
  border-radius: 0.25rem;
}
.pax_prices_section .b-tabs .tab-content {
  padding: 1rem 0 0;
}
.pax_prices_section > footer {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--quote-bg-color);
  width: 100%;
}
.card > header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: baseline;
}
.card > header > p {
  font-weight: 700;
  font-size: 1rem;
}
.level-disabled {
  background: #eaeaef;
  border-color: #666687;
  opacity: 0.99 !important;
}
.level-disabled .small {
  color: #666687 !important;
}
.b-table .table-wrapper.has-sticky-header {
  max-height: 12rem;
  min-height: 12rem;
}
.levelComfort[disabled] {
  cursor: pointer;
  pointer-events: all;
}
@media screen and (max-width: 480px) {
  .pax_prices_modal__container .animation-content.modal-content {
    width: 90%;
  }
  .pax_prices_section {
    padding: 1.5rem !important;
  }
  .pax_prices_modal,
  .pax_prices_modal > div {
    width: 100%;
  }
  .cardItineraryContent .card-content {
    padding: 0.5rem;
  }
  .levelComfort .cardItineraryContent {
    margin-left: 0;
    width: max-content;
    max-width: max-content;
    min-width: 6.5rem;
    display: flex;
    flex: 1;
  }
  .PriceComfort {
    font-size: 1rem;
  }
  .recalulate_prices__container {
    display: none;
  }
  .pax_prices_section :is(.b-tabs) {
    overflow-x: auto;
  }
}
@media screen and (max-width: 375px) {
  .cardItineraryContent .card-content {
    padding: 0.25rem 0rem;
  }
  .levelComfort .cardItineraryContent {
    min-width: 6rem;
  }
}
@media screen and (max-width: 320px) {
  .levelComfort .cardItineraryContent {
    min-width: 5rem;
  }
}
</style>
