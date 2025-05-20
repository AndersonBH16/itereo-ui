<template>
  <div class="is-flex">
    <div style="width: 100%">
      <div style="position: relative; min-height: 500px">
        <GuideBox
          title="Creating an itinerary"
          description="There are 2 ways to create an itinerary, the fastest one is based on the current services, for that click on 'Generate Itinerary'"
          :step="33"
          :positionX="360"
          :positionY="250"
          v-if="!loading"
          :showNextButton="false"
          :showBackButton="false"
        />
        <GuideBox
          title="Creating an itinerary"
          description="Well done!, you have created an itinerary based on your current services"
          :step="34"
          :positionX="360"
          :positionY="20"
          v-if="!loading"
          :showBackButton="false"
        />
        <GuideBox
          title="Editing your itinerary"
          description="You can also edit a day in your itinerary"
          :step="35"
          :positionX="360"
          :positionY="20"
          v-if="!loading"
        />
        <GuideBox
          title="Editing your itinerary"
          description="For that, click on the pencil icon on the top right corner of the day."
          :step="36"
          :positionX="650"
          :positionY="180"
          v-if="!loading"
          :showNextButton="false"
        />
        <GuideBox
          title="Editing your itinerary"
          description="Here, you can edit the day name, the photo, the location, etc"
          :step="37"
          :positionX="270"
          :positionY="20"
          v-if="!loading"
        />
        <GuideBox
          title="Editing your itinerary"
          description="Here, you can edit the day name"
          :step="38"
          :positionX="270"
          :positionY="80"
          v-if="!loading"
        />
        <GuideBox
          title="Editing your itinerary"
          description="Here, you can edit the day description"
          :step="40"
          :positionX="270"
          :positionY="160"
          v-if="!loading"
        />
        <GuideBox
          title="Editing your itinerary"
          description="You can also add a photo related to the day, for that click on the 'Add photo' button"
          :step="41"
          :positionX="270"
          :positionY="160"
          v-if="!loading"
          :showNextButton="false"
        />
        <GuideBox
          title="Editing your itinerary"
          description="The last step is click on the 'Save' button"
          :step="44"
          :positionX="730"
          :positionY="520"
          :showNextButton="false"
          :showBackButton="false"
          v-if="!loading"
        />
        <GuideBox
          title="Editing your itinerary"
          description="Congratulations, you have edited your itinerary successfully"
          :step="45"
          :showBackButton="false"
          v-if="!loading"
        />
        <GuideBox
          title="Editing the Weblink"
          description="Well, now it's time to edit the Weblink, for that click on 'Export'"
          :step="46"
          :positionX="20"
          :showNextButton="false"
          v-if="!loading"
        />
        <ItineraryModules
          v-if="isAddingModules"
          :itineraryDays="itineraryDays"
          :loadItinerary="loadItinerary"
          :setLoading="setLoading"
          :closeIsAddingModules="closeIsAddingModules"
          :loadItineraryDays="loadItineraryDays"
          :loadServicesItinerary="loadServicesItineraryWithLoading"
          :loadPricesItinerary="loadPricesItineraryWithLoading"
          :isAddingModules="isAddingModules"
        />
        <ItineraryList
          v-if="!getToggleReorderList"
          :loadingSkeleton="loadingSkeleton"
          :loadItinerary="loadItinerary"
          :loadServicesItinerary="loadServicesItineraryWithLoading"
          :loadItineraryDays="loadItineraryDays"
          :services_itinerary="services_itinerary"
          :setLoading="setLoading"
          :handleCreateDays="handleCreateDays"
          :toggleIsAddingModules="toggleIsAddingModules"
          :validateFunctionExecution="validateFunctionExecution"
          :updateDaysEditedList="updateDaysEditedList"
        />
        <Skeleton :loading="loadingSkeleton" />

        <b-modal
          v-model="isLeavingViewAlertOpen"
          has-modal-card
          trap-focus
          :destroy-on-hide="false"
          aria-role="dialog"
          aria-label="Example Modal"
          aria-modal
        >
          <template #default="props">
            <form action="">
              <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title"></p>
                  <button type="button" class="delete" @click="props.close" />
                </header>
                <section class="modal-card-body">
                  <div style="width: 25rem" class="has-text-centered">
                    <h2 class="title">Are you sure?</h2>
                    <p>
                      You have unsaved changes, are you sure you want to leave
                      this page?
                    </p>
                  </div>
                </section>
                <footer
                  class="modal-card-foot is-flex is-justify-content-center"
                >
                  <b-button
                    label="Cancel"
                    type="is-text"
                    @click="props.close"
                  />
                  <b-button
                    label="Yes, leave"
                    type="is-danger"
                    @click="confirmLeavingView"
                  />
                </footer>
              </div>
            </form>
          </template>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from "@/helpers";
import ItineraryList from "@/components/quote-views/itinerary/ItineraryList.vue";
import ItineraryModules from "../components/quote-views/itinerary/ItineraryModules.vue";
import Skeleton from "@/components/quote-views/itinerary/Skeleton.vue";
import GuideBox from "@/components/_shared/GuideBox.vue";
import { PATH_INFO } from "@/router/path";
import { mapGetters } from "vuex";

export default {
  name: "ItineraryView",
  props: {
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    loadPricesItinerary: {
      type: Function,
      default: () => {},
    },
    loadClientContracts: {
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
    loadItinerariesTags: {
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
      payload: {
        from: null,
        to: null,
        id: null,
      },
      loadingSkeleton: false,
      isAddingModules: false,
      isLeavingViewAlertOpen: false,
      daysEditedList: [],
      nextView: null,
    };
  },
  components: {
    ItineraryList,
    Skeleton,
    GuideBox,
    ItineraryModules,
  },
  computed: {
    ...mapGetters({
      countries: "client/getCountriesFromContract",
      getToggleReorderList: "itinerary/getToggleReorderList",
      clients: "client/getClients",
      itinerary: "itinerary/getItinerary",
      loading: "utils/getLoading",
      services_itinerary: "itinerary/getServicesItinerary",
      client_contracts: "client/getClientContracts",
      prices_itinerary: "itinerary/getPricesItineraries",
      itineraryDays: "itineraryDays/getItineraryDays",
      historyView: "utils/getHistoryView",
    }),
    backgroundImage() {
      return helpers.backgroundImage(
        "https://305c511294116d47a2eb-8984c8bf4382d773df005374b9639769.ssl.cf2.rackcdn.com/itereo/ttc/background_app.jpg"
      );
    },
    info() {
      return {
        clients: this.clients,
        client_contracts: this.client_contracts,
        itinerary: this.itinerary,
        services_itinerary: this.services_itinerary,
      };
    },
  },
  methods: {
    confirmLeavingView() {
      this.isLeavingViewAlertOpen = false;
      this.daysEditedList = [];
      this.$router.push(this.nextView);
    },
    updateDaysEditedList(day, addDay = true) {
      if (addDay) {
        this.daysEditedList.push(day);
      } else {
        this.daysEditedList = this.daysEditedList.filter(
          (d) => d.id !== day.id
        );
      }
    },
    toggleIsAddingModules() {
      this.isAddingModules = !this.isAddingModules;
    },
    closeIsAddingModules() {
      this.isAddingModules = false;
    },
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
    },
    handleCreateDays() {
      this.setLoading(true);
      const payload = {
        data: {
          itinerary_uuid: this.$route.query.itinerary,
        },
      };
      this.$store
        .dispatch("itineraryDays/generateItineraryDays", payload)
        .then(() => {
          this.setLoading(false);
          this.loadItineraryDays();
        })
        .catch((error) => {
          this.setLoading(false);
          throw error;
        });
    },
    loadData() {
      if (this.info.itinerary.data && this.$route.query.itinerary) {
        this.payload.id = this.$route.query.itinerary;

        this.payload.from = this.info.itinerary
          ? this.info.itinerary.data.start_date
          : null;

        this.payload.to = this.info.itinerary.data
          ? this.info.itinerary.data.end_date >=
            this.info.itinerary.data.start_date
            ? this.info.itinerary.data.end_date
            : this.info.itinerary.data.start_date
          : null;
      }
    },
    async loadOnlyItineraryData() {
      try {
        this.setLoading(true);
        this.loadingSkeleton = true;
        await Promise.allSettled([
          this.loadData(),
          this.loadServicesItineraryWithLoading(),
          this.loadItineraryDays(false),
          this.loadItinerariesTags(),
        ]);
        this.loadingSkeleton = false;
        this.setLoading(false);
      } catch (error) {
        this.loadingSkeleton = false;
        this.setLoading(false);
        console.error("Error:", error.message);
      }
    },
    async loadPricesItineraryWithLoading(reload = false) {
      if (this.$route.query.itinerary) {
        this.setLoading(true);
        await this.loadPricesItinerary(reload);
        this.setLoading(false);
      }
    },
    async loadServicesItineraryWithLoading(reload = false) {
      if (this.info.itinerary.data && this.$route.query.itinerary) {
        await this.loadServicesItinerary({ ...this.payload, reload });
      }
    },
    async loadItineraryByRouteQuery() {
      this.setLoading(true);
      this.loadingSkeleton = true;
      await this.loadItinerary();
      await this.makePostItineraryFetchs();
      this.loadingSkeleton = false;
      this.setLoading(false);
    },
    async makePostItineraryFetchs() {
      return await Promise.allSettled([
        this.loadData(),
        this.loadPublishedItinerary(),
        this.loadServicesItineraryWithLoading(),
        this.loadItineraryDays(false),
        this.loadClientContracts(this.info.itinerary.data.client.id),
        this.loadItinerariesTags(),
      ]).catch((err) => {
        console.info(err);
      });
    },
    async loadItineraryVersion(itineraryId) {
      this.setLoading(true);
      this.loadingSkeleton = true;
      if (!this.itinerary?.data?.id) {
        await this.$store.dispatch("itinerary/getItineraryVersion", {
          itineraryId: itineraryId,
          version: this.historyView.version,
        });
      }
      this.loadingSkeleton = false;
      this.setLoading(false);
    },
  },
  beforeMount() {
    this.$store.dispatch("utils/setHistoryView");
    if (this.historyView.isActive) {
      this.loadItineraryVersion(this.$route.query.itinerary);
      return;
    } else if (this.$route.query.itinerary && !this.itinerary.data) {
      this.loadItineraryByRouteQuery();
    } else if (!this.$route.query.itinerary && this.itinerary.data) {
      this.$router.push({
        path: PATH_INFO.ITINERARY.path,
        query: { itinerary: this.itinerary.data.id },
      });
      this.loadItineraryByRouteQuery();
    } else if (this.$route.query.itinerary && this.itinerary.data) {
      this.loadOnlyItineraryData();
    } else {
      // redirect to home when don't have itineray uuid in query
      this.$router.push({
        path: PATH_INFO.HOME.path,
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.daysEditedList.length > 0) {
      this.nextView = to;
      this.isLeavingViewAlertOpen = true;
      next(false);
    } else {
      next();
    }
  },
};
</script>
