<template>
  <div
    class="dotContainer"
    v-if="displayAlert"
    :style="customStyle"
    @click="onClick"
  >
    <b-tooltip
      v-if="tooltip.length > 0"
      :label="tooltip"
      :type="`is-${type}`"
      :position="tooltipPosition"
    >
      <span :class="`dotAlert ${type}`"></span>
    </b-tooltip>
    <span :class="`dotAlert ${type}`" v-else></span>
  </div>
</template>
<script>
export default {
  name: "CustomDotAlert",
  props: {
    tooltip: {
      type: String,
      default: "",
    },
    displayAlert: {
      type: Boolean,
      default: false,
    },
    customStyle: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "warning",
    },
    onClick: {
      type: Function,
      default: () => {},
    },
    tooltipPosition: {
      type: String,
      default: "is-right",
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
  left: 58%;
  top: -0.25rem;
}
.dotAlert {
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #ffd43d;
  animation: dotAlert 1s infinite ease-in-out;
}
.dotAlert.danger {
  background-color: #ff3860;
}
.dotAlert.default {
  background-color: #a2a5b9;
}
@keyframes dotAlert {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 212, 61, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 0 rgba(240, 11, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 212, 61, 0.4);
  }
}
</style>
