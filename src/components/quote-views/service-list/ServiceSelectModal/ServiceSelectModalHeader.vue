<template>
  <div class="header">
    <h1 class="header_title">Selecting a service</h1>
    <b-field
      label="Country"
      class="header_select"
      style="width: 45%; margin-right: 1rem"
      :data-test-id="
        constants.DATA_TEST_ID_VALUES.SELECT_SERVICE_MODAL_SELECT_COUNTRY
      "
    >
      <b-select
        placeholder="Select a country"
        :value="searchPayload.country"
        @input="
          $emit('update:searchPayload', {
            ...searchPayload,
            country: $event,
            destination: 'All',
          });
          getDestinationsPerCountry($event);
        "
      >
        <option
          v-for="serviceCountry in serviceCountriesOptions"
          :value="serviceCountry.name"
          :key="serviceCountry.id"
        >
          {{ serviceCountry.name }}
        </option>
      </b-select>
    </b-field>
    <b-field
      label="Destination"
      class="header_select"
      style="width: 50%"
      :data-test-id="
        constants.DATA_TEST_ID_VALUES.SELECT_SERVICE_MODAL_SELECT_DESTINATION
      "
    >
      <b-select
        placeholder="Select a destination"
        :value="searchPayload.destination"
        :disabled="
          serviceDestinationsOptions.length === 0 ||
          searchPayload.country === 'All'
        "
        @input="
          $emit('update:searchPayload', {
            ...searchPayload,
            destination: $event,
          })
        "
      >
        <option
          v-for="serviceDestination in serviceDestinationsOptions"
          :value="serviceDestination.name"
          :key="serviceDestination.id"
        >
          {{
            serviceDestination.name === ""
              ? "All"
              : `${serviceDestination.name} - ${serviceDestination.label}`
          }}
        </option>
      </b-select>
    </b-field>
    <b-field
      label="Service Type"
      class="header_select"
      style="width: 84%"
      :data-test-id="
        constants.DATA_TEST_ID_VALUES.SELECT_SERVICE_MODAL_SELECT_SERVICE_TYPE
      "
    >
      <b-select
        placeholder="Select a service type"
        v-model="searchPayload.serviceType"
        @input="
          $emit('update:searchPayload', {
            ...searchPayload,
            serviceType: $event,
          })
        "
      >
        <option
          v-for="serviceType in serviceTypesOptions"
          :value="serviceType.id"
          :key="serviceType.id"
        >
          {{ serviceType.name }}
        </option>
      </b-select>
    </b-field>
    <button
      class="button_search"
      @click="searchServicesBySearchPayload"
      :data-test-id="constants.DATA_TEST_ID_VALUES.SEARCH_SERVICES_BUTTON"
    >
      <IconSearch slot="icon" class="icon is-small" />
    </button>
    <div class="input_search">
      <IconSearch class="icon is-small" />
      <input
        type="text"
        class="input"
        placeholder="Search for a service ..."
        @input="formatSearch"
        ref="searchServiceInput"
      />
    </div>
  </div>
</template>
<script>
import IconClose from "@/components/icons/IconClose.vue";
import IconSearch from "@/components/icons/IconSearch.vue";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "ServiceSelectModalHeader",
  components: {
    IconClose,
    IconSearch,
  },
  props: {
    searchPayload: {
      type: Object,
      default: () => {},
    },
    searchServicesBySearchPayload: {
      type: Function,
      default: () => {},
    },
    formatSearch: {
      type: Function,
      default: () => {},
    },
    serviceTypesOptions: {
      type: Array,
      default: () => [],
    },
    serviceCountriesOptions: {
      type: Array,
      default: () => [],
    },
    serviceDestinationsOptions: {
      type: Array,
      default: () => [],
    },
    getDestinationsPerCountry: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: { DATA_TEST_ID_VALUES },
    };
  },
};
</script>
<style>
.serviceselect_modal .header {
  position: relative;
  width: 100%;
  text-align: left;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid #f00b81;
}
.header_title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
}
.header .header_select {
  margin: 0.3rem 0;
  display: inline-block;
}
.header .header_select :is(label) {
  text-align: left;
  margin-left: 0.25rem;
  font-size: 0.65rem;
}
.header .header_select :is(.select, select) {
  font-size: 0.8rem;
  width: 100%;
  border-radius: 0.5rem;
}
.header .header_select :is(select:focus) {
  border-color: #f00b81;
  box-shadow: 0 0 0 0.125em #f00b8138;
}
.header .header_select .select::after {
  border-color: #f00b81;
}
.serviceselect_modal .header .input_search {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
}
.serviceselect_modal .header .input_search .input {
  outline: none;
  border: none;
  border-radius: 0px;
  box-shadow: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  width: 18rem;
}
.serviceselect_modal .header .btnClose {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
}
.serviceselect_modal .header .btnClose > svg {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: #b5b5b5;
}
.input_search svg {
  color: #f00b81;
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 0.5rem;
}
.button_search {
  background: #f00b81;
  border: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  margin-left: 1rem;
}
.button_search svg {
  color: #fff;
  width: 1rem;
  height: 1rem;
}
</style>
