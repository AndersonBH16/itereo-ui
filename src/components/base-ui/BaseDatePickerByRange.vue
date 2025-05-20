<template>
  <div class="datepicker_range_container">
    <b-datepicker
      inline
      placeholder="Select a date..."
      size="is-small"
      v-model="valueFormatted"
      v-bind="$attrs"
    >
    </b-datepicker>
  </div>
</template>

<script>
export default {
  name: "BaseDatePickerByRange",
  inheritAttrs: false,
  props: {
    value: {
      type: [Array, Date],
      default: () => [],
    },
  },
  computed: {
    valueFormatted: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style scoped>
.datepicker_range_container
  :is(.dropdown-menu, .dropdown-menu:hover, .dropdown-item, .dropdown-item:hover) {
  background-color: #fff;
  font-size: 0.7rem;
}
.datepicker_range_container
  .datepicker
  .datepicker-table
  .datepicker-body
  .datepicker-cell.is-selected {
  background-color: #1d3b83;
  color: #fff;
  margin: 0;
}
</style>
