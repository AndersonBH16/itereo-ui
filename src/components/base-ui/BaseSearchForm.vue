<template>
  <section class="table-box">
    <b-field>
      <b-input
        placeholder="Search"
        type="search"
        icon="magnify"
        icon-clickable
        @icon-click="searchIconClick"
        class="search-bg"
      >
      </b-input>
    </b-field>
    <b-field label="Travel date">
      <b-datepicker
        placeholder="Select travel date"
        icon="calendar-today"
        :locale="locale"
        editable
      >
      </b-datepicker>
    </b-field>
    <b-field label="Sales Manual">
      <b-select placeholder="Select sales manual" class="select-full">
        <option v-for="option in data" :value="option.id" :key="option.id">
          {{ option.pax }}
        </option>
      </b-select>
    </b-field>
    <b-field label="Paxs">
      <b-select
        placeholder="Select pax qty."
        class="select-full"
        icon="account"
      >
        <option v-for="option in data" :value="option.id" :key="option.id">
          {{ option.pax }}
        </option>
      </b-select>
    </b-field>
    <b-field label="Status">
      <b-select placeholder="Select a status" class="select-full">
        <option value="">Enabled</option>
        <option value="">Disabled</option>
      </b-select>
    </b-field>
  </section>
</template>

<script>
export default {
  name: "BaseSearchForm",
  data() {
    const data = [
      { pax: 1 },
      { pax: 2 },
      { pax: 4 },
      { pax: 5 },
      { pax: 6 },
      { pax: 7 },
      { pax: 8 },
      { pax: 9 },
      { pax: 10 },
    ];
    return {
      data,
    };
  },
  methods: {
    searchIconClick() {
      alert("Search Quote");
    },
  },
  computed: {
    sampleFormat() {
      const dtf = new Intl.DateTimeFormat(this.locale, { timezome: "UTC" });
      return dtf.format(new Date(2000, 11, 25, 12));
    },
  },
};
</script>
