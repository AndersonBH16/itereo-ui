<template>
  <div class="quotes__search__form">
    <GlobalEvents @keydown.alt.83="keymap" />
    <div class="column px-0 py-0 is-flex is-justify-content-space-between">
      <div>
        <h2 class="is-h2">
          <strong>{{ formTitle }}</strong>
        </h2>
        <small class="small">Reservations</small>
      </div>
      <div class="quotes_search_form__toggle">
        <b-button @click="setQuotesSearchFormClass">
          <b-icon
            size="is-small"
            custom-size="mdi-24px"
            icon="filter"
            class="color-8 mt-1"
          ></b-icon>
        </b-button>
      </div>
    </div>
    <div :class="`searchFormQuote ${quotesSearchFormClass}`">
      <b-field label="Search" class="header_select" style="width: 100%">
        <Multiselect
          v-model="form.title"
          :options="[]"
          :multiple="true"
          :taggable="true"
          @tag="addSearchItem"
          tag-position="top"
          :max-height="200"
          :close-on-select="true"
          :clear-on-select="false"
          :preserve-search="true"
          :allow-empty="true"
          placeholder="Add a name or code"
          :disabled="form.title === 0"
          id="searchInput"
          @input="updateUrlWithForm"
          :data-test-id="
            constants.DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH
          "
        >
        </Multiselect>
      </b-field>

      <BaseSelect
        v-if="!hiddenControls.includes(constants.QUOTES_FILTERS.CLIENT)"
        label="Client"
        :list="[{ id: '', name: 'All' }, ...clients]"
        optionValue="id"
        optionText="name"
        placeholder="Select a client"
        :disabled="loading || localLoading"
        :value="form.client"
        @input="
          form.client = $event;
          updateUrlWithForm();
          focusSearchButton();
        "
        class="field"
      />
      <b-field
        v-if="!hiddenControls.includes(constants.QUOTES_FILTERS.COUNTRY)"
        label="Country"
      >
        <multiselect
          v-model="form.country"
          :options="[
            { id: '', location_name: 'All', location_code: 'All' },
            ...info.countries,
          ]"
          :multiple="true"
          tag-position="top"
          :max-height="100"
          :close-on-select="true"
          :clear-on-select="false"
          :preserve-search="true"
          :allow-empty="true"
          placeholder="Select a country"
          track-by="location_name"
          label="location_name"
          @input="
            (event) => {
              listDestinationsByCountry(event);
              updateUrlWithForm();
              focusSearchButton();
            }
          "
          :disabled="loading || info.countries.length === 0"
        >
        </multiselect>
      </b-field>
      <b-field label="Destination">
        <multiselect
          v-model="form.location"
          :options="[
            { id: '', location_name: 'All', location_code: 'All' },
            ...destinationsBySelectedCountries,
          ]"
          :multiple="true"
          tag-position="top"
          :max-height="100"
          :close-on-select="true"
          :clear-on-select="false"
          :preserve-search="true"
          :allow-empty="true"
          placeholder="Select a destination"
          track-by="location_name"
          label="location_name"
          @input="
            form.location = $event;
            updateUrlWithForm();
            focusSearchButton();
          "
          :disabled="
            loading ||
            destinationsBySelectedCountries.length === 0 ||
            form.country === ''
          "
        >
        </multiselect>
      </b-field>
      <b-field label="Range Date" class="range-date">
        <BaseDatePicker
          v-if="!hiddenControls.includes(constants.QUOTES_FILTERS.FROM)"
          placeholder="From"
          v-model="form.from"
          size="medium"
          class="field"
          :isNotValid="false"
        />
        <BaseDatePicker
          v-if="!hiddenControls.includes(constants.QUOTES_FILTERS.TO)"
          placeholder="To"
          v-model="form.to"
          size="medium"
          class="date_to field"
          :isNotValid="false"
        />
      </b-field>
      <BaseDatePicker
        v-if="!hiddenControls.includes(constants.QUOTES_FILTERS.CREATION)"
        label="Creation"
        v-model="form.creation"
        placeholder="Creation"
        class="field"
        :isNotValid="false"
      />
      <BaseSelect
        v-if="
          !hiddenControls.includes(
            constants.QUOTES_FILTERS.ITINERARY_TYPE_ID
          ) && displayItineraryTypes
        "
        label="Type"
        :list="itineraryTypesOptions"
        optionValue="id"
        optionText="name"
        placeholder="Select a type"
        :disabled="
          loading ||
          disabledControls.includes(constants.QUOTES_FILTERS.ITINERARY_TYPE_ID)
        "
        :value="form.itinerary_type_id"
        @input="
          form.itinerary_type_id = $event;
          updateForm({ ...form, itinerary_type_id: $event });
          updateUrlWithForm();
          focusSearchButton();
        "
        class="field"
        :data-test-id="constants.DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TYPE"
      />
      <BaseSelect
        v-if="!hiddenControls.includes(constants.QUOTES_FILTERS.STATUS)"
        label="Status"
        :list="[{ id: '', name: 'All' }, ...status_itinerary]"
        optionValue="id"
        optionText="name"
        placeholder="Select a status"
        :disabled="loading"
        :value="form.status"
        @input="
          form.status = $event;
          updateUrlWithForm();
          focusSearchButton();
        "
        class="field"
      />
      <b-field label="Tags">
        <multiselect
          v-model="form.tags"
          :options="info.tags"
          :multiple="true"
          tag-position="top"
          :max-height="100"
          :close-on-select="true"
          :clear-on-select="false"
          :preserve-search="true"
          :allow-empty="true"
          placeholder="Select a tags"
          track-by="name"
          label="name"
          @input="
            () => {
              updateUrlWithForm();
              focusSearchButton();
            }
          "
          :disabled="loading || info.tags.length === 0"
          :data-test-id="constants.DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TAGS"
        >
        </multiselect>
      </b-field>
      <div class="buttons-form-search">
        <BaseButton
          ref="searchQuotesButton"
          size="large"
          @click="handleSearchItineraries(form)"
          action="principal"
          :data-test-id="
            constants.DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH_BUTTON
          "
        >
          <IconSearch slot="icon" class="icon is-small" />
          <p slot="text">Search</p>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GlobalEvents from "vue-global-events";
import Multiselect from "vue-multiselect";
import { USER_ROLE } from "@/constants";
import helpers from "@/helpers";
import { helper } from "@/utils/itinerary";
import { getObjectWithDefinedKeys } from "@/utils/utils";
import {
  DEFAULT_SEARCH_QUOTES_PAYLOAD,
  QUOTES_FILTERS,
  QUOTES_SEARCH_PARAM_SEPARATOR_INTERSECTION,
  QUOTES_SEARCH_PARAM_SEPARATOR,
} from "@/constants/itinerary";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "QuoteSearchForm",
  components: {
    GlobalEvents,
    Multiselect,
  },
  props: {
    formTitle: {
      type: String,
      default: "Quotes",
    },
    itineraryTypes: {
      type: Array,
      default: () => helper.getItineraryTypesMapped(),
    },
    loadItineraries: {
      type: Function,
      default: () => {},
    },
    loadStatusesItinerary: {
      type: Function,
      default: () => {},
    },
    defaultForm: {
      type: Object,
      default: () => {},
    },
    hiddenControls: {
      type: Array,
      default: () => [],
    },
    disabledControls: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      from: null,
      to: null,
      creation: null,
      localLoading: false,
      constants: {
        QUOTES_FILTERS,
        DATA_TEST_ID_VALUES,
      },
      itineraryTypesOptions: [{ id: "", name: "All" }, ...this.itineraryTypes],
      quotesSearchFormClass: "",
    };
  },
  computed: {
    ...mapGetters({
      clients: "client/getClients",
      status_itinerary: "status_itinerary/getStatusesItinerary",
      countries: "locations/listCountry",
      destinations: "locations/listDestinations",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      authData: "auth/getAuthData",
      itineraryTags: "tags/getItinerariesTags",
    }),
    displayItineraryTypes() {
      return helpers.hasAnyRoles(this.authData.user, [USER_ROLE.ADMIN], true);
    },
    info() {
      return {
        countries: this.countries ?? [],
        destinations: this.destinations ?? [],
        tags: this.itineraryTags ?? [],
      };
    },
    destinationsBySelectedCountries() {
      if (!this.form.country || !this.form.country?.length) return [];
      const selectedCountriesIds = this.info.countries
        .filter((item) => this.form.country.includes(item))
        ?.map((item) => item.id);

      return this.info.destinations.filter((item) =>
        selectedCountriesIds.includes(item.parent)
      );
    },
    selectedCountries() {
      return this.form.country
        ?.filter((item) => item.location_code !== "All")
        ?.map((item) => item.location_code)
        ?.join(",");
    },
    selectedDestinations() {
      return this.form.location
        ?.filter((item) => item.location_code !== "All")
        ?.map((item) => item.location_code)
        ?.join(QUOTES_SEARCH_PARAM_SEPARATOR_INTERSECTION);
    },
    form: {
      get() {
        return this.defaultForm;
      },
      set(value) {
        this.$emit("update:updateDefaultForm", {
          ...DEFAULT_SEARCH_QUOTES_PAYLOAD,
          ...value,
        });
      },
    },
  },
  methods: {
    setQuotesSearchFormClass() {
      if (this.quotesSearchFormClass === "show") {
        this.quotesSearchFormClass = "";
      } else {
        this.quotesSearchFormClass = "show";
      }
    },
    updateForm(newValue) {
      this.$emit("update:updateDefaultForm", {
        ...DEFAULT_SEARCH_QUOTES_PAYLOAD,
        ...newValue,
      });
    },
    focusSearchButton() {
      this.$refs.searchQuotesButton.$el.querySelector("button").focus();
    },
    addSearchItem(newItem) {
      this.form.title.push(newItem);
      this.updateUrlWithForm();
      this.focusSearchButton();
    },
    async getCountriesSelectedAndDestinations() {
      const { query, params } = this.$route;
      const queryCountries =
        query.country?.length > 0 ? query.country : params.destination;
      const splittedCountries = queryCountries?.split(",");
      if (queryCountries === undefined || splittedCountries.length === 0) {
        return {
          selectedCountries: [],
          selectedDestinations: [],
        };
      }
      const parsedCountries = splittedCountries.map((item) =>
        item.replace("-", " ")
      );
      const countriesFound = this.countries.filter(
        (item) =>
          parsedCountries.includes(item.location_code) ||
          parsedCountries.includes(item.location_name.toLowerCase())
      );
      if (countriesFound.length === 0) {
        return {
          selectedCountries: [],
          selectedDestinations: [],
        };
      }

      await this.listDestinationsByCountry(countriesFound);

      const decodedDestinations = decodeURIComponent(query.destination || "");

      const selectedDestinations = decodedDestinations
        ?.split(QUOTES_SEARCH_PARAM_SEPARATOR_INTERSECTION)
        ?.filter((item) => item !== "")
        ?.map((item) =>
          this.destinations.find((dest) => dest.location_code === item)
        );

      return {
        selectedCountries: countriesFound,
        selectedDestinations,
      };
    },
    async fullfillFormWithUrl() {
      const { query } = this.$route;
      const { selectedCountries, selectedDestinations } =
        await this.getCountriesSelectedAndDestinations();

      const queryTags = query.tags?.split(",") ?? [];
      const tags = this.itineraryTags.filter((tag) =>
        queryTags.includes(String(tag.id))
      );

      const newForm = {
        title: query.search
          ?.split(QUOTES_SEARCH_PARAM_SEPARATOR)
          .filter((search) => search.length > 0),
        code: query.search
          ?.split(QUOTES_SEARCH_PARAM_SEPARATOR)
          .filter((search) => search.length > 0),
        client: this.clients.find((item) => item.code === query.client)?.id,
        country: selectedCountries,
        location: selectedDestinations,
        tags: tags,
        itinerary_type_id: this.itineraryTypesOptions.find(
          (item) => item.name === query.type
        )?.id,
        status: this.status_itinerary.find((item) => item.name === query.status)
          ?.id,
      };

      const formWithDefinedKeys = getObjectWithDefinedKeys(newForm);

      const updatedForm = {
        ...this.form,
        ...formWithDefinedKeys,
      };
      this.form = updatedForm;
      await this.handleSearchItineraries(updatedForm);
    },
    updateUrlWithForm() {
      const newQuery = {
        search: this.form.title?.join(QUOTES_SEARCH_PARAM_SEPARATOR),
        client: this.clients.find((item) => item.id === this.form.client)?.code,
        country: this.selectedCountries,
        tags: this.form.tags.map((tag) => tag.id).join(","),
        destination: encodeURIComponent(this.selectedDestinations),
        type: this.itineraryTypesOptions.find(
          (item) => item.id === this.form.itinerary_type_id
        )?.name,
        status: this.status_itinerary.find(
          (item) => item.id === this.form.status
        )?.name,
      };
      const newQueryIsDifferent = Object.keys(newQuery).some(
        (key) => newQuery[key] !== this.$route.query[key]
      );
      const queryWithoutEmptyValues = Object.fromEntries(
        Object.entries(newQuery).filter((value) => value !== "")
      );
      if (!newQueryIsDifferent) return;
      this.$router.push({
        query: {
          ...queryWithoutEmptyValues,
        },
      });
    },
    async listDestinationsByCountry(countries) {
      return await this.$store.dispatch(
        "locations/listDestinationsOfMultipleCountries",
        {
          countriesIds: countries.map((country) => country.id),
        }
      );
    },
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) this.setLoadingText("Loading content, please wait...");
    },
    setLoadingText(value = "") {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    destinationText(item) {
      return `${item.location_name} (${item.location_code})`;
    },
    keymap(e) {
      e = e || window.event;
      const code = e?.which || e?.keyCode;
      switch (code) {
        case 83:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
      document.getElementById("searchInput").focus();
    },
    formatDate(date) {
      if (!date) {
        return null;
      }
      const dtf = new Intl.DateTimeFormat("en-CA", { timezome: "UTC" });
      return dtf.format(new Date(`${date}`));
    },
    async handleSearchItineraries(payload) {
      const adaptedPayload = {
        ...payload,
        country: this.selectedCountries,
        location: this.selectedDestinations,
        accumulate: false,
      };
      this.setLoading(true);
      await this.loadItineraries(adaptedPayload);
      this.setLoading(false);
    },
    async initialFetching() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          this.localLoading = true;
          await Promise.all([
            this.$store.dispatch("locations/listCountry"),
            this.$store.dispatch("client/getDestinations"),
            this.$store.dispatch("client/getClients"),
            this.loadStatusesItinerary(),
          ]);
          await this.fullfillFormWithUrl();
          this.localLoading = false;
        },
        functionToExecuteOnFail: async () => {
          this.localLoading = false;
        },
      });
    },
  },
  mounted() {
    this.keymap();
    this.initialFetching();
    this.form.itinerary_type_id = this.itineraryTypes[0].id;
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.searchFormQuote {
  padding-right: 0.5em;
}
.searchFormQuote .field {
  margin-bottom: 0.8em;
  width: 100%;
}
.range-date .field-body .form-control {
  padding: 0.6em 0.5em;
  margin: 0 !important;
  font-weight: 400 !important;
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
  font-size: 1em !important;
}
.range-date .b-form-datepicker {
  padding: 0.1em !important;
}
.range-date .field-body .form-control {
  padding: 0.5em;
  margin: 0 !important;
  font-weight: 400 !important;
}
.field.date_to .dropdown-menu.show {
  left: -130px !important;
}
.quotes__search__form {
  position: relative;
  top: 0;
  max-width: 15rem;
}
.quotes_search_form__toggle {
  display: none;
}
@media screen and (max-width: 480px) {
  .quotes_search_form__toggle {
    display: block;
  }
  .searchFormQuote {
    height: 0rem;
    overflow: hidden;
  }
  .searchFormQuote.show {
    height: fit-content;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }
  .searchFormQuote.show .buttons-form-search {
    position: fixed;
    z-index: 9;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
    padding: 1rem;
  }
  .searchFormQuote.show .buttons-form-search .field {
    margin: 0rem;
  }
  .quotes__search__form {
    max-width: 100%;
  }
}
</style>
