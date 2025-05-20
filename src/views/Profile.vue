<template>
  <PageWrapper>
    <NavbarMain />
    <div class="mt-5 profile__container">
      <div class="profile__info__container">
        <h1 class="text-center">Profile</h1>
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
            <b-button
              @click="handleTriggerClick"
              class="edit_photo__button"
              style="font-size: 0.8rem"
            >
              <b-icon icon="pencil"></b-icon>
              Edit photo
            </b-button>
            <BaseButton
              action="tercery"
              v-if="form.assets_name"
              @click="savePhoto"
            >
              <p slot="text">
                Save
                <i
                  class="button bg-transparent button-saas is-radius is-size is-small"
                >
                  <IconCheck class="icon is-small" />
                </i>
              </p>
            </BaseButton>
            <div class="profile__content">
              <div class="prouser__sign__container" v-if="isProUser">
                <ProUserSign />
              </div>
              <p class="profile__date">Member since {{ createdAt }}</p>
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload($event)"
              id="file"
              class="input file"
              title=" "
              ref="imageSelector"
            />
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script>
import * as XLSX from "xlsx";
import { mapGetters } from "vuex";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import PageWrapper from "@/components/_shared/PageWrapper.vue";
import BaseButton from "../components/base-ui/BaseButton.vue";
import ProUserSign from "../components/_shared/ProUserSign.vue";

export default {
  name: "Profile",
  components: {
    PageWrapper,
    NavbarMain,
    BaseButton,
    ProUserSign,
  },
  data() {
    return {
      chartOptions: {
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
      },
      chartOptions2: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: false,
            text: "Doughnut Chart Example",
          },
        },
      },
      chartOptions3: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true, // Ensures bars start from zero
          },
        },
        plugins: {
          legend: {
            position: "top", // Positions the legend at the top
          },
          title: {
            display: false,
            text: "Requests by Destinations", // Title of the chart
          },
        },
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
            position: "top", // Positions the legend at the top
          },
          title: {
            display: false,
            text: "Requests by Stage", // Title of the chart
          },
        },
        loading: false,
        params: {
          from: null,
          to: null,
          clients: [],
          clientsText: "All",
        },
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
    };
  },
  computed: {
    ...mapGetters({
      authData: "auth/getAuthData",
      requestsByTime: "reports/getQuotesByTime",
      requestsByClients: "reports/getQuotesByClients",
      requestsByStage: "reports/getRequestsByStages",
      requestsByDestinations: "reports/getRequestsByDestinations",
      userSummary: "reports/getUserSummary",
      clients: "client/getClients",
    }),
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
  },
  methods: {
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
    async loadQuotesByClients() {
      await this.$store.dispatch("reports/getQuotesByClients");
    },
    async loadQuotesByTime() {
      await this.$store.dispatch("reports/getQuotesByTime");
    },
    async loadUserSummary() {
      await this.$store.dispatch("reports/loadUserSummary");
    },
    async loadQuotesByDestinations() {
      await this.$store.dispatch("reports/loadQuotesByDestinations");
    },
    async loadReports() {
      await Promise.allSettled([
        await this.loadUserSummary(),
        await this.loadQuotesByTime(),
        await this.loadQuotesByClients(),
        await this.loadQuotesByDestinations(),
        await this.getRequestsByStages(),
      ]);
    },
    async getRequestsByStages(params = {}) {
      this.requestsByStageOptions.loading = true;

      const adaptedParams = {
        client: params?.clients?.map((client) => client.id),
        from: params?.from,
        to: params?.to,
      };

      await this.$store.dispatch("reports/getRequestsByStages", adaptedParams);

      this.requestsByStageOptions.loading = false;
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
    async loadInitialData() {
      this.loading = true;
      await Promise.allSettled([this.loadReports(), this.loadClients()]);
      this.loading = false;
    },
    handleRequestsByStageOptionsClientsUpdate() {
      let clientsText = "All";

      if (this.requestsByStageOptions.params.clients.length > 0) {
        clientsText = this.requestsByStageOptions.params.clients
          .map((client) => client.name)
          .join(",");
      }

      this.requestsByStageOptions.params.clientsText = clientsText;
    },
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
.profile__container {
  display: flex;
  gap: 2rem;
  height: 70vh;
  justify-content: center;
  align-items: center;
}
.profile__container hr {
  height: 100%;
  width: 2px;
  background-color: #ccc;
}
.profile__info__container {
  min-width: 16rem;
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
</style>
