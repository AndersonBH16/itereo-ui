<template>
  <draggable
    v-bind="dragOptions"
    :list="[]"
    id="modulesPlaceholder"
    class="draggable_placeholder"
    group="people"
    @change="addItemAtTheEnd"
  >
  </draggable>
</template>
<script>
import draggable from "vuedraggable";

export default {
  name: "ItineraryModulePlaceholder",
  components: {
    draggable,
  },
  props: {
    addItemAtTheEnd: {
      type: Function,
      default: () => {},
    },
    dragOptions: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<style scoped>
.draggable_placeholder {
  background: rgba(87, 106, 213, 0.05);
  border: 1px dashed #1d3b83;
  border-radius: 0.75rem;
  position: relative;
  height: 10rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  & > div {
    width: 100%;
    z-index: 9;
  }
}
.draggable_placeholder::after {
  content: "Drop a day here to add to the itinerary";
  display: inline-block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) !important;
  max-width: 16rem;
}
</style>
