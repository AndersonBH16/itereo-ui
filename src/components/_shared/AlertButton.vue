<template>
  <b-tooltip :label="label" type="is-warning">
    <button class="button" style="font-size: 0.7rem" @click="onButtonClick">
      Now
      <span class="has-text-weight-bold">{{ text }}</span>
      <IconChange
        class="ml-2 heartIcon"
        style="width: 0.8rem; height: 0.8rem"
      />
      <IconWarning
        class="icon__warning"
        style="width: 0.8rem; height: 0.8rem"
      />
    </button>
  </b-tooltip>
</template>
<script>
export default {
  name: "AlertButton",
  props: {
    text: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    onButtonClick: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
<style scoped>
.button {
  cursor: pointer;
  border: none;
  background-color: #ffd43d;
  color: #444444;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  text-wrap: nowrap;
}
svg.icon__warning {
  position: absolute;
  top: -0.5rem;
  right: -0.4rem;
  color: #444444;
  z-index: 2;
}
</style>
