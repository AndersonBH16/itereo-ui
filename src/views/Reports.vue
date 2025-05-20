<template>
  <PageWrapper>
    <NavbarMain />
    <div class="mt-5 reports__container">
      <div class="profile__info__container">
        <header class="is-flex">
          <b-icon
            size="is-medium"
            icon="chart-box-outline"
            class="mr-2"
          ></b-icon>
          <h1>Reports</h1>
        </header>
        <div>
          <div class="loading__container mt-4" v-if="loading">
            <b-skeleton
              height="400px"
              width="270px"
              :active="true"
            ></b-skeleton>
            <div class="mt-4">
              <b-skeleton
                height="50px"
                width="270px"
                :active="true"
              ></b-skeleton>
            </div>
            <div class="is-flex mt-4" style="gap: 1rem">
              <b-skeleton
                height="100px"
                width="128px"
                :active="true"
              ></b-skeleton>
              <b-skeleton
                height="100px"
                width="128px"
                :active="true"
              ></b-skeleton>
            </div>
          </div>
          <div class="profile__card" v-else>
            <picture class="profile__picture">
              <img :src="userPhoto" alt="user profile photo" />
              <div class="profile__picture__content">
                <h2>{{ user.name }}</h2>
                <p class="profile__email">{{ user.email }}</p>
              </div>
            </picture>

            <div class="profile__content">
              <div class="prouser__sign__container" v-if="isProUser">
                <ProUserSign />
              </div>
              <p class="profile__date">Member since {{ createdAt }}</p>
            </div>

            <div class="profile__content__quotes">
              <div>
                <p>{{ userSummary.quotes }}</p>
                <span>Requests</span>
              </div>
              <div>
                <p>{{ userSummary.confirmed }}</p>
                <span>Won</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="profile__reports__container">
        <div v-if="!loading" class="profile__charts__container">
          <div v-if="selectedChart === null" class="sales_report__container">
            <div class="is-flex is-align-items-center" style="gap: 1rem">
              <h2>Request</h2>
            </div>

            <div class="is-flex is-flex-direction-column" style="gap: 1rem">
              <div class="is-flex mt-2" style="gap: 1rem">
                <b-field label="Client(s)" class="report_config__select mb-0">
                  <Multiselect
                    v-model="salesReportParams.clients"
                    label="name"
                    track-by="id"
                    :options="clientOptions"
                    :multiple="true"
                    :taggable="true"
                    tag-position="top"
                    :max-height="200"
                    :close-on-select="true"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :allow-empty="true"
                    @input="
                      () =>
                        handleRequestsOptionsClientsUpdate(salesReportParams)
                    "
                    placeholder="Select a Client"
                  >
                  </Multiselect>
                </b-field>

                <b-field label="User(s)" class="report_config__select mb-0">
                  <Multiselect
                    v-model="salesReportParams.users"
                    label="name"
                    track-by="id"
                    :loading="isLoadingUsers"
                    :options="userOptions"
                    :multiple="true"
                    :taggable="true"
                    tag-position="top"
                    :max-height="200"
                    :close-on-select="true"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :allow-empty="true"
                    @search-change="validateSearchingUsers"
                    @input="
                      () => handleRequestsOptionsUsersUpdate(salesReportParams)
                    "
                    placeholder="Select a User"
                  >
                  </Multiselect>
                </b-field>
              </div>

              <div>
                <b-field label="Range Date" class="range-date is-relative">
                  <BaseDatePicker
                    placeholder="From"
                    v-model="salesReportParams.from"
                    :min="salesReportParams.min_from"
                    :max="salesReportParams.max_from"
                    size="medium"
                    class="request_date__field"
                    :isNotValid="false"
                  />
                  <BaseDatePicker
                    placeholder="To"
                    v-model="salesReportParams.to"
                    :min="salesReportParams.min_from"
                    :max="salesReportParams.max_from"
                    size="medium"
                    class="request_date__field ml-4"
                    :isNotValid="false"
                  />
                  <p
                    style="
                      position: absolute;
                      text-decoration: underline;
                      top: 0rem;
                      right: 0rem;
                      cursor: pointer;
                    "
                    @click="resetSalesReportFilters"
                  >
                    <span
                      class="is-flex is-align-items-center"
                      style="font-size: 0.8rem"
                    >
                      <!-- <b-icon icon="close" class="mr-2" custom-size="mdi-18px" /> -->

                      Clear Filters
                    </span>
                  </p>
                </b-field>
              </div>

              <div>
                <BaseButton
                  ref="searchQuotesButton"
                  size="large"
                  @click="() => loadReports()"
                  action="outline-gray"
                  class="mt-3"
                >
                  <IconSearch class="icon is-small" slot="icon" />

                  <p slot="text">Load</p>
                </BaseButton>

                <BaseButton
                  ref="searchQuotesButton"
                  size="large"
                  @click="() => downloadSalesReport(salesReportParams)"
                  action="principal"
                  class="mt-3"
                >
                  <b-icon icon="download" custom-size="mdi-18px" slot="icon" />

                  <p slot="text">Download</p>
                </BaseButton>
              </div>
            </div>
          </div>

          <hr
            v-if="selectedChart === null && canViewRequestReport"
            style="width: 100%; height: 0.1rem"
          />

          <div class="w-100">
            <h2 class="mb-4">Other</h2>
            <div class="is-flex" style="flex-wrap: wrap; gap: 1.25rem">
              <ReportItem
                :loading="areReportsloading"
                :style="`display: ${
                  selectedChart === null || selectedChart === 'requestsByStage'
                    ? 'inherit'
                    : 'none'
                };`"
                :chart-data="requestsByStage"
                :chart-options="requestsByStageOptions"
                :chart-type="'funnel'"
                :selected-chart="selectedChart"
                :report-name="'requestsByStage'"
                :report-title="'Requests by Stage'"
                :label="`Client(s): ${salesReportParams.clientsText}`"
                :excel-report-title="'RequestsByStageReport'"
                :open-selected-source-data-table="openSelectedSourceDataTable"
                :export-table-to-excel="exportTableToExcel"
                :return-to-reports-view="returnToReportsView"
                :set-selected-chart="setSelectedChart"
                :charts-types="['funnel', 'line']"
                :height="'500px'"
                :minHeight="'200px'"
              >
                <div
                  slot="tags__section"
                  class="is-flex"
                  style="gap: 0.5rem; flex-wrap: wrap"
                >
                  <b-tag>
                    {{ salesReportParams.clientsText }}
                  </b-tag>

                  <b-tag> From {{ salesReportParams.from }} </b-tag>

                  <b-tag> To {{ salesReportParams.to }} </b-tag>
                </div>
              </ReportItem>

              <ReportItem
                :style="`display: ${
                  selectedChart === null || selectedChart === 'time'
                    ? 'inherit'
                    : 'none'
                };`"
                :chart-data="requestsByTime"
                :chart-options="requestsByTimeOptions"
                :chart-type="'line'"
                :selected-chart="selectedChart"
                :report-name="'time'"
                :report-title="'Requests by Time'"
                :excel-report-title="'QuotesByTimeReport'"
                :open-selected-source-data-table="openSelectedSourceDataTable"
                :export-table-to-excel="exportTableToExcel"
                :return-to-reports-view="returnToReportsView"
                :set-selected-chart="setSelectedChart"
                :height="'400px'"
                :minHeight="'200px'"
                :loading="areReportsloading"
              >
                <div
                  slot="tags__section"
                  class="is-flex"
                  style="gap: 0.5rem; flex-wrap: wrap"
                >
                  <b-tag>
                    {{ salesReportParams.clientsText }}
                  </b-tag>
                </div>
              </ReportItem>

              <ReportItem
                :style="`display: ${
                  selectedChart === null || selectedChart === 'clients'
                    ? 'inherit'
                    : 'none'
                };`"
                :chart-data="requestsByClients"
                :chart-options="requestsByClientOptions"
                :chart-type="'doughnut'"
                :selected-chart="selectedChart"
                :report-name="'clients'"
                :report-title="'Requests by Clients'"
                :excel-report-title="'QuotesByClientsReport'"
                :open-selected-source-data-table="openSelectedSourceDataTable"
                :export-table-to-excel="exportTableToExcel"
                :return-to-reports-view="returnToReportsView"
                :set-selected-chart="setSelectedChart"
                :loading="areReportsloading"
                :height="'400px'"
                :minHeight="'200px'"
              >
                <div
                  slot="tags__section"
                  class="is-flex"
                  style="gap: 0.5rem; flex-wrap: wrap"
                >
                  <b-tag>
                    {{ salesReportParams.clientsText }}
                  </b-tag>

                  <b-tag> From {{ salesReportParams.from }} </b-tag>

                  <b-tag> To {{ salesReportParams.to }} </b-tag>
                </div>
              </ReportItem>

              <ReportItem
                :style="`display: ${
                  selectedChart === null || selectedChart === 'destinations'
                    ? 'inherit'
                    : 'none'
                };`"
                :chart-data="requestsByDestinations"
                :chart-options="requestsByDestinationOptions"
                :chart-type="'bar'"
                :selected-chart="selectedChart"
                :report-name="'destinations'"
                :report-title="'Requests by Destinations'"
                :excel-report-title="'QuotesByDestinationReport'"
                :open-selected-source-data-table="openSelectedSourceDataTable"
                :export-table-to-excel="exportTableToExcel"
                :return-to-reports-view="returnToReportsView"
                :set-selected-chart="setSelectedChart"
                :loading="areReportsloading"
                :legend="'(*) <strong>Multicountry Requests Included:</strong> The data includes multicountry requests where multiple destinations are combined'"
                :height="'400px'"
                :minHeight="'200px'"
              >
                <div
                  slot="tags__section"
                  class="is-flex"
                  style="gap: 0.5rem; flex-wrap: wrap"
                >
                  <b-tag>
                    {{ salesReportParams.clientsText }}
                  </b-tag>

                  <b-tag> From {{ salesReportParams.from }} </b-tag>

                  <b-tag> To {{ salesReportParams.to }} </b-tag>
                </div>
              </ReportItem>
            </div>
          </div>
        </div>
        <div v-else class="is-flex mt-4" style="flex-wrap: wrap; gap: 1rem">
          <div>
            <b-skeleton
              height="100px"
              width="820px"
              :active="true"
            ></b-skeleton>
          </div>

          <div>
            <b-skeleton
              height="300px"
              width="400px"
              :active="true"
            ></b-skeleton>
          </div>

          <div>
            <b-skeleton
              height="300px"
              width="400px"
              :active="true"
            ></b-skeleton>
          </div>

          <div>
            <b-skeleton
              height="300px"
              width="400px"
              :active="true"
            ></b-skeleton>
          </div>

          <div>
            <b-skeleton
              height="300px"
              width="400px"
              :active="true"
            ></b-skeleton>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      title="Source Data"
      size="xl"
      v-model="isSourceDataModalOpen"
      @close="closeModal()"
    >
      <div class="source_data_modal__container">
        <h1 class="mb-2">Source data</h1>
        <b-table
          v-if="selectedSourceData && selectedSourceDataColumns"
          class="source_data_table"
          :data="selectedSourceData"
          :columns="selectedSourceDataColumns"
          hoverable
        >
        </b-table>
      </div>
    </b-modal>
    <div class="excel_table__container" style="display: none">
      <b-table
        v-if="selectedSourceData && selectedSourceDataColumns"
        class="source_data_table"
        :data="selectedSourceData"
        :columns="selectedSourceDataColumns"
        hoverable
      >
      </b-table>
    </div>
  </PageWrapper>
</template>

<script>
import * as XLSX from "xlsx";
import { mapGetters } from "vuex";
import { format } from "date-fns";
import helpers from "@/helpers";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import PageWrapper from "@/components/_shared/PageWrapper.vue";
import BaseButton from "../components/base-ui/BaseButton.vue";
import ProUserSign from "../components/_shared/ProUserSign.vue";
import ReportItem from "@/components/base-ui/ReportItem.vue";
import Multiselect from "vue-multiselect";
import {
  USER_ROLE,
  DATE_FORMAT_YYYY_MM_DD,
  DEFAULT_ALLOWED,
  USER_ROLE_IDS,
} from "@/constants";
import { PATH_INFO } from "@/router/path";

export default {
  name: "Reports",
  components: {
    PageWrapper,
    NavbarMain,
    BaseButton,
    ProUserSign,
    ReportItem,
    Multiselect,
  },
  data() {
    const min_from = format(new Date(2025, 0, 1), DATE_FORMAT_YYYY_MM_DD);

    const max_from = format(new Date(), DATE_FORMAT_YYYY_MM_DD);

    const clients = [{ id: "", name: "All Clients" }];

    const users = [{ id: "", name: "All Users" }];

    const usersText = "All Users";

    const clientsText = "All Clients";

    const defaultRequestsByClientOptionsParams = {
      from: min_from,
      to: max_from,
      loading: false,
      users,
      usersText,
      clients,
      clientsText,
    };

    return {
      isLoadingUsers: false,
      salesReportParams: {
        min_from: min_from,
        max_from: max_from,
        from: min_from,
        to: max_from,
        users,
        usersText,
        clients,
        clientsText,
      },
      requestsByTimeOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: false,
            text: "Monthly Sales",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        defaultParams: defaultRequestsByClientOptionsParams,
      },
      requestsByClientOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: false,
            text: "Doughnut Chart Example",
          },
        },
        defaultParams: defaultRequestsByClientOptionsParams,
      },
      requestsByDestinationOptions: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true, // Ensures bars start from zero
          },
        },
        plugins: {
          legend: {
            position: "bottom", // Positions the legend at the top
          },
          title: {
            display: false,
            text: "Requests by Destinations", // Title of the chart
          },
        },
        defaultParams: defaultRequestsByClientOptionsParams,
      },
      requestsByStageOptions: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true, // Ensures bars start from zero
          },
        },
        plugins: {
          legend: {
            position: "bottom", // Positions the legend at the top
          },
          title: {
            display: false,
            text: "Requests by Stage", // Title of the chart
          },
        },
        loading: false,
        defaultParams: defaultRequestsByClientOptionsParams,
      },
      loading: true,
      dateToStringOptions: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
      form: {
        data: null,
        assets_name: "",
      },
      image: null,
      preview: null,
      selectedChart: null,
      selectedSourceData: null,
      selectedSourceDataColumns: null,
      isSourceDataModalOpen: false,
      areReportsloading: false,
    };
  },
  computed: {
    ...mapGetters({
      authData: "auth/getAuthData",
      requestsByTime: "reports/getQuotesByTime",
      requestsByClients: "reports/getQuotesByClients",
      requestsByStage: "reports/getRequestsByStages",
      requestsByDestinations: "reports/getRequestsByDestinations",
      salesReport: "reports/getSalesReport",
      userSummary: "reports/getUserSummary",
      clients: "client/getClients",
      authUser: "auth/getAuthUserData",
      users: "users/getUsers",
    }),
    clientOptions() {
      return [{ id: "", name: "All Clients" }, ...this.clients];
    },
    userOptions() {
      const defaultOptions = [
        { id: "", name: "All Users" },
        this.authData.user,
      ];

      const filteredOptions = this.users.data?.filter(
        (user) => user.id !== this.authData.user.id
      );

      return [...defaultOptions, ...filteredOptions];
    },
    user() {
      return this.authData.user;
    },
    isProUser() {
      return this.authData.user_type.name === "pro";
    },
    createdAt() {
      return new Date(this.user.created_at).toLocaleDateString(
        undefined,
        this.dateToStringOptions
      );
    },
    userPhoto() {
      if (this.preview) return this.preview;
      if (this.form.assets_name) return this.form.data;
      return (
        this.user.photo ??
        "https://place-hold.it/610x380/DDDDDD/fff.jpg?bold&fontsize=50&text=UserPhoto"
      );
    },
    canViewRequestReport() {
      if (process.env.NODE_ENV !== "production") return true;

      const allowed = DEFAULT_ALLOWED.concat([
        "jloaiza@encounterlatinamerica.com",
        "jloaiza@ela.travel",
      ]);

      return allowed.includes(this.authUser.email);
    },
  },
  methods: {
    resetSalesReportFilters() {
      this.salesReportParams = {
        ...this.salesReportParams,
        from: this.salesReportParams.min_from,
        to: this.salesReportParams.max_from,
        clients: [{ id: "", name: "All Clients" }],
      };
    },
    returnToReportsView($event) {
      $event.stopPropagation();
      this.setSelectedChart(null);
    },
    exportTableToExcel(sourceData, filename = "table") {
      this.setSelectedSourceData(sourceData);
      this.$nextTick(() => {
        const table = document.querySelector(".excel_table__container table");
        if (!table) {
          console.error("Table element not found!");
          return;
        }

        const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(workbook, `${filename}.xlsx`);
      });
    },
    transformToTableData(chartData) {
      const data = chartData.labels.map((label, index) => ({
        country: label,
        quotes: chartData.datasets[0].data[index],
      }));

      const columns = [
        { field: "country", label: "Country" },
        { field: "quotes", label: "Requests by Country", numeric: true },
      ];

      return { data, columns };
    },
    openSelectedSourceDataTable(sourceData = null) {
      const { data, columns } = this.transformToTableData(sourceData);

      this.selectedSourceData = data;
      this.selectedSourceDataColumns = columns;
      this.isSourceDataModalOpen = sourceData !== null;
    },
    setSelectedSourceData(sourceData) {
      const { data, columns } = this.transformToTableData(sourceData);

      this.selectedSourceData = data;
      this.selectedSourceDataColumns = columns;
    },
    closeModal() {
      this.isSourceDataModalOpen = false;
    },
    setSelectedChart(chart) {
      this.selectedChart = chart;
    },
    handleTriggerClick() {
      const elem = this.$refs.imageSelector;
      elem.click();
    },
    handleFileUpload(event) {
      if (event.target.files[0].name) {
        const fileName = event.target.files[0].name.substring(
          0,
          event.target.files[0].name.lastIndexOf(".")
        );
        this.form.assets_name = fileName;
        this.form.data = event.target.files[0];
      }

      const reader = new FileReader();
      this.loading = true;

      reader.onload = function (e) {
        this.preview = e.target.result;
        this.loading = false;
      }.bind(this);

      reader.onerror = function (error) {
        console.info(error);
        this.loading = false;
      };
      this.image = event.target.files[0];
      reader.readAsDataURL(this.image);
    },
    savePhoto() {
      this.loading = true;
      this.$store
        .dispatch("users/updateUserPhoto", this.form)
        .then(() => {
          this.$store.dispatch("auth/getUserData");
          this.resetForm();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetForm() {
      this.form = {
        data: null,
        assets_name: "",
      };
      this.preview = null;
    },
    async loadUserSummary() {
      await this.$store.dispatch("reports/loadUserSummary");
    },
    async loadQuotesByClients(params) {
      const adaptedParams = {
        client: params?.clients?.map((client) => client.id),
        from: params?.from,
        to: params?.to,
        user: params?.users?.map((user) => user.id),
      };

      await this.$store.dispatch("reports/getQuotesByClients", adaptedParams);
    },
    async loadQuotesByTime(params) {
      const adaptedParams = {
        client: params?.clients?.map((client) => client.id),
        from: params?.from,
        to: params?.to,
        user: params?.users?.map((user) => user.id),
      };

      await this.$store.dispatch("reports/getQuotesByTime", adaptedParams);
    },
    async loadQuotesByDestinations(params) {
      const adaptedParams = {
        client: params?.clients?.map((client) => client.id),
        from: params?.from,
        to: params?.to,
        user: params?.users?.map((user) => user.id),
      };

      await this.$store.dispatch(
        "reports/loadQuotesByDestinations",
        adaptedParams
      );
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
    async downloadSalesReport(params) {
      this.setLoading(true);

      const adaptedParams = {
        client: params?.clients?.map((client) => client.id),
        from: params?.from,
        to: params?.to,
        user: params?.users?.map((user) => user.id),
      };

      await this.$store.dispatch("reports/loadSalesReport", adaptedParams);

      const workbook = XLSX.utils.book_new();

      const worksheet = XLSX.utils.json_to_sheet(this.salesReport);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "SalesReport.xlsx";
      link.click();

      URL.revokeObjectURL(link.href);

      this.setLoading(false);
    },
    async loadReports() {
      this.areReportsloading = true;

      await Promise.allSettled([
        await this.loadUserSummary(),
        await this.loadQuotesByTime(this.salesReportParams),
        await this.loadQuotesByClients(this.salesReportParams),
        await this.loadQuotesByDestinations(this.salesReportParams),
        await this.getRequestsByStages(this.salesReportParams),
      ]);

      this.areReportsloading = false;

      console.log("this.sales", this.areReportsloading);
    },
    async getRequestsByStages(params = {}) {
      const adaptedParams = {
        client: params?.clients?.map((client) => client.id),
        from: params?.from,
        to: params?.to,
        user: params?.users?.map((user) => user.id),
      };

      await this.$store.dispatch("reports/getRequestsByStages", adaptedParams);
    },
    async loadClients() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          return await this.$store.dispatch("client/getClients", {
            page: 1,
          });
        },
        functionToExecuteOnFail: async (error) => {
          this.loading = false;
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
    async loadUsers(payload = {}) {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          this.isLoadingUsers = true;

          await this.$store.dispatch("users/getUsers", {
            page: 1,
            name: payload?.name || "",
            role: [USER_ROLE_IDS.ADMIN, USER_ROLE_IDS.TRAVEL_AGENT].join(","),
          });

          this.isLoadingUsers = false;
        },
        functionToExecuteOnFail: async (error) => {
          this.loading = false;
          this.isLoadingUsers = false;
          this.$buefy.toast.open({
            duration: 5000,
            message: "Error trying to get users, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });
    },
    async loadInitialData() {
      this.loading = true;
      await Promise.allSettled([
        this.loadReports(),
        this.loadClients(),
        this.loadUsers(),
      ]);
      this.loading = false;
    },
    handleRequestsOptionsClientsUpdate(params) {
      let clientsText = "All Clients";

      if (params.clients.length > 0) {
        clientsText = params.clients.map((client) => client.name).join(",");
      }

      params.clientsText = clientsText;
    },
    handleRequestsOptionsUsersUpdate(params) {
      let usersText = "All Users";

      if (params.users.length > 0) {
        usersText = params.users.map((user) => user.name).join(",");
      }

      params.usersText = usersText;
    },
    async validateSearchingUsers(event) {
      if (event.length > 3) {
        await this.loadUsers({ name: event });
      }
    },
  },
  created() {
    const canViewReportsSection = !helpers.hasAnyRoles(
      this.authData.user,
      [USER_ROLE.TRAVEL_AGENT],
      false
    );

    if (!canViewReportsSection) {
      this.$router.push({
        path: PATH_INFO.HOME.path,
      });
    }
  },
  mounted() {
    this.loadInitialData();
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
h1 {
  font-weight: 700;
  font-size: 1.5rem;
}
.bg-transparent {
  background-color: transparent;
  color: #fff;
}
.loading__container {
  display: flex;
  flex-direction: column;
}
.loading__container .b-skeleton + .b-skeleton {
  margin-top: 0rem;
}
.profile__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 0.5rem;
  margin-top: 2rem;
}
.profile__picture {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  height: 18rem;
  width: 100%;
  border-radius: 1rem;
  position: relative;
}
.profile__picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile__picture__content {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #eee;
  width: 100%;
  padding: 0.5rem;
}
.profile__picture__content > * {
  width: 100%;
  text-align: center;
}
.profile__picture__content h2 {
  font-size: 1rem;
  font-weight: 500;
}
.profile__picture__content .profile__email {
  font-size: 0.9rem;
}
.profile__content {
  margin: 1rem 0;
  text-align: center;
}
.profile__content h2 {
  font-weight: 700;
  font-size: 1.2rem;
}
.profile__date {
  color: #bebebe;
  margin: 0.5rem 0;
  margin-top: 1.5rem;
}
#file {
  display: none;
}
.prouser__sign__container {
  position: relative;
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
}
.profile__content__quotes {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}
.profile__content__quotes > div {
  display: grid;
  place-items: center;
  padding: 1rem;
  box-shadow: 0px 0px 30px -12px #ccc;
  flex: 1;
  border-radius: 0.5rem;
}
.profile__content__quotes > div p {
  font-weight: 600;
}
.profile__content__quotes > div:last-of-type {
  background-color: #8ed793;
}
.reports__container {
  display: flex;
  gap: 2rem;
}
.reports__container hr {
  height: 100%;
  width: 2px;
  background-color: #ccc;
}
.profile__info__container {
  min-width: 14rem;
}
.profile__reports__container {
  width: 100%;
}
.profile__reports__container h2 {
  font-weight: 800;
  font-size: 1.25rem;
}
.reports__charts__container {
  flex-grow: 1;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.chart__container {
  width: 25rem;
  box-shadow: 0px 0px 30px -15px #ccc;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  position: relative;
  gap: 1rem;
}
.chart__container.selected {
  width: 100%;
  /* height: 100%; */
  justify-content: flex-start;
}
.chart__container:hover {
  border: 1px solid #ccc;
  transition: all 0.3s linear;
}

.chart__header__options {
  gap: 0.5rem;
  display: none;
}
.chart__container.selected .chart__header__options {
  display: flex;
}
.chart__header__options > button {
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 0.85rem;
}
.source_data_modal__container {
  padding: 1rem;
}
.source_data_table th,
.source_data_table td {
  text-align: center !important;
  vertical-align: middle !important;
}
.source_data_table.b-table .table th .th-wrap {
  justify-content: center;
}

.edit_photo__button,
.edit_photo__button span {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.edit_photo__button .icon {
  margin-left: 0rem !important;
  margin-right: 0rem !important;
}

.report_config__select {
  /* width: 20rem; */
  width: 50%;
}

.report_config__select label {
  font-size: 0.8rem;
}

.request_date__field {
  height: 1.75rem;
  min-width: 49%;
}

/* .profile__reports__container .multiselect {
  min-width: 50%;
  max-width: 50%;
} */

.sales_report__container {
  box-shadow: 0px 0px 25px -10px #ccc;
  padding: 1.4rem;
  border-radius: 0.5rem;
}

@media screen and (max-width: 480px) {
  .reports__container {
    flex-direction: column;
    height: 100%;
  }
  .reports__container hr {
    width: 100%;
    height: 2px;
    margin: 0.25rem 0;
  }
  .reports__charts__container {
    margin-top: 2rem;
  }
  .chart__container {
    pointer-events: none;
  }
}
</style>
