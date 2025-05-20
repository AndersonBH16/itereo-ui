<template>
  <div>
    <b-modal
      v-if="isModalOpen"
      v-model="isModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Modal"
      aria-modal
      @close="isModalOpen = false"
      v-bind="$attrs"
    >
      <div class="link_to_itinerary__modal">
        <h1 class="header_title mb-3" style="text-align: left; width: 100%">
          Linking Quote to Request
        </h1>

        <div class="header w-100">
          <div
            class="is-flex w-100"
            style="flex-wrap: wrap; column-gap: 0.75rem"
          >
            <b-field
              label="Client(s)"
              class="form_stage__control"
              style="width: 32%"
            >
              <Multiselect
                v-model="payload.client"
                label="name"
                track-by="id"
                :options="clientsOptions"
                :multiple="true"
                :taggable="true"
                tag-position="top"
                :max-height="200"
                :close-on-select="true"
                :clear-on-select="false"
                :preserve-search="true"
                :allow-empty="true"
                placeholder="Select Client(s)"
              >
              </Multiselect>
            </b-field>

            <b-field
              label="Country(s)"
              class="form_stage__control"
              style="width: 32%"
            >
              <Multiselect
                v-model="payload.countries"
                label="location_name"
                track-by="location_name"
                :options="countriesOptions"
                :multiple="true"
                :taggable="true"
                tag-position="top"
                :max-height="200"
                :close-on-select="true"
                :clear-on-select="false"
                :preserve-search="true"
                :allow-empty="true"
                placeholder="Select Country(s)"
              >
              </Multiselect>
            </b-field>

            <b-field
              label="Destination(s)"
              class="form_stage__control"
              style="width: 32%"
            >
              <Multiselect
                v-model="payload.location"
                label="location_name"
                track-by="location_name"
                :options="destinationsOptions"
                :multiple="true"
                :taggable="true"
                tag-position="top"
                :max-height="200"
                :close-on-select="true"
                :clear-on-select="false"
                :preserve-search="true"
                :allow-empty="true"
                placeholder="Select Destination(s)"
              >
              </Multiselect>
            </b-field>

            <b-field
              label="Type(s)"
              class="form_stage__control"
              style="width: 32%"
              disabled
            >
              <Multiselect
                v-model="payload.type"
                label="name"
                track-by="id"
                :options="itineraryTypesOptions"
                :multiple="true"
                :taggable="true"
                tag-position="top"
                :max-height="200"
                :close-on-select="true"
                :clear-on-select="false"
                :preserve-search="true"
                :allow-empty="true"
                placeholder="Select Type(s)"
              >
              </Multiselect>
            </b-field>

            <b-field
              label="Status(es)"
              class="form_stage__control"
              style="width: 32%"
            >
              <Multiselect
                v-model="payload.status"
                label="name"
                track-by="id"
                :options="statusesOptions"
                :multiple="true"
                :taggable="true"
                tag-position="top"
                :max-height="200"
                :close-on-select="true"
                :clear-on-select="false"
                :preserve-search="true"
                :allow-empty="true"
                placeholder="Select Status(es)"
              >
              </Multiselect>
            </b-field>

            <b-field
              label="Tag(s)"
              class="form_stage__control"
              style="width: 32%"
            >
              <Multiselect
                v-model="payload.tag"
                label="name"
                track-by="id"
                :options="tagsOptions"
                :multiple="true"
                :taggable="true"
                tag-position="top"
                :max-height="200"
                :close-on-select="true"
                :clear-on-select="false"
                :preserve-search="true"
                :allow-empty="true"
                placeholder="Select Tag(s)"
              >
              </Multiselect>
            </b-field>

            <b-field
              label="Range Date"
              class="header_select service_country__select"
              style="width: 48%; text-align: left"
            >
              <BaseDatePicker
                placeholder="From date"
                v-model="payload.from"
                size="medium"
                class="field"
                style="width: 12rem"
              />
              <BaseDatePicker
                placeholder="To date"
                v-model="payload.to"
                size="medium"
                class="field ml-4"
                style="width: 12rem"
              />
            </b-field>

            <b-field
              label="Creation Date"
              class="header_select service_country__select ml-4"
              style="width: 48%; text-align: left"
            >
              <BaseDatePicker
                placeholder="Creation date"
                v-model="payload.creation_date"
                size="medium"
                class="field"
                style="width: 15rem"
              />
            </b-field>
          </div>
          <div class="search__container w-100">
            <div class="input_search" style="width: 90%">
              <IconFilter class="icon is-small" />
              <input
                type="text"
                class="input"
                placeholder="Type request code, title ..."
                v-model="payload.text"
                @input="
                  $emit('update:payload', {
                    ...payload,
                    text: $event.target.value,
                  })
                "
                ref="searchServiceInput"
              />
            </div>
            <button
              class="button_search ml-4"
              @click="() => loadItineraries(payload)"
            >
              <IconSearch
                slot="icon"
                class="icon is-small"
                style="width: 1.2rem"
              />
            </button>
          </div>
        </div>

        <div class="w-100 is-flex is-justify-content-end mt-5">
          <b-switch class="is-small color-2" v-model="isMultipleSelection">
            <p class="color-7">Multiple selection</p>
          </b-switch>
        </div>

        <p class="services_results_length">{{ resultsLength }} results</p>

        <div class="results__container w-100" v-if="resultsLength > 0">
          <div
            v-for="quote in filteredQuotes"
            :key="quote.id"
            class="is-flex is-justify-content-start"
          >
            <b-checkbox
              v-if="isMultipleSelection"
              v-model="checkedRows"
              :native-value="quote.id"
              size="is-small"
              :disabled="!isRowCheckable(quote)"
            >
            </b-checkbox>
            <button :class="'item'" @click="() => handleItemClick(quote)">
              <div>
                <div class="is-flex is-align-items-center gap-2">
                  <div class="item__top">
                    {{ quote.code }}
                  </div>
                </div>
                <div class="item__bottom">
                  {{ quote.title }}
                </div>
              </div>
            </button>
          </div>
        </div>

        <footer class="w-100">
          <b-button
            :disabled="checkedRows.length === 0"
            size="is-small"
            rounded
            class="is-flex is-justify-content-center is-align-items-center w-100"
            style="font-size: 1rem"
            @click="openLinkToRequestAlert"
          >
            <b-icon
              icon="link"
              custom-size="mdi-24px"
              class="mr-2 color-8 is-relative"
              style="top: 0.25rem"
            ></b-icon>
            <span> Link to Request </span>
          </b-button>
        </footer>

        <b-loading
          :is-full-page="false"
          v-model="localLoading"
          :can-cancel="false"
        ></b-loading>
      </div>
    </b-modal>

    <LinkToItineraryAlert
      :alertText="`Are you sure to link these quote(s) to <strong>${requestToLink.title}</strong> request?`"
      :isLinkToItineraryAlertOpen="isLinkToItineraryAlertOpen"
      :onCancel="onCancel"
      :onContinue="onContinue"
      @update:isLinkToItineraryAlertOpen="isLinkToItineraryAlertOpen = $event"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { helpers as adapters } from "@/utils/adapters";
import { helper } from "@/utils/itinerary";
import { cloneDeep } from "lodash";
import LinkToItineraryAlert from "@/components/requests/LinkToItineraryAlert.vue";
import * as ITINERARY from "@/constants/itinerary";
import Multiselect from "vue-multiselect";

export default {
  name: "LinkToItineraryModal",
  components: {
    LinkToItineraryAlert,
    Multiselect,
  },
  props: {
    setLoading: {
      type: Function,
      default: () => {},
    },
    isLinkToItineraryModalOpen: {
      type: Boolean,
      default: false,
    },
    requestToLink: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    isModalOpen(newValue) {
      if (this.isLinkToItineraryModalOpen === newValue) return;
      this.$emit("update:isLinkToItineraryModalOpen", newValue);
    },
    isLinkToItineraryModalOpen(newValue) {
      this.isModalOpen = newValue;
      this.$store.dispatch("utils/setIsModalOpen", newValue);
      if (newValue) this.onMounted();
      else this.resetComponentState();
    },
  },
  data() {
    return {
      localLoading: false,
      filteredQuotes: [],
      checkedRows: [],
      isModalOpen: this.isLinkToItineraryModalOpen,
      isLinkToItineraryAlertOpen: false,
      isMultipleSelection: true,
      payload: {
        ...cloneDeep(ITINERARY.DEFAULT_SEARCH_QUOTES_PAYLOAD),
        type: [ITINERARY.ITINERARY_TYPES.NO_TEMPLATE],
        status: [{ id: "", name: "All" }],
        limit: 100,
      },
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      requests: "request/getRequests",
      clients: "client/getClients",
      countries: "locations/listCountry",
      destinations: "locations/listDestinations",
      itineraryStatuses: "status_itinerary/getStatusesItinerary",
      itineraryTags: "tags/getItinerariesTags",
      itineraries: "itinerary/getItineraries",
    }),
    checkedRowsClientAndContract() {
      if (this.checkedRows.length === 0)
        return { client: null, contract: null };
      return {
        client: this.filteredQuotes?.[0]?.client.id,
        contract: this.filteredQuotes?.[0]?.contract_id,
      };
    },
    resultsLength() {
      return this.filteredQuotes.length || 0;
    },
    clientsOptions() {
      const clients = this.clients || [];
      return [{ id: "", name: "All" }, ...clients];
    },
    countriesOptions() {
      const countries = this.countries || [];
      return [{ id: "", name: "All" }, ...countries];
    },
    destinationsOptions() {
      const destinations = this.destinations || [];
      return [{ id: "", name: "All" }, ...destinations];
    },
    statusesOptions() {
      const statuses = this.itineraryStatuses || [];
      return [{ id: "", name: "All" }, ...statuses];
    },
    tagsOptions() {
      const tags = this.itineraryTags || [];
      return [{ id: "", name: "All" }, ...tags];
    },
    itineraryTypesOptions() {
      const itineraryTypes = helper.getItineraryTypesMapped();
      return [{ id: "", name: "All" }, ...itineraryTypes];
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("request/SET_QUOTE_TO_LINK_TO_REQUEST", null);
    next();
  },
  methods: {
    openLinkToRequestAlert() {
      this.isLinkToItineraryAlertOpen = true;
    },
    isRowCheckable(quote) {
      if (quote.file_id?.length > 0) return false;
      if (this.checkedRows.length === 0) return true;

      return (
        this.checkedRowsClientAndContract.client === quote.client.id &&
        this.checkedRowsClientAndContract.contract === quote.contract_id
      );
    },
    toggleLocalLoading(value) {
      this.localLoading = value;
    },
    buildSearchPayload() {
      return {
        ...cloneDeep(ITINERARY.DEFAULT_SEARCH_QUOTES_PAYLOAD),
        type: [ITINERARY.ITINERARY_TYPES.NO_TEMPLATE],
        status: [{ id: "", name: "All" }],
        limit: 100,
      };
    },
    updateSearchPayload(payload) {
      this.payload = payload;
      this.filterServices();
    },
    closeLinkToRequestModal() {
      this.isModalOpen = false;
    },
    async onMounted() {
      this.payload = this.buildSearchPayload();
      await this.initialFetching();
    },
    resetComponentState() {
      this.filteredQuotes = [];
    },
    async onContinue() {
      this.setLoading(true);
      this.isLinkToItineraryAlertOpen = false;

      const response = await this.$store.dispatch(
        "request/linkQuoteToRequest",
        {
          requestId: this.requestToLink.id,
          currentRequest: this.requestToLink,
          quotesToLink: this.checkedRows.map((quote) => ({ id: quote })),
        }
      );

      this.$buefy.toast.open({
        duration: 5000,
        message:
          response.type == "success"
            ? "Quote linked to request successfully"
            : "Error linking quote to request",
        position: "is-top",
        type: response.type == "success" ? "is-success" : "is-danger",
        pauseOnHover: true,
      });

      this.isModalOpen = false;
      this.setLoading(false);
    },
    onCancel() {
      this.isLinkToItineraryAlertOpen = false;
    },
    handleItemClick(request) {
      this.checkedRows = [...this.checkedRows, request.id];

      this.closeLinkToRequestModal();

      this.requestToLink = request;

      this.isLinkToItineraryAlertOpen = true;
    },
    async loadItineraries(newPayload = {}) {
      this.checkedRows = [];
      this.toggleLocalLoading(true);

      const payload = {
        ...this.payload,
        ...newPayload,
        client: Array.isArray(newPayload.client)
          ? newPayload.client.flatMap((client) => client.id).join(",")
          : "",
        status: Array.isArray(newPayload.status)
          ? newPayload.status.flatMap((status) => status.id).join(",")
          : "",
        type: ITINERARY.TYPE.NORMAL,
        code: [newPayload?.text],
        title: [newPayload?.text],
        limit: 100,
      };

      await this.$store.dispatch(
        "itinerary/list",
        adapters.adaptPayloadToGetQuotes(payload)
      );

      this.filteredQuotes =
        this.itineraries.data?.filter((quote) => {
          return quote?.file_id === null;
        }) || [];

      this.toggleLocalLoading(false);
    },
    async loadStatusesItinerary() {
      const payload = {
        page: 1,
      };

      await this.$store.dispatch(
        "status_itinerary/getStatusesItinerary",
        payload
      );
    },
    async initialFetching() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          this.toggleLocalLoading(true);

          await Promise.all([
            this.$store.dispatch("locations/listCountry"),
            this.$store.dispatch("client/getDestinations"),
            this.$store.dispatch("client/getClients"),
            this.loadStatusesItinerary(),
          ]);

          await this.loadItineraries();

          this.toggleLocalLoading(false);
        },
        functionToExecuteOnFail: async () => {
          this.toggleLocalLoading(false);
        },
      });
    },
  },
  mounted() {
    this.initialFetching();
  },
};
</script>

<style>
.link_to_itinerary__modal .selectContainer {
  display: block;
}
.link_to_itinerary__modal .btnClose {
  background-color: transparent;
  border: none;
  padding: 0;
}
.animation-content {
  z-index: 999;
}
.link_to_itinerary__modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 56rem;
  height: 56rem;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: center;
  position: relative;
}
.link_to_itinerary__modal .services_results_length {
  display: block;
  width: 100%;
  text-align: right;
  margin-top: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6d6d6d;
}
.header_title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
}
.link_to_itinerary__modal .select,
.link_to_itinerary__modal select {
  width: 100%;
}

.link_to_itinerary__modal .header {
  position: relative;
  width: 100%;
  text-align: left;
  padding-bottom: 0.2rem;
}
.link_to_itinerary__modal .header .header_select {
  margin: 0.3rem 0;
  display: inline-block;
}
.link_to_itinerary__modal .header .header_select :is(label) {
  text-align: left;
  margin-left: 0.25rem;
  font-size: 0.8rem !important;
}
.link_to_itinerary__modal
  .header
  .header_select
  :is(.select, select, .b-form-datepicker.base-datePicker.form-control) {
  font-size: 0.8rem !important;
  width: 100% !important;
  border-radius: 0.5rem !important;
}
.link_to_itinerary__modal
  .header
  .header_select
  :is(select:focus, .b-form-datepicker.base-datePicker.form-control:focus, .b-form-datepicker.base-datePicker.form-control:hover) {
  border-color: #f00b81 !important;
  box-shadow: 0 0 0 0.125em #f00b8138 !important;
}
.link_to_itinerary__modal .header .header_select .select::after {
  border-color: #f00b81;
}
.link_to_itinerary__modal .header .input_search {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
  border-bottom: 1px solid #f00b81;
}
.link_to_itinerary__modal .header .input_search .input {
  outline: none;
  border: none;
  border-radius: 0px;
  box-shadow: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  width: 18rem;
}
.link_to_itinerary__modal .header svg {
  color: #f00b81 !important;
  width: 1.2rem !important;
  height: 1.2rem !important;
}
.button_search {
  background: #f00b81;
  border: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
}
.link_to_itinerary__modal .button_search :is(svg) {
  color: #fff !important;
}

.link_to_itinerary__modal .footer__button {
  position: absolute;
  bottom: 1.5rem;
  left: 1rem;
}

.item {
  background-color: #fff;
  border: none;
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(217, 217, 217, 0.25);
  cursor: pointer;
  border-radius: 0.5rem;
}
.item.disabled {
  cursor: not-allowed;
  background-color: #eeeeee;
}
.item:hover {
  background-color: rgba(217, 217, 217, 0.25);
  border-radius: 0.5rem;
  color: #fff;
}
.item__top {
  font-size: 0.8rem;
  font-weight: 400;
  color: #6d6d6d;
}
.item__bottom {
  font-size: 0.8rem;
  font-weight: 600;
  color: #444444;
}

.link_to_itinerary__modal .results__container {
  max-height: 100%;
  overflow-y: auto;
  margin-bottom: 2rem;
}

.form_stage__control label {
  text-align: left;
  margin-left: 0.25rem;
  font-size: 0.8rem !important;
}

.form_stage__control .multiselect__tag {
  margin-bottom: 0rem;
}

@media screen and (max-width: 480px) {
  .link_to_itinerary__modal {
    padding: 1rem;
    height: 100%;
  }
}
</style>
