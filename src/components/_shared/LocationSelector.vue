<template>
  <div class="is-flex align-items-center ml-2 location_selector">
    <BaseSelect
      size="medium"
      label="Country"
      style="width: 130px"
      :list="countries"
      optionValue="location_name"
      :customText="destinationText"
      placeholder="Country"
      :value="this.country.location_name"
      @input="setCountry"
    />
    <BaseSelect
      size="medium"
      label="Destination"
      style="width: 150px"
      :list="destinationsByCountry"
      optionValue="location_code"
      optionText="text"
      placeholder="Destination"
      :disabled="destinationsByCountry.length === 0"
      :value="this.destination.location_code"
      @input="setDestination"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { findByKey } from "@/utils/filter";

export default {
  name: "LocationSelector",
  data() {
    return {
      country: {
        id: null,
      },
      destination: {
        id: null,
      },
    };
  },
  props: {
    location: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      countries: "client/getCountriesFromContract",
    }),
    destinationsByCountry() {
      if (!this.country.id) return [];

      const defaultDestination = {
        location_name: "All",
        location_code: "",
        id: null,
      };

      return [defaultDestination]
        .concat(this.country.destination)
        .map((loc) => ({
          ...loc,
          text: `${loc.location_name}${
            loc.location_code ? ` (${loc.location_code})` : ""
          }`,
        }));
    },
  },
  methods: {
    destinationText(item) {
      return `${item.location_name} (${item.location_code})`;
    },
    setCountry(event) {
      this.country = findByKey(this.countries, "location_name", event);
      this.destination = { ...this.destination, id: null };
      this.updateLocations();
    },
    setDestination(event) {
      this.destination = findByKey(
        this.destinationsByCountry,
        "location_code",
        event
      );
      this.updateLocations();
    },
    newLocation(location) {
      return {
        id: location.id,
        parent: location.parent,
        location_name: location.location_name,
        status: 1,
      };
    },
    updateLocations() {
      let locations = this.location
        .map((loc) => ({
          ...loc,
          status:
            loc.id === this.country.id || loc.id === this.destination.id
              ? 1
              : -1,
        }))
        .reduce(
          (acc, loc) => ({
            ...acc,
            [loc.id]: loc,
          }),
          {}
        );

      if (this.destination.id) {
        locations = {
          ...locations,
          [this.destination.id]: this.newLocation(this.destination),
        };
      }

      locations = {
        ...locations,
        [this.country.id]: this.newLocation(this.country),
      };

      this.$emit("update", Object.values(locations));
    },
  },
  mounted() {
    const location = this.location.find((loc) => loc.parent !== 0);
    if (location) {
      this.country = findByKey(this.countries, "id", location.parent);
      this.destination = location;
    } else if (this.location.length) {
      this.country = findByKey(this.countries, "id", this.location[0].id);
    }
  },
};
</script>
<style>
.location_selector {
  gap: 0.5rem;
}
.location_selector .base-select {
  width: 100% !important;
}
</style>
