<template>
  <div class="columns p-5 ml-2 backgroundSecondary">
    <div class="column">
      <!-- <div v-if="isLoadingDays">
        <b-loading :is-full-page="false" v-model="isLoadingDays"></b-loading>
      </div> -->

      <ItineraryReorderList
        v-if="totalItineraryDays > 0 && !isLoadingDays"
        :data="itineraryDays"
        :selectedDay="selectedDay"
        :loadServicesItinerary="loadServicesItinerary"
        :setLoading="setLoading"
      />

      <div v-else>Empty list.</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ItineraryReorderList from "./ItineraryReorderList.vue";

export default {
  name: "ItineraryReorder",
  components: {
    ItineraryReorderList,
  },
  computed: {
    ...mapGetters({
      totalItineraryDays: "itineraryDays/getTotalItineraryDays",
      itineraryDays: "itineraryDays/getItineraryDays",
      isLoadingDays: "itineraryDays/isLoading",
      selectedDay: "itinerary/getSelectedDay",
    }),
  },
  props: {
    loadServicesItinerary: {
      type: Function,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
