<template>
  <section>
    <GlobalEvents
      @keydown.alt.enter="keymap"
      @keydown.enter="keymap"
      @keydown.esc="keymap"
      @keydown.46="keymap"
      @keydown.116="keymap"
      @keydown.alt.78="keymap"
      @keydown.alt.69="keymap"
      @keydown.alt.70="keymap"
      @keydown.alt.65="keymap"
      @keydown.alt.71="keymap"
      @keydown.alt.77="keymap"
      @keydown.alt.79="keymap"
      @keydown.alt.80="keymap"
      @keydown.alt.83="keymap"
      @keydown.alt.84="keymap"
      @keydown.alt.86="keymap"
      @keydown.alt.88="keymap"
      @keydown.shift.219="keymap"
      @keydown.ctrl.77="keymap"
      @keydown.ctrl.79="keymap"
      @keydown.ctrl.82="keymap"
    />
    <BaseModal
      :isComponentModalActive="modalPreventCreateService"
      :closeModal="handleModalPreventCreateService"
    >
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title">Your current changes will not be saved</span>
      <span slot="paragraph"
        >Are you sure to <span class="has-text-weight-semibold">create</span> a
        new service?
      </span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="handleModalPreventCreateService()"
          action="secondary"
          size="medium"
          :disabled="loading"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="confirmAddService()"
          action="tercery"
          size="medium"
          :disabled="loading"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>
    <BaseModal
      :isComponentModalActive="modalPreventGotoSearchServices"
      :closeModal="handleModalPreventGotoSearchServices"
    >
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title">Your current changes will not be saved</span>
      <span slot="paragraph"
        >Are you sure to go to
        <span class="has-text-weight-semibold">Search Services?</span>
      </span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="handleModalPreventGotoSearchServices()"
          action="secondary"
          size="medium"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="
            searchServices();
            handleModalPreventGotoSearchServices();
            handleValidateIsEditing(false);
            removeItem(services_itinerary.length - 1);
          "
          action="tercery"
          size="medium"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>
    <div v-if="!hideElementByCondition" class="servicesButtonsContainer">
      <BaseButton
        size="medium"
        @click="
          validateIsEditing
            ? handleModalPreventGotoSearchServices()
            : searchServices();
          nextStep();
        "
        v-if="itinerary.data && itinerary.data.id && showServices"
        :disabled="disableQuoteByStatus"
        action="outline-gray"
        :class="
          focusedGuideBoxClass('is-pulled-right searchServicesButton', 13)
        "
      >
        <i slot="icon">
          <BaseButtonLock v-if="disableQuoteByStatus" class="icon-check" />
          <IconSearch v-else class="icon is-small" />
        </i>
        <p slot="text">Search Services</p>
      </BaseButton>
      <GuideBox
        title="Adding a new service"
        description="Well done you have made the first step, now, as you can see, we can create add a service in 2 different ways, the first way , clicking on 'Search Services'"
        :step="13"
        :positionY="-180"
        :positionX="60"
        v-if="!loading"
        :showBackButton="false"
        :showNextButton="false"
      />
      <GuideBox
        title="Adding a new service"
        description="Now, let's add another one but now, in a faster way, click on 'Add Service'"
        :step="24"
        :positionX="-50"
        :positionY="-180"
        :showNextButton="false"
      />
      <GuideBox
        title="Adding a new service"
        description="Choose a date to start the service"
        :step="25"
        :positionX="-650"
        :positionY="20"
        :showBackButton="false"
      />
      <GuideBox
        title="Adding a new service"
        description="To add the service, click on '✔'"
        :step="30"
        :positionX="100"
        :positionY="0"
        :showNextButton="false"
        v-if="!loading"
      />
      <GuideBox
        title="Adding a new service"
        description="Great, you have added a new service sucesfully"
        :step="31"
        :positionX="-350"
        :positionY="-100"
        v-if="!loading"
        :showBackButton="false"
      />
      <GuideBox
        title="Creating an itinerary"
        description="Now is time to make an itinerary, let´s move to it, click on 'Itinerary'"
        :step="32"
        :positionX="-650"
        :positionY="-100"
        :showNextButton="false"
      />
    </div>
    <div
      v-if="hideBasicInfo && !hideElementByCondition"
      class="save_button__container"
    >
      <BaseButton
        size="medium"
        @click="
          handleSaveItinerary();
          resetForm();
        "
        :disabled="disableQuoteByStatus || loading"
        :lock="disableQuoteByStatus"
        v-if="itinerary.data && itinerary.data.id"
        action="tercery"
      >
        <IconCheck slot="icon" class="icon is-small" />
        <p slot="text">Save</p>
      </BaseButton>
      <BaseButton
        size="medium"
        @click="
          nextStep();
          handleSaveItinerary();
          resetForm();
        "
        :class="focusedGuideBoxClass('is-pulled-right', 12)"
        :disabled="disableQuoteByStatus || loading"
        :lock="disableQuoteByStatus"
        v-else
        action="tercery"
        :data-test-id="constants.DATA_TEST_ID_VALUES.CREATE_ITINERARY_BUTTON"
      >
        <IconCelebration slot="icon" class="icon is-small" />
        <p slot="text">Create {{ itineraryTypeLabel }}</p>
      </BaseButton>
      <GuideBox
        title="Creating a new quote"
        description="Great, now the last step is to click on 'Create itinerary'"
        :step="12"
        :positionY="-50"
        :positionX="150"
        :showNextButton="false"
        v-if="!loading"
      />
    </div>
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :overlay="true"
      :right="true"
      :can-cancel="['escape']"
      v-model="isComponentModalActive"
      class="sidebarRight sidebarSearch"
      ref="sidebarContent"
    >
      <GuideBox
        title="Adding a new service"
        description="Now let's go back to see your added service, click on 'Back Services'"
        :step="22"
        :positionX="20"
        :positionY="70"
        v-if="!loading"
        :showBackButton="false"
        :showNextButton="false"
      />
      <div
        :class="focusedGuideBoxClass('topCloseSideBar is-flex pr-5 p-2', 22)"
      >
        <a
          @click="
            isComponentModalActive = false;
            handleServicesAdded(0);
            nextStep();
          "
          class="is-flex color-8"
        >
          <IconChevronLeft class="icon is-small mr-2" />
          <div>
            <span class="color-4 has-text-weight-medium is-h2">
              Back services</span
            >
          </div>
        </a>
        <a
          @click="isComponentModalActive = false"
          class="color-8 sideBarCloseButton"
        >
          <IconClose class="icon is-small" />
        </a>
      </div>
      <div class="SideBarBox">
        <div class="columns">
          <div class="column">
            <AddServicesModalSearchForm
              :handleSearchServicesContract="handleSearchServicesContract"
              :getDestinationsPerCountry="getDestinationsPerCountry"
              :getServices="getServices"
              :updateSearchServicesPayload="updateSearchServicesPayload"
              :setLoading="setLoading"
            />
          </div>
          <div class="column is-four-fifths pt-2 pr-0">
            <AddServicesModalResults
              :createItineraryServiceForm="createItineraryServiceForm"
              :getServicePrice="getServicePrice"
              :getServices="getServices"
              :setRoomsSelectedAccomPack="setRoomsSelectedAccomPack"
              :updateSearchServicesPayload="updateSearchServicesPayload"
            />
          </div>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>

<script>
import GlobalEvents from "vue-global-events";
import { mapGetters } from "vuex";
import { addDaysToDate } from "@/utils/utils";
import AddServicesModalSearchForm from "./AddServicesModalSearchForm.vue";
import AddServicesModalResults from "./AddServicesModalResults.vue";
import { PATH_INFO } from "@/router/path";
import GuideBox from "../../_shared/GuideBox.vue";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { EDIT_SERVICE_SIDEBAR_TABS_IDS } from "@/constants/services";

export default {
  name: "AddServicesModal",
  components: {
    AddServicesModalSearchForm,
    AddServicesModalResults,
    GlobalEvents,
    GuideBox,
  },
  data() {
    return {
      isComponentModalActive: false,
      modalPreventGotoSearchServices: false,
      constants: { DATA_TEST_ID_VALUES },
    };
  },
  props: {
    currentRow: {
      type: Object,
      default: () => {},
    },
    itineraryTypeLabel: {
      type: String,
      default: "",
    },
    localSaving: {
      type: Object,
      default: () => {},
    },
    createItineraryService: {
      type: Function,
      default: () => {},
    },
    createItineraryServiceForm: {
      type: Function,
      default: () => {},
    },
    dispatchServicesItinerary: {
      type: Function,
      default: () => {},
    },
    getLocationCountry: {
      type: Function,
      default: () => {},
    },
    getDestinationsPerCountry: {
      type: Function,
      default: () => {},
    },
    getServicePrice: {
      type: Function,
      default: () => {},
    },
    getServices: {
      type: Function,
      default: () => {},
    },
    handleSearchServicesContract: {
      type: Function,
      default: () => {},
    },
    hideBasicInfo: {
      type: Boolean,
      default: true,
    },
    handleRemoveService: {
      type: Function,
      default: () => false,
    },
    handleSaveItinerary: {
      type: Function,
      default: () => {},
    },
    handleSearchServices: {
      type: Function,
      default: () => {},
    },
    handleValidateIsEditing: {
      type: Function,
      default: () => {},
    },
    handleModalPreventBasicInfo: {
      type: Function,
      default: () => {},
    },
    handleModalPreventCreateService: {
      type: Function,
      default: () => false,
    },
    handleModalExitService: {
      type: Function,
      default: () => {},
    },
    handleModalShortcuts: {
      type: Function,
      default: () => {},
    },
    newService: {
      type: Object,
      default: () => {},
    },
    modalPreventCreateService: {
      type: Boolean,
      default: false,
    },
    modalPreventExitService: {
      type: Boolean,
      default: false,
    },
    modalPreventBasicInfo: {
      type: Boolean,
      default: false,
    },
    handleModalEditServiceModal: {
      type: Function,
      default: () => {},
    },
    openServiceSelectModal: {
      type: Function,
      default: () => {},
    },
    removeItem: {
      type: Function,
      default: () => {},
    },
    removeService: {
      type: Boolean,
      default: false,
    },
    rowSelected: {
      type: Array,
      default: () => [],
    },
    showServices: {
      type: Boolean,
      default: true,
    },
    loadNewServiceAndSearchServicesPayload: {
      type: Function,
      default: () => "",
    },
    loadServiceInformationFromLocalStorage: {
      type: Function,
      default: () => {},
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    setRoomsSelectedAccomPack: {
      type: Function,
      default: () => {},
    },
    shortcutsOpen: {
      type: Boolean,
      default: false,
    },
    updateSearchServicesPayload: {
      type: Function,
      default: () => {},
    },
    updateNewServiceItineraryForm: {
      type: Function,
      default: () => {},
    },
    validateIsEditing: {
      type: Boolean,
      default: () => false,
    },
    preventCreateNewService: {
      type: Function,
      default: () => {},
    },
    addServiceByCode: {
      type: Function,
      default: () => {},
    },
    setNewServiceData: {
      type: Function,
      default: () => {},
    },
    updateServiceViewState: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    toggleNavbarSecondary() {
      this.$store.commit(
        "itinerary/SET_REDUCE_NAVBAR_SECONDARY",
        !this.reduceNavbarSecondary
      );
    },
    handleOpenServiceSidebar() {
      const itineraryServicesLength = this.services_itinerary.length;
      if (itineraryServicesLength === 0) return;
      const lastService = this.services_itinerary[itineraryServicesLength - 1];
      const serviceSelected =
        this.rowSelected === null ? lastService : this.rowSelected[0];
      this.handleModalEditServiceModal(
        serviceSelected,
        EDIT_SERVICE_SIDEBAR_TABS_IDS.INFO
      );
    },
    handleServicesAdded(value) {
      this.$store.dispatch("utils/setServicesAdded", value);
    },
    async keymap(e) {
      if (this.hideElementByCondition) return;
      e = e || window.event;
      const code = e.which || e.keyCode;
      const ctrlKey = e.ctrlKey;
      switch (code) {
        case 13:
        case 27:
        case 46:
        case 65:
        case 69:
        case 70:
        case 71:
        case 77:
        case 78:
        case 79:
        case 80:
        case 82:
        case 83:
        case 84:
        case 86:
        case 88:
        case 116:
        case 219:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
      // Service list Hotkeys
      if (this.itinerary.data && this.itinerary.data.id && this.showServices) {
        if (code === 13) {
          const isServiceSelected = this.newService?.service?.length > 0;
          if (isServiceSelected) this.createItineraryService(this.newService);
        } else if (ctrlKey && code === 13) {
          this.$router.push(PATH_INFO.ITINERARY.path);
        } else if (ctrlKey && code === 82) {
          if (this.localSaving.isActive) {
            this.updateServiceViewState("localSaving", {
              ...this.localSaving,
              isPreventReloadModalActive: true,
            });
          } else {
            window.location.reload(true);
          }
        } else if (code === 83 && !this.isComponentModalActive) {
          this.validateIsEditing
            ? this.handleModalPreventGotoSearchServices()
            : this.searchServices();
        } else if (code === 69) {
          this.setServiceIdDataHotKey(4);
        } else if (code === 65) {
          this.setServiceIdDataHotKey(2);
        } else if (code === 70) {
          this.setServiceIdDataHotKey(1);
        } else if (code === 71) {
          this.setServiceIdDataHotKey(8);
        } else if (ctrlKey && code === 77) {
          this.handleOpenServiceSidebar();
        } else if (ctrlKey && code === 79) {
          this.toggleNavbarSecondary();
        } else if (code === 77) {
          this.setServiceIdDataHotKey(6);
        } else if (code === 78) {
          this.preventCreateNewService();
        } else if (code === 79) {
          this.setServiceIdDataHotKey(10);
        } else if (code === 80) {
          this.setServiceIdDataHotKey(9);
        } else if (code === 84) {
          this.setServiceIdDataHotKey(5);
        } else if (code === 86) {
          this.setServiceIdDataHotKey(3);
        } else if (code === 88) {
          this.setServiceIdDataHotKey(7);
        } else if (code === 116) {
          if (this.localSaving.isActive) {
            this.updateServiceViewState("localSaving", {
              ...this.localSaving,
              isPreventReloadModalActive: true,
            });
          } else {
            window.location.reload(true);
          }
        } else if (
          code === 46 &&
          !this.isComponentModalActive &&
          this.validateIsEditing &&
          !this.modalPreventExitService &&
          !this.modalPreventCreateService &&
          !this.modalPreventGotoSearchServices
        ) {
          this.handleRemoveService(true);
        } else if (
          code === 27 &&
          !this.isComponentModalActive &&
          this.validateIsEditing &&
          this.removeService &&
          !this.modalPreventExitService &&
          !this.modalPreventCreateService &&
          !this.modalPreventGotoSearchServices
        ) {
          this.handleRemoveService(false);
        } else if (
          code === 27 &&
          !this.isComponentModalActive &&
          this.validateIsEditing &&
          !this.shortcutsOpen &&
          !this.RemoveService &&
          !this.modalPreventExitService &&
          !this.modalPreventCreateService &&
          !this.modalPreventGotoSearchServices
        ) {
          this.handleModalExitService(true);
        } else if (
          code === 27 &&
          !this.isComponentModalActive &&
          this.validateIsEditing &&
          !this.shortcutsOpen &&
          !this.RemoveService &&
          this.modalPreventExitService &&
          !this.modalPreventCreateService &&
          !this.modalPreventGotoSearchServices
        ) {
          this.handleModalExitService(false);
        } else if (code === 219) {
          //shortcuts guide
          this.handleModalShortcuts();
        }
      } else {
        // Basic Information Hotkeys
        if (code === 13) {
          this.$store.dispatch("shortcuts/setShortcuts", {
            code,
            alt: true,
            from: "basicInformation",
          });
          const response = await this.handleSaveItinerary();
          if (
            response &&
            this.itineraryUpdatedStatus === "updated" &&
            this.$route.query.itinerary
          ) {
            this.$router.push({
              path: PATH_INFO.SERVICES.path,
              query: { itinerary: this.$route.query.itinerary },
            });
          }
        } else if (!e.ctrlKey && code === 83) {
          this.handleSaveItinerary();
        } else if (
          code === 27 &&
          this.modalOpenName === "" &&
          !this.shortcutsOpen &&
          !this.$route.query.itinerary &&
          (!this.itinerary || !this.itinerary.data || !this.itinerary.data.id)
        ) {
          this.handleModalPreventBasicInfo();
        } else if (code === 219) {
          //shortcuts guide
          this.handleModalShortcuts();
        }
      }
    },
    handleModalPreventGotoSearchServices() {
      this.modalPreventGotoSearchServices =
        !this.modalPreventGotoSearchServices;
    },
    resetForm() {
      this.updateSearchServicesPayload("", "", {
        code: "",
        from: "",
        to: "",
      });
    },
    async setServiceIdDataHotKey(id) {
      if (this.disableQuoteByStatus) return;

      this.updateNewServiceItineraryForm([["id_service_type", id]]);

      if (this.currentRow) {
        this.addServiceByCode({
          day: this.currentRow.day,
          start_date: this.currentRow.start_date,
          end_date: this.currentRow.end_date,
          level: this.currentRow.level,
          num_pax: this.currentRow.num_pax,
        });
      } else {
        this.addServiceByCode();
      }

      this.newService.new = true;

      await this.loadNewServiceAndSearchServicesPayload(id);

      this.setNewServiceData();

      const lastElementIndex = this.services_itinerary.length - 1;

      const newService = this.services_itinerary[lastElementIndex];

      this.openServiceSelectModal(newService);
    },
    confirmAddService() {
      this.handleModalPreventCreateService();
      this.addServiceByCode();
    },
    searchServices() {
      if (this.$route.query.itinerary) {
        this.isComponentModalActive = true;
        this.loadServiceInformationFromLocalStorage();
        this.updateSearchServicesPayload("", "", {
          page: this.searchServicesPayload.page
            ? this.searchServicesPayload.page
            : 1,
          limit: 10,
          info: 1,
          contract_user: this.contract.contract_user,
          contract: this.contract.contract,
          calculate_prices: 1,
          num_pax: this.numPax,
          id_service_type: null,
          location: null,
          from: addDaysToDate(this.itinerary.data.end_date, 1),
          to: addDaysToDate(this.itinerary.data.end_date, 1),
        });
        this.getDestinationsPerCountry(this.searchServicesPayload.country);
        this.$store.dispatch("services/resetServices");
      } else {
        this.$router.push(PATH_INFO.HOME.path);
      }
    },
    focusedGuideBoxClass(classDefault, step, bgWhite = false) {
      const bgWhiteClass = bgWhite ? "bg-white" : "";
      return this.isUserGuideActive &&
        this.userGuideStep === step &&
        !this.loading
        ? `${classDefault} is-guide-step ${bgWhiteClass}`
        : classDefault;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      itineraryStatus: "itinerary/getItineraryStatus",
      itineraryUpdatedStatus: "itinerary/getItineraryUpdatedStatus",
      reduceNavbarSecondary: "itinerary/getReduceNavbarSecondary",
      loading: "utils/getLoading",
      modalOpenName: "utils/getModalOpenName",
      numPax: "itinerary/getNumPax",
      searchServicesPayload: "services/getSearchServicesPayload",
      services_itinerary: "itinerary/getServicesItinerary",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      isModalOpen: "utils/getIsModalOpen",
      formItinerary: "itinerary/getFormItinerary",
    }),
    contract() {
      return {
        contract_user: this.itinerary.data ? this.itinerary.data.client.id : "",
        contract: this.itinerary.data ? this.itinerary.data.contract_id : "",
      };
    },
  },
};
</script>

<style>
.servicesButtonsContainer .searchServicesButton {
  margin-left: 0.5em;
}
@media screen and (max-width: 480px) {
  .save_button__container {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
    padding: 1rem;
    z-index: 999;
  }
  .BasicInfoForm .save_button__container {
    z-index: 9;
  }
  .basicInfoAdd button {
    width: 100% !important;
  }
  .searchServicesButton {
    display: none;
  }
}
</style>
