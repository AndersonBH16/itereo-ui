<template>
  <PageWrapperWithSidebar>
    <Loading :loading="loading" :loadingText="loadingText" />
    <div class="is-flex">
      <div class="blnavsecondary pb-0" style="width: 100%">
        <NavbarMain :showLogo="false" :setLoading="setLoading" />
        <div class="quote__container">
          <RequestNav v-if="isLinkedToRequest" />
          <div class="quote_box__container">
            <div>
              <h2 class="is-h2 mr-2 pb-3 mb-4">
                {{
                  isNewRequest ? "Creating a new Request" : "Editing Request"
                }}
              </h2>
              <div class="quote_form__container">
                <BaseSelect
                  size="large"
                  :list="clients"
                  optionValue="id"
                  optionText="name"
                  :disabled="
                    loading ||
                    disableQuoteByStatus ||
                    hideElementByCondition ||
                    Boolean(quoteToLinkToRequest) ||
                    isFormDisabled ||
                    isClientAndContractDisabled
                  "
                  placeholder="Select a client"
                  v-model="requestForm.client_id"
                  label="Client*"
                  @input="($event) => loadClientContracts($event)"
                />
                <BaseSelect
                  size="large"
                  :list="client_contracts"
                  optionValue="id"
                  optionText="name"
                  :disabled="
                    loading ||
                    disableQuoteByStatus ||
                    hideElementByCondition ||
                    Boolean(quoteToLinkToRequest) ||
                    isFormDisabled ||
                    isClientAndContractDisabled
                  "
                  placeholder="Select a contract"
                  v-model="requestForm.contract_id"
                  label="Contract*"
                  @input="() => {}"
                />
                <BaseInput
                  size="large"
                  label="Title"
                  :disabled="
                    disableQuoteByStatus ||
                    loading ||
                    hideElementByCondition ||
                    isFormDisabled
                  "
                  placeholder="Type a title"
                  v-model="requestForm.title"
                />
                <BaseInput
                  size="large"
                  label="Code"
                  :disabled="true"
                  placeholder="Type a code"
                  v-model="requestForm.code"
                />
                <!-- <BaseInput
                  size="large"
                  label="External Id"
                  :disabled="
                    disableQuoteByStatus ||
                    loading ||
                    hideElementByCondition ||
                    isNewRequest
                  "
                  placeholder="-"
                  v-model="requestForm.code"
                />
                <BaseInput
                  size="large"
                  label="External Code"
                  :disabled="
                    disableQuoteByStatus || loading || hideElementByCondition
                  "
                  placeholder="Type a external code"
                  v-model="requestForm.code"
                /> -->
                <BaseSelect
                  size="large"
                  :list="requestStages"
                  optionValue="id"
                  optionText="name"
                  :disabled="
                    loading ||
                    disableQuoteByStatus ||
                    hideElementByCondition ||
                    isNewRequest ||
                    isFormDisabled
                  "
                  placeholder="Select a stage"
                  v-model="requestForm.stage_id"
                  label="Stage"
                />
                <!-- <b-field label="Tags" class="header_select" style="width: 100%" disabled>
                  <Multiselect
                    v-model="requestForm.tags"
                    :options="[]"
                    :multiple="true"
                    :taggable="true"
                    tag-position="top"
                    :max-height="200"
                    :close-on-select="true"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :allow-empty="true"
                    placeholder="Select tag(s)"
                    :disabled="disableQuoteByStatus || hideElementByCondition"
                  >
                  </Multiselect>
                </b-field> -->
                <BaseButton
                  v-if="!hideElementByCondition"
                  action="tercery"
                  size="small"
                  class="w-100 quote_form__button mt-5"
                  :loading="loading"
                  @click="onSaveClick"
                  :disabled="
                    disableQuoteByStatus ||
                    isRequestFormNotValid ||
                    isFormDisabled
                  "
                >
                  <i slot="icon">
                    <IconCheck class="icon is-small" />
                  </i>
                  <div slot="text">
                    {{
                      isNewRequest
                        ? `Create Request ${
                            linkQuoteToRequest ? "and link quote to it" : ""
                          }`
                        : "Save Request"
                    }}
                  </div>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrapperWithSidebar>
</template>

<script>
import PageWrapperWithSidebar from "@/components/_shared/PageWrapperWithSidebar.vue";
import RequestNav from "@/components/requests/RequestNav.vue";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import Loading from "@/components/_shared/Loading.vue";
import { mapGetters } from "vuex";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/request";
import { datesHelper } from "@/utils/dates";
import { REQUEST_STAGES } from "@/constants/itinerary";
// import { openToast } from "@/utils/utils";
import confetti from "@/assets/confetti.min.js";
import { PATH_INFO } from "@/router/path";

export default {
  name: "CreateRequest",
  components: {
    PageWrapperWithSidebar,
    Loading,
    NavbarMain,
    RequestNav,
  },
  data() {
    return {
      requestForm: {
        client_id: null,
        contract_id: null,
        code: null,
        title: null,
        stage_id: null,
        tags: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      historyView: "utils/getHistoryView",
      datesFormat: "itinerary/getDatesFormat",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      clients: "client/getClients",
      client_contracts: "client/getClientContracts",
      requestStages: "request/getRequestStages",
      request: "request/getRequest",
      quoteToLinkToRequest: "request/getQuoteToLinkToRequest",
      formItinerary: "itinerary/getFormItinerary",
    }),
    isRequestFormNotValid() {
      const isClientNotValid = !this.requestForm.client_id;
      const isContractNotValid = !this.requestForm.contract_id;
      const isTitleNotValid = !this.requestForm.title;
      return isClientNotValid || isContractNotValid || isTitleNotValid;
    },
    isNewRequest() {
      return !this.$route.query.request;
    },
    linkQuoteToRequest() {
      return this.quoteToLinkToRequest !== null;
    },
    isLinkedToRequest() {
      return ![null, undefined].includes(this.request?.id);
    },
    isClientAndContractDisabled() {
      if (!this.request.id) return false;
      if (this.isFormDisabled) return true;
      return this.request.items.length > 0;
    },
    isFormDisabled() {
      if (!this.request.id) return false;
      return [REQUEST_STAGES.WON.id, REQUEST_STAGES.WON.id].includes(
        this.request.stage.id
      );
    },
  },
  watch: {
    request() {
      if (this.request.id) {
        this.fillRequestFormWithRequestData();
      } else {
        this.requestForm = this.request;
      }
    },
  },
  methods: {
    getItineraryEditionDatetime(itinerary) {
      return `${datesHelper.getDatetimeFromUTC(
        itinerary.updated_date,
        this.datesFormat
      )}`;
    },
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) {
        this.setLoadingText("Loading content, please wait...");
      }
    },
    setLoadingText(value) {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    resetCurrentItinerary() {
      this.$store.dispatch("itinerary/resetItineraryAndRelatedData");
    },
    async loadClients() {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("client/getClients", {
          page: 1,
        });
      });
    },
    async buildRequestForm() {
      if (this.isNewRequest) {
        this.requestForm = this.validateFillRequestFormByQuote();
      } else {
        await this.loadRequestData();
      }
    },
    validateFillRequestFormByQuote() {
      return {
        ...this.requestForm,
        stage_id: REQUEST_STAGES.IN_PREPARATION.id,
        client_id: this.quoteToLinkToRequest
          ? this.quoteToLinkToRequest.client.id
          : this.requestForm.client_id,
        contract_id: this.quoteToLinkToRequest
          ? this.quoteToLinkToRequest.contract.id
          : this.requestForm.contract_id,
        title: this.quoteToLinkToRequest
          ? this.quoteToLinkToRequest.title
          : this.requestForm.title,
      };
    },
    async loadRequestData() {
      const requestId = this.$route.query.request;
      if (requestId) {
        await this.validateFunctionExecution(async () => {
          this.$store.dispatch("request/resetRequestState");
          return await this.$store.dispatch("request/getRequestById", {
            id: requestId,
          });
        });

        if (!this.request?.id) return;

        await this.loadClientContracts(this.request.client.id);

        this.fillRequestFormWithRequestData();
      }
    },
    fillRequestFormWithRequestData() {
      this.requestForm = {
        ...this.requestForm,
        client_id: this.request.client.id,
        contract_id: this.request.contract.id,
        code: this.request.code,
        title: this.request.title,
        stage_id: this.request.stage.id,
        tags: this.request.tags,
      };
    },
    async loadInitialData() {
      this.setLoading(true);
      await this.loadClients();
      await this.buildRequestForm();
      this.setLoading(false);
    },
    async validateFunctionExecution(functionToHandle = null, onError = null) {
      try {
        return await functionToHandle();
      } catch (error) {
        if (onError) onError();
        const errorMessage =
          error?.response?.data?.errors?.data || DEFAULT_ERROR_MESSAGE;
        this.setLoading(false);
        console.error(error);
        this.$buefy.toast.open({
          duration: 5000,
          message: errorMessage,
          position: "is-top",
          type: "is-danger",
          pauseOnHover: true,
        });
      }
    },
    async loadClientContracts(clientId) {
      return await this.validateFunctionExecution(async () => {
        this.requestForm.contract_id = null;

        this.setLoading(true);

        await this.$store.dispatch("client/getClientContracts", {
          id: clientId,
          contract_id: this.itinerary.data
            ? this.itinerary.data.contract_id
            : "",
        });

        this.setLoading(false);

        const firstClientContract = this.client_contracts?.find(
          (clientContract) => clientContract.id === this.client_contracts[0].id
        )?.id;

        this.requestForm.contract_id = firstClientContract
          ? firstClientContract
          : this.requestForm.contract_id;
      });
    },
    async onSaveClick() {
      const isNewRequest = !this.$route.query.request;
      const adaptedRequest = {
        ...this.requestForm,
        contract_id: this.client_contracts.find(
          (contract) => contract.id === this.requestForm.contract_id
        )?.contract_id,
        id: this.$route.query.request,
      };
      if (isNewRequest) {
        await this.createRequest(adaptedRequest);
        await this.handleLinkQuoteToRequest();
      } else {
        await this.saveRequest(adaptedRequest);
      }
    },
    async handleLinkQuoteToRequest() {
      if (this.quoteToLinkToRequest) {
        const response = await this.$store.dispatch(
          "request/linkQuoteToRequest",
          [
            {
              requestId: this.request.id,
              quotesToLink: {
                ...this.quoteToLinkToRequest,
              },
            },
          ]
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
      }

      const validatedQuery = this.quoteToLinkToRequest
        ? { itinerary: this.quoteToLinkToRequest.id }
        : null;

      this.$router.push({
        path: PATH_INFO.BASIC_INFO.path,
        query: validatedQuery,
      });

      this.$store.commit("request/SET_QUOTE_TO_LINK_TO_REQUEST", null);
    },
    async createRequest(adaptedRequest) {
      this.setLoading(true);

      const response = await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("request/createRequest", {
          request: adaptedRequest,
        });
      });

      this.$router.push({
        query: {
          request: response.data.id,
        },
      });

      this.fillRequestFormWithRequestData();

      this.validateAutofillByRequest();

      this.$buefy.toast.open({
        duration: 5000,
        message:
          response.type == "success"
            ? "Request created successfully"
            : "Error creating request",
        position: "is-top",
        type: response.type == "success" ? "is-success" : "is-danger",
        pauseOnHover: true,
      });

      confetti.start();

      setTimeout(() => {
        confetti.stop();
      }, 5000);

      this.setLoading(false);
    },
    async saveRequest(adaptedRequest) {
      this.setLoading(true);

      const response = await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("request/saveRequest", {
          request: adaptedRequest,
        });
      });

      this.fillRequestFormWithRequestData();

      this.$buefy.toast.open({
        duration: 5000,
        message:
          response.type == "success"
            ? "Request saved successfully"
            : "Error saving request changes",
        position: "is-top",
        type: response.type == "success" ? "is-success" : "is-danger",
        pauseOnHover: true,
      });

      this.setLoading(false);
    },
    updateformItinerary(key, value) {
      this.$store.dispatch("itinerary/udpateFormItineraryByKey", {
        key,
        value,
      });
    },
    generateCode() {
      this.$store.dispatch("itinerary/generateCode");
    },
    validateAutofillByRequest() {
      if (this.request?.id && !this.itinerary?.data?.id) {
        this.updateformItinerary("client_id", this.request.client.id);
        this.updateformItinerary("contract_id", this.request.contract.id);
        this.updateformItinerary("title", {
          ...this.formItinerary[0].title,
          value: `${this.request.title}`,
        });
        this.generateCode();
      }
    },
  },
  mounted() {
    this.loadInitialData();
  },
  beforeRouteLeave(to, from, next) {
    if (PATH_INFO.BASIC_INFO.path !== to.path) {
      this.$store.dispatch("request/resetRequestState");
      this.$store.dispatch("request/resetQuoteToLinkToRequest");
    }
    next();
  },
};
</script>

<style>
.quote_box__container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  width: 100%;
}

.quote_box__container > div {
  width: 30rem;
  max-width: 30rem;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 30px -15px #aaa;
}

.quote_box__container h2 {
  font-weight: 700;
}

.quote_form__container > div {
  margin: 1rem 0;
}

.quote_form__container label {
  font-size: 1rem !important;
}

.quote_form__button button {
  width: 100% !important;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
