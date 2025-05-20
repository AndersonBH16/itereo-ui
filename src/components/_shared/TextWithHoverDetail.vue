<template>
  <div class="text_hover_container">
    <slot name="baseText"></slot>
    <span class="text_hover">{{ message }}</span>
  </div>
</template>
<script>
export default {
  name: "TextWithHoverDetail",
  props: {
    message: {
      type: String,
      default: "Tag",
    },
  },
};
</script>
<style>
.text_hover {
  position: absolute;
  opacity: 0;
  background-color: #363636;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  width: 0;
  display: none;
  overflow: hidden;
  transition: opacity 0.3s ease, width 0.6s ease;
}
.text_hover_container:hover .text_hover {
  opacity: 1;
  width: auto;
  display: inline-block;
  color: #fff;
  z-index: 9;
}
</style>
