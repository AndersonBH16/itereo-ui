<template>
  <section>
    <div class="is-relative">
      <img
        class="itineraryEmptyImg"
        src="/img/itineraryEmpty.png"
        alt="Itinerary Empty Image"
      />
      <div class="itineraryEmptyContainer">
        <div class="itineraryEmptyText">
          <div class="itineraryEmptyTitle mb-4">
            <p>Sorry we don't have any day to show you.</p>
            <br />
            <p v-if="!hideElementByCondition && !disableQuoteByStatus">
              Please <strong> Generate your itinerary</strong> based on your
              current<br />
              services or start an itinerary <strong>from scratch.</strong>
            </p>
          </div>
          <b-tooltip
            v-if="!hideElementByCondition && !disableQuoteByStatus"
            label="The days will be added from scratch"
            type="is-dark"
            position="is-bottom"
            :class="[disableQuoteByStatus ? 'disabled' : '']"
          >
            <BaseButton
              size="medium"
              @click="addADay"
              action="principal"
              :disabled="disableQuoteByStatus"
              class="mr-4"
            >
              <IconPlus slot="icon" class="icon is-small" />
              <p slot="text">Start from scratch</p>
            </BaseButton>
          </b-tooltip>
          <b-tooltip
            v-if="!hideElementByCondition && !disableQuoteByStatus"
            label="The days will be created based on the services"
            type="is-dark"
            position="is-bottom"
            :class="[disableQuoteByStatus ? 'disabled' : '']"
          >
            <BaseButton
              size="medium"
              :disabled="
                !this.services_itinerary.length ||
                !this.services_itinerary.filter((e) => e.id !== null).length ||
                disableQuoteByStatus
              "
              @click="
                handleCreateDays();
                nextStep();
              "
              action="tercery"
              :class="focusedGuideBoxClass('', 33)"
            >
              <IconPlus slot="icon" class="icon is-small" />
              <p slot="text">Generate Itinerary</p>
            </BaseButton>
          </b-tooltip>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ItineraryDayEmpty",
  data() {
    return {
      media: 3,
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      itineraryStatus: "itinerary/getItineraryStatus",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
    }),
  },
  props: {
    services_itinerary: {
      type: [Array, Object],
      default: () => [],
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    handleCreateDays: {
      type: Function,
    },
    loadItineraryDays: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    async loadItineraryDaysWithLoading() {
      this.setLoading(true);
      await this.loadItineraryDays(false);
      this.setLoading(false);
    },
    addADay() {
      const itinerary = this.itinerary.data;
      const startDate = itinerary.start_date;
      const data = [
        {
          id: null,
          duration: 1,
          title: {
            id: null,
            value: "Day added",
          },
          services: [],
          images: "",
          start_date: startDate,
          end_date: startDate,
          start_day: 1,
          description: {
            id: null,
            value: "Day added description",
          },
          location: [],
        },
      ];

      const payload = {
        uuid: this.$route.query.itinerary,
        data,
      };

      this.setLoading(true);
      this.$store
        .dispatch("itineraryDays/processItineraryDays", payload)
        .then(() => {
          this.setLoading(false);
          this.loadItineraryDaysWithLoading();
        })
        .catch((error) => {
          this.setLoading(false);
          throw error;
        });
    },
    focusedGuideBoxClass(classDefault, step, bgWhite = false) {
      const bgWhiteClass = bgWhite ? "bg-white" : "";
      return this.isUserGuideActive && this.userGuideStep === step
        ? `${classDefault} is-guide-step ${bgWhiteClass}`
        : classDefault;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
  },
};
</script>
