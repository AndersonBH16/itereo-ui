<template>
  <PageWrapper>
    <Loading :loading="loading" :loadingText="loadingText" />
    <NavbarMain />
    <h2 class="is-h2 mb-5">
      <strong>Destinations</strong>
    </h2>
    <DestinationsSkeleton
      v-if="loading"
      :isLoading="loading"
      :cardsNumber="cardsToDisplay"
    />
    <div v-else class="grid">
      <Card
        v-for="destination in destinationsWithAssets"
        :key="destination.country.id"
        :destination="destination"
        :destination-image="destination.asset"
      />
    </div>
  </PageWrapper>
</template>

<script>
import PageWrapper from "@/components/_shared/PageWrapper.vue";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import Loading from "@/components/_shared/Loading.vue";
import Card from "@/components/destinations/Card.vue";
import DestinationsSkeleton from "@/components/destinations/DestinationsSkeleton.vue";
import { mapGetters } from "vuex";
import { PATH_INFO } from "@/router/path";
import { helper } from "../utils/itinerary";
import { DESTINATIONS_WITH_FIXED_IMAGES } from "../constants/itinerary";

export default {
  name: "Destinations",
  components: {
    PageWrapper,
    NavbarMain,
    Loading,
    Card,
    DestinationsSkeleton,
  },
  data() {
    return {
      displayWidth: 0,
      preview: null,
      showModal: false,
      paths: { ...PATH_INFO },
    };
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      destinations: "itinerary/getItineraryDestinations",
      clients: "client/getClients",
    }),
    cardsToDisplay() {
      return this.displayWidth >= 1350 ? 12 : 8;
    },
    destinationsWithAssets() {
      return this.destinations.map((destination) => {
        const destinationFound = DESTINATIONS_WITH_FIXED_IMAGES.find(
          (item) => item.id === destination.country.id
        );
        return {
          ...destination,
          asset: {
            ...destination.asset,
            fullpath:
              destinationFound !== undefined
                ? destinationFound?.asset
                : destination?.asset.fullpath,
            thumbnail_350X240:
              destinationFound !== undefined
                ? destinationFound?.asset
                : destination?.asset.thumbnail_350X240,
            thumbnail_1200X725:
              destinationFound !== undefined
                ? destinationFound?.asset
                : destination?.asset.thumbnail_1200X725,
            thumbnail_1600X900:
              destinationFound !== undefined
                ? destinationFound?.asset
                : destination?.asset.thumbnail_1600X900,
          },
        };
      });
    },
  },
  methods: {
    updateDisplaySize() {
      this.displayWidth = window.innerWidth;
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
    async getDestinations() {
      return this.$store.dispatch("itinerary/listItineraryDestinations");
    },
    async initialLoad() {
      this.setLoading(true);
      await this.getDestinations();
      helper.resetPageTitle();
      this.setLoading(false);
    },
  },
  mounted() {
    this.updateDisplaySize();
    this.initialLoad();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateDisplaySize);
  },
  beforeRouteEnter(to, from, next) {
    if (to.path === PATH_INFO.ITINERARIES_OLD.path) {
      next({ path: PATH_INFO.ITINERARIES.path });
    } else {
      next();
    }
  },
};
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-gap: 2rem;
  grid-auto-rows: minmax(100px, auto);
}
</style>
