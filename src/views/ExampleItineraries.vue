<template>
  <PageWrapper>
    <Loading :loading="loading" :loadingText="loadingText" />
    <NavbarMain />
    <b-breadcrumb
      v-if="payload.country"
      separator="has-bullet-separator"
      size="is-small"
    >
      <b-breadcrumb-item>
        <b-navbar-item
          tag="router-link"
          :to="{ path: paths.ITINERARIES.path }"
          class="first-breadcrumb-item"
          >Destinations</b-navbar-item
        >
      </b-breadcrumb-item>
      <b-breadcrumb-item active>{{
        (payload.country &&
          payload.country[0] &&
          payload.country[0].location_name) ||
        ""
      }}</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="columns example__container mt-2">
      <div class="column">
        <QuoteSearchForm
          formTitle="Example Itineraries"
          :defaultForm="payloadForm"
          :disabledControls="disabledControls"
          :hiddenControls="hiddenControls"
          :typeItineraryPayload="constants.EXAMPLE_TYPE_ITINERARY"
          :loadItineraries="loadExampleItineraries"
          :itinerary-types="itineraryTypes"
          @update:updateDefaultForm="updatePayloadForm"
        />
      </div>
      <div class="column is-four-fifths ml-4">
        <div class="grid">
          <ExampleItineraryCard
            v-for="itinerary in itineraries.data"
            :key="itinerary.id"
            :itinerary="itinerary"
            :handleDuplicate="preloadTemplateInfo"
            :handlePreview="handlePreview"
          />
        </div>
        <ExampleItinerariesSkeleton
          v-if="loading"
          :isLoading="loading"
          :cardsNumber="cardsToDisplay"
        />
        <div
          v-else-if="itineraries.data && itineraries.data.length === 0"
          class="content has-text-centered h-100 is-flex is-align-items-center is-justify-content-center"
        >
          <p>
            There are no results. Please try the search again in a couple of
            minutes. If the issue continues, contact support
          </p>
        </div>
        <div
          v-if="displayPagination"
          class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center"
        >
          <p class="color-4 mb-2">
            Displaying
            <span class="has-text-weight-bold">{{
              resultsInfo.displaying
            }}</span>
            of
            <span class="has-text-weight-bold">{{ resultsInfo.results }}</span>
            results
          </p>
          <b-progress
            :value="resultsInfo.displayingPercentage"
            size="is-small"
            class="w-25 m-auto pagination__progress"
          >
          </b-progress>
          <BaseButton
            v-if="resultsInfo.displaying < resultsInfo.results"
            class="mt-2"
            size="large"
            action="principal"
            @click="loadMoreExampleItineraries"
          >
            <p slot="text">Load more Example Itineraries</p>
          </BaseButton>
        </div>
      </div>
    </div>
    <BaseModal
      :isComponentModalActive="!!preview"
      :closeModal="closePreviewModal"
      type="preview"
    >
      <iframe
        v-if="preview"
        :src="preview.url"
        :title="preview.title"
        width="800"
        height="600"
        slot="body"
      ></iframe>
      <BaseButton
        size="large"
        @click="preloadTemplateInfo(preview)"
        action="tercery"
        class="card__button mt-4"
        slot="footer"
      >
        <p slot="text">Customize!</p>
      </BaseButton>
    </BaseModal>
    <BaseModal type="loading" :isComponentModalActive="showModal">
      <h1 slot="title">We are creating your itinerary</h1>
      <p slot="paragraph">
        Please wait a couple of seconds, we are preparing everything to show you
        the content
      </p>
      <LoadingDotGathering slot="icon" />
    </BaseModal>
    <PreloadDataModal
      :showPreloadTemplateInfoModal="showPreloadTemplateInfoModal"
      :preloadedTemplateInfo="preloadedTemplateInfo"
      :handleDuplicate="handleDuplicate"
      @update:showPreloadTemplateInfoModal="
        showPreloadTemplateInfoModal = $event
      "
    />
  </PageWrapper>
</template>

<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";
import { cloneDeep } from "lodash";
import helpers from "@/helpers";
import * as Sentry from "@sentry/vue";
import { helpers as adapters } from "@/utils/adapters";
import { PATH_INFO } from "../router/path";
import { DATE_FORMAT_YYYY_MM_DD } from "../constants";
import {
  DEFAULT_SEARCH_QUOTES_PAYLOAD,
  QUOTES_FILTERS,
} from "../constants/itinerary";
import PageWrapper from "@/components/_shared/PageWrapper.vue";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import QuoteSearchForm from "@/components/quotes/QuoteSearchForm.vue";
import Loading from "@/components/_shared/Loading.vue";
import BaseModal from "@/components/base-ui/BaseModal.vue";
import { EXAMPLE_TYPE_ITINERARY, ITINERARY_TYPES } from "@/constants/itinerary";
import LoadingDotGathering from "../components/icons/LoadingDotGathering.vue";
import ExampleItinerariesSkeleton from "@/components/example-itineraries/ExampleItinerariesSkeleton.vue";
import ExampleItineraryCard from "@/components/example-itineraries/ExampleItineraryCard.vue";
import PreloadDataModal from "../components/quotes/PreloadDataModal.vue";

export default {
  name: "ExampleQuotes",
  components: {
    PageWrapper,
    NavbarMain,
    QuoteSearchForm,
    Loading,
    BaseModal,
    LoadingDotGathering,
    ExampleItinerariesSkeleton,
    ExampleItineraryCard,
    PreloadDataModal,
  },
  beforeRouteEnter(to, from, next) {
    if (to.name === PATH_INFO.ITINERARIES_BY_DESTINATION_OLD.name) {
      const destination = to.path.split("/").at(-1);
      next({ path: `${PATH_INFO.ITINERARIES.path}/${destination}` });
    } else {
      next();
    }
  },
  data() {
    return {
      displayWidth: 0,
      payload: {
        page: 1,
        type: ITINERARY_TYPES.TEMPLATE.id,
        country: null,
      },
      paths: {
        ...PATH_INFO,
      },
      preview: null,
      showModal: false,
      showPreloadTemplateInfoModal: false,
      preloadedTemplateInfo: {
        id: null,
        code: null,
        name: "",
        start_date: new Date(),
      },
      constants: {
        EXAMPLE_TYPE_ITINERARY,
      },
      itineraryTypes: [ITINERARY_TYPES.TEMPLATE],
      payloadForm: {
        ...cloneDeep(DEFAULT_SEARCH_QUOTES_PAYLOAD),
        type: ITINERARY_TYPES.TEMPLATE.id,
      },
    };
  },
  computed: {
    ...mapGetters({
      itineraries: "itinerary/getItineraries",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      authData: "auth/getAuthData",
      countries: "locations/listCountry",
      quoteServices: "itinerary/getServicesItinerary",
    }),
    data() {
      return {
        data: this.itineraries.data,
        total: this.itineraries.meta ? this.itineraries.meta.total : 0,
        currentPage: this.itineraries.meta
          ? this.itineraries.meta.current_page
          : 1,
        lastPage: this.itineraries.meta ? this.itineraries.meta.last_page : 1,
        prev: this.itineraries.links ? this.itineraries.links.prev : 1,
        next: this.itineraries.links ? this.itineraries.links.next : 1,
      };
    },
    cardsToDisplay() {
      return this.displayWidth >= 1350 ? 8 : 6;
    },
    resultsInfo() {
      return {
        displaying: this.data?.data?.length || 0,
        results: this.data?.total || 0,
        displayingPercentage: Math.round(
          (this.data?.data?.length / this.data?.total) * 100
        ),
      };
    },
    displayPagination() {
      return this.data?.data?.length > 0 && !this.loading;
    },
    disabledControls() {
      return [QUOTES_FILTERS.COUNTRY, QUOTES_FILTERS.ITINERARY_TYPE_ID];
    },
    hiddenControls() {
      return [
        QUOTES_FILTERS.STATUS,
        QUOTES_FILTERS.COUNTRY,
        QUOTES_FILTERS.DESTINATION,
      ];
    },
  },
  methods: {
    updateDisplaySize() {
      this.displayWidth = window.innerWidth;
    },
    updatePayloadForm(payload) {
      this.payloadForm = {
        ...this.payloadForm,
        ...payload,
        country: this.payload.country,
      };
    },
    async loadMoreExampleItineraries() {
      this.payload = {
        ...this.payload,
        ...this.payloadForm,
        page: this.data.currentPage + 1,
        accumulate: true,
      };
      await this.loadExampleItineraries(this.payload);
    },
    async loadExampleItineraries(payload = {}) {
      this.getCountryByUrlParam();
      const newPayload = {
        filter: "template",
        limit: this.cardsToDisplay,
        ...this.payload,
        ...payload,
        country: this.payload.country
          ?.map((country) => country.location_code)
          .join(","),
      };
      try {
        this.setLoading(true);
        await this.$store.dispatch(
          "itinerary/list",
          adapters.adaptPayloadToGetQuotes(newPayload)
        );
        this.setLoading(false);
      } catch (error) {
        this.setLoading(false);
        throw error;
      }
    },
    closePreviewModal() {
      this.preview = null;
    },
    onPageChange(page) {
      this.data.currentPage = page;
      this.payload.page = this.data.currentPage;
      this.loadExampleItineraries();
    },
    handlePreview(itinerary) {
      const path = itinerary?.link_code;
      const weblinkUrl = `${process.env.VUE_APP_WEB_LINK_URL}${path}`;
      const newPreview = {
        url: weblinkUrl,
        title: itinerary.title,
        code: itinerary.code,
        id: itinerary.id,
      };
      this.preview = newPreview;
    },
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) {
        this.setLoadingText("Loading content, please wait...");
      }
    },
    setLoadingText(value = "") {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    preloadTemplateInfo(itinerary) {
      this.preloadedTemplateInfo.id = itinerary.id;
      this.preloadedTemplateInfo.code = itinerary.code;
      this.preloadedTemplateInfo.name = itinerary.title;
      this.preloadedTemplateInfo.start_date = new Date();
      this.showPreloadTemplateInfoModal = true;
    },
    async duplicateItinerary(data = {}) {
      this.setLoading(true);
      this.isActive = false;

      await this.loadQuoteServices({ id: data.id });

      this.setLoading(true);

      const initialQuoteServicesCodes = this.quoteServices.map(
        (service) => service.code
      );

      const initialQuoteId = data.id;

      const payload = {
        code: data.code,
        uuid: data.id,
        start_date: format(data.start_date, DATE_FORMAT_YYYY_MM_DD),
        name: data.name,
        calculate_prices: 1,
        originalServices: this.quoteServices,
      };

      const response = await this.$store.dispatch(
        "itinerary/duplicate",
        payload
      );

      const newQuoteServicesCodes = response.updatedServices.map(
        (service) => service.code
      );

      const newQuoteId = response.itinerary;

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
      this.setLoading(false);
      this.preloadedTemplateInfo = {
        id: null,
        code: null,
        name: "",
        start_date: new Date(),
      };
    },
    async handleDuplicate(data) {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          return await this.duplicateItinerary(data);
        },
        functionToExecuteOnFail: async (error) => {
          this.setLoading(false);
          this.preloadedTemplateInfo = {
            id: null,
            code: null,
            name: "",
            start_date: new Date(),
          };
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
    getCountryByUrlParam() {
      if (this.countries.length === 0) return;
      if (this.payload.country?.length > 0) return;
      const countryFound = this.countries.find(
        (country) =>
          country.location_name ===
          helpers.revertKebabCase(this.$route.params?.destination)
      );
      if (!countryFound) return;
      this.payload.country = [countryFound];
      this.payloadForm.country = this.payload.country;
    },
    async loadQuoteServices(payload = null) {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          if (payload) {
            return await this.$store.dispatch(
              "itinerary/list_services",
              payload
            );
          }
        },
        functionToExecuteOnFail: async (error) => {
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message: "Error trying to load the services, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });
    },
  },
  mounted() {
    this.updateDisplaySize();
    window.addEventListener("resize", this.updateDisplaySize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateDisplaySize);
  },
};
</script>
<style scoped>
.example__container .sticky-searchform {
  position: relative;
  top: 0;
  margin-top: 0rem !important;
  padding-top: 0rem !important;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 240px);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}
.grid .card {
  margin: 0 auto 0 0;
}
iframe {
  border-radius: 1rem;
}
.first-breadcrumb-item {
  color: rgb(141, 141, 141);
  padding: 0;
}
.breadcrumb .is-active {
  font-weight: 800;
  font-size: 0.8rem;
}
.datepicker_container
  :is(.dropdown-menu, .dropdown-menu:hover, .dropdown-item, .dropdown-item:hover) {
  background-color: #fff;
  font-size: 0.7rem;
}
.datepicker_container
  .datepicker
  .datepicker-table
  .datepicker-body
  .datepicker-cell.is-selected {
  background-color: #1d3b83;
  color: #fff;
}
</style>
