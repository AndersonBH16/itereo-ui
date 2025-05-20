<template>
  <b-modal
    v-if="isSelectModalActive"
    v-model="isSelectModalActive"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Modal"
    aria-modal
    @close="closeSelectModal()"
    v-bind="$attrs"
  >
    <div class="select_modal">
      <h1 class="header_title" style="text-align: left; width: 100%">
        Modules
      </h1>
      <div class="header">
        <b-field label="Country" class="header_select" style="width: 30%">
          <b-select
            placeholder="Select a country"
            :value="searchPayload.country"
            @input="
              $emit('update:searchPayload', {
                ...searchPayload,
                country: $event,
                location: '',
              });
              getDestinationsPerCountry($event);
            "
          >
            <option
              v-for="serviceCountry in serviceCountriesOptions"
              :value="serviceCountry.location_code"
              :key="serviceCountry.id"
            >
              {{ serviceCountry.location_label }}
            </option>
          </b-select>
        </b-field>
        <b-field
          label="Destination"
          class="header_select ml-2"
          style="width: 46%"
        >
          <b-select
            placeholder="Select a destination"
            :value="searchPayload.location"
            :disabled="
              serviceDestinationsOptions.length === 0 ||
              searchPayload.country === ''
            "
            @input="
              $emit('update:searchPayload', {
                ...searchPayload,
                location: $event,
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
        <b-field label="Days" class="header_select ml-2" style="width: 20%">
          <BaseInputNumber
            controlsPosition="compact"
            size="is-small"
            :max="365"
            :min="0"
            :placeholder="0"
            :value="searchPayload.num_day"
            @input="
              $emit('update:searchPayload', {
                ...searchPayload,
                num_day: $event,
              })
            "
          >
          </BaseInputNumber>
        </b-field>
        <b-field label="Tag(s)" class="header_select" style="width: 100%">
          <multiselect
            v-model="searchPayload.tags"
            :options="filteredModulesTags"
            :multiple="true"
            tag-position="top"
            :max-height="100"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            :allow-empty="true"
            placeholder="Select a tag"
            track-by="name"
            label="name"
            @input="
              $emit('update:searchPayload', {
                ...searchPayload,
                tags: $event,
                formattedTags: $event.map((tag) => tag.id).join(','),
              })
            "
            :disabled="filteredModulesTags.length === 0"
          >
          </multiselect>
        </b-field>
        <BaseFilterSearchInput
          style="grid-area: search"
          :onButtonClick="onSearchClick"
          @update="onSearchPayloadUpdate"
        />
        <span class="results_length">{{ resultsLength }} results</span>
      </div>
      <div class="body">
        <div>
          <div
            class="select_modal_item"
            v-for="item in dataFiltered"
            :key="item.id"
            @click="handleClickItem(item)"
          >
            <div>
              <div class="top_text">
                <p>{{ item.topText }}</p>
                <span>·</span>
                <span>{{ item.rightText }}</span>
              </div>
              <div class="bottom_text">
                {{ item.bottomText }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { serviceHelper } from "@/utils/service";
import Multiselect from "vue-multiselect";

export default {
  name: "SelectModal",
  components: {
    Multiselect,
  },
  props: {
    closeSelectModal: {
      type: Function,
      default: () => {},
    },
    isSelectModalActive: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    handleClickItem: {
      type: Function,
      default: () => {},
    },
    searchPayload: {
      type: Object,
      default: () => {},
    },
    loadItineraries: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      dataFiltered: [],
      resultsLength: 0,
    };
  },
  computed: {
    ...mapGetters({
      serviceCountries: "client/getCountriesFromContract",
      destinations: "client/getFilteredDestinations",
      itinerariesTags: "tags/getItinerariesTags",
    }),
    serviceCountriesOptions() {
      return [
        { id: "", location_name: "", location_label: "All", location_code: "" },
        ...this.serviceCountries,
      ];
    },
    serviceDestinationsOptions() {
      return serviceHelper.formatDestinationsTextForServiceTable(
        this.destinations
      );
    },
    filteredModulesTags() {
      return this.itinerariesTags;
    },
  },
  watch: {
    isSelectModalActive(newValue) {
      if (newValue) {
        this.dataFiltered = this.data;
        this.resultsLength = this.data.length;
      }
    },
  },
  methods: {
    getDestinationsPerCountry(country) {
      const countryName = this.serviceCountries.find(
        (serviceCountry) => serviceCountry.location_code === country
      )?.location_name;
      this.$store
        .dispatch("client/filterDestinationsByCountry", { name: countryName })
        .catch((error) => {
          throw error;
        });
    },
    onSearchPayloadUpdate(newValue) {
      this.$emit("update:searchPayload", {
        ...this.searchPayload,
        code: newValue,
        title: newValue,
      });
      this.filterData(newValue);
    },
    filterData(value) {
      const search = value.trim();
      this.dataFiltered = this.data.filter((item) => {
        const itemFormatted = `${item.bottomText} ${item.topText}`;
        return itemFormatted.toLowerCase().includes(search.toLowerCase());
      });
      this.resultsLength = this.dataFiltered.length;
    },
    async onSearchClick() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          await this.loadItineraries();
          this.filterData(this.searchPayload.code);
        },
        functionToExecuteOnFail: async (error) => {
          throw error;
        },
      });
    },
  },
};
</script>
<style>
.select_modal .btnClose {
  background-color: transparent;
  border: none;
  width: 2.5rem;
}
.animation-content {
  z-index: 999;
}
.results_length {
  position: absolute;
  right: 0;
  bottom: -2rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6d6d6d;
}
.select_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33rem;
  height: 30rem;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: center;
}
.select_modal .body {
  max-height: 100%;
  overflow-y: auto;
  margin-top: 2rem;
  width: 100%;
}
.select_modal .body .select_modal_item {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(217, 217, 217, 0.25);
  cursor: pointer;
}
.select_modal .body .select_modal_item:hover {
  background-color: rgba(217, 217, 217, 0.25);
  border-radius: 0.5rem;
  color: #fff;
}
.select_modal .body .top_text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #444444;
}
.select_modal .top_text :is(p, span) {
  display: inline-block;
  margin-right: 0.4rem;
}
.select_modal .top_text span:nth-of-type(2) {
  color: #6d6d6d;
  opacity: 0.8;
}
.select_modal .body .bottom_text {
  font-size: 0.8rem;
  font-weight: 400;
  color: #6d6d6d;
}

.select_modal .header .btnClose > svg {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: #b5b5b5;
}

.header .header_select {
  margin: 0.3rem 0;
  display: inline-block;
}
.header .header_select .control .button.is-primary {
  border-color: #f00b81;
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
.header .header_select :is(.input:focus, select:focus) {
  border-color: #f00b81;
  box-shadow: 0 0 0 0.125em #f00b8138;
}
.header .header_select .select::after {
  border-color: #f00b81;
}
.header {
  width: 100%;
}
.header .header__top {
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 4fr 3fr;
}
.header_title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
}
.control.has-icons-right .input {
  padding-right: 1.5rem;
}
</style>
