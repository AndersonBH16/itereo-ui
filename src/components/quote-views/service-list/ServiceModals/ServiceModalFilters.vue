<template>
  <div class="header">
    <b-field
      label="Country"
      class="header_select service_country__select"
      style="width: 30%"
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
          :value="serviceCountry.location_name"
          :key="serviceCountry.id"
        >
          {{ serviceCountry.location_name }}
        </option>
      </b-select>
    </b-field>

    <b-field
      label="Destination"
      class="header_select service_destination__select"
      style="width: 35%"
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
          :value="serviceDestination.location_code"
          :key="serviceDestination.id"
        >
          {{
            serviceDestination.location_code === ""
              ? "All"
              : serviceDestination.text
          }}
        </option>
      </b-select>
    </b-field>

    <b-field
      label="Service Type"
      class="header_select ml-2 service_type__select"
      style="width: 30%"
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

    <b-field label="Category" class="header_select" style="width: 100%">
      <multiselect
        v-model="searchPayload.serviceTags"
        :options="filteredServicesTagsByServiceType"
        :multiple="true"
        tag-position="top"
        :max-height="100"
        :close-on-select="true"
        :clear-on-select="false"
        :preserve-search="true"
        :allow-empty="true"
        placeholder="Select a category"
        track-by="name"
        label="name"
        @input="
          $emit('update:searchPayload', {
            ...searchPayload,
            serviceTags: $event,
            formattedServiceTags: $event.map((tag) => tag.acronym).join(','),
          })
        "
        :disabled="servicesTags.length === 0"
      >
      </multiselect>
    </b-field>
    <div class="search__container">
      <div class="input_search" style="width: 88%">
        <IconFilter class="icon is-small" />
        <input
          type="text"
          class="input"
          placeholder="Type service code, name ..."
          v-model="searchPayload.text"
          @input="
            $emit('update:searchPayload', {
              ...searchPayload,
              text: $event.target.value,
            })
          "
          ref="searchServiceInput"
          :data-test-id="
            constants.DATA_TEST_ID_VALUES
              .SELECT_SERVICE_MODAL_INPUT_SERVICE_SEARCH
          "
        />
      </div>
      <button
        class="button_search"
        @click="searchServicesByPayload"
        :data-test-id="constants.DATA_TEST_ID_VALUES.SEARCH_SERVICES_BUTTON"
      >
        <IconSearch slot="icon" class="icon is-small" style="width: 1.2rem" />
      </button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { serviceHelper } from "@/utils/service";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { SERVICE_TAGS_TYPES } from "@/constants/services";
import Multiselect from "vue-multiselect";

export default {
  name: "ServiceModalFilters",
  components: {
    Multiselect,
  },
  data() {
    return {
      constants: { DATA_TEST_ID_VALUES },
    };
  },
  props: {
    searchPayload: {
      type: Object,
      default: () => {},
    },
    searchServicesByPayload: {
      type: Function,
      default: () => {},
    },
    serviceTypesOptions: {
      type: Array,
      default: () => [],
    },
    getDestinationsPerCountry: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      serviceCountries: "client/getCountriesFromContract",
      destinations: "client/getFilteredDestinations",
      servicesTags: "tags/getServicesTags",
    }),
    serviceCountriesOptions() {
      return [{ id: "", location_name: "All" }, ...this.serviceCountries];
    },
    serviceDestinationsOptions() {
      return serviceHelper.formatDestinationsTextForServiceTable(
        this.destinations
      );
    },
    isAccommodationPackageServiceTypeSelected() {
      return serviceHelper.isAccommodationPackageService(
        this.searchPayload.serviceType
      );
    },
    filteredServicesTagsByServiceType() {
      return this.servicesTags.filter((serviceTag) => {
        if (this.searchPayload.serviceType === "") return true;
        if (this.isAccommodationPackageServiceTypeSelected)
          return [SERVICE_TAGS_TYPES.TOD, SERVICE_TAGS_TYPES.CAT_AC].includes(
            serviceTag.type
          );
        return ![SERVICE_TAGS_TYPES.TOD, SERVICE_TAGS_TYPES.CAT_AC].includes(
          serviceTag.type
        );
      });
    },
  },
  mounted() {
    this.focusInputSearch();
  },
  methods: {
    focusInputSearch() {
      setTimeout(() => {
        this.$refs.searchServiceInput.focus();
      }, 100);
    },
  },
};
</script>
<style scoped>
.header {
  position: relative;
  width: 100%;
  text-align: left;
  padding-bottom: 0.2rem;
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
.header .input_search {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
  border-bottom: 1px solid #f00b81;
}
.header .input_search .input {
  outline: none;
  border: none;
  border-radius: 0px;
  box-shadow: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  width: 18rem;
}
.header svg {
  color: #f00b81;
  width: 1.2rem;
  height: 1.2rem;
}
.button_search {
  background: #f00b81;
  border: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
}
.button_search :is(svg) {
  color: #fff;
}
.header_select.service_destination__select,
.header_select.service_country__select {
  margin-right: 0.5rem;
}
@media screen and (max-width: 480px) {
  .header .header_select {
    margin: 0 0 0.5rem 0;
  }
  .service_type__select {
    width: 100% !important;
    margin: 0 0 0.5rem 0 !important;
  }
  .service_country__select,
  .service_destination__select {
    width: 48% !important;
  }
  .service_destination__select {
    margin-left: 0.5rem !important;
  }
  .header .search__container {
    width: 100% !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .header .search__container .input_search {
    margin-top: 0;
    width: 85% !important;
  }
}
</style>
