<template>
  <section v-if="itineraryDays">
    <ItineraryInfoDay
      v-for="(data, index) in editableItineraryDays"
      :key="index"
      :index="index"
      :data="data"
      :services_itinerary="services_itinerary"
      :selected-day="selectedDay"
      :autocomplete="autocomplete"
      :setLoading="setLoading"
      :loadServicesItinerary="loadServicesItinerary"
      :loadItinerary="loadItinerary"
      :loadItineraryDays="loadItineraryDays"
      :validateFunctionExecution="validateFunctionExecution"
      :fetch-save-edit="fetchSaveEdit"
      :generating-days="generatingDays"
      :handle-autocomplete-day="autocompleteModal"
      :updateDaysEditedList="updateDaysEditedList"
    />
    <ItineraryDayAutocompleteModal
      :open="isDayAutocompleteModalOpen"
      :close-modal="() => (isDayAutocompleteModalOpen = false)"
      :day="selectedDay"
      :generated-day="generatedDay"
      :save-day="saveDay"
      :saving="savingDay"
    />
  </section>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
import { mapGetters } from "vuex";
import ItineraryInfoDay from "./ItineraryInfoDay.vue";
import ItineraryDayAutocompleteModal from "@/components/quote-views/itinerary/ItineraryDayAutocompleteModal.vue";

export default {
  name: "ItineraryDay",
  components: {
    ItineraryDayAutocompleteModal,
    ItineraryInfoDay,
  },
  data() {
    return {
      isDayAutocompleteModalOpen: false,
      selectedDay: null,
      generatedDay: null,
      generatingDays: false,
      savingDay: false,
    };
  },
  props: {
    itineraryDays: {
      type: Array,
      require: true,
    },
    services_itinerary: {
      type: [Array, Object],
      default: () => [],
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    autocomplete: {
      type: Boolean,
      default: false,
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
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
  methods: {
    async saveDay(generatedDay) {
      this.savingDay = true;
      const payload = {
        uuid: this.itinerary.data.id,
        data: [generatedDay],
      };
      await this.fetchSaveEdit(payload, 1, 1);
      this.savingDay = false;
      this.isDayAutocompleteModalOpen = false;
    },
    async fetchSaveEdit(payload = {}, cur_step = 0, last_step = 0) {
      try {
        await this.$store.dispatch("itineraryDays/processItineraryDays", {
          ...payload,
          cur_step,
          last_step,
        });
      } catch (error) {
        throw error;
      }
    },
    async autocompleteModal(day) {
      this.generatingDays = true;
      this.selectedDay = day;
      const results = await this.$store.dispatch("itineraryDays/generate", {
        id: this.itinerary.data.id,
        day: day.start_day,
      });
      this.isDayAutocompleteModalOpen = true;
      this.generatedDay = cloneDeep(
        results.find((result) => result.id === day.id)
      );
      this.generatingDays = false;
    },
    copyImgFullToImg() {
      const newItineraryDays = cloneDeep(this.itineraryDays);
      newItineraryDays.forEach((day) => {
        if (!day.images_full) return;
        day.images = Array.isArray(this.itineraryDays.images) ? day.images : [];
        day.images_full.forEach((imgFull) => {
          const imgFound = day.images.find((img) => img.id === imgFull.id);
          if (!imgFound) day.images.push(imgFull);
        });
      });
      this.$store.dispatch("itineraryDays/setItineraryDays", newItineraryDays);
    },
  },
  mounted() {
    this.copyImgFullToImg();
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
    }),
    editableItineraryDays() {
      return cloneDeep(this.itineraryDays);
    },
  },
};
</script>
