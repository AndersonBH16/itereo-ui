<template>
  <div class="is-relative">
    <slot name="baseText"></slot>
    <div class="dotContainer" v-if="displayAlert">
      <b-tooltip :label="tooltip" type="is-danger" position="is-right">
        <span class="dotAlert"></span>
      </b-tooltip>
    </div>
  </div>
</template>
<script>
export default {
  name: "DotAlert",
  props: {
    tooltip: {
      type: String,
      default: "",
    },
    displayAlert: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.b-tooltip {
  position: relative;
}
.dotContainer {
  position: absolute;
  top: 0.2rem;
  right: 0.5rem;
}
.dotAlert {
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #f00b81;
  animation: dotAlert 1s infinite ease-in-out;
}
@keyframes dotAlert {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(240, 11, 129, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 0 rgba(240, 11, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(240, 11, 129, 0.4);
  }
}
</style>
