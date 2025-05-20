<template>
  <div class="sticky-searchform">
    <GlobalEvents @keydown.alt.83="keymap" />
    <div class="column px-0 pt-0">
      <h2 class="is-h2"><strong>Search</strong></h2>
      <small class="small">Services</small>
    </div>
    <div class="table-box">
      <BaseInput
        size="large"
        placeholder="Search"
        :value="searchServicesPayload.code || ''"
        @keyup.native.enter="sendToSearch"
        type="search"
        @input="updateSearchServicesPayload('code', $event)"
        :class="focusedGuideBoxClass('field', 15, false)"
      />
      <BaseSelect
        label="Type"
        :list="[{ id: '', name: 'All' }, ...services_types]"
        optionValue="id"
        optionText="name"
        :value="searchServicesPayload.id_service_type || ''"
        placeholder="Select Type"
        @input="updateSearchServicesPayload('id_service_type', $event)"
        :class="focusedGuideBoxClass('field', 16, true)"
      />
      <BaseSelect
        label="Country"
        :list="serviceCountriesOptions"
        optionValue="location_name"
        :customText="destinationText"
        :value="searchServicesPayload.country || ''"
        placeholder="Select Country"
        @input="
          resetAndGetDestinationPerCountry($event);
          updateSearchServicesPayload('country', $event);
        "
        :class="focusedGuideBoxClass('field', 17, true)"
      />
      <BaseSelect
        label="Destination"
        :list="destinations"
        optionValue="location_code"
        :customText="destinationText"
        :value="searchServicesPayload.location || ''"
        placeholder="Select Destination"
        @input="updateSearchServicesPayload('location', $event)"
        :class="focusedGuideBoxClass('field', 18, true)"
      />
      <b-field label="Category" class="header_select" style="width: 100%">
        <multiselect
          :value="searchServicesPayload.unformattedCategory"
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
            (event) => {
              updateSearchServicesPayload('unformattedCategory', event);
              updateSearchServicesPayload(
                'category',
                event.map((tag) => tag.acronym).join(',')
              );
            }
          "
          :disabled="servicesTags.length === 0"
        >
        </multiselect>
      </b-field>
      <BaseDatePicker
        label="Range Date"
        placeholder="From"
        v-model="searchServicesFrom"
        size="large"
        class="mb-2"
        :class="
          focusedGuideBoxClass('mb-2 search_services_form_datepicker', 19, true)
        "
        :isNotValid="false"
      />
      <BaseDatePicker
        placeholder="To"
        v-model="searchServicesTo"
        size="medium"
        :class="
          focusedGuideBoxClass('mb-4 search_services_form_datepicker', 19, true)
        "
        :isNotValid="false"
      />
      <BaseButton
        size="large"
        @click="
          nextStep();
          sendToSearch();
        "
        action="principal"
        :class="focusedGuideBoxClass('', 20)"
      >
        <IconSearch slot="icon" class="icon is-small" />
        <p slot="text">Search</p>
      </BaseButton>
      <b-collapse class="" animation="slide" v-model="isOpen">
        <b-field label="Category">
          <b-select placeholder="Select Category" class="select-full">
          </b-select>
        </b-field>
        <b-field label="Paxs">
          <b-select
            placeholder="Select pax qty."
            class="select-full"
            icon="account"
          >
            <option v-for="pax in paxs" :value="pax" :key="pax">
              {{ pax }}
            </option>
          </b-select>
        </b-field>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GlobalEvents from "vue-global-events";
import Multiselect from "vue-multiselect";
import { SERVICE_TAGS_TYPES } from "@/constants/services";
import { serviceHelper } from "@/utils/service";

export default {
  name: "AddServicesModalSearchForm",
  components: {
    GlobalEvents,
    Multiselect,
  },
  data() {
    return {
      isOpen: false,
      paxs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      from: null,
      to: null,
      fields: {
        key: "destination",
        label: "Destination",
        type: "text",
        editable: false,
      },
      uuid: this.$route.query.itinerary,
    };
  },
  props: {
    handleSearchServicesContract: {
      type: Function,
      default: () => {},
    },
    getDestinationsPerCountry: {
      type: Function,
      default: () => {},
    },
    getServices: {
      type: Function,
      default: () => {},
    },
    updateSearchServicesPayload: {
      type: Function,
      default: () => {},
    },
    setLoading: {
      type: Function,
    },
  },
  methods: {
    destinationText(item) {
      return `${item.location_name}${
        item.location_code ? ` (${item.location_code})` : ""
      }`;
    },
    keymap(e) {
      e = e || window.event;
      const code = e.which || e.keyCode;
      switch (code) {
        case 83:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
    },
    async sendToSearch() {
      try {
        this.setLoading(true);
        if (
          new Date(this.searchServicesPayload.from) >
          new Date(this.searchServicesPayload.to)
        ) {
          this.updateSearchServicesPayload(
            "to",
            this.searchServicesPayload.from
          );
        }
        this.updateSearchServicesPayload("", "", {
          page: 1,
          limit: 10,
          info: 1,
          contract_user: this.itinerary.data.client.id,
          contract: this.itinerary.data.contract_id,
          calculate_prices: 1,
          num_pax: this.numPax,
        });
        const response = await this.getServices();
        if (response && response.data) {
          this.setLoading(false);
        }
      } catch (error) {
        this.setLoading(false);
        console.info(error);
        this.$buefy.toast.open({
          duration: 5000,
          message:
            error.response.data && error.response.data.message
              ? error.response.data.message
              : "Ups! An unexpected error has occurred, please try again!",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    resetAndGetDestinationPerCountry(e) {
      this.updateSearchServicesPayload("location", "");
      this.getDestinationsPerCountry(e);
    },
    focusedGuideBoxClass(classDefault, step, bgWhite = false) {
      const bgWhiteClass = bgWhite ? "bg-white" : "";
      const finalClass =
        this.isUserGuideActive && this.userGuideStep === step
          ? `${classDefault} is-guide-step ${bgWhiteClass}`
          : classDefault;
      return finalClass;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
  },
  computed: {
    sampleFormat() {
      const dtf = new Intl.DateTimeFormat(this.locale, { timezome: "UTC" });
      return dtf.format(new Date(2000, 11, 25, 12));
    },
    ...mapGetters({
      serviceCountriesOptions: "client/getCountriesFromContract",
      itinerary: "itinerary/getItinerary",
      destinations: "client/getFilteredDestinations",
      searchServicesPayload: "services/getSearchServicesPayload",
      services: "services/getServices",
      numPax: "itinerary/getNumPax",
      services_types: "service_types/list",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      servicesTags: "tags/getServicesTags",
    }),
    isAccommodationPackageServiceTypeSelected() {
      return serviceHelper.isAccommodationPackageService(
        this.searchServicesPayload.id_service_type
      );
    },
    filteredServicesTagsByServiceType() {
      return this.servicesTags.filter((serviceTag) => {
        if (this.searchServicesPayload.id_service_type === "") return true;
        if (this.isAccommodationPackageServiceTypeSelected)
          return [SERVICE_TAGS_TYPES.TOD, SERVICE_TAGS_TYPES.CAT_AC].includes(
            serviceTag.type
          );
        return ![SERVICE_TAGS_TYPES.TOD, SERVICE_TAGS_TYPES.CAT_AC].includes(
          serviceTag.type
        );
      });
    },
    searchServicesFrom: {
      get() {
        return this.searchServicesPayload.from;
      },
      set(value) {
        this.updateSearchServicesPayload("from", value);
      },
    },
    searchServicesTo: {
      get() {
        return this.searchServicesPayload.to;
      },
      set(value) {
        this.updateSearchServicesPayload("to", value);
      },
    },
    serviceDestinationsOptions() {
      return serviceHelper.formatDestinationsTextForServiceTable(
        this.destinations
      );
    },
  },
  updated() {
    if (
      (!this.searchServicesPayload.from || !this.searchServicesPayload.to) &&
      this.itinerary &&
      this.itinerary.data
    ) {
      this.updateSearchServicesPayload(
        "from",
        this.itinerary.data ? this.itinerary.data.start_date : null
      );
      this.updateSearchServicesPayload(
        "to",
        this.itinerary.data
          ? this.itinerary.data.end_date >= this.itinerary.data.start_date
            ? this.itinerary.data.end_date
            : this.itinerary.data.start_date
          : null
      );
    } else if (
      this.searchServicesPayload.from &&
      this.searchServicesPayload.to &&
      this.searchServicesPayload.from > this.searchServicesPayload.to
    ) {
      this.updateSearchServicesPayload("to", this.searchServicesPayload.from);
    }
  },
};
</script>

<style>
.select-full.selectDestination {
  height: 2.5em;
  font-size: 14px !important;
  line-height: 0.9;
  padding-left: 6px;
}
.select-full.selectDestination.ui.selection.dropdown .dropdown.icon {
  font-size: 16px !important;
  top: 50% !important;
}
.sticky-searchform .table-box .field {
  margin-bottom: 0.8rem;
}
.field.range-date .field-body .field.has-addons {
  display: flex;
  flex-direction: row !important;
  margin-bottom: 0 !important;
}
.range-date .field-body {
  border-radius: 15px;
  flex-direction: row;
}
.range-date .label {
  font-size: 1em;
}
.range-date .b-form-datepicker {
  padding: 0.1em !important;
}
.range-date .field-body .form-control {
  padding: 0.5em 0 0.5em 0.2em;
  margin: 0 !important;
  font-weight: 400 !important;
}
.field.date_to .dropdown-menu.show {
  left: -130px !important;
}
.search_services_form_datepicker .dropdown-menu.show[role="dialog"] {
  transform: none !important;
  transform: translateX(74%) !important;
  top: 0 !important;
  left: 0 !important;
}
</style>
