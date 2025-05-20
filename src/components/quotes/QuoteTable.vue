<template>
  <section>
    <GlobalEvents
      @keydown.alt.65="keymap"
      @keyup.esc="keymapTwo"
      @keydown.shift.219="keymap"
    />
    <div class="columns">
      <div
        class="column has-text-right is-flex is-justify-content-end"
        style="gap: 0.5rem"
      >
        <div class="is-flex" style="gap: 0.5rem">
          <b-button
            :disabled="checkedRows.length === 0"
            size="is-small"
            rounded
            class="is-flex is-justify-content-center is-align-items-center"
            @click="openLinkToRequestModal"
          >
            <b-icon
              icon="link"
              custom-size="mdi-24px"
              class="mr-2 color-8 is-relative"
              style="top: 0.25rem"
            ></b-icon>
            <span> Link to Request </span>
          </b-button>
          <NewQuoteButton />
        </div>
      </div>
    </div>
    <div class="table-box cursor-default">
      <div class="is-flex is-justify-content-space-between mb-2">
        <p class="my-2 quotes_table__legend">
          <span class="has-text-weight-semibold">Tip: </span> Click on columns
          headers(Title, Creation) to sort by that column.
        </p>

        <div class="is-flex is-align-items-center" style="gap: 1rem">
          <b-button
            label="Clear checked"
            type="is-danger"
            icon-left="close"
            class="field m-0"
            size="is-small"
            @click="checkedRows = []"
            :disabled="checkedRows.length === 0"
            outlined
            rounded
          />

          <b-switch
            class="is-small color-2"
            @input="() => showMultipleSelection(!isMultipleSelection)"
          >
            <p class="color-7">Multiple selection</p>
          </b-switch>
        </div>
      </div>

      <b-field
        grouped
        group-multiline
        :data-test-id="constants.DATA_TEST_ID_VALUES.QUOTES_TABLE"
      >
        <b-table
          :data="info.itineraries"
          :checkable="isMultipleSelection"
          :checked-rows.sync="checkedRows"
          :is-row-checkable="(row) => isRowCheckable(row)"
          :row-class="helper.getItineraryRowClass"
          :default-sort-direction="defaultSortOrder"
          @sort="onSort"
          @sorting-priority-removed="sortingPriorityRemoved"
          :sort-multiple="multiColumnSortingEnabled"
          :sort-multiple-data="sortingPriority"
          backend-sorting
          :loading="globalLoading || loading.status"
          hoverable
          class="quotes__table"
        >
          <b-table-column
            field="client"
            label="Client"
            v-slot="props"
            width="80"
          >
            <p class="has-one-line-ellipsis" style="width: 5rem">
              {{ getFieldValidatedData(props.row, "client", "name") }}
            </p>
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
              {{
                helper.getItineraryTypeById(props.row.itinerary_type_id).name
              }}
            </b-tag>
          </b-table-column>

          <b-table-column
            field="code"
            label="Code"
            v-slot="props"
            width="15%"
            centered
          >
            <b-navbar-item
              tag="router-link"
              :to="{
                path: constants.PATH_INFO.BASIC_INFO.path,
                query: { itinerary: props.row.id },
              }"
              class="color-secondary cursor quote__link"
              style="cursor: pointer"
            >
              <p class="has-one-line-ellipsis" style="width: 5rem">
                {{ props.row.code }}
              </p>
            </b-navbar-item>
          </b-table-column>

          <b-table-column
            field="user"
            label="User"
            v-slot="props"
            width="10%"
            centered
          >
            <p class="has-one-line-ellipsis">
              {{ (props.row.user && props.row.user.name) || "-" }}
            </p>
          </b-table-column>

          <b-table-column
            field="title"
            label="Title"
            v-slot="props"
            width="12%"
            :th-attrs="getThAttrs"
            sortable
          >
            <b-tooltip :label="props.row.title" type="is-light">
              <b-navbar-item
                tag="router-link"
                :to="{
                  path: constants.PATH_INFO.BASIC_INFO.path,
                  query: { itinerary: props.row.id },
                }"
                class="color-secondary cursor quote__link"
                style="cursor: pointer"
              >
                <p class="has-one-line-ellipsis" style="width: 9rem">
                  {{ props.row.title }}
                </p>
              </b-navbar-item>
            </b-tooltip>
          </b-table-column>

          <b-table-column
            field="paxs"
            label="Paxs"
            centered
            v-slot="props"
            width="2%"
          >
            {{ props.row.num_pax }}
          </b-table-column>

          <b-table-column
            field="price"
            label="Price"
            numeric
            v-slot="props"
            centered
            width="5%"
          >
            {{ (props.row.price && props.row.price) || "-" }}
          </b-table-column>

          <b-table-column
            field="from"
            label="Dates"
            v-slot="props"
            centered
            width="15%"
          >
            {{
              props.row.start_date
                | customDate(constants.DATE_FORMAT_MMM_DD_YYYY)
            }}
            <br />
            {{
              props.row.end_date | customDate(constants.DATE_FORMAT_MMM_DD_YYYY)
            }}
          </b-table-column>

          <b-table-column
            field="creation"
            label="Creation"
            v-slot="props"
            centered
            width="15%"
            :th-attrs="getThAttrs"
            sortable
          >
            {{
              props.row.created_date
                | customDate(constants.DATE_FORMAT_MMM_DD_YYYY)
            }}
          </b-table-column>

          <b-table-column
            field="status"
            label="Status"
            v-slot="props"
            width="20%"
            centered
          >
            <BaseSelect
              size="xs"
              :list="status_itinerary"
              optionValue="id"
              optionText="name"
              placeholder="Status"
              v-model="props.row.status.id"
              @input="
                () => setSelectedItinerary(props.row.id, props.row.status.id)
              "
              :lock="props.row.status.id !== 1"
              :disabled="
                props.row.status.id !== 1 ||
                disableStatusColumn(props.row.itinerary_type_id)
              "
            />
          </b-table-column>

          <b-table-column
            field="edit"
            label="Actions"
            centered
            v-slot="props"
            width="8%"
          >
            <div
              class="is-flex is-justify-content-center is-align-items-center"
              style="gap: 0.5rem"
            >
              <a @click.prevent="handleEditItinerary(props.row)">
                <IconPencil class="icon color-4 is-small" />
              </a>
              <QuotesTableActions :data="props.row" :payload="payload" />
            </div>
          </b-table-column>
          <template v-if="!globalLoading && !loading.status" #empty>
            <div class="content has-text-centered py-5">
              <p>
                There are no results. Please try the search again in a couple of
                minutes. If the issue continues, contact support
              </p>
            </div>
          </template>
        </b-table>
        <b-pagination
          class="mt-2 mb-0 quoteTablePagination"
          :total="itineraries.meta && itineraries.meta.total"
          v-model="payload.page"
          :range-before="3"
          :range-after="1"
          :rounded="false"
          size="is-small"
          order="is-centered"
          :per-page="itineraries.meta && itineraries.meta.per_page"
        >
          <template #default="props">
            <b-pagination-button
              :page="props.page"
              tag="button"
              :id="`page${props.page.number}`"
              @click.native="handleSearchItineraries()"
            >
              {{ props.page.number }}
            </b-pagination-button>
          </template>

          <template #previous="props">
            <b-pagination-button
              :page="props.page"
              @click.native="handleSearchItineraries()"
            >
              <IconArrowLeft class="icon_previous" />
            </b-pagination-button>
          </template>

          <template #next="props">
            <b-pagination-button
              :page="props.page"
              @click.native="handleSearchItineraries()"
            >
              <IconArrowRight class="icon_next" />
            </b-pagination-button>
          </template>
        </b-pagination>
        <div class="shortcutLinkContainer quoteTable mb-3">
          <BaseShortcutLink @click="handleModal" class="shortcutsLink" />
          <BaseModal
            :isComponentModalActive="shortcutsOpen"
            type="shortcuts"
            :shortcuts="shortcuts"
            :closeModal="handleModal"
          >
            <span slot="title">Quotes keyboard shortcuts </span>
          </BaseModal>
        </div>
      </b-field>
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
              showStatusChangeModal = false;
              loadItineraries();
            }
          "
          action="secondary"
          size="medium"
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
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>

    <ExternalExportModal
      :isModalOpen="showExternalExportModal"
      :loading="loading.status"
      :onExternalExportContinue="onExternalExportContinue"
      :closeModal="closeChangeStatusModal"
    />

    <CongratulationsModal
      :isModalOpen="showCongratulationsMessage"
      :closeModal="() => (showCongratulationsMessage = false)"
    />

    <LinkToRequestModal
      :quotesToLink="checkedRows"
      :setLoading="setLoading"
      :isLinkToRequestModalOpen="isLinkToRequestModalOpen"
      :onContinue="() => (checkedRows = [])"
      @update:isLinkToRequestModalOpen="isLinkToRequestModalOpen = $event"
    />
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import GlobalEvents from "vue-global-events";
import { helper } from "@/utils/itinerary";
import { helpers as adapterHelper } from "@/utils/adapters";
import QuotesTableActions from "@/components/_shared/QuotesTableActions.vue";
import ExternalExportModal from "@/components/quote-views/_shared/ExternalExportModal.vue";
import CongratulationsModal from "@/components/quote-views/_shared/CongratulationsModal.vue";
import { quoteTableShortcuts as shortcuts } from "@/utils/shortcuts";
import { PATH_INFO } from "@/router/path";
import { DATE_FORMAT_MMM_DD_YYYY } from "@/constants";
import { QUOTE_TABLE_FIELDS } from "@/constants/itinerary";
import NewQuoteButton from "@/components/_shared/NewQuoteButton.vue";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { ITINERARY_STATUS, ITINERARY_TYPES } from "@/constants/itinerary";
import LinkToRequestModal from "@/components/requests/LinkToRequestModal.vue";

export default {
  name: "QuoteTable",
  components: {
    NewQuoteButton,
    QuotesTableActions,
    GlobalEvents,
    ExternalExportModal,
    CongratulationsModal,
    LinkToRequestModal,
  },
  props: {
    loadItineraries: {
      type: Function,
      default: () => {},
    },
    payload: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: {
        status: false,
        message: "",
      },
      showStatusChangeModal: false,
      showExternalExportModal: false,
      showCongratulationsMessage: false,
      selectedItinerary: {
        id: null,
        statusId: null,
      },
      checkedRows: [],
      constants: { DATE_FORMAT_MMM_DD_YYYY, PATH_INFO, DATA_TEST_ID_VALUES },
      helper: { ...helper },
      shortcutsOpen: false,
      shortcuts,
      defaultSortOrder: "desc",
      customKey: null,
      backendSortingEnabled: true,
      multiColumnSortingEnabled: true,
      sortingPriority: [],
      isLinkToRequestModalOpen: false,
      isMultipleSelection: false,
    };
  },
  computed: {
    ...mapGetters({
      itineraries: "itinerary/getItineraries",
      status_itinerary: "status_itinerary/getStatusesItinerary",
      globalLoading: "utils/getLoading",
    }),
    checkedRowsClientAndContract() {
      if (this.checkedRows.length === 0)
        return { client: null, contract: null };
      return {
        client: this.checkedRows[0].client.id,
        contract: this.checkedRows[0].contract_id,
      };
    },
    info() {
      return {
        itineraries: this.itineraries.data,
      };
    },
  },
  methods: {
    showMultipleSelection(value) {
      this.isMultipleSelection = value;
      if (!value) {
        this.checkedRows = [];
      }
    },
    openLinkToRequestModal() {
      this.isLinkToRequestModalOpen = true;
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
    isRowCheckable(quote) {
      if (quote.file_id?.length > 0) return false;
      if (this.checkedRows.length === 0) return true;
      if (this.disableStatusColumn(quote.itinerary_type_id)) return false;

      return (
        this.checkedRowsClientAndContract.client === quote.client.id &&
        this.checkedRowsClientAndContract.contract === quote.contract_id
      );
    },
    disableStatusColumn(itineraryTypeId) {
      return ITINERARY_TYPES.NO_TEMPLATE.id !== itineraryTypeId;
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
    getThAttrs(column) {
      const COLUMNS_TO_CONTRAST = [
        QUOTE_TABLE_FIELDS.TITLE,
        QUOTE_TABLE_FIELDS.CREATION,
      ];
      return COLUMNS_TO_CONTRAST.includes(column.field)
        ? {
            class: "contrasted__th",
          }
        : null;
    },
    sortingPriorityRemoved(field) {
      this.sortingPriority = this.sortingPriority.filter(
        (priority) => priority.field !== field
      );
      this.handleSearchItineraries({
        sort: adapterHelper.adaptedSortingPriorityToParamsFormat(
          this.sortingPriority
        ),
      });
    },
    onSort(field, order) {
      if (this.backendSortingEnabled && this.multiColumnSortingEnabled) {
        if (!this.customKey) {
          let existingPriority = this.sortingPriority.filter(
            (i) => i.field === field
          )[0];
          if (existingPriority) {
            existingPriority.order =
              existingPriority.order === "desc" ? "asc" : "desc";
          } else {
            this.sortingPriority.push({ field, order });
          }
          this.handleSearchItineraries({
            sort: adapterHelper.adaptedSortingPriorityToParamsFormat(
              this.sortingPriority
            ),
          });
        } else {
          this.sortingPriority = [];
          this.handleSearchItineraries({ sort: "" });
        }
      }
    },
    openItineraryInAnotherTab(itinerary = {}) {
      const urlToRedirect = `${window.location.origin}${PATH_INFO.BASIC_INFO.path}?itinerary=${itinerary.id}`;
      window.open(urlToRedirect, "_blank", "");
    },
    getFieldValidatedData(row = {}, key = "", subKey = "") {
      const value = row[key] && row[key][subKey] ? row[key][subKey] : "-";
      return value;
    },
    toggleLoading(message = "Loading content, please wait...") {
      if (!this.loading.status) this.loading = { status: true, message };
      else this.loading = { status: false, message: "" };
    },
    handleModal() {
      this.shortcutsOpen = !this.shortcutsOpen;
    },
    keymap(e) {
      e = e || window.event;
      const code = e.which || e.keyCode;
      switch (code) {
        case 65:
        case 219:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
      if (code === 219) {
        this.handleModal();
      } else if (code === 65) {
        this.$router.push(PATH_INFO.HOME.path);
      }
    },
    keymapTwo() {
      this.$router.push(PATH_INFO.HOME.path);
    },
    formatDate(date) {
      if (!date) {
        return null;
      }
      const dtf = new Intl.DateTimeFormat("en-CA", { timezome: "UTC" });
      return dtf.format(new Date(`${date}`));
    },
    async handleSearchItineraries(newPayload = {}) {
      this.toggleLoading();
      await this.loadItineraries(newPayload);
      this.toggleLoading();
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
  },
};
</script>
<style>
.b-checkbox.checkbox:not(.button) {
  margin-right: 0em;
}
.checkbox-cell {
  padding-right: 0 !important;
}
.quoteTablePagination {
  margin-left: 50%;
  transform: translateX(-50%);
}
.quoteTable.shortcutLinkContainer .shortcutsLink {
  padding: 0 !important;
  margin-right: 0;
}
.b-table .table th .th-wrap .icon {
  margin-left: 0.1rem;
  margin-right: -0.25rem;
}
.b-table .table th .multi-sort-cancel-icon {
  margin-left: 0.25rem;
}
.is-sortable .is-invisible {
  visibility: visible !important;
}
.contrasted__th :is(span, p) {
  font-weight: bold;
}
:is(.quote__link.navbar-item, .quote__link.navbar-item:hover, .quote__link.navbar-item:active, .quote__link.navbar-item:focus) {
  cursor: pointer;
  color: #f00b81 !important;
  background-color: transparent !important;
}

.quotes__table .ui.fluid.search.selection.dropdown.base-select {
  width: 100% !important;
}

@media screen and (max-width: 480px) {
  .quotes_table__legend {
    display: none;
  }
  .table-box {
    margin-top: 2rem;
  }
  .table-mobile-sort {
    margin: 0rem !important;
    margin-bottom: 1rem !important;
  }
}
</style>
