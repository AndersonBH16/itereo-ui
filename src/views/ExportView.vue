<template>
  <div class="is-flex export_view__container">
    <div class="columns ml-1" style="width: 100%">
      <GuideBox
        title="Editing the Weblink"
        description="To edit you Weblink click on the pencil icon"
        :step="47"
        :positionX="720"
        :positionY="20"
        :showNextButton="false"
        v-if="!loading"
      />
      <ExportAccordion
        v-if="published_images_config.config && published_images_config.images"
        :itinerary="info.itinerary"
        :isExperience="isExperience"
        :handleLoading="handleLoading"
        :isOpenWeblinkTab="isOpenWeblinkTab"
        :setIsOpenWeblinkTab="setIsOpenWeblinkTab"
        :published_images_config="published_images_config"
        :templateColors="templateColors"
        :templateImages="templateImages"
        :loadPublishedImagesItinerary="loadPublishedImagesItinerary"
        :finishTourGuide="finishTourGuide"
        :validateFunctionExecution="validateFunctionExecution"
        @update="updateConfig"
        @udpate:templateImages="updateTemplateImages"
      />
      <UnderConstruction style="display: none" />
    </div>
    <BaseModal
      type="guide"
      :isComponentModalActive="isComponentModalActive"
      :closeModal="closeGuideModal"
      :showSecondaryButton="false"
      primaryButtonText="Ok, close modal"
      :actionButtonOne="closeGuideModal"
      v-if="!loading"
    >
      <h1 slot="title" class="guidemodal__h1">
        Congratulations!, you have finished the tour
      </h1>
      <p slot="paragraph"></p>
      <img
        slot="image"
        src="/img/finishguide.png"
        alt="modal image"
        style="max-width: 40%; margin: 4rem auto"
      />
    </BaseModal>
  </div>
</template>

<script>
import ExportAccordion from "@/components/quote-views/export/ExportAccordion.vue";
import UnderConstruction from "@/components/quote-views/UnderConstruction.vue";
import { mapGetters } from "vuex";
import GuideBox from "../components/_shared/GuideBox.vue";
import BaseModal from "../components/base-ui/BaseModal.vue";
import { ITINERARY_TYPES } from "@/constants/itinerary";
import {
  TEMPLATE_COLORS,
  getTemplateImagesDefault,
} from "@/constants/exportConfig";
import { exportHelper } from "@/utils/export";
import { PATH_INFO } from "@/router/path";

export default {
  name: "ExportView",
  components: {
    ExportAccordion,
    UnderConstruction,
    GuideBox,
    BaseModal,
  },
  props: {
    setLoading: {
      type: Function,
      default: () => {},
    },
    loadClientContracts: {
      type: Function,
      default: () => {},
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    loadItineraryDays: {
      type: Function,
      default: () => {},
    },
    loadItinerary: {
      type: Function,
      default: () => {},
    },
    loadPublishedItinerary: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      payload: {
        from: null,
        to: null,
        id: null,
      },
      templateImages: getTemplateImagesDefault(this.isExperience),
      templateColors: TEMPLATE_COLORS,
      isComponentModalActive: false,
      helper: { ...exportHelper },
      isOpenWeblinkTab: false,
    };
  },
  computed: {
    ...mapGetters({
      currencies: "currency/getCurrencies",
      language: "language/getLanguages",
      clients: "client/getClients",
      client_contracts: "client/getClientContracts",
      itinerary: "itinerary/getItinerary",
      services: "services/getServices",
      services_itinerary: "itinerary/getServicesItinerary",
      published_images_config: "itinerary/getPublishedConfigAndImages",
      prices_itinerary: "itinerary/getPricesItineraries",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      historyView: "utils/getHistoryView",
    }),
    info() {
      return {
        currencies: this.currencies,
        language: this.language,
        clients: this.clients,
        client_contracts: this.client_contracts,
        itinerary: this.itinerary,
        services: this.services,
        services_itinerary: this.services_itinerary,
        published_images_config: this.published_images_config,
      };
    },
    isExperience() {
      return (
        this.itinerary.data?.itinerary_type_id === ITINERARY_TYPES.EXPERIENCE.id
      );
    },
  },
  methods: {
    updateTemplateImages(newTemplateImages) {
      this.templateImages = newTemplateImages;
    },
    loadItineraryPublishedImages() {
      if (this.published_images_config.images) {
        const imagesToMatch = this.templateImages.map((img) => {
          const imageFound = this.published_images_config.images.find(
            (image) => image.type === img.type
          );
          if (imageFound !== undefined) {
            return {
              ...img,
              id: imageFound.id,
              images_full: imageFound.images_full ?? img.images_full,
            };
          }
          return img;
        });
        this.updateTemplateImages([...imagesToMatch]);
      }
    },
    setIsOpenWeblinkTab(newValue = false) {
      this.isOpenWeblinkTab = newValue;
    },
    updateConfig({ key = "", value = null }) {
      if (key === "updateColors") {
        this.templateColors = value;
      }
    },
    handleLoading(newValue = false) {
      this.loading = newValue;
      this.setLoading(newValue);
    },
    addInfoToPayload() {
      this.payload.id = this.info.itinerary.data.id;
      this.payload.from = this.info.itinerary
        ? this.info.itinerary.data.start_date
        : null;
      this.payload.to = this.info.itinerary.data
        ? this.info.itinerary.data.end_date >=
          this.info.itinerary.data.start_date
          ? this.info.itinerary.data.end_date
          : this.info.itinerary.data.start_date
        : null;
    },
    async loadPublishedImagesItinerary() {
      await this.loadPublishedItinerary();
      this.loadItineraryPublishedImages();
      this.setInitialColors(this.published_images_config?.config?.colors);
    },
    async loadItineraryByRouteQuery() {
      this.handleLoading(true);
      await this.loadItinerary();
      this.addInfoToPayload();
      await Promise.allSettled([
        this.loadItineraryDays(false),
        this.loadServicesItinerary(this.payload),
        this.loadClientContracts(this.info.itinerary.data.client.id),
        this.loadPublishedImagesItinerary(),
      ]);
      if (!this.isExperience) this.setIsOpenWeblinkTab(true);
      this.handleLoading(false);
    },
    async loadItineraryRestQuerys() {
      this.handleLoading(true);
      this.addInfoToPayload();
      try {
        await Promise.allSettled([
          this.loadItineraryDays(false),
          this.loadServicesItinerary(this.payload),
          this.loadClientContracts(this.info.itinerary.data.client.id),
          this.loadPublishedImagesItinerary(),
        ]);
        if (!this.isExperience) this.setIsOpenWeblinkTab(true);
      } catch (error) {
        console.warn(error);
      }
      this.handleLoading(false);
    },
    closeGuideModal() {
      this.isComponentModalActive = false;
    },
    openGuideModal() {
      this.isComponentModalActive = true;
    },
    finishTourGuide() {
      if (!this.isUserGuideActive) return;
      this.$store.dispatch("userguide/setIsGuideActive", false);
      this.openGuideModal();
    },
    setInitialColors(colors = []) {
      const colorsNoDuplicated = this.helper.getColorsWithoutDuplicated(colors);
      this.templateColors =
        colors === null || colors?.length === 0
          ? TEMPLATE_COLORS
          : colorsNoDuplicated;
    },
    async loadItineraryVersion(itineraryId) {
      this.setLoading(true);
      if (!this.itinerary?.data?.id) {
        await this.$store.dispatch("itinerary/getItineraryVersion", {
          itineraryId: itineraryId,
          version: this.historyView.version,
        });
      }
      if (!this.isExperience) this.setIsOpenWeblinkTab(true);
      this.setLoading(false);
    },
  },
  beforeMount() {
    const itineraryRouteQuery = this.$router.history.current.query.itinerary;
    this.$store.dispatch("utils/setHistoryView");
    if (this.historyView.isActive) {
      this.loadItineraryVersion(itineraryRouteQuery);
    } else if (itineraryRouteQuery && !this.info.itinerary.data) {
      this.loadItineraryByRouteQuery();
    } else if (!itineraryRouteQuery && this.info.itinerary.data) {
      this.$router.push({
        path: PATH_INFO.EXPORT.path,
        query: { itinerary: this.info.itinerary.data.id },
      });
      this.loadItineraryRestQuerys();
    } else {
      this.loadItineraryRestQuerys();
    }
  },
};
</script>
<style>
.content p:not(:last-child) {
  margin-bottom: 0;
}
.guidemodal__h1 {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
}
.export_view__container {
  margin-top: 2rem;
}
@media screen and (max-width: 480px) {
  .export_view__container {
    margin-top: 1rem;
  }
}
</style>
