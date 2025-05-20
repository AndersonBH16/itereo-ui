<template>
  <div class="is-flex">
    <BasicInfoUpdateDateModals
      :handleModal="handleModal"
      :infoModal="infoModal"
      :errorModal="errorModal"
      :successModal="successModal"
      :modalMessages="modalMessages"
      :updateServicesCharacteristics="updateServicesCharacteristics"
      :saveItineraryUpdated="saveItineraryUpdated"
      :newItineraryData="newItineraryData"
      :setLoading="setLoading"
      :setLoadingText="setLoadingText"
      :loadServicesItinerary="loadServicesItinerary"
      :setGlobalModalOpenName="setGlobalModalOpenName"
      :resetNewItineraryData="resetNewItineraryData"
      :validateFunctionExecution="validateFunctionExecution"
    />
    <BaseModal
      :isComponentModalActive="modalPreventBasicInfo"
      :closeModal="closeModal"
      :cancel="cancel"
    >
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title"
        >Are you sure you want to
        <span class="has-text-weight-semibold">exit</span>?
      </span>
      <span slot="paragraph"
        >Leaving this page will discard any changes you've made.</span
      >
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="closeModal"
          action="secondary"
          size="medium"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton @click="goToNextView" action="tercery" size="medium">
          <p slot="text">Yes, go to home</p>
        </BaseButton>
      </div>
    </BaseModal>
    <div style="width: 100%">
      <div class="columns">
        <div class="column">
          <GuideBox
            title="Creating a new quote"
            description="Well done, now you have to fill in the following form with the parameters you want "
            :step="3"
            :showBackButton="false"
            :positionY="-60"
            :positionX="300"
          />
          <BasicInfoForm
            :handleSaveItinerary="handleSaveItinerary"
            :setLoading="setLoading"
            :loadClientContracts="loadClientContracts"
            :showServices="false"
            :tripTypes="tripTypes"
            :modalPreventBasicInfo="modalPreventBasicInfo"
            :handleModalPreventBasicInfo="handleModalPreventBasicInfo"
            :setGlobalModalOpenName="setGlobalModalOpenName"
            :updateformItinerary="updateformItinerary"
          />
        </div>
      </div>
    </div>

    <b-modal
      title="Changing quote dates"
      size="xl"
      class="dates__moving__alert"
      v-model="datesMovingAlert.isOpen"
      @close="closeModal()"
    >
      <div class="service_replace_modal">
        <h1 style="font-size: 1.25rem; font-weight: 800">
          Changing quote dates
        </h1>

        <p class="mt-5 mb-4 text-left">
          {{ datesMovingAlert.alertText }}
        </p>

        <div class="is-flex is-justify-content-end is-align-items-center mt-4">
          <BaseButton
            class="m-0 mr-2"
            action="secondary"
            @click="handleDatesMovingAlertCancelClick"
          >
            <p slot="text">No, cancel</p>
          </BaseButton>
          <BaseButton
            action="principal"
            @click="handleDatesMovingAlertContinueClick"
          >
            <p slot="text">Ok, continue</p>
          </BaseButton>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import helpers from "@/helpers";
import { datesHelper } from "@/utils/dates";
import { helper as itineraryHelper } from "@/utils/itinerary";
import BasicInfoForm from "@/components/quote-views/basic-info/BasicInfoForm.vue";
import BasicInfoUpdateDateModals from "@/components/quote-views/basic-info/BasicInfoUpdateDateModals.vue";
import { mapGetters } from "vuex";
import {
  openToast,
  calculateDays,
  setItemToLocalStorage,
  deleteObjectProperties,
} from "@/utils/utils";
import confetti from "@/assets/confetti.min.js";
import { parse, format } from "date-fns";
import GuideBox from "../components/_shared/GuideBox.vue";
import { PATH_INFO } from "@/router/path";
import { DATE_FORMAT_YYYY_MM_DD } from "@/constants";

export default {
  name: "BasicInfoView",
  components: {
    BasicInfoForm,
    BasicInfoUpdateDateModals,
    GuideBox,
  },
  props: {
    loadItinerary: {
      type: Function,
      default: () => {},
    },
    loadCurrencies: {
      type: Function,
      default: () => {},
    },
    loadLanguages: {
      type: Function,
      default: () => {},
    },
    loadClients: {
      type: Function,
      default: () => {},
    },
    loadRequestByQuote: {
      type: Function,
      default: () => {},
    },
    loadClientContracts: {
      type: Function,
      default: () => {},
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    loadItineraryDays: {
      type: Function,
      default: () => {},
    },
    loadPublishedItinerary: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      tripTypes: [
        { name: "Fully Guided", id: 1 },
        { name: "Independent", id: 2 },
        { name: "Partially Guided", id: 3 },
        { name: "Undecided", id: 4 },
      ],
      modalPreventBasicInfo: false,
      nextView: null,
      cancel: ["x", "outside"],
      updateServicesCharacteristics: {},
      newItineraryData: {
        start_date: null,
        end_date: null,
        num_pax: 0,
      },
      itineraryUpdated: "",
      loadingSkeleton: false,
      modalMessages: {
        info: `Looks it's possible to make the update! Please keep in mind we will
          move services and this can change in price or logistic challenges,
          after this change review carefully the service list to avoid
          inconvenience.`,
        success: `Dates and services were updated!`,
      },
      successModal: false,
      errorModal: false,
      infoModal: false,
      datesMovingAlert: {
        isOpen: false,
        alertText: `The itinerary start date has changed by 10 days. Are you sure you want to proceed?`,
      },
    };
  },
  beforeRouteLeave(to, from, next) {
    this.resetFormItineraryWithInitialItineraryData();
    if (
      from.fullPath === PATH_INFO.BASIC_INFO.path &&
      !from.query.itinerary &&
      !this.nextView &&
      (!this.info.itinerary ||
        !this.info.itinerary.data ||
        !this.info.itinerary.data.id)
    ) {
      this.modalPreventBasicInfo = true;
      this.nextView = to;
    } else if (
      from.fullPath === PATH_INFO.BASIC_INFO.path &&
      !from.query.itinerary &&
      !this.nextView &&
      this.info.itinerary &&
      this.info.itinerary.data &&
      this.info.itinerary.data.id
    ) {
      this.$router.replace({
        path: PATH_INFO.BASIC_INFO.path,
        query: { itinerary: this.info.itinerary.data.id },
      });
      this.$router.push({
        path: to.fullPath,
        query: { itinerary: this.info.itinerary.data.id },
      });
      next();
    } else {
      next();
    }
  },
  computed: {
    ...mapGetters({
      client_contracts: "client/getClientContracts",
      countries: "client/getCountriesFromContract",
      itinerary: "itinerary/getItinerary",
      prices_itinerary: "itinerary/getPricesItineraries",
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      numPax: "itinerary/getNumPax",
      authData: "auth/getAuthData",
      roomPreferableDistributionJson:
        "itinerary/getRoomPreferableDistributionJson",
      requestInProgress: "utils/getRequestInProgress",
      formItinerary: "itinerary/getFormItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      services_itinerary: "itinerary/getServicesItinerary",
      historyView: "utils/getHistoryView",
      request: "request/getRequest",
    }),
    info() {
      return {
        itinerary: this.itinerary,
      };
    },
  },
  methods: {
    handleDatesMovingAlertCancelClick() {
      this.datesMovingAlert.isOpen = false;
    },
    handleDatesMovingAlertContinueClick() {
      this.handleUpdateItinerary();
    },
    updateformItinerary(key, value) {
      this.$store.dispatch("itinerary/udpateFormItineraryByKey", {
        key,
        value,
      });
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
    setGlobalModalOpenName(value = "") {
      this.$store.dispatch("utils/setModalOpenName", value);
    },
    getRoomPreferedDistribution() {
      if (
        this.roomPreferableDistributionJson &&
        this.roomPreferableDistributionJson.length > 0 &&
        this.formItinerary[0].room_preferable_dist
      ) {
        const seenRoomTypes = new Set();

        const isDraftItinerary = [null, undefined].includes(
          this.itinerary?.data?.room_preferable_dist
        );

        return !isDraftItinerary
          ? this.itinerary.data.room_preferable_dist.map((room) => {
              const updatedRoom = this.roomPreferableDistributionJson.find(
                (r) => r.id_room_type === room.id_room_type
              );

              if (updatedRoom) {
                if (seenRoomTypes.has(updatedRoom.id_room_type)) {
                  return { ...room, status: -1 };
                }

                seenRoomTypes.add(updatedRoom.id_room_type);
                return {
                  ...room,
                  ...updatedRoom,
                  id: room.id,
                  qty: updatedRoom.qty,
                };
              }

              return room;
            })
          : this.roomPreferableDistributionJson.map((room) => ({
              ...room,
              id: null,
              status: 1,
              qty: room.qty,
            }));
      } else {
        return null;
      }
    },
    setRoomPreferedDistributionToItineraryForm() {
      const room_preferable_dist = this.getRoomPreferedDistribution();
      this.updateformItinerary("room_preferable_dist", room_preferable_dist);
    },
    async saveItinerary() {
      if (this.disableQuoteByStatus) return;

      this.setLoading(true);
      if (
        parse(this.formItinerary[0].start_date) >
        parse(this.formItinerary[0].end_date)
      ) {
        this.setLoading(false);
        openToast(
          this.$buefy,
          `Incorrect dates: The end date cannot be before the start date.`
        );
        return false;
      }
      this.setRoomPreferedDistributionToItineraryForm();

      if (
        !this.formItinerary[0].client_id ||
        !this.formItinerary[0].title.value ||
        !this.formItinerary[0].num_pax ||
        !this.formItinerary[0].start_date ||
        !this.formItinerary[0].end_date ||
        !this.formItinerary[0].contract_id ||
        !this.formItinerary[0].itinerary_type_id
      ) {
        this.setLoading(false);
        openToast(this.$buefy, "Please complete the required fields.");
        return "error";
      }

      if (this.formItinerary[0].id !== null) {
        this.setLoading(false);
        return this.handleUpdateItinerary();
      }

      this.setLoadingText(
        "We are creating the itinerary for you, please wait..."
      );
      const response = await this.$store.dispatch(
        "itinerary/save",
        this.formItinerary
      );
      this.setLoading(false);
      this.datesMovingAlert.isOpen = false;

      let type = "success";
      if (typeof response["messages"][0]["errors"] !== "undefined") {
        type = "error";
      }
      openToast(
        this.$buefy,
        response.messages[0].message,
        type == "success" ? "is-success" : "is-danger"
      );
      if (type == "success") {
        confetti.start();
        this.updateformItinerary("id", response.messages[0].itinerary);
        await this.loadItinerary(response.messages[0].itinerary);
        this.validateLinkQuoteToRequest(this.itinerary.data);
        this.$store.dispatch(
          "itinerary/setNumPax",
          this.formItinerary[0].num_pax
        );
        const path = helpers.isProUser(this.authData)
          ? PATH_INFO.SERVICES.path
          : PATH_INFO.ITINERARY.path;
        this.nextView = { fullPath: path };
        this.$router.push({
          path: path,
          query: { itinerary: this.formItinerary[0].id },
        });
        setTimeout(() => {
          confetti.stop();
        }, 5000);
        return "firstSave";
      }
    },
    async validateLinkQuoteToRequest(quote) {
      if (!this.request?.id) return;

      const isAlreadyLinkedToRequest = this.request?.items?.find(
        (item) => item.id === quote.id
      );

      if (![null, undefined].includes(isAlreadyLinkedToRequest)) return;

      this.linkQuoteToRequest(quote);
    },
    async linkQuoteToRequest(quote) {
      this.setLoading(true);
      await this.$store.dispatch("request/linkQuoteToRequest", {
        requestId: this.request.id,
        quotesToLink: [
          {
            ...quote,
            title: quote.title.value,
          },
        ],
      });
      await this.loadRequestByQuote();
      this.setLoading(false);
    },
    async handleSaveItinerary() {
      return await this.validateFunctionExecution(async () => {
        return await this.saveItinerary();
      });
    },
    saveItineraryUpdated(cur_step = 0, last_step = 0) {
      setItemToLocalStorage(this.$route.query.itinerary, {
        ...JSON.parse(localStorage.getItem(this.$route.query.itinerary)),
        from: format(
          parse(this.formItinerary[0].start_date),
          DATE_FORMAT_YYYY_MM_DD
        ),
        to: format(
          parse(this.formItinerary[0].end_date),
          DATE_FORMAT_YYYY_MM_DD
        ),
      });
      const payload = {
        ...this.formItinerary[0],
        cur_step,
        last_step,
      };

      deleteObjectProperties(payload, ["description"]);

      return this.$store
        .dispatch("itinerary/update", payload)
        .then((response) => response)
        .catch((error) => {
          this.$buefy.toast.open({
            duration: 5000,
            message:
              error.response.data && error.response.data.message
                ? error.response.data.message
                : "Can't update the itinerary, please try again",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        });
    },
    setUpdateServicesCharacteristics(value = {}) {
      this.updateServicesCharacteristics = value;
    },
    async validateIfExistsServicesItinerary() {
      try {
        if (!this.services_itinerary || this.services_itinerary.length <= 0) {
          const response = await this.loadServicesItineraryWithPayload();
          if (response) {
            return response?.data?.length > 0;
          }
        }
        if (this.services_itinerary && this.services_itinerary.length > 0) {
          return true;
        }
        return false;
      } catch (err) {
        console.info(err.response);
        if (err && err.response && err.response.status === 404) {
          return false;
        }
        throw err;
      }
    },
    async validateMoveItineraryServices() {
      const existsItineraryServices =
        await this.validateIfExistsServicesItinerary();
      if (!existsItineraryServices) return false;
      const { itineraryStartDateChanged } =
        this.validateIfItineraryDatesChanged();
      const serviceListStartDate = format(
        datesHelper.getStartDateOfServiceList(this.services_itinerary)
          ?.start_date,
        DATE_FORMAT_YYYY_MM_DD
      );
      const servicesAffectedByStartDate =
        itineraryStartDateChanged &&
        serviceListStartDate !== this.newItineraryData.start_date;
      const servicesAffectedByEndDate =
        parse(
          datesHelper.getEndDateOfServiceList(this.services_itinerary)?.end_date
        ) > parse(this.newItineraryData.end_date);
      return servicesAffectedByStartDate || servicesAffectedByEndDate;
    },
    async loadServicesItineraryWithPayload(reload = false) {
      if (this.$route.query.itinerary && this.itinerary.data) {
        const payload = {
          id: this.$route.query.itinerary,
          reload,
          from: this.itinerary.data.start_date,
          to: this.itinerary.data.end_date,
        };
        return this.loadServicesItinerary(payload);
      }
    },
    async getModalContentToDisplayWhenUpdateItinerary() {
      const { itineraryEndDateChanged } =
        this.validateIfItineraryDatesChanged();
      const numPaxChanged = this.validateIfNumPaxChanged();
      const contractChanged = this.validateIfContractChanged();
      const roomDistributionChanged = this.validateIfRoomDistributionChanged();
      const onlyUpdateItineraryServicesNumeration =
        this.validateOnlyUpdateItineraryServicesNumeration();
      const hasNewDateItineraryServices =
        await this.validateItineraryServicesAndNewDates();
      const updateItineraryServices =
        this.services_itinerary.length > 0 &&
        (hasNewDateItineraryServices ||
          numPaxChanged ||
          roomDistributionChanged ||
          contractChanged);

      const updateItineraryDays =
        itineraryEndDateChanged || hasNewDateItineraryServices;

      const displayModal =
        hasNewDateItineraryServices ||
        numPaxChanged ||
        contractChanged ||
        roomDistributionChanged ||
        onlyUpdateItineraryServicesNumeration ||
        itineraryEndDateChanged;

      this.setUpdateServicesCharacteristics({
        updateItineraryServices,
        numPaxChanged,
        contractChanged,
        roomDistributionChanged,
        onlyUpdateItineraryServicesNumeration,
        updateItineraryDays,
      });

      this.changeModalInfoMessage(this.updateServicesCharacteristics);
      this.handleModal("infoModal", displayModal);
      return !displayModal;
    },
    validateOnlyUpdateItineraryServicesNumeration() {
      const newStartDateChanged =
        this.itinerary.data?.start_date !== this.formItinerary?.[0]?.start_date;
      const newStartDateIncreaseOrMaintain =
        parse(this.itinerary.data?.start_date) <=
        parse(this.formItinerary?.[0]?.start_date);
      const newStartDateNotExceedsServiceList =
        this.formItinerary?.[0]?.start_date <=
        format(
          datesHelper.getStartDateOfServiceList(this.services_itinerary)
            ?.start_date,
          DATE_FORMAT_YYYY_MM_DD
        );
      return (
        this.services_itinerary.length > 0 &&
        newStartDateChanged &&
        newStartDateIncreaseOrMaintain &&
        newStartDateNotExceedsServiceList
      );
    },
    async validateItineraryServicesAndNewDates() {
      const validateMoveItineraryServices =
        await this.validateMoveItineraryServices();
      return validateMoveItineraryServices;
    },
    handleModal(key, value = false) {
      this[key] = value;
      if (value) {
        this.setGlobalModalOpenName(`basicInformation${key}`);
      }
      if (!value) {
        this.setGlobalModalOpenName("");
        this.setUpdateServicesCharacteristics();
      }
    },
    changeModalInfoMessage({
      updateItineraryServices,
      numPaxChanged,
      roomDistributionChanged,
      contractChanged,
      onlyUpdateItineraryServicesNumeration,
      updateItineraryDays,
    }) {
      if (numPaxChanged && roomDistributionChanged) {
        this.modalMessages.info = `Looks it's possible to make the update! Please keep in mind we will
          update prices, number of passengers and distribution of rooms of all itinerary services and
          this may generate logistical challenges, after this change review carefully the service list
          to avoid inconvenience.`;
      } else if (!numPaxChanged && roomDistributionChanged) {
        this.modalMessages.info = `Looks it's possible to make the update! Please keep in mind we will
          update prices and distribution of rooms of all itinerary services and
          this may generate logistical challenges, after this change review carefully the service list
          to avoid inconvenience.`;
      } else if (contractChanged) {
        this.modalMessages.info = `Looks it's possible to make the update! Please keep in mind we will
          update prices of all itinerary services and this may generate logistical challenges, after
          this change review carefully the service list to avoid inconvenience.`;
      } else if (updateItineraryServices) {
        this.modalMessages.info = `Looks it's possible to make the update! Please keep in mind we will
          move services and this can change in price or logistic challenges,
          after this change review carefully the service list to avoid
          inconvenience.`;
      } else if (onlyUpdateItineraryServicesNumeration) {
        this.modalMessages.info =
          "Please keep in mind we will only update itinerary dates and itinerary services numeration";
      } else if (updateItineraryDays) {
        this.modalMessages.info =
          "Please keep in mind we will only update itinerary days";
      }
    },
    validateDisplayDatesMovingAlert() {
      if (this.datesMovingAlert.isOpen) {
        this.datesMovingAlert.isOpen = false;
        return false;
      }

      const startDate = parse(this.formItinerary[0].start_date);

      const itineraryStartDate = parse(this.itinerary.data.start_date);

      const daysToMove = datesHelper.getDatesDiffByDates(
        startDate,
        itineraryStartDate
      );

      const displayDatesMovingAlert = Math.abs(daysToMove) > 10;

      this.datesMovingAlert = {
        isOpen: displayDatesMovingAlert,
        alertText: `The itinerary start date has changed by ${Math.abs(
          daysToMove
        )} days. Are you sure you want to proceed?`,
      };

      return this.datesMovingAlert.isOpen;
    },
    async handleUpdateItinerary() {
      const changedLang =
        this.formItinerary[0].language_id !== this.itinerary.data.language.id;

      if (this.validateDisplayDatesMovingAlert()) {
        this.setLoading(false);
        return false;
      }

      const updateOnlyItinerary =
        await this.getModalContentToDisplayWhenUpdateItinerary();
      if (updateOnlyItinerary) {
        this.setLoading(true);
        const response = await this.saveItineraryUpdated(1, 1);
        if (response) {
          this.setLoading();
          this.$buefy.toast.open({
            duration: 5000,
            message: response.message,
            position: "is-top",
            type: "is-success",
          });
          await this.loadItinerary();

          if (changedLang) {
            await this.$store.dispatch("services/resetService");

            await this.loadServicesItinerary({
              id: this.formItinerary[0].id,
              from: this.formItinerary[0].start_date,
              to: this.formItinerary[0].end_date,
              reload: true,
            });

            await this.loadItineraryDays();
          }
        }
        return response;
      }
    },
    goToNextView() {
      this.modalPreventBasicInfo = false;
      this.$router.push(PATH_INFO.HOME.path);
    },
    closeModal() {
      this.modalPreventBasicInfo = false;
      this.nextView = null;
    },
    handleModalPreventBasicInfo() {
      this.modalPreventBasicInfo = !this.modalPreventBasicInfo;
      if (this.modalPreventBasicInfo) {
        this.setGlobalModalOpenName("modalPreventBasicInfo");
      } else {
        this.setGlobalModalOpenName("");
      }
    },
    resetFormItineraryWithInitialItineraryData() {
      if (this.itinerary && this.itinerary.data) {
        const { start_date, end_date, code } = this.itinerary.data;
        this.updateformItinerary("start_date", start_date);
        this.updateformItinerary("end_date", end_date);
        this.updateformItinerary("code", code);
      }
    },
    resetSearchServicesPayload() {
      this.$store.dispatch("services/setSearchServicesPayload", {});
      this.$store.dispatch("services/setLastSearchServicesPayload", null);
    },
    resetNewItineraryData() {
      this.newItineraryData = {};
    },
    validateIfItineraryDatesChanged() {
      this.newItineraryData.start_date = format(
        this.formItinerary[0].start_date,
        DATE_FORMAT_YYYY_MM_DD
      );
      this.newItineraryData.end_date = format(
        this.formItinerary[0].end_date,
        DATE_FORMAT_YYYY_MM_DD
      );
      return {
        itineraryStartDateChanged:
          this.itinerary.data.start_date !== this.formItinerary[0].start_date,
        itineraryEndDateChanged:
          this.itinerary.data.end_date !== this.formItinerary[0].end_date,
        initialItineraryDuration: calculateDays(
          this.itinerary.data.start_date,
          this.itinerary.data.end_date
        ),
        newItineraryDuration: calculateDays(
          this.formItinerary[0].start_date,
          this.formItinerary[0].end_date
        ),
      };
    },
    validateIfNumPaxChanged() {
      if (this.itinerary && this.itinerary.data && this.formItinerary) {
        const currentItineraryNumPax = Number(this.itinerary.data.num_pax || 0);
        const newItineraryNumPax = Number(this.formItinerary[0].num_pax || 0);
        if (currentItineraryNumPax !== newItineraryNumPax) {
          this.newItineraryData.num_pax = newItineraryNumPax;
          return true;
        }
      }
      return false;
    },
    validateIfContractChanged() {
      if (this.itinerary && this.itinerary.data && this.formItinerary) {
        const { contract_id, client_id } = this.formItinerary[0];
        const changed = contract_id !== this.itinerary.data.contract_id;
        if (changed) {
          this.newItineraryData.contract_id = contract_id;
          this.newItineraryData.client_id = client_id;
          return true;
        }
      }
      return false;
    },
    validateIfRoomDistributionChanged() {
      if (this.itinerary?.data && this.formItinerary) {
        const pastRoomDistribution =
          itineraryHelper.getRoomPreferableDistributionHash(
            this.itinerary.data.room_preferable_dist
          );

        const currentRoomDistribution =
          itineraryHelper.getRoomPreferableDistributionHash(
            this.roomPreferableDistributionJson
          );

        return pastRoomDistribution !== currentRoomDistribution;
      }
    },
    async loadInitialData() {
      try {
        this.setLoading(true);
        this.resetSearchServicesPayload();
        this.setLoading(false);
        await this.loadServicesItineraryWithPayload();
        await this.loadGlobalData();
      } catch (err) {
        console.info(err);
        this.setLoading(false);
        this.$buefy.toast.open({
          duration: 5000,
          message: err || "Ups! something went wrong, please try again!",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    async loadInitialDataOnlyWithRoute() {
      this.setLoading(true);
      await this.loadItinerary();
      await this.loadPublishedItinerary();
      await this.loadServicesItineraryWithPayload();
      this.setLoading(false);
      await this.loadGlobalData();
      this.resetSearchServicesPayload();
    },
    async loadGlobalData() {
      this.setLoading(true);
      await this.loadClients();
      await this.loadCurrencies();
      await this.loadLanguages();
      if (this.info.itinerary.data !== undefined) {
        await this.loadClientContracts(this.info.itinerary.data.client.id);
      }
      this.setLoading(false);
    },
    async loadItineraryVersion(itineraryId) {
      this.setLoading(true);
      if (!this.itinerary?.data?.id) {
        await this.$store.dispatch("itinerary/getItineraryVersion", {
          itineraryId: itineraryId,
          version: this.historyView.version,
        });
      }
      await this.loadGlobalData();
      this.setLoading(false);
    },
  },
  created() {
    const itineraryRouteQuery = this.$router.history.current.query.itinerary;
    this.$store.dispatch("utils/setHistoryView");
    if (this.historyView.isActive) {
      this.loadItineraryVersion(itineraryRouteQuery);
    } else if (itineraryRouteQuery && !this.info.itinerary.data) {
      this.loadInitialDataOnlyWithRoute();
    } else if (!itineraryRouteQuery && this.info.itinerary.data) {
      this.$router.push({
        path: PATH_INFO.BASIC_INFO.path,
        query: { itinerary: this.info.itinerary.data.id },
      });
      this.resetSearchServicesPayload();
      this.loadGlobalData();
    } else {
      this.loadInitialData();
    }
  },
};
</script>
<style>
.dates__moving__alert .modal-content {
  max-width: 30rem !important;
}
.dates__moving__alert p {
  text-align: left;
}
.dates__moving__alert .service_replace_modal {
  padding: 2rem;
}
</style>
