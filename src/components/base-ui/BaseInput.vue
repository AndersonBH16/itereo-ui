<template>
  <div :class="`base-input-container ${isNotValid ? 'is-danger' : ''}`">
    <label class="label" v-if="label">{{ label }} </label>
    <input
      v-bind="$attrs"
      :class="[
        customSize === 'large' ? 'large' : '',
        customSize === 'medium' ? 'medium' : '',
        customSize === 'xlarge' ? 'xlarge' : '',
        customSize === 'small' ? 'small' : '',
        customSize === 'thin' ? 'thin' : '',
        'base-input',
        value !== '' ? 'hideDangerIcon' : 'showDangerIcon',
      ]"
      :placeholder="placeholder"
      v-model="baseInputValue"
      :disabled="disabled"
      :type="type"
      :required="required"
      :max="max"
      :maxlength="maxlength"
    />
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
    },
    customText: {
      type: Function,
    },
    customSize: {
      type: String,
      default: "large",
    },
    value: {
      type: [String, Number],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text",
    },
    required: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 1000,
    },
    maxlength: {
      type: Number,
      default: 100,
    },
    isNotValid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    baseInputValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
};
</script>

<style scoped>
.base-input-container {
  display: flex;
  flex-direction: column;
}
.base-input-container .label {
  margin-bottom: 0.25em;
  font-size: 1em;
}
.control.has-icons-left .icon,
.control.has-icons-right .icon {
  display: none;
}
.help.is-danger {
  display: flex;
  flex-direction: column;
}
.help.is-danger:after {
  content: "This field is required";
  background: white;
  top: -1rem;
  position: relative;
  color: #f14668;
}
.base-input.large {
  line-height: 0.9;
}
/**Disabled */
[disabled].base-input {
  color: #8e8ea9 !important;
  background: #eaeaef !important;
  border: 1px solid #8e8ea9 !important;
}
/**Disabled */

.is-danger label {
  color: #f14668;
}

.is-danger input {
  border: 1.5px solid #f14668 !important;
}
</style>
