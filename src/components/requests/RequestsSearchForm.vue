<template>
  <div class="quotes__search__form">
    <div class="column px-0 py-0 is-flex is-justify-content-space-between">
      <div>
        <h2 class="is-h2">
          <strong>Requests</strong>
        </h2>
      </div>
    </div>
    <div class="searchFormQuote mt-5">
      <b-field label="Search" class="header_select" style="width: 100%">
        <Multiselect
          v-model="form.text"
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
          id="searchInput"
        >
        </Multiselect>
      </b-field>
      <BaseSelect
        label="Client"
        :list="[{ id: '', name: 'All' }, ...clients]"
        optionValue="id"
        optionText="name"
        placeholder="Select a client"
        :disabled="loading"
        :value="form.client_id"
        @input="
          form.client_id = $event;
          focusSearchButton();
        "
        class="field"
      />
      <BaseSelect
        label="Stage"
        :list="[{ id: '', name: 'All' }, ...requestStages]"
        optionValue="id"
        optionText="name"
        placeholder="Select a stage"
        :disabled="loading"
        :value="form.stage_id"
        @input="
          form.stage_id = $event;
          focusSearchButton();
        "
        class="field"
      />
      <b-field label="Creation date" class="range-date">
        <BaseDatePicker
          placeholder="Creation date"
          v-model="form.creation_date"
          size="medium"
          class="field"
          :isNotValid="false"
        />
      </b-field>
    </div>
    <div class="buttons-form-search w-100 mt-5">
      <BaseButton
        ref="searchQuotesButton"
        size="large"
        @click="() => onSearchClick(form)"
        action="principal"
        class="w-100"
      >
        <IconSearch slot="icon" class="icon is-small" />
        <p slot="text">Search</p>
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Multiselect from "vue-multiselect";

export default {
  name: "RequestsSearchForm",
  components: {
    Multiselect,
  },
  props: {
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        text: [],
        client_id: null,
        stage_id: null,
        creation_date: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
      clients: "client/getClients",
      requestStages: "request/getRequestStages",
    }),
  },
  watch: {
    form: {
      handler(newFormData) {
        this.$emit("update:payload", newFormData);
      },
      deep: true,
    },
  },
  methods: {
    addSearchItem(newItem) {
      this.form.text.push(newItem);
      this.focusSearchButton();
    },
    focusSearchButton() {
      this.$refs.searchQuotesButton.$el.querySelector("button").focus();
    },
    async onSearchClick(form) {
      this.setLoading(true);
      await this.$store.dispatch("request/getRequests", {
        title: form.text,
        code: form.text,
        client: form.client_id,
        stage: form.stage_id,
        creation: form.creation_date,
      });
      this.setLoading(false);
    },
    async loadClients() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          return await this.$store.dispatch("client/getClients", {
            page: 1,
          });
        },
        functionToExecuteOnFail: async (error) => {
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message: "Error trying to get clients, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });
    },
    async loadInitialData() {
      this.setLoading(true);
      await Promise.allSettled([
        this.onSearchClick(this.form),
        this.loadClients(),
      ]);
      this.setLoading(false);
    },
  },
  mounted() {
    this.loadInitialData();
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
