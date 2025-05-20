<template>
  <b-field>
    <button
      v-on="$listeners"
      v-bind="$attrs"
      :class="[
        action === 'secondary'
          ? 'secondary'
          : action === 'tercery'
          ? 'tercery'
          : action === 'turquose'
          ? 'turquose'
          : action === 'green'
          ? 'green'
          : action === 'turquose-secondary'
          ? 'turquose-secondary'
          : action === 'tercery-secondary'
          ? 'tercery-secondary'
          : action === 'blue'
          ? 'blue'
          : action === 'blue-secondary'
          ? 'blue-secondary'
          : action === 'red'
          ? 'red'
          : action === 'red-secondary'
          ? 'red-secondary'
          : action === 'outline'
          ? 'outline'
          : action === 'outline-gray'
          ? 'outline-gray'
          : action === 'outline-secondary'
          ? 'outline-secondary'
          : 'principal',
        ,
        buttonClass ? buttonClass : '',
        'base-button',
        size === 'xlarge'
          ? 'xlarge'
          : size === 'large'
          ? 'large'
          : size === 'medium'
          ? 'medium'
          : 'small',
      ]"
      :disabled="loading || disabled"
    >
      <div class="icon-button">
        <slot name="icon" />
      </div>
      <slot name="text" />
      <clip-loader
        :loading="loading"
        :color="
          action === 'secondary' || action === 'turquose-secondary'
            ? '#348abf'
            : 'white'
        "
        size="20px"
      ></clip-loader>
    </button>
  </b-field>
</template>

<script>
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

export default {
  name: "BaseButton",
  inheritAttrs: false,
  components: {
    ClipLoader,
  },
  props: {
    buttonClass: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: "principal",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateValue() {
      this.$emit("input", this.value);
    },
  },
};
</script>

<style scoped>
.base-button {
  border-radius: 40px !important;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
}
.base-button .v-spinner {
  padding-left: 10px;
  display: flex;
}
.base-button:hover,
.base-button:focus {
  background-position: 100% 0;
  moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}
.base-button.principal {
  background: #ff9316;
  border: 1px solid #ff9316;
  color: white;
}
.base-button.principal:hover {
  background: #ffab3d;
  border: 1px solid #ffab3d;
  color: white;
  box-shadow: 0px 4px 4px -2px rgba(253, 86, 49, 0.1),
    0px 6px 12px -2px rgba(253, 86, 49, 0.4);
}
.base-button.secondary {
  background: #ffffff;
  color: var(--dark-text);
  border: 1px solid #f3f3f3;
}
.base-button.secondary:hover {
  background: #f3f3f3;
  box-shadow: 0px 2px 8px -4px rgba(0, 27, 56, 0.1),
    0px 4px 16px rgba(0, 27, 56, 0.1);
}
.base-button.tercery {
  background: #f00b81;
  border: 1px solid #f00b81;
  color: white;
}
.base-button.tercery:hover {
  background: #ffab3d;
  border: 1px solid #ffab3d;
  color: white;
  box-shadow: 0px 4px 4px -2px rgba(253, 86, 49, 0.1),
    0px 6px 12px -2px rgba(253, 86, 49, 0.4);
}
.base-button.turquose {
  background: var(--info-color);
  border: 1px solid var(--info-color);
  color: white;
}
.base-button.turquose:hover {
  background: white;
  border: 1px solid var(--info-color);
  color: var(--info-color);
}
.base-button.turquose-secondary {
  background: white;
  border: 1px solid var(--info-color);
  color: var(--info-color);
}
.base-button.turquose-secondary:hover {
  background: #eaeaef;
  color: var(--info-color);
}
.base-button.blue {
  background: var(--info-color);
  border: 1px solid var(--info-color);
  color: white;
}
.base-button.blue:hover {
  background: white;
  border: 2px solid var(--info-color);
  color: var(--info-color);
}
.base-button.green {
  background: var(--success-color);
  border: 1px solid var(--success-color);
  color: white;
}
.base-button.green:hover {
  background: var(--success-color);
  border: 1px solid var(--success-color);
  color: white;
}
.base-button.red {
  background: #a80000;
  border: 1px solid #a80000;
  color: white;
}
.base-button.red:hover {
  background: white;
  border: 2px solid #a80000;
  color: #a80000;
}
.base-button.red-secondary {
  background: white;
  border: 1px solid #a80000;
  color: #a80000;
}
.base-button.red-secondary:hover {
  background: #eaeaef;
  color: #a80000;
}
.base-button.outline {
  background: transparent;
  border: 2px solid white;
  color: white;
}
.base-button.outline:hover {
  background: white;
  color: #000;
}
.base-button.outline-secondary {
  background-color: transparent;
  border: 2px solid #f00b81;
  color: #f00b81;
  border-radius: 0.8rem !important;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.base-button.outline-secondary:hover {
  background-color: #f00b81;
  color: white;
}
.base-button.xlarge {
  font-size: 20px;
  line-height: 30px;
  font-weight: bold;
  padding: 1rem;
}
.base-button.large {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  padding: 0.3rem 1rem;
}
.base-button.medium {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  width: max-content;
  min-height: 2.1rem;
}
.base-button.small {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  width: max-content;
}
.base-button .icon-button {
  margin-right: 0.5em;
}
button[disabled] {
  opacity: 0.7 !important;
  pointer-events: none;
  cursor: not-allowed;
}
.base-button.outline-gray {
  background-color: transparent;
  border: 1px solid #aeaeae;
  color: #363636;
  font-weight: 500;
  border-radius: 1rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.base-button.outline-gray:hover {
  background-color: #fff;
  color: #363636;
}
</style>
