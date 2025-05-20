<template>
  <div class="is-flex ml-2">
    <div style="width: 100%">
      <div class="card__booking__status mb-6">
        <h2>Booking Status</h2>
        <PhasesProgress :steps="helpers.getQuoteStatusPhases(quoteStatus)" />
      </div>
      <BookContent
        :loading="loading"
        :loadServicesItinerary="loadServicesItinerary"
        @updateLoading="updateLoading"
      />
    </div>
  </div>
</template>

<script>
import helpers from "@/helpers";
import BookContent from "@/components/quote-views/book/BookContent.vue";
import { mapGetters } from "vuex";
import PhasesProgress from "@/components/_shared/PhasesProgress.vue";
import { helper } from "@/utils/itinerary";

export default {
  name: "BookView",
  components: {
    BookContent,
    PhasesProgress,
  },
  props: {
    loadItinerary: {
      type: Function,
      default: () => {},
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    loadPublishedItinerary: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      loadingText: "Loading content, please wait...",
      payload: {
        from: null,
        to: null,
        id: null,
      },
      helpers: {
        ...helper,
      },
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
      prices_itinerary: "itinerary/getPricesItineraries",
      quoteStatus: "itinerary/getItineraryStatus",
    }),
    backgroundImage() {
      return helpers.backgroundImage(
        "https://305c511294116d47a2eb-8984c8bf4382d773df005374b9639769.ssl.cf2.rackcdn.com/itereo/ttc/background_app.jpg"
      );
    },
    info() {
      return {
        currencies: this.currencies,
        language: this.language,
        clients: this.clients,
        client_contracts: this.client_contracts,
        itinerary: this.itinerary,
        services: this.services,
        services_itinerary: this.services_itinerary,
      };
    },
  },
  methods: {
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) {
        this.setLoadingText("Loading content, please wait...");
      }
    },
    setLoadingText(value) {
      this.$store.dispatch("utils/setLoadingText", value);
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
    async loadItineraryByRouteQuery() {
      this.loading = true;
      await this.loadItinerary();
      await this.loadPublishedItinerary();
      await this.addInfoToPayload();
      await this.loadServicesItinerary(this.payload);
      this.loading = false;
    },
    async loadWithOutItinerary() {
      this.loading = true;
      this.addInfoToPayload();
      await this.loadServicesItinerary(this.payload);
      this.loading = false;
    },
    updateLoading(value) {
      this.loading = value;
    },
  },
  beforeMount() {
    if (this.$route.query.itinerary && !this.info.itinerary.data) {
      this.loadItineraryByRouteQuery();
    } else {
      this.loadWithOutItinerary();
    }
  },
};
</script>

<style>
.card__booking__status {
  padding: 2rem;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
  border-radius: 0.75rem;
  background-color: #fff;
}
.card__booking__status h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
@media screen and (max-width: 480px) {
  .card__booking__status {
    padding: 1rem;
  }
}
</style>
