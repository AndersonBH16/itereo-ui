<template>
  <div :class="`selectContainer ${isNotValid ? 'is-danger' : ''}`">
    <label v-if="label" class="label">{{ label }} </label>
    <model-list-select
      :class="[
        size === 'xl'
          ? 'base-select x-large'
          : size === 'large'
          ? 'base-select large'
          : size === 'medium'
          ? 'base-select medium'
          : size === 'xs'
          ? 'base-select xsmall'
          : size === 'auto'
          ? 'base-select auto'
          : 'base-select small',
        lock ? 'lock' : '',
      ]"
      :placeholder="placeholder"
      :list="list"
      :option-value="optionValue"
      :option-text="optionText"
      :custom-text="customText"
      v-model="baseSelectValue"
      :isDisabled="disabled"
      v-bind="$attrs"
    />
    <IconLock v-if="lock" class="icon lock lockselect" />
  </div>
</template>

<script>
import { ModelListSelect } from "vue-search-select";
export default {
  name: "BaseSelect",
  inheritAttrs: false,
  components: {
    ModelListSelect,
  },
  data() {
    return {
      valueFromProp: this.value,
    };
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      required: true,
    },
    optionValue: {
      type: String,
      required: true,
    },
    optionText: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    customText: {
      type: Function,
    },
    size: {
      type: String,
      default: "large",
    },
    value: {
      type: [String, Number, Object],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    lock: {
      type: Boolean,
      default: false,
    },
    listSelect: {
      type: Boolean,
      default: true,
    },
    isNotValid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    baseSelectValue: {
      get() {
        const value = this.valueFromProp ?? this.value;
        return value;
      },
      set(newValue) {
        this.$emit("input", newValue);
        this.valueFromProp = newValue;
      },
    },
  },
  watch: {
    value(newValue) {
      this.valueFromProp = newValue;
    },
  },
};
</script>

<style scoped>
.selectContainer {
  display: flex;
  flex-direction: column;
}
.selectContainer .label {
  margin-bottom: 0.25em;
  font-size: 1rem;
}

.is-danger label {
  color: #f14668;
}

.is-danger .ui.fluid.search.selection.dropdown.base-select {
  border: 1.5px solid #f14668 !important;
}
</style>
