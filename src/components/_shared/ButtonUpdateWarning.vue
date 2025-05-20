<template>
  <b-tooltip :label="tooltipText" type="is-warning" style="margin-left: 10px">
    <button
      class="new_room_price_button"
      @click="handleUpdate(ROW_KEY.NEW_PRICE_AVAILABLE, $event, props.row)"
    >
      Now
      <span class="has-text-weight-bold">{{ text }}</span>
      <IconChange class="ml-2 heartIcon" />
      <IconWarning class="icon__warning" style="width: 1rem; height: 1rem" />
    </button>
  </b-tooltip>
</template>
<script>
export default {
  name: "ButtonUpdateWarning",
  props: {
    text: {
      type: String,
      default: "",
    },
    tooltipText: {
      type: String,
      default: "",
    },
    handleClick: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
<style scoped>
.new_room_price_button {
  cursor: pointer;
  border: none;
  background-color: #ffd43d;
  color: #444444;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}
svg.icon__warning {
  position: absolute;
  top: -0.5rem;
  right: -0.4rem;
  color: #444444;
  z-index: 2;
}
</style>
