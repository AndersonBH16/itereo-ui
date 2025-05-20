<template>
  <div class="columns">
    <div class="column">
      <ItineraryDescription
        :setLoading="setLoading"
        :toggleIsAddingModules="toggleIsAddingModules"
        :loadItinerary="loadItinerary"
        :autocomplete="canAutocomplete"
      />
      <ItineraryDay
        v-if="!loadingSkeleton && totalItineraryDays > 0"
        :itineraryDays="itineraryDays"
        :currentContractLocations="currentContractLocations"
        :services_itinerary="services_itinerary"
        :setLoading="setLoading"
        :loadServicesItinerary="loadServicesItinerary"
        :loadItinerary="loadItinerary"
        :loadItineraryDays="loadItineraryDays"
        :class="focusedGuideBoxClass('', 34)"
        :validateFunctionExecution="validateFunctionExecution"
        :autocomplete="canAutocomplete"
        :updateDaysEditedList="updateDaysEditedList"
      />
      <ItineraryDayEmpty
        v-if="itineraryDays.length === 0 && !loadingSkeleton"
        :services_itinerary="services_itinerary"
        :setLoading="setLoading"
        :handleCreateDays="handleCreateDays"
        :loadItineraryDays="loadItineraryDays"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ItineraryDay from "@/components/quote-views/itinerary/ItineraryDay.vue";
import ItineraryDescription from "@/components/quote-views/itinerary/ItineraryDescription.vue";
import ItineraryDayEmpty from "@/components/quote-views/itinerary/ItineraryDayEmpty.vue";
import { DEFAULT_ALLOWED } from "@/constants";

export default {
  name: "ItineraryList",
  components: {
    ItineraryDay,
    ItineraryDescription,
    ItineraryDayEmpty,
  },
  props: {
    services_itinerary: {
      type: [Array, Object],
      default: () => [],
    },
    currentContractLocations: {
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
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    toggleIsAddingModules: {
      type: Function,
      default: () => {},
    },
    loadingSkeleton: {
      type: Boolean,
      default: false,
    },
    loadItinerary: {
      type: Function,
      default: () => {},
    },
    loadItineraryDays: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
    updateDaysEditedList: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      totalItineraryDays: "itineraryDays/getTotalItineraryDays",
      itineraryDays: "itineraryDays/getItineraryDays",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      authUser: "auth/getAuthUserData",
    }),
    canAutocomplete() {
      if (process.env.NODE_ENV !== "production") return true;

      const allowed = DEFAULT_ALLOWED.concat([
        "kcuba@ela.travel",
        "jstivelman@encounterlatinamerica.com",
        "jloaiza@encounterlatinamerica.com",
        "lquinapallo@encounterlatinamerica.com",
        "noyola@encounterlatinamerica.com",
        "peru-commercial2@ela.travel",
      ]);

      return allowed.includes(this.authUser.email);
    },
  },
  methods: {
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
