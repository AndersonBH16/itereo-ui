<template>
  <section
    class="table-box mt-5"
    :data-test-id="constants.DATA_TEST_ID_VALUES.HOME_QUOTES_TABLE"
  >
    <Loading :loading="loading" />
    <GlobalEvents @keydown.alt.83="keymap" @keydown.shift.219="keymap" />
    <div class="columns is-flex-mobile">
      <div class="column">
        <h2 class="is-h2 p-1 pb-3"><strong>Recent Itineraries</strong></h2>
      </div>
      <div class="column has-text-right">
        <NewQuoteButton />
      </div>
    </div>
    <QuotesTableSkeleton v-if="loading" :rows="10" />
    <b-table
      v-else
      :data="itinerariesLimited"
      :row-class="helper.getItineraryRowClass"
      hoverable
    >
      <b-table-column field="client" label="Client" v-slot="props" width="15%">
        {{ getFieldValidatedData(props.row, "client", "name") }}
      </b-table-column>

      <b-table-column
        field="type"
        label="Type"
        v-slot="props"
        width="10%"
        centered
      >
        <b-tag
          v-if="helper.getItineraryTypeById(props.row.itinerary_type_id)"
          type="is-light"
        >
          {{ helper.getItineraryTypeById(props.row.itinerary_type_id).name }}
        </b-tag>
      </b-table-column>

      <b-table-column field="code" label="Code" v-slot="props">
        <b-navbar-item
          tag="router-link"
          :to="{
            path: constants.PATH_INFO.BASIC_INFO.path,
            query: { itinerary: props.row.id },
          }"
          class="color-secondary cursor quote__link"
          style="cursor: pointer"
        >
          {{ props.row.code }}
        </b-navbar-item>
      </b-table-column>

      <b-table-column field="user" label="User" v-slot="props">
        {{ props.row.user.name }}
      </b-table-column>

      <b-table-column field="title" label="Title" v-slot="props">
        <b-navbar-item
          tag="router-link"
          :to="{
            path: constants.PATH_INFO.BASIC_INFO.path,
            query: { itinerary: props.row.id },
          }"
          class="color-secondary cursor quote__link"
          style="cursor: pointer"
          >{{ props.row.title }}</b-navbar-item
        >
      </b-table-column>

      <b-table-column field="paxs" label="Paxs" centered v-slot="props">
        {{ props.row.num_pax }}
      </b-table-column>

      <b-table-column field="price" label="Price" numeric v-slot="props">
        {{ props.row.price }}
      </b-table-column>

      <b-table-column
        field="from"
        label="Dates"
        v-slot="props"
        centered
        width="8%"
      >
        {{
          props.row.start_date | customDate(constants.DATE_FORMAT_MMM_DD_YYYY)
        }}
        <br />
        {{ props.row.end_date | customDate(constants.DATE_FORMAT_MMM_DD_YYYY) }}
      </b-table-column>

      <b-table-column field="status" label="Status" width="110" v-slot="props">
        <BaseSelect
          size="xs"
          :list="status_itinerary"
          optionValue="id"
          optionText="name"
          placeholder="Status"
          v-model="props.row.status.id"
          :lock="props.row.status.id !== 1"
          :disabled="props.row.status.id !== 1"
          @input="() => setSelectedItinerary(props.row.id, props.row.status.id)"
        />
      </b-table-column>

      <b-table-column
        field="edit"
        label="Actions"
        width="6%"
        centered
        v-slot="props"
      >
        <div
          class="is-flex is-justify-content-center is-align-items-center"
          style="gap: 0.5rem"
        >
          <a class="ml-2" @click.prevent="handleEditItinerary(props.row)"
            ><IconPencil class="icon color-4 is-small"
          /></a>
          <QuotesTableActions :data="props.row" />
        </div>
      </b-table-column>
      <template #empty>
        <div class="content has-text-centered py-5">
          <p>
            There are no results. Please try the search again in a couple of
            minutes. If the issue continues, contact support
          </p>
        </div>
      </template>
    </b-table>
    <div class="shortcutLinkContainer">
      <BaseShortcutLink @click="handleModal" class="shortcutsLink" />
      <BaseTourGuideLink :handleClick="openGuideModal" class="shortcutsLink" />
      <BaseModal
        :isComponentModalActive="shortcutsOpen"
        type="shortcuts"
        :shortcuts="shortcuts"
        :closeModal="handleModal"
      >
        <span slot="title">Recent Itineraries keyboard shortcuts </span>
      </BaseModal>
    </div>
    <BaseModal :isComponentModalActive="showStatusChangeModal">
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title"
        >Are you sure to
        <span class="has-text-weight-semibold">change</span> this status?
      </span>
      <span slot="paragraph"
        >The update will take around 1 minute to become visible</span
      >
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="
            () => {
              loadItineraries();
              showStatusChangeModal = false;
            }
          "
          action="secondary"
          size="medium"
          :disabled="loading"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="
            () =>
              validateShowExportExternalModal(
                selectedItinerary.statusId,
                selectedItinerary.id
              )
          "
          action="tercery"
          size="medium"
          :disabled="loading"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>

    <ExternalExportModal
      :isModalOpen="showExternalExportModal"
      :loading="loading"
      :onExternalExportContinue="onExternalExportContinue"
      :closeModal="closeChangeStatusModal"
    />

    <CongratulationsModal
      :isModalOpen="showCongratulationsMessage"
      :closeModal="() => (showCongratulationsMessage = false)"
    />
  </section>
</template>

<script>
import NewQuoteButton from "@/components/_shared/NewQuoteButton.vue";
import ExternalExportModal from "@/components/quote-views/_shared/ExternalExportModal.vue";
import CongratulationsModal from "@/components/quote-views/_shared/CongratulationsModal.vue";
import QuotesTableActions from "@/components/_shared/QuotesTableActions.vue";
import QuotesTableSkeleton from "@/components/_shared/QuotesTableSkeleton.vue";
import Loading from "@/components/_shared/Loading.vue";
import { mapGetters } from "vuex";
import GlobalEvents from "vue-global-events";
import { homeQuoteTableShortcuts as shortcuts } from "@/utils/shortcuts";
import { ITINERARY_TYPES } from "@/constants/itinerary";
import { PATH_INFO } from "@/router/path";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { DATE_FORMAT_MMM_DD_YYYY } from "@/constants";
import { helper } from "@/utils/itinerary";
import { ITINERARY_STATUS } from "@/constants/itinerary";

export default {
  name: "HomeQuoteTable",
  components: {
    NewQuoteButton,
    QuotesTableActions,
    GlobalEvents,
    Loading,
    QuotesTableSkeleton,
    ExternalExportModal,
    CongratulationsModal,
  },
  props: {
    openGuideModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: { DATA_TEST_ID_VALUES, DATE_FORMAT_MMM_DD_YYYY, PATH_INFO },
      helper: { ...helper },
      showStatusChangeModal: false,
      showExternalExportModal: false,
      showCongratulationsMessage: false,
      shortcutsOpen: false,
      shortcuts,
      loading: null,
      selectedItinerary: {
        id: null,
        statusId: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      itineraries: "itinerary/getItineraries",
      status_itinerary: "status_itinerary/getStatusesItinerary",
    }),
    itinerariesLimited() {
      return this.itineraries.data;
    },
    info() {
      return {
        itineraries: this.itineraries.data,
      };
    },
  },
  methods: {
    openItineraryInAnotherTab(itinerary = {}) {
      const urlToRedirect = `${window.location.origin}${PATH_INFO.BASIC_INFO.path}?itinerary=${itinerary.id}`;
      window.open(urlToRedirect, "_blank", "");
    },
    getFieldValidatedData(row = {}, key = "", subKey = "") {
      const value = row[key] && row[key][subKey] ? row[key][subKey] : "-";
      return value;
    },
    toggleLoading() {
      if (!this.loading) this.loading = true;
      else this.loading = null;
      this.$store.dispatch("utils/setLoading", this.loading != null);
    },
    handleModal() {
      this.shortcutsOpen = !this.shortcutsOpen;
    },
    keymap(e) {
      e = e || window.event;
      const code = e.which || e.keyCode;
      switch (code) {
        case 83:
        case 219:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
      if (code === 83) {
        this.$router.push(PATH_INFO.QUOTES.path);
        document.getElementById("searchInput").focus();
      } else if (code === 219) {
        this.handleModal();
      }
    },
    async loadItineraries() {
      const payload = {
        page: 1,
        limit: 10,
        type: ITINERARY_TYPES.NO_TEMPLATE.id,
      };

      await this.$store
        .dispatch("itinerary/list", payload)
        .then()
        .catch((error) => {
          throw error;
        });
    },
    async loadStatusesItinerary() {
      const payload = {
        page: 1,
      };

      await this.$store
        .dispatch("status_itinerary/getStatusesItinerary", payload)
        .then()
        .catch((error) => {
          throw error;
        });
    },
    setSelectedItinerary(id, statusId) {
      this.selectedItinerary = {
        id,
        statusId,
      };
      this.showStatusChangeModal = true;
    },
    resetSelectedItinerary() {
      this.selectedItinerary = {
        id: null,
        statusId: null,
      };
    },
    handleChangeStatus(newStatus, selectedItinerary) {
      const payload = {
        id: selectedItinerary,
        status: newStatus,
      };
      this.toggleLoading();
      this.$store
        .dispatch("itinerary/change_status", payload)
        .then((response) => {
          this.showStatusChangeModal = false;
          this.$buefy.toast.open({
            duration: 5000,
            message: response.message,
            position: "is-top",
            type: "is-success",
          });
          this.loadItineraries();
        })
        .catch((error) => {
          this.$buefy.toast.open({
            duration: 5000,
            message:
              "Error trying to change status of itinerary, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          this.showStatusChangeModal = false;
          throw error;
        })
        .finally(() => {
          this.resetSelectedItinerary();
          this.toggleLoading();
        });
    },
    closeChangeStatusModal() {
      this.showStatusChangeModal = false;
      this.showExternalExportModal = false;
    },
    async validateShowExportExternalModal(newStatus, selectedItinerary) {
      if (newStatus === ITINERARY_STATUS.CONFIRM.value) {
        this.showStatusChangeModal = false;
        this.showExternalExportModal = true;
        return;
      }
      this.handleChangeStatus(newStatus, selectedItinerary);
    },
    async onExternalExportContinue(externalSource = "") {
      this.closeChangeStatusModal();
      this.$store.dispatch("itinerary/setIsRecentlyExported", true);
      await this.handleChangeStatus(
        this.selectedItinerary.statusId,
        this.selectedItinerary.id
      );
      await this.$store.dispatch("itinerary/exportToExternal", {
        itineraryId: this.selectedItinerary.id,
        externalSource,
      });
      this.$store.dispatch("itinerary/setIsRecentlyExported", false);
      this.showCongratulationsMessage = true;
    },
    handleEditItinerary(row) {
      this.$store.dispatch("itinerary/read", { uuid: row.id }).then(() => {
        this.$router.push(PATH_INFO.BASIC_INFO.path);
      });
    },
    async fetchingOnMounted() {
      this.toggleLoading();
      Promise.all([
        this.loadItineraries(),
        this.loadStatusesItinerary(),
      ]).finally(() => {
        this.toggleLoading();
      });
    },
  },
  mounted() {
    this.fetchingOnMounted();
  },
};
</script>
<style scoped>
:is(.quote__link.navbar-item, .quote__link.navbar-item:hover, .quote__link.navbar-item:active, .quote__link.navbar-item:focus) {
  cursor: pointer;
  color: #f00b81 !important;
  background-color: transparent !important;
}
</style>
