<template>
  <div :class="`baseDatePickerContainer ${isNotValid ? 'is-danger' : ''}`">
    <label v-if="label" class="label">{{ label }}</label>
    <b-form-datepicker
      :placeholder="placeholder"
      :disabled="disabled"
      icon="calendar-today"
      locale="en"
      v-model="value"
      @input="updateValue"
      :date-format-options="{
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        weekday: 'short',
      }"
      :class="[
        size === 'large'
          ? 'base-datePicker large'
          : size === 'medium'
          ? 'base-datePicker medium'
          : 'base-datePicker small',
      ]"
      :min="min"
      :max="max"
      :unselectable-dates="unselectableDates"
      :unselectable-days-of-week="unselectableDaysOfWeek"
      :events="events"
      :indicators="indicators"
      v-bind="$attrs"
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
    size: {
      type: String,
      default: "large",
    },
    value: {
      type: [String, Number, Array, Date],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    min: {
      type: [String, Date],
      default: "",
    },
    max: {
      type: [String, Date],
      default: "",
    },
    unselectableDates: {
      type: [String, Date, Array],
      default: "",
    },
    unselectableDaysOfWeek: {
      type: [String, Date, Array],
      default: "",
    },
    events: {
      default: "",
    },
    indicators: {
      type: String,
      default: "",
    },
    isNotValid: {
      type: Boolean,
      default: true,
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
.baseDatePickerContainer {
  display: flex;
  flex-direction: column;
}
.baseDatePickerContainer .label {
  margin-bottom: 0.5em;
  font-size: 1em;
}

.is-danger label {
  color: #f14668;
}

.is-danger .b-form-datepicker.base-datePicker.form-control {
  border: 1.5px solid #f14668 !important;
}
</style>
