<template>
  <div class="exportButton_container">
    <button
      v-if="!loading"
      @click="generateQuoteWord"
      :disabled="!isExportToWordButtonAvailable"
      class="button-outline button is-color2 color2"
    >
      <i class="mr-4"><IconExport class="icon is-small" /></i>
      Export Word
    </button>
    <span v-else class="exportButton_loading">
      Proccesing your Word Document
      <clip-loader :loading="loading" color="#032647" size="20px"></clip-loader>
    </span>
    <div class="container__template__word" style="display: none">
      <Print />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { ITINERARY_STATUS } from "@/constants/itinerary";
import { exportHelper } from "@/utils/export";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import Print from "@/components/quote-views/export/print/Print.vue";

export default {
  name: "ExportToWordButton",
  components: { ClipLoader, Print },
  data() {
    return {
      loading: false,
      helper: { ...exportHelper },
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      itineraryStatus: "itinerary/getItineraryStatus",
      itineraryDays: "itineraryDays/getItineraryDays",
      services_itinerary: "itinerary/getServicesItinerary",
      prices_itinerary_source: "itinerary/getPricesItinerariesSource",
      paxsPrices: "itinerary/getPaxPrices",
      published_images_config: "itinerary/getPublishedConfigAndImages",
    }),
    isItineraryCancelled() {
      return this.itineraryStatus === ITINERARY_STATUS.CANCEL.value;
    },
    isExportToWordButtonAvailable() {
      return (
        this.itineraryDays?.length > 0 &&
        this.paxsPrices?.length > 0 &&
        !this.isItineraryCancelled
      );
    },
  },
  methods: {
    generateQuoteWord() {
      const htmlContent2 = document.querySelector(
        ".PrintVersionContainer"
      ).innerHTML;
      const blob = new Blob([htmlContent2], { type: "application/msword" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${this.itinerary.data.title.value}.doc`;
      link.click();

      URL.revokeObjectURL(url);
    },
  },
};
</script>
<style scoped>
.exportButton_container {
  display: inline-flex;
  align-items: center;
}
.exportButton_loading {
  display: inline-flex;
  column-gap: 1rem;
  color: var(--bs-gray);
}
</style>
