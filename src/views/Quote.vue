<template>
  <PageWrapperWithSidebar>
    <Loading :loading="loading" :loadingText="loadingText" />
    <div class="is-flex">
      <div class="blnavsecondary pb-0" style="width: 100%">
        <NavbarMain :showLogo="false" :setLoading="setLoading" />
        <div class="quote__container">
          <div
            class="quote_sidebar__container"
            style="border-right: 1px solid #eee"
          >
            <div
              class="quote_sidebar__container_fixed"
              v-scroll="{ className: 'fixed_top', threshold: 50 }"
            >
              <RequestNav v-if="isLinkedToRequest" :setLoading="setLoading" />
              <hr
                v-if="isLinkedToRequest"
                style="width: 100%; height: 2px; background-color: #ccc"
              />
              <NavbarSecondary />
            </div>
          </div>
          <div class="quote_content__container">
            <div class="columns mb-0">
              <div class="column" style="position: relative">
                <MainItineraryContent
                  :itinerary="itinerary"
                  :loadServicesItinerary="loadServicesItinerary"
                />
                <ViewContractSalesManualModal />
              </div>
            </div>
            <div>
              <router-view
                :setLoading="setLoading"
                :loadItinerary="loadItinerary"
                :loadCurrencies="loadCurrencies"
                :loadLanguages="loadLanguages"
                :loadClients="loadClients"
                :loadRequestByQuote="loadRequestByQuote"
                :loadClientContracts="loadClientContracts"
                :loadPassengersItinerary="loadPassengersItinerary"
                :loadPricesItinerary="loadPricesItinerary"
                :loadServicesItinerary="loadServicesItinerary"
                :loadServiceTypes="loadServiceTypes"
                :loadServicesTags="loadServicesTags"
                :loadItineraryDays="loadItineraryDays"
                :loadPublishedItinerary="loadPublishedItinerary"
                :validateFunctionExecution="validateFunctionExecution"
              ></router-view>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="historyView.isActive && itinerary.data"
        class="history__footer__background"
      >
        <div>
          <p
            class="history__view__opener"
            @click="() => setItineraryHistoryModal(true)"
          >
            <IconInfo class="icon color-8 is-xsmall" /> Quote History
          </p>
          <b-taglist attached class="mb-0 is-relative">
            <b-tag
              type="is-dark"
              class="mt-2 mr-2"
              style="border-radius: 0.25rem"
            >
              Version
              <strong style="color: #fff">{{
                itinerary.data.version
              }}</strong></b-tag
            >
            <b-tag
              rounded
              type="is-dark"
              class="mb-0"
              style="background-color: #444"
            >
              {{ itinerary.data.edition.user.name }} -
              <strong style="color: #fff">{{
                getItineraryEditionDatetime(itinerary.data)
              }}</strong>
            </b-tag>
          </b-taglist>
          <h4 class="mt-1">
            {{ itineraryTitle }}
          </h4>
        </div>
        <div class="is-flex">
          <BaseButton
            class="m-0 mr-2"
            action="secondary"
            @click="returnToOriginalView"
          >
            <p slot="text">Exit</p>
          </BaseButton>
          <BaseButton
            v-if="this.itinerary.data.restorable"
            action="tercery"
            @click="
              () =>
                setItineraryRestoreVersionModal({
                  isOpen: true,
                  selectedVersion: this.itinerary.data,
                })
            "
          >
            <p slot="text">Restore to this version</p>
          </BaseButton>
        </div>
      </div>
    </div>
    <RestoreItineraryVersionAlert
      :isOpen="historyView.restoreModal.isOpen"
      :itineraryVersion="historyView.restoreModal.selectedVersion"
      :restoreItineraryByVersion="validatedRestoreItineraryByVersion"
      :getItineraryEditionDatetime="getItineraryEditionDatetime"
      @update:setItineraryRestoreVersionModal="
        setItineraryRestoreVersionModal($event)
      "
    />

    <QuoteExportFailedAlert />

    <QuoteHistoryModal
      v-if="itinerary.data"
      :isModalOpen="historyView.isModalOpen"
      :itineraryId="itinerary.data.id"
      :getItineraryHistory="getItineraryHistory"
      :restoreItineraryByVersion="restoreItineraryByVersion"
      :setItineraryRestoreVersionModal="setItineraryRestoreVersionModal"
      @update:setIsServiceHistoryModalOpen="
        (event) => setItineraryHistoryModal(event)
      "
    />
  </PageWrapperWithSidebar>
</template>
<script>
import ViewContractSalesManualModal from "@/components/_shared/ViewContractSalesManualModal.vue";
import PageWrapperWithSidebar from "@/components/_shared/PageWrapperWithSidebar.vue";
import MainItineraryContent from "@/components/_shared/MainItineraryContent.vue";
import NavbarSecondary from "@/components/_shared/NavbarSecondary.vue";
import RequestNav from "@/components/requests/RequestNav.vue";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import Loading from "@/components/_shared/Loading.vue";
import QuoteHistoryModal from "@/components/quote-views/_shared/QuoteHistoryModal.vue";
import QuoteExportFailedAlert from "@/components/quote-views/_shared/QuoteExportFailedAlert.vue";
import RestoreItineraryVersionAlert from "@/components/quote-views/_shared/RestoreItineraryVersionAlert.vue";
import { PATH_INFO } from "@/router/path";
import { mapGetters } from "vuex";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/request";
import { datesHelper } from "@/utils/dates";
import {
  saveInLocalStorage,
  manageLocalStorageExpiration,
} from "@/utils/localStorage";

export default {
  name: "Quote",
  components: {
    PageWrapperWithSidebar,
    Loading,
    NavbarSecondary,
    RequestNav,
    MainItineraryContent,
    NavbarMain,
    ViewContractSalesManualModal,
    QuoteHistoryModal,
    RestoreItineraryVersionAlert,
    QuoteExportFailedAlert,
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      historyView: "utils/getHistoryView",
      datesFormat: "itinerary/getDatesFormat",
      request: "request/getRequest",
    }),
    itineraryTitle() {
      return this.itinerary?.data?.title?.value || "";
    },
    isLinkedToRequest() {
      return ![null, undefined].includes(this.request?.id);
    },
  },
  beforeRouteLeave(to, from, next) {
    next();
    this.resetCurrentItinerary();
  },
  created() {
    this.checkFromItineraryVersion();
    this.loadTags();
    this.loadItinerariesTags();
  },
  methods: {
    loadRequestByQuote() {
      const requestId = this.itinerary.data.file_id;
      if (requestId) {
        this.$store.dispatch("request/getRequestById", { id: requestId });
      }
    },
    checkFromItineraryVersion() {
      for (let key in localStorage) {
        if (key.startsWith("from_itinerary_version"))
          manageLocalStorageExpiration(key, 600);
      }
    },
    async restoreItineraryByVersion(itineraryVersion, force = false) {
      if (!force) {
        return this.setItineraryRestoreVersionModal({
          isOpen: true,
          selectedVersion: itineraryVersion,
        });
      }

      this.setLoadingText(
        "We are restoring your itinerary<br><br><span style='font-weight: 400'><strong class='mr-1'>⏱︎</strong> This process may take around 1 minute</span>"
      );
      this.setLoading(true);

      this.setItineraryHistoryModal(false);

      await this.$store.dispatch("itinerary/restoreItineraryByVersion", {
        itineraryId: this.itinerary.data.id,
        version: itineraryVersion.version,
      });

      saveInLocalStorage(
        `from_itinerary_version_${itineraryVersion.id}`,
        {
          version: itineraryVersion.version,
        },
        true
      );

      this.returnToOriginalView();

      this.setLoading(false);
    },
    async validatedRestoreItineraryByVersion(itineraryVersion, force = false) {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          return await this.restoreItineraryByVersion(itineraryVersion, force);
        },
        functionToExecuteOnFail: async (error) => {
          this.setItineraryHistoryModal(false);
          this.setItineraryRestoreVersionModal({
            isOpen: false,
            selectedVersion: null,
          });
          const errorMessage =
            error?.response?.data?.errors?.data || DEFAULT_ERROR_MESSAGE;
          this.$buefy.toast.open({
            duration: 5000,
            message: errorMessage,
            position: "is-top",
            type: "is-danger",
            pauseOnHover: true,
          });
        },
      });
    },
    setItineraryHistoryModal(newValue = false) {
      this.$store.dispatch("utils/setHistoryView", {
        historyView: {
          isModalOpen: newValue,
        },
      });
      if (newValue) this.getItineraryHistory();
    },
    setItineraryRestoreVersionModal({
      isOpen = false,
      selectedVersion = null,
    }) {
      this.$store.dispatch("utils/setHistoryView", {
        historyView: {
          isModalOpen: false,
          restoreModal: {
            isOpen,
            selectedVersion,
          },
        },
      });
    },
    async getItineraryHistory(payload = null) {
      this.setLoading(true);
      await this.$store.dispatch("itinerary/getItineraryHistory", payload);
      this.setLoading(false);
    },
    returnToOriginalView() {
      const currentUrl = new URL(window.location.href);

      const newPath = currentUrl.pathname.replace("/history", "");
      currentUrl.searchParams.delete("version");

      const newUrl = `${newPath}${currentUrl.search}`;
      window.location.href = newUrl;
    },
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
      this.$store.dispatch("request/resetRequestState");
    },
    async loadItinerary(uuid = null, force = false) {
      return await this.validateFunctionExecution(
        async () => {
          const idToSet = uuid || this.$route.query.itinerary;
          const response = await this.$store.dispatch("itinerary/read", {
            uuid: idToSet,
            force,
          });
          this.loadRequestByQuote();
          return response;
        },
        () => {
          this.$router.push(PATH_INFO.NOT_FOUND.path);
        }
      );
    },
    async loadCurrencies() {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("currency/getCurrencies", {
          page: 1,
        });
      });
    },
    async loadLanguages() {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("language/getLanguages", {
          page: 1,
        });
      });
    },
    async loadTags() {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("tags/list", {
          page: 1,
        });
      });
    },
    async loadClients() {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("client/getClients", {
          page: 1,
        });
      });
    },
    async loadClientContracts(clientId) {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("client/getClientContracts", {
          id: clientId,
          contract_id: this.itinerary.data
            ? this.itinerary.data.contract_id
            : "",
        });
      });
    },
    async loadPassengersItinerary(payload = null) {
      return await this.validateFunctionExecution(async () => {
        if (payload)
          return await this.$store.dispatch(
            "itinerary/list_passengers",
            payload
          );
      });
    },
    async loadPricesItinerary(reload = false) {
      return await this.validateFunctionExecution(async () => {
        if (this.$route.query.itinerary) {
          return await this.$store.dispatch("itinerary/list_prices", {
            uuid: this.$route.query.itinerary,
            reload,
          });
        }
      });
    },
    async loadServicesItinerary(payload = null) {
      return await this.validateFunctionExecution(async () => {
        if (payload) {
          return await this.$store.dispatch("itinerary/list_services", payload);
        }
      });
    },
    async loadServiceTypes() {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("service_types/list", {
          page: 1,
          query: "",
        });
      });
    },
    async loadServicesTags() {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("tags/getServicesTags", {
          page: 1,
          query: "",
          limit: 1000,
        });
      });
    },
    async loadItinerariesTags() {
      return await this.validateFunctionExecution(async () => {
        return await this.$store.dispatch("tags/getItinerariesTags", {
          page: 1,
          query: "",
          limit: 1000,
        });
      });
    },
    async loadItineraryDays(reload = true) {
      return await this.validateFunctionExecution(async () => {
        if (this.itinerary.data && this.$route.query.itinerary) {
          return await this.$store.dispatch("itineraryDays/getItineraryDays", {
            uuid: this.$route.query.itinerary,
            reload,
          });
        }
      });
    },
    async loadPublishedItinerary() {
      return await this.validateFunctionExecution(async () => {
        if (this.itinerary.data && this.$route.query.itinerary) {
          return await this.$store.dispatch(
            "itinerary/getPublishedConfigAndImages",
            this.$route.query.itinerary
          );
        }
      });
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
        await this.$store.dispatch("itinerary/check_version");
        this.$buefy.toast.open({
          duration: 5000,
          message: errorMessage,
          position: "is-top",
          type: "is-danger",
          pauseOnHover: true,
        });
      }
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
.quote_sidebar__container {
  min-width: 15rem;
  position: relative;
  z-index: 10;
}

.quote_sidebar__container_fixed {
  height: auto;
  position: fixed;
  z-index: 1;
  left: 3.5rem;
}

.quote_sidebar__container_fixed.fixed_top {
  top: 1rem;
}

@media screen and (max-width: 480px) {
  .quote_sidebar__container_fixed {
    position: relative;
    left: 0rem;
  }

  .quote_sidebar__container_fixed > hr {
    margin: 0.5rem 0;
  }

  .quote_sidebar__container {
    border-right: none !important;
  }
}
</style>
