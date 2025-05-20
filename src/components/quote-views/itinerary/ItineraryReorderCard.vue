<template>
  <div>
    <p
      style="
        text-align: left;
        font-weight: 600;
        position: absolute;
        top: 0.75rem;
        left: 1.2rem;
      "
    >
      Day {{ startDay }}
    </p>
    <div
      style="
        text-align: left;
        font-weight: 400;
        position: absolute;
        top: 0.75rem;
        left: 4.5rem;
      "
    >
      {{ dayLocations }}
    </div>
    <div class="nested__days__drag_container">
      <ItineraryModuleDay
        v-for="nestedDay in item.nestedDays"
        :key="nestedDay.id"
        :day="nestedDay"
        :highlight="item.isTemplateDay"
      />
    </div>
  </div>
</template>
<script>
import ItineraryModuleDay from "@/components/quote-views/itinerary/ItineraryModuleDay.vue";

export default {
  name: "ItineraryReorderCard",
  components: {
    ItineraryModuleDay,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    startDay: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    dayLocations() {
      return this.item.location
        .map((location) => location.location_name)
        .join(", ");
    },
  },
  methods: {
    getCardClass() {
      return {
        show: true,
        is__highlight: this.highlight,
      };
    },
  },
};
</script>
