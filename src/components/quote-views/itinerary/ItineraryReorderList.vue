<template>
  <section class="mb-6">
    <ItineraryReorderButtons
      :newDaysOrder="myArray"
      :loadServicesItinerary="loadServicesItinerary"
      :setLoading="setLoading"
    />

    <Draggable
      class="DraggableBox"
      v-model="myArray"
      :disabled="isSaving"
      @start="isDragging = true"
      @end="isDragging = false"
      v-bind="dragOptions"
    >
      <ItineraryReorderDays
        v-for="day in myArray"
        :key="day.id"
        :data="day"
        :selectedDay="selectedDay"
      />
    </Draggable>

    <ItineraryReorderButtons
      :newDaysOrder="myArray"
      :loadServicesItinerary="loadServicesItinerary"
      :setLoading="setLoading"
    />
  </section>
</template>

<script>
import ItineraryReorderButtons from "./ItineraryReorderButtons.vue";
import ItineraryReorderDays from "./ItineraryReorderDays.vue";

import Draggable from "vuedraggable";

export default {
  name: "ItineraryReorderList",
  components: {
    ItineraryReorderButtons,
    ItineraryReorderDays,
    Draggable,
  },
  data() {
    return {
      isSaving: false,
      isDragging: false,
      myArray: [],
    };
  },
  props: {
    data: {
      type: Array,
      require: true,
    },
    selectedDay: {
      // Day selected
      type: Object,
      required: false,
    },
    loadServicesItinerary: {
      type: Function,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  created() {
    this.myArray = this.data;
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        group: "itinerary",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0.6;
}
</style>
