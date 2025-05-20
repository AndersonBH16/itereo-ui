<template>
  <div class="second_row">
    <div class="filters_container">
      <div class="search_container">
        <label for="search">Search for a service</label>
        <div class="input_search">
          <IconFilter class="icon is-small" />
          <input
            type="text"
            class="input"
            placeholder="Search for a service ..."
            @input="filterServices"
            ref="searchServiceInput"
            name="search"
          />
        </div>
      </div>
      <b-field label="Service Level" class="header_select">
        <b-select
          placeholder="Select a service level"
          @input="searchServicesByServiceType($event)"
        >
          <option
            v-for="serviceLevel in serviceLevelOptions"
            :value="serviceLevel.id"
            :key="serviceLevel.id"
          >
            {{ serviceLevel.name }}
          </option>
        </b-select>
      </b-field>
    </div>
    <div class="is-flex is-align-items-center">
      <b-switch
        v-if="!hideElementByCondition"
        class="is-small color-2 mr-4"
        @input="showMultipleSelection"
      >
        <p class="color-7">Multiple selection</p>
      </b-switch>
      <b-switch
        v-if="hasViewSalePricePermission"
        class="is-small color-2 mr-0"
        @input="showUnitPrices"
      >
        <p class="color-7">Show Unit Prices</p>
      </b-switch>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { SERVICE_LEVELS, SERVICE_LEVELS_OPTIONS } from "@/constants/services";
import { helper } from "@/utils/itinerary";
import { serviceHelper } from "@/utils/service";
import { PERMISSION } from "@/constants";

export default {
  name: "ServiceTableFilters",
  props: {
    fields: {
      type: Array,
      required: true,
    },
    resetLocalSaving: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      serviceLevelOptions: [{ id: "", name: "--" }, ...SERVICE_LEVELS_OPTIONS],
      helper: { ...helper },
    };
  },
  computed: {
    ...mapGetters({
      initialItineraryServices: "itinerary/getInitialServicesItinerary",
      itinerary: "itinerary/getItinerary",
      authData: "auth/getAuthData",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    hasViewSalePricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_SALE_PRICE]
      );
    },
  },
  methods: {
    showUnitPrices(evt) {
      const unitPriceClass = evt
        ? "priceUnitField shown_field"
        : "priceUnitField hidden_field";
      const priceClass = evt
        ? "priceField hidden_field"
        : "priceField shown_field";
      const newFields = this.fields.map((field) => {
        if (field.key !== "price_unit" && field.key !== "price") return field;
        return {
          ...field,
          class: field.key === "price" ? priceClass : unitPriceClass,
        };
      });
      this.$emit("updateFields", newFields);
    },
    showMultipleSelection(evt) {
      const multipleSelectionClass = evt
        ? "selectionField shown_field"
        : "selectionField hidden_field";
      const visibleClass = evt
        ? "checkboxField hidden_field"
        : "checkboxField shown_field";
      const newFields = this.fields.map((field) => {
        if (field.key !== "selected" && field.key !== "visible") return field;
        return {
          ...field,
          class:
            field.key === "visible" ? visibleClass : multipleSelectionClass,
        };
      });

      this.resetLocalSaving();
      this.$emit("updateFields", newFields);
    },
    searchServicesByServiceType(idServiceType = "") {
      if (idServiceType?.length === 0)
        this.$emit(
          "updateFilteredItineraryServices",
          this.initialItineraryServices
        );
      else {
        const newServices = this.initialItineraryServices.filter(
          (service) =>
            service.level === idServiceType ||
            service.level === SERVICE_LEVELS.ALL.id
        );
        this.$emit("updateFilteredItineraryServices", newServices);
      }
    },
    filterServices(event) {
      const search = event.target.value.trim();
      const newServices = this.initialItineraryServices?.filter((service) => {
        const codeWithName = this.helper.getServiceSearchString(service);
        return codeWithName.toLowerCase().includes(search.toLowerCase());
      });
      this.$emit("updateFilteredItineraryServices", newServices);
    },
  },
};
</script>
<style>
.tableServiceTable {
  position: relative;
}
.tableServiceTable .second_row {
  margin: -1rem 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.second_row .input_search {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #f00b81;
}

.second_row .input_search .input {
  outline: none;
  border: none;
  border-radius: 0px;
  box-shadow: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  width: 18rem;
  background-color: transparent;
}

.second_row .input_search svg {
  color: #f00b81;
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 0.5rem;
}
.filters_container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1rem;
}
.filters_container .header_select {
  margin: 1.5rem 0 1rem;
}
.filters_container :is(label) {
  text-align: left;
  margin-left: 0.25rem;
  font-size: 0.65rem;
  font-weight: 600;
}
.filters_container .header_select :is(.select, select) {
  font-size: 0.8rem;
  width: 100%;
  border-radius: 0.5rem;
  background-color: transparent;
}
.filters_container .header_select :is(select:focus) {
  border-color: #f00b81;
  box-shadow: 0 0 0 0.125em #f00b8138;
}
.filters_container .header_select .select::after {
  border-color: #f00b81;
}
@media screen and (max-width: 480px) {
  .tableServiceTable .second_row {
    margin: 1rem 0;
    flex-direction: column;
    align-items: flex-start;
    display: none;
  }
  .filters_container {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .filters_container .search_container {
    width: 100%;
  }
  .tableServiceTable .second_row .filters_container .header_select {
    margin: 1rem 0;
  }
  .second_row .input_search .input {
    width: 100%;
  }
}
</style>
