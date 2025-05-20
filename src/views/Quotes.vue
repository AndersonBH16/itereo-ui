<template>
  <PageWrapper>
    <Loading :loading="loading" :loadingText="loadingText" />
    <NavbarMain />
    <div class="columns mt-2">
      <div class="column">
        <QuoteSearchForm
          :defaultForm="payload"
          :loadItineraries="loadItineraries"
          :loadStatusesItinerary="loadStatusesItinerary"
          :hiddenControls="hiddenControls"
          @update:updateDefaultForm="updatePayloadForm"
        />
      </div>
      <div class="column is-four-fifths">
        <QuoteTable :loadItineraries="loadItineraries" :payload="payload" />
      </div>
    </div>
  </PageWrapper>
</template>

<script>
import { mapGetters } from "vuex";
import { cloneDeep } from "lodash";
import helpers from "@/helpers";
import { helpers as adapters } from "@/utils/adapters";
import * as ITINERARY from "@/constants/itinerary";
import { USER_ROLE } from "../constants";
import { QUOTES_FILTERS } from "../constants/itinerary";
import PageWrapper from "@/components/_shared/PageWrapper.vue";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import QuoteTable from "@/components/quotes/QuoteTable.vue";
import QuoteSearchForm from "@/components/quotes/QuoteSearchForm.vue";
import Loading from "@/components/_shared/Loading.vue";

export default {
  name: "Quotes",
  components: {
    PageWrapper,
    NavbarMain,
    QuoteTable,
    QuoteSearchForm,
    Loading,
  },
  data() {
    return {
      payload: {
        ...cloneDeep(ITINERARY.DEFAULT_SEARCH_QUOTES_PAYLOAD),
        type: ITINERARY.TYPE.NORMAL,
      },
    };
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      authData: "auth/getAuthData",
    }),
    backgroundImage() {
      return helpers.backgroundImage(
        "https://305c511294116d47a2eb-8984c8bf4382d773df005374b9639769.ssl.cf2.rackcdn.com/itereo/ttc/background_app.jpg"
      );
    },
    hiddenControls() {
      if (helpers.hasAnyRoles(this.authData.user, [USER_ROLE.ADMIN], true)) {
        return [];
      }
      return [QUOTES_FILTERS.CLIENT];
    },
  },
  methods: {
    updatePayloadForm(payload) {
      this.payload = {
        ...this.payload,
        ...payload,
      };
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
    async loadStatusesItinerary() {
      const payload = {
        page: 1,
      };

      await this.$store.dispatch(
        "status_itinerary/getStatusesItinerary",
        payload
      );
    },
    async loadItineraries(newPayload = {}) {
      const payload = {
        ...this.payload,
        ...newPayload,
      };
      return await this.$store
        .dispatch("itinerary/list", adapters.adaptPayloadToGetQuotes(payload))
        .catch((error) => {
          throw error;
        });
    },
  },
};
</script>
