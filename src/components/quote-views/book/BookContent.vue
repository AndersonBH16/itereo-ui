<template>
  <div class="book_content_container">
    <div class="book_content_header">
      <div class="book_content_text">
        <h1>Confirming quote</h1>
        <p>
          Please, select a level and then confirm your choice in the opening
          mode
        </p>
      </div>
    </div>
    <section class="book_content_body" v-if="loading">
      <BookLevelCardSkeleton v-for="n in 3" :key="n" />
    </section>
    <b-tabs
      v-model="activeTab"
      position="is-right"
      class="block mb-0"
      :is-nav-hidden="isOnlyOneType"
      v-if="!loading && pricesLevels.length > 0"
    >
      <b-tab-item
        v-for="price in pricesLevels"
        :key="price.id"
        :label="price.label"
      >
        <section class="book_content_body">
          <BookLevelCard
            v-for="level in price.prices"
            :key="level.id"
            :price="price"
            :level="level"
            :selectedLevel="selectedLevel"
            :selectedPrice="selectedPrice"
            :isDisabledToUpdate="
              isDisabledToUpdate ||
              disableQuoteByStatus ||
              hideElementByCondition
            "
            @selectLevel="selectLevel"
          />
        </section>
      </b-tab-item>
    </b-tabs>
    <p
      v-if="!loading && pricesLevels.length === 0"
      class="book_content_placeholder"
    >
      There is no price available for this itinerary, please add services to
      your quote
    </p>
    <BaseModal :isComponentModalActive="showStatusChangeModal">
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title"
        >Are you sure to
        <span class="has-text-weight-semibold">change</span> this status?
      </span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="closeModal"
          action="secondary"
          size="medium"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="
            () => {
              this.closeModal();
              this.validateItineraryIsPublished(
                this.constants.ITINERARY_STATUS.CONFIRM.value
              );
            }
          "
          action="tercery"
          size="medium"
          :disabled="loading"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>

    <BaseModal :isComponentModalActive="showIsItineraryPublishedModal">
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title">
        This itinerary has not been published yet. Then you will not be able to
        edit the export.
        <br />Are you sure to
        <span class="has-text-weight-semibold">change</span> this status?
      </span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="
            () => {
              showStatusChangeModal = false;
              showIsItineraryPublishedModal = false;
              redirectToExportSection();
            }
          "
          action="secondary"
          size="medium"
          :disabled="loading"
          class="mr-4"
        >
          <p slot="text">No, redirect to export</p>
        </BaseButton>
        <BaseButton
          @click="
            () => handleChangeStatus(constants.ITINERARY_STATUS.CONFIRM.value)
          "
          action="tercery"
          size="medium"
          :disabled="loading"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>

    <ExternalExportModal
      :isModalOpen="showExternalExportModal"
      :loading="loading"
      :onExternalExportContinue="onExternalExportContinue"
      :closeModal="closeChangeStatusModal"
    />

    <CongratulationsModal
      :isModalOpen="showCongratulationsMessage"
      :closeModal="() => (showCongratulationsMessage = false)"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import BookLevelCard from "./BookLevelCard/BookLevelCard.vue";
import BookLevelCardSkeleton from "./BookLevelCard/BookLevelCardSkeleton.vue";
import ExternalExportModal from "@/components/quote-views/_shared/ExternalExportModal.vue";
import CongratulationsModal from "@/components/quote-views/_shared/CongratulationsModal.vue";
import { SERVICE_STATUS } from "@/constants";
import {
  ITINERARY_STATUS_TO_PUBLISH_QUOTE,
  ITINERARY_STATUS,
} from "@/constants/itinerary";
import { PATH_INFO } from "@/router/path";

export default {
  name: "BookContent",
  components: {
    BookLevelCard,
    BookLevelCardSkeleton,
    ExternalExportModal,
    CongratulationsModal,
  },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: {
        ITINERARY_STATUS,
      },
      selectedLevel: {
        id: null,
      },
      selectedPrice: {
        id: null,
      },
      selectLevelServices: [],
      activeTab: 0,
      showStatusChangeModal: false,
      showIsItineraryPublishedModal: false,
      showExternalExportModal: false,
      showCongratulationsMessage: false,
    };
  },
  computed: {
    ...mapGetters({
      prices: "itinerary/getPricesItinerariesSource",
      itinerary: "itinerary/getItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      published_images_config: "itinerary/getPublishedConfigAndImages",
    }),
    isOnlyOneType() {
      return this.prices?.length === 1;
    },
    pricesLevels() {
      return this.prices.map((price) => {
        return {
          ...price,
          isPriceSelected:
            price.selected_level !== 0 && price.selected_level !== null,
        };
      });
    },
    isDisabledToUpdate() {
      const priceFound = this.pricesLevels.find(
        (price) => price.isPriceSelected
      );
      return priceFound !== undefined;
    },
  },
  watch: {
    pricesLevels() {
      const priceSelected = this.pricesLevels?.find(
        (price) => price.isPriceSelected
      );
      this.selectedPrice = priceSelected || { id: null };
      this.selectedLevel = priceSelected?.prices?.find(
        (level) => level.level === priceSelected?.selected_level
      ) || { id: null };
      this.activeTab =
        this.pricesLevels?.findIndex((price) => price.isPriceSelected) || 0;
    },
  },
  methods: {
    redirectToExportSection() {
      this.$router.push({
        path: PATH_INFO.EXPORT.path,
        query: { itinerary: this.$route.query.itinerary },
      });
    },
    async validateItineraryIsPublished(newStatus, forceSaving = false) {
      const isItineraryPublished = this.published_images_config.config?.id;
      if (
        !forceSaving &&
        !isItineraryPublished &&
        ITINERARY_STATUS_TO_PUBLISH_QUOTE.includes(newStatus)
      ) {
        this.showStatusChangeModal = false;
        this.showIsItineraryPublishedModal = true;
      } else {
        this.setLoading(true);
        if (forceSaving) await this.confirmQuote(newStatus);
        else await this.handleChangeStatus(newStatus);
        const payload = {
          id: this.$route.query.itinerary,
          reload: true,
          from: this.itinerary.data.start_date,
          to: this.itinerary.data.end_date,
        };
        await this.loadServicesItinerary(payload);
        this.setLoading(false);
      }
    },
    async onExternalExportContinue(externalSource = "") {
      this.closeChangeStatusModal();
      this.$store.dispatch("itinerary/setIsRecentlyExported", true);
      await this.validateItineraryIsPublished(
        ITINERARY_STATUS.CONFIRM.value,
        true
      );
      await this.$store.dispatch("itinerary/exportToExternal", {
        itineraryId: this.itinerary.data.id,
        externalSource,
      });
      this.$store.dispatch("itinerary/setIsRecentlyExported", false);
      this.showCongratulationsMessage = true;
    },
    async handleChangeStatus(newStatus) {
      if (newStatus === ITINERARY_STATUS.CONFIRM.value) {
        this.showStatusChangeModal = false;
        this.showIsItineraryPublishedModal = false;
        this.showExternalExportModal = true;
        return;
      }
      this.confirmQuote(newStatus);
    },
    closeChangeStatusModal() {
      this.showStatusChangeModal = false;
      this.showExternalExportModal = false;
      this.showIsItineraryPublishedModal = false;
    },
    getQuotePayload(defaultPayload = {}) {
      return {
        ...defaultPayload,
        id: this.itinerary?.data?.id,
        status: ITINERARY_STATUS.CONFIRM.value,
        prices_list: this.pricesLevels.map((price) => {
          return {
            ...price,
            selected_level:
              price.id === this.selectedPrice.id ? this.selectedLevel.level : 0,
          };
        }),
      };
    },
    closeModal() {
      this.showStatusChangeModal = false;
    },
    selectLevel({ level = {}, services = [], price = {} }) {
      this.selectedLevel = level;
      this.selectedPrice = price;
      this.selectLevelServices = services;
      this.showStatusChangeModal = true;
    },
    async confirmQuote() {
      this.setLoading(true);
      this.showStatusChangeModal = false;
      this.showIsItineraryPublishedModal = false;
      const TOTAL_STEPS_TO_PERFORM = 2;
      const payload = this.getQuotePayload({
        cur_step: 1,
        last_step: TOTAL_STEPS_TO_PERFORM,
      });

      try {
        await this.$store.dispatch("itinerary/change_status", payload);
        await this.confirmQuoteServices(
          TOTAL_STEPS_TO_PERFORM,
          TOTAL_STEPS_TO_PERFORM
        );
      } catch (error) {
        this.setLoading(false);
        this.$buefy.toast.open({
          duration: 5000,
          message: error.message,
          position: "is-top",
          type: "is-danger",
        });
      }

      this.setLoading(false);
    },
    async confirmQuoteServices(cur_step = 0, last_step = 0) {
      const payload = {
        id: this.itinerary?.data?.id,
        status: SERVICE_STATUS.CONFIRM.value,
        services: this.selectLevelServices.map((service) => service.id),
        cur_step,
        last_step,
      };
      await this.$store.dispatch("itinerary/change_status_services", payload);
    },
    setLoading(value) {
      this.$emit("updateLoading", value);
    },
  },
};
</script>
<style>
.book_content_container {
  padding: 0 1.5rem 0 0;
}
.book_content_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.book_content_header button > p {
  padding-right: 0.5rem;
}
.book_content_text > h1 {
  font-size: 1.5rem;
  font-weight: 800;
}
.book_content_text > p {
  margin-top: 1rem;
}
.book_content_body {
  display: flex;
  margin: 4rem 0;
  align-items: flex-start;
  justify-content: center;
  column-gap: 2rem;
}
.book_content_container :is(.b-tabs) {
  top: -4rem;
  position: relative;
}
.book_content_container > .b-tabs .tabs :is(li, a) {
  color: #1d3b83;
  border-color: #1d3b83;
}
.book_content_container > .b-tabs .tabs li.is-active a {
  background: #1d3b83;
  color: #fff;
  border-radius: 0.25rem;
}
.book_content_placeholder {
  text-align: center;
  margin-top: 5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #4a4a4a;
}
.book_content_container :is(.b-tabs[is-nav-hidden="true"] > nav) {
  opacity: 0;
  pointer-events: none;
}

@media screen and (max-width: 480px) {
  .book_content_container {
    padding: 0rem;
  }

  .b-tabs .tab-content {
    padding: 0rem;
  }

  .book_content_body {
    flex-direction: column;
    row-gap: 2rem;
  }

  .book_level_card {
    width: 100%;
  }

  .book_level_card body {
    margin-top: 1rem;
    height: 10rem;
    overflow-y: auto;
  }
}
</style>
