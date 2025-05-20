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
      <div class="linktorequests_modal">
        <h1 class="header_title mb-3" style="text-align: left; width: 100%">
          Linking Quote to Request
        </h1>
        <div class="header w-100">
          <div class="is-flex is-justify-content-space-between w-100">
            <!-- <b-field
              label="Client"
              class="header_select service_country__select"
              style="width: 32%; text-align: left"
            >
              <b-select
                placeholder="Select a Client"
                v-model="searchPayload.client"
              >
                <option
                  v-for="client in clientsOptions"
                  :value="client.id"
                  :key="client.id"
                >
                  {{ client.name }}
                </option>
              </b-select>
            </b-field> -->
            <!-- <b-field
              label="Stage"
              class="header_select service_country__select"
              style="width: 48%; text-align: left"
            >
              <b-select
                placeholder="Select a Stage"
                v-model="searchPayload.stage"
              >
                <option
                  v-for="stage in requestStagesOptions"
                  :value="stage.id"
                  :key="stage.id"
                >
                  {{ stage.name }}
                </option>
              </b-select>
            </b-field> -->

            <b-field
              label="Stage(s)"
              class="form_stage__control"
              style="width: 48%"
            >
              <Multiselect
                v-model="searchPayload.stage"
                label="name"
                track-by="id"
                :options="requestStagesOptions"
                :multiple="true"
                :taggable="true"
                tag-position="top"
                :max-height="200"
                :close-on-select="true"
                :clear-on-select="false"
                :preserve-search="true"
                :allow-empty="true"
                placeholder="Select Stage(s)"
              >
              </Multiselect>
            </b-field>

            <b-field
              label="Creation Date"
              class="header_select service_country__select"
              style="width: 48%; text-align: left"
            >
              <BaseDatePicker
                placeholder="Creation date"
                v-model="searchPayload.creation_date"
                size="medium"
                class="field"
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
                v-model="searchPayload.text"
                @input="
                  $emit('update:searchPayload', {
                    ...searchPayload,
                    text: $event.target.value,
                  })
                "
                ref="searchServiceInput"
              />
            </div>
            <button class="button_search ml-4" @click="searchRequests">
              <IconSearch
                slot="icon"
                class="icon is-small"
                style="width: 1.2rem"
              />
            </button>
          </div>
        </div>
        <p class="services_results_length">{{ resultsLength }} results</p>
        <div class="results__container w-100" v-if="resultsLength > 0">
          <button
            v-for="request in filteredRequests"
            :class="'item'"
            :key="request.id"
            @click="() => handleItemClick(request)"
          >
            <div>
              <div class="is-flex is-align-items-center gap-2">
                <div class="item__top">
                  {{ request.code }}
                </div>
              </div>
              <div class="item__bottom">
                {{ request.title }}
              </div>
            </div>
          </button>
        </div>
        <footer class="w-100 mt-4 footer__button px-4 pr-6">
          <b-button class="w-100" @click="redirectToRequestCreation">
            Or create a new request
          </b-button>
        </footer>
      </div>
    </b-modal>

    <LinkToRequestAlert
      :alertText="`Are you sure to link the selected quote(s) to <strong>${requestSelected.title}</strong> request?`"
      :isLinkToRequestAlertOpen="isLinkToRequestAlertOpen"
      :onCancel="onCancel"
      :onConfirm="onConfirm"
      @update:isLinkToRequestAlertOpen="isLinkToRequestAlertOpen = $event"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { PATH_INFO } from "@/router/path";
import LinkToRequestAlert from "@/components/requests/LinkToRequestAlert.vue";
import { REQUEST_STAGES } from "@/constants/itinerary";
import Multiselect from "vue-multiselect";

export default {
  name: "LinkToRequestModal",
  components: {
    LinkToRequestAlert,
    Multiselect,
  },
  props: {
    setLoading: {
      type: Function,
      default: () => {},
    },
    isLinkToRequestModalOpen: {
      type: Boolean,
      default: false,
    },
    quotesToLink: {
      type: Array,
      default: () => [],
    },
    onContinue: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    isModalOpen(newValue) {
      if (this.isLinkToRequestModalOpen === newValue) return;
      this.$emit("update:isLinkToRequestModalOpen", newValue);
    },
    isLinkToRequestModalOpen(newValue) {
      this.isModalOpen = newValue;
      this.$store.dispatch("utils/setIsModalOpen", newValue);
      if (newValue) this.onMounted();
      else this.resetComponentState();
    },
  },
  data() {
    return {
      filteredRequests: [],
      isModalOpen: this.isLinkToRequestModalOpen,
      isLinkToRequestAlertOpen: false,
      searchPayload: {
        client: "",
        contract: "",
        stage: [],
        creation_date: "",
        text: "",
      },
      requestSelected: {},
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      requests: "request/getRequests",
      clients: "client/getClients",
      requestStages: "request/getRequestStages",
    }),
    resultsLength() {
      return this.filteredRequests.length || 0;
    },
    clientsOptions() {
      return [{ id: "", name: "All" }, ...this.clients];
    },
    requestStagesOptions() {
      return [
        REQUEST_STAGES.IN_PREPARATION,
        REQUEST_STAGES.SENT,
        REQUEST_STAGES.NEGOTIATION,
        REQUEST_STAGES.WON,
        REQUEST_STAGES.LOST,
      ];
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("request/SET_QUOTE_TO_LINK_TO_REQUEST", null);
    next();
  },
  methods: {
    buildSearchPayload() {
      return {
        client: this.itinerary.data ? this.itinerary.data.client.id : "",
        contract: this.itinerary.data ? this.itinerary.data.contract.id : "",
        stage: [
          REQUEST_STAGES.IN_PREPARATION,
          REQUEST_STAGES.SENT,
          REQUEST_STAGES.NEGOTIATION,
          REQUEST_STAGES.WON,
          REQUEST_STAGES.LOST,
        ],
        creation_date: "",
        text: "",
      };
    },
    updateSearchPayload(payload) {
      this.searchPayload = payload;
      this.filterServices();
    },
    closeLinkToRequestModal() {
      this.isModalOpen = false;
    },
    async onMounted() {
      this.searchPayload = this.buildSearchPayload();
      await this.searchRequests();
    },
    resetComponentState() {
      this.filteredRequests = [];
    },
    async searchRequests() {
      this.setLoading(true);

      const currentStages =
        this.searchPayload.stage.length > 0
          ? this.searchPayload.stage
          : [
              REQUEST_STAGES.IN_PREPARATION,
              REQUEST_STAGES.SENT,
              REQUEST_STAGES.NEGOTIATION,
              REQUEST_STAGES.WON,
              REQUEST_STAGES.LOST,
            ];

      await this.$store.dispatch("request/getRequests", {
        title: this.searchPayload.text,
        code: this.searchPayload.text,
        client: this.searchPayload.client,
        contract: this.searchPayload.contract,
        stage: currentStages.map((stage) => stage.id).join(","),
        creation: this.searchPayload.creation_date,
      });
      this.filteredRequests = this.requests.data;
      this.setLoading(false);
    },
    async onConfirm() {
      this.setLoading(true);

      const response = await this.$store.dispatch(
        "request/linkQuoteToRequest",
        {
          requestId: this.requestSelected.id,
          currentRequest: this.requestSelected,
          quotesToLink: this.quotesToLink.map((quote) => ({
            ...quote,
            title: quote.title.value,
          })),
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

      this.onContinue();
      this.isLinkToRequestAlertOpen = false;
      this.setLoading(false);
    },
    onCancel() {
      this.isLinkToRequestAlertOpen = false;
    },
    handleItemClick(request) {
      this.closeLinkToRequestModal();
      this.requestSelected = request;
      this.isLinkToRequestAlertOpen = true;
    },
    redirectToRequestCreation() {
      this.$store.commit("request/SET_QUOTE_TO_LINK_TO_REQUEST", {
        id: this.itinerary.data.id,
        client: this.itinerary.data.client,
        contract: this.itinerary.data.contract,
        title: this.itinerary.data.title.value,
        status: this.itinerary.data.status,
      });
      this.$router.push({ name: PATH_INFO.REQUESTS_CREATION.name });
    },
  },
};
</script>

<style>
.linktorequests_modal .selectContainer {
  display: block;
}
.linktorequests_modal .btnClose {
  background-color: transparent;
  border: none;
  padding: 0;
}
.animation-content {
  z-index: 999;
}
.linktorequests_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 36rem;
  height: 40rem;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: center;
  position: relative;
}
.linktorequests_modal .services_results_length {
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
.linktorequests_modal .select,
.linktorequests_modal select {
  width: 100%;
}

.linktorequests_modal .header {
  position: relative;
  width: 100%;
  text-align: left;
  padding-bottom: 0.2rem;
}
.linktorequests_modal .header .header_select {
  margin: 0.3rem 0;
  display: inline-block;
}
.linktorequests_modal .header .header_select :is(label) {
  text-align: left;
  margin-left: 0.25rem;
  font-size: 0.8rem !important;
}
.linktorequests_modal
  .header
  .header_select
  :is(.select, select, .b-form-datepicker.base-datePicker.form-control) {
  font-size: 0.8rem !important;
  width: 100% !important;
  border-radius: 0.5rem !important;
}
.linktorequests_modal
  .header
  .header_select
  :is(select:focus, .b-form-datepicker.base-datePicker.form-control:focus, .b-form-datepicker.base-datePicker.form-control:hover) {
  border-color: #f00b81 !important;
  box-shadow: 0 0 0 0.125em #f00b8138 !important;
}
.linktorequests_modal .header .header_select .select::after {
  border-color: #f00b81;
}
.linktorequests_modal .header .input_search {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
  border-bottom: 1px solid #f00b81;
}
.linktorequests_modal .header .input_search .input {
  outline: none;
  border: none;
  border-radius: 0px;
  box-shadow: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  width: 18rem;
}
.linktorequests_modal .header svg {
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
.linktorequests_modal .button_search :is(svg) {
  color: #fff !important;
}

.linktorequests_modal .footer__button {
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

.linktorequests_modal .results__container {
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
  .linktorequests_modal {
    padding: 1rem;
    height: 100%;
  }
}
</style>
