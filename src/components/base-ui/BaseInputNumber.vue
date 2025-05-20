<template>
  <div>
    <label class="label" v-if="label">{{ label }} </label>
    <b-numberinput
      v-bind="$attrs"
      :controls-position="controlsPosition"
      :size="size"
      :max="max"
      :min="min"
      :required="required"
      v-model="updatedValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="[
        size === 'large' ? 'large' : '',
        size === 'medium' ? 'medium' : '',
        size === 'xlarge' ? 'xlarge' : '',
        size === 'small' ? 'small' : '',
        size === 'thin' ? 'thin' : '',
      ]"
    ></b-numberinput>
  </div>
</template>

<script>
export default {
  name: "BaseInputNumber",
  inheritAttrs: false,

  props: {
    label: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "is-small",
    },
    max: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    required: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: Number,
    },
    controlsPosition: {
      type: String,
      default: "",
    },
  },
  computed: {
    updatedValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  methods: {
    updateValue() {
      this.$emit("input", this.value);
    },
  },
};
</script>

<style>
.control .button.is-primary {
  color: #404040;
  border: 1px solid #404040;
  background: white;
}
.control.minus .button.is-primary {
  border-bottom-left-radius: 5px !important;
  border-top-left-radius: 5px !important;
}
.control.plus .button.is-primary {
  border-bottom-right-radius: 5px !important;
  border-top-right-radius: 5px !important;
}
.control.is-clearfix {
  /* width: 2.5rem; */
}
.control.is-clearfix .input:focus,
.control.is-clearfix .input:hover {
  outline: none !important;
  color: var(--info-color) !important;
}
.control .button.is-primary:hover,
.control .button.is-primary:focus {
  color: white !important;
  /* border: 1px solid var(--info-color); */
  background: var(--info-color);
  outline: none !important;
}
.control .button.is-primary[disabled] {
  color: #8e8ea9 !important;
  background: #eaeaef !important;
  border: 1px solid #8e8ea9 !important;
  pointer-events: none !important;
  cursor: default !important;
}
</style>
