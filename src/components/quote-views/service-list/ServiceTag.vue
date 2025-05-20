<template>
  <span class="is-relative">
    <span :class="`service__tag service__tag__${type}`" style="max-width: 100%">
      <slot name="icon"></slot>
      <slot name="message"></slot>
    </span>
    <span class="service__tag__hover">
      {{ message }}
    </span>
  </span>
</template>
<script>
export default {
  name: "ServiceTag",
  props: {
    message: {
      type: String,
      default: "Tag",
    },
    type: {
      type: String,
      default: "normal",
    },
    icon: {
      type: String,
      default: "",
    },
  },
};
</script>
<style>
.service__tag {
  background-color: #d9d9d9;
  border-radius: 0.5rem;
  padding: 0.2rem;
  font-size: 0.6rem !important;
  display: inline-block;
  line-height: 0.6rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}
.service__tag__hover {
  position: absolute;
  opacity: 0;
  background-color: #363636;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  width: 0;
  display: none;
  overflow: hidden;
  font-size: 0.8rem;
  bottom: -1.5rem;
  text-wrap: nowrap;
  left: 0;
  z-index: 2;
  transition: opacity 0.3s ease, width 0.6s ease;
}
.service__tag:hover + .service__tag__hover {
  opacity: 1;
  width: auto;
  display: inline-block;
}
span.service__tag__warning {
  background-color: #f00b81;
  color: #fff;
  max-width: 100%;
  padding-right: 0.5rem;
}
span.service__tag__warning svg {
  width: 0.7rem;
  margin: 0 0.1rem;
}
.service__tag__warning + .service__tag__hover {
  background-color: #f00b81;
  color: #e7e7e7;
}
.service__tag__light {
  background-color: #fff;
  color: #363636;
}
.service__tag__light span {
  font-size: 0.6rem !important;
}
.service__tag__light path {
  fill: #363636;
}
.service__tag__dark {
  background-color: #363636;
  color: #fff;
}
.service__tag__dark span {
  font-size: 0.6rem !important;
}
.service__tag__dark path {
  fill: #fff;
}
</style>
