<template>
  <div class="sticky-searchform mt-6">
    <GlobalEvents @keydown.alt.83="keymap" />
    <div class="column px-0 pt-0">
      <h2 class="is-h2">
        <strong>{{ title }}</strong>
      </h2>
      <small class="small">{{ subTitle }}</small>
    </div>
    <div class="searchFormQuote">
      <BaseInput
        label="Destination"
        id="searchInput"
        size="large"
        placeholder="Ex: Machu Picchu"
        v-model="form.title"
        @keyup.native.enter="handleSearchItineraries"
        type="search"
        class="field"
      />
      <BaseSelect
        label="Region"
        :list="info.countries"
        optionValue="location_name"
        :customText="destinationText"
        placeholder="Select a region"
        :disabled="loading"
        :value="form.country"
        @input="form.country = $event"
        class="field mb-5"
      />
      <div class="buttons-form-search">
        <BaseButton
          size="large"
          @click="handleSearchItineraries()"
          action="principal"
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

export default {
  name: "FilterForm",
  components: {
    GlobalEvents,
  },
  props: {
    typeItineraryPayload: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "Quotes",
    },
    subTitle: {
      type: String,
      default: "Reservations",
    },
  },
  data() {
    return {
      from: null,
      to: null,
      creation: null,
      form: {
        code: null,
        title: null,
        country: null,
        location: null,
        from: null,
        to: null,
        creation: null,
        status: 0,
        page: 1,
        limit: 10,
      },
    };
  },
  methods: {
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
    handleSearchItineraries() {
      this.form.code = this.form.title;
      this.form.from = this.formatDate(this.from);
      this.form.to = this.formatDate(this.to);
      this.form.creation = this.formatDate(this.creation);
      this.form.type = this.typeItineraryPayload;

      const payload = this.form;
      this.setLoading(true);
      this.$store
        .dispatch("itinerary/list", payload)
        .then()
        .catch((error) => {
          throw error;
        })
        .finally(() => this.setLoading(false));
    },
  },
  computed: {
    ...mapGetters({
      status_itinerary: "status_itinerary/getStatusesItinerary",
      locations: "client/getDestinations",
      countries: "locations/listCountry",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
    }),
    info() {
      return {
        countries: this.countries ?? [],
      };
    },
  },
  mounted() {
    this.keymap();
    this.$store.dispatch("client/getDestinations", { name: this.form.country });
  },
};
</script>

<style>
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
</style>
