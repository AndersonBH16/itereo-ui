<template>
  <section>
    <BaseModal
      :isComponentModalActive="infoModal"
      :closeModal="() => handleModal('infoModal', false)"
      :height="'45rem'"
    >
      <div slot="icon" class="is-flex infoIcon">
        <IconInfoWithoutBackground class="icon is-large color-4" />
        <span class="iconText">Info</span>
      </div>
      <div slot="paragraph" class="infoParagraph">
        <span>
          {{ modalMessages["info"] }}
        </span>
        <div v-if="showItineraryServices" class="pt-4">
          <div class="is-flex is-flex-direction-column">
            <div
              class="is-flex mb-2 has-text-centered"
              style="color: var(--gray-dark) !important; font-size: 0.8rem"
            >
              <div style="flex: 1">Day</div>
              <div style="flex: 1">Dates</div>
              <div style="flex: 1">Location</div>
              <div style="flex: 3">Service</div>
              <div style="flex: 1">Pax(s)</div>
              <div style="flex: 1">Price</div>
            </div>
            <ServiceRow
              v-for="service in itineraryServices"
              :key="service.id"
              :service="service"
              :fieldsToDisplay="serviceRowFields"
            />
          </div>
        </div>
      </div>
      <div
        slot="buttons"
        class="is-flex w-100 updateModalButtons is-flex-direction-column px-2"
        style="position: sticky; bottom: 0"
      >
        <p v-if="showItineraryServices" class="w-100 has-text-left my-2">
          <span
            v-if="
              servicesWithEditedPrices.length > 0 &&
              !maintainServiceManualPrices
            "
          >
            <IconWarningCircle class="mr-1" style="fill: #ff9316" />
            <span style="color: #ff9316; font-size: 0.8rem">
              Edited prices will be overwritten
            </span>
          </span>
          <b-checkbox
            v-if="!quoteContractChanged"
            v-model="maintainServiceManualPrices"
            class="mb-2 mt-1 w-100"
          >
            Mantain services prices
          </b-checkbox>
        </p>
        <div
          class="is-flex w-100 is-justify-content-center"
          style="gap: 1rem; position: sticky"
        >
          <BaseButton
            :disabled="loading"
            @click="handleModal('infoModal', false)"
            action="secondary"
            size="large"
          >
            <p slot="text" class="updateModalButton">Cancel</p>
          </BaseButton>
          <BaseButton
            :disabled="loading"
            @click="handleUpdateServicesDatesAndSaveItinerary"
            action="blue"
            size="large"
          >
            <p slot="text" class="updateModalButton">Ok, continue</p>
          </BaseButton>
        </div>
      </div>
    </BaseModal>
    <BaseModal
      :isComponentModalActive="successModal"
      :closeModal="() => handleModal('successModal', false)"
    >
      <div slot="icon" class="is-flex infoIcon pt-5">
        <IconCheckCircle class="icon is-large color-green" />
        <span class="iconText">Congratulations!</span>
      </div>
      <div slot="paragraph" class="infoParagraph">
        <span>{{ modalMessages["success"] }}</span>
      </div>
    </BaseModal>
    <BaseModal
      :isComponentModalActive="errorModal"
      :closeModal="() => handleModal('errorModal', false)"
    >
      <div slot="icon" class="is-flex infoIcon">
        <IconError class="icon is-large color-danger" />
        <span class="iconText">Ups!</span>
      </div>
      <div slot="paragraph" class="infoParagraph">
        <span
          >Sorry, this date change can’t be executed. We found services taking
          place on after
          <b>{{ newItineraryData.end_date | customDate(datesFormat) }}</b
          >. To continue with it please remove the service after it.</span
        >
      </div>
      <div slot="buttons" class="is-flex w-100 updateModalButtons">
        <BaseButton
          :disabled="loading"
          @click="handleModal('errorModal', false)"
          action="secondary"
          size="large"
        >
          <p slot="text" class="updateModalButton">Ok</p>
        </BaseButton>
      </div>
    </BaseModal>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import helpers from "@/helpers";
import { datesHelper } from "@/utils/dates";
import { getSalesManualUUID } from "@/utils/utils";
import { MAX_PROCESS_SERVICES } from "@/constants";
import { SERVICE_ROW_FIELDS } from "@/constants/services";
import { PATH_INFO } from "@/router/path";

import ServiceRow from "@/components/quote-views/service-list/ServiceModals/ServiceRow.vue";

export default {
  name: "BasicInfoUpdateDateModals",
  components: {
    ServiceRow,
  },
  data() {
    return {
      constants: {
        SERVICE_ROW_FIELDS,
      },
      maintainServiceManualPrices: false,
    };
  },
  computed: {
    ...mapGetters({
      client_contracts: "client/getClientContracts",
      itinerary: "itinerary/getItinerary",
      loading: "utils/getLoading",
      prices_itinerary: "itinerary/getPricesItineraries",
      itineraryServices: "itinerary/getServicesItinerary",
      shortcuts: "shortcuts/getShortcuts",
      formItinerary: "itinerary/getFormItinerary",
      datesFormat: "itinerary/getDatesFormat",
    }),
    servicesWithEditedPrices() {
      return this.itineraryServices.filter((service) => service.isPriceEdited);
    },
    quoteContractChanged() {
      return this.updateServicesCharacteristics?.contractChanged || false;
    },
    showItineraryServices() {
      return (
        this.updateServicesCharacteristics.updateItineraryServices &&
        this.itineraryServices.length > 0
      );
    },
    serviceRowFields() {
      return [
        {
          label: this.constants.SERVICE_ROW_FIELDS.DAY,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.DATES,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.LOCATION,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.NUM_PAX,
          text: "",
        },
        {
          label: this.constants.SERVICE_ROW_FIELDS.PRICE,
          text: "",
        },
      ];
    },
  },
  props: {
    handleModal: {
      type: Function,
      default: () => {},
    },
    infoModal: {
      type: Boolean,
      default: false,
    },
    successModal: {
      type: Boolean,
      default: false,
    },
    errorModal: {
      type: Boolean,
      default: false,
    },
    modalMessages: {
      type: Object,
      default: () => {},
    },
    updateServicesCharacteristics: {
      type: [Object, Array],
      default: () => {},
    },
    saveItineraryUpdated: {
      type: Function,
      default: () => {},
      required: true,
    },
    newItineraryData: {
      type: Object,
      default: () => {},
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    setLoadingText: {
      type: Function,
      default: () => {},
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    setGlobalModalOpenName: {
      type: Function,
      default: () => {},
    },
    resetNewItineraryData: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    getItineraryServicesStatus(updateServicesCharacteristics = {}) {
      const { numPaxChanged } = updateServicesCharacteristics;

      const serviceRelatedOptions = this.itineraryServices.reduce(
        (acc, service) => {
          const servicesRelated = service.servicesRelated.map(
            (service, index) => {
              return { ...service, delete: index > 0 && numPaxChanged };
            }
          );
          return [...acc, ...servicesRelated];
        },
        []
      );
      return serviceRelatedOptions;
    },
    getItineraryServicesChunks(updateServicesCharacteristics = {}) {
      const servicesWithStatus = this.getItineraryServicesStatus(
        updateServicesCharacteristics
      );

      const servicesToUpdate = servicesWithStatus.filter(
        (service) => !service.delete
      );
      const serviceUUIDs = [...servicesToUpdate.map((service) => service.id)];
      const chunks = helpers.sliceIntoChunks(
        serviceUUIDs,
        MAX_PROCESS_SERVICES
      );
      return {
        chunks,
        servicesWithStatus,
        servicesToDelete: servicesWithStatus.filter(
          (service) => service.delete
        ),
        servicesToUpdate,
      };
    },
    loadPricesItinerary(reload = false) {
      if (this.$route.query.itinerary) {
        this.$store
          .dispatch("itinerary/list_prices", {
            uuid: this.$route.query.itinerary,
            reload,
          })
          .then(() => {})
          .catch((error) => {
            throw error;
          });
      }
    },
    setItineraryUpdatedStatus(value = "") {
      this.$store.dispatch("itinerary/setItineraryUpdatedStatus", value);
    },
    redirectToServicesAccordingToShortcut({ code, from, alt }) {
      if (code === 13 && from === "basicInformation" && alt) {
        this.$router.push({
          path: PATH_INFO.SERVICES.path,
          query: { itinerary: this.$route.query.itinerary },
        });
        this.$store.dispatch("shortcuts/setShortcuts", null);
      }
    },
    async fetchUpdateItineraryServices(
      oldStartDate,
      cur_step = 0,
      last_step = 0,
      updateServicesCharacteristics = {}
    ) {
      const {
        numPaxChanged,
        roomDistributionChanged,
        contractChanged,
        onlyUpdateItineraryServicesNumeration,
      } = updateServicesCharacteristics;

      if (this.itineraryServices?.length === 0) return;
      this.setLoadingText(
        "We are updating the Service List with prices, please wait..."
      );

      let reverting = true;
      if (
        this.itineraryServices.length &&
        this.itinerary.data.start_date < this.itineraryServices[0].start_date
      ) {
        reverting = false;
      }

      let { servicesWithStatus } = this.getItineraryServicesChunks(
        updateServicesCharacteristics
      );

      const delta = datesHelper.getDatesDiffByDates(
        oldStartDate,
        this.itineraryServices[0].start_date
      );

      const daysToMove = onlyUpdateItineraryServicesNumeration
        ? 0
        : datesHelper.getDatesDiffByDates(
            this.newItineraryData.start_date,
            this.itineraryServices[0].start_date
          ) - delta;

      let day_date = this.itinerary.data.start_date;
      if (
        !onlyUpdateItineraryServicesNumeration &&
        day_date.localeCompare(oldStartDate) >= 0
      ) {
        day_date = oldStartDate;
      }

      const calculate_room_distribution = roomDistributionChanged ? 1 : 0;
      const calculate_prices =
        (daysToMove === 0 &&
          calculate_room_distribution === 0 &&
          !contractChanged) ||
        (this.maintainServiceManualPrices && !contractChanged)
          ? 0
          : 1;
      const sm = getSalesManualUUID(this.itinerary, this.client_contracts);

      await this.$store.dispatch("itinerary/moveServices", {
        itinerary: this.$route.query.itinerary,
        calculate_prices: calculate_prices,
        calculate_room_distribution,
        sm,
        num_pax:
          numPaxChanged || roomDistributionChanged
            ? this.newItineraryData.num_pax
            : 0,
        cur_step,
        last_step,
        services: servicesWithStatus,
        daysToMove,
        reverting,
        day_date,
      });
    },
    async updateServicesDatesAndSaveItinerary() {
      const updateServicesCharacteristics = this.updateServicesCharacteristics;

      const {
        updateItineraryServices,
        updateItineraryDays,
        onlyUpdateItineraryServicesNumeration,
      } = updateServicesCharacteristics;

      const hasServiceUpdate =
        updateItineraryServices || onlyUpdateItineraryServicesNumeration;

      this.handleModal("infoModal", false);
      this.setLoading(true);
      this.setLoadingText("We are updating the itinerary, please wait...");

      const { chunks } = this.getItineraryServicesChunks(
        updateServicesCharacteristics
      );

      const itineraryServicesToProcessLength = chunks.length;
      const TOTAL_STEPS_TO_PERFORM = hasServiceUpdate
        ? 2 + itineraryServicesToProcessLength
        : updateItineraryDays
        ? 2
        : 1;

      const oldStartDate = this.itinerary.data.start_date;

      await this.saveItineraryUpdated(1, TOTAL_STEPS_TO_PERFORM);

      if (hasServiceUpdate)
        await this.fetchUpdateItineraryServices(
          oldStartDate,
          2,
          TOTAL_STEPS_TO_PERFORM,
          updateServicesCharacteristics
        );
      else if (updateItineraryDays) {
        await this.$store.dispatch("itineraryDays/updateItineraryDays", {
          data: {
            itinerary_uuid: this.$route.query.itinerary,
            autocomplete: false,
          },
          cur_step: 2,
          last_step: TOTAL_STEPS_TO_PERFORM,
        });
      }

      this.maintainServiceManualPrices = false;
      this.resetNewItineraryData();
      this.setLoading(false);
      this.setLoadingText();
      this.$buefy.toast.open({
        duration: 5000,
        message: this.modalMessages["success"],
        position: "is-top",
        type: "is-success",
      });
      if (this.shortcuts) {
        this.redirectToServicesAccordingToShortcut(this.shortcuts);
      }
    },
    async handleUpdateServicesDatesAndSaveItinerary() {
      return this.validateFunctionExecution(
        this.updateServicesDatesAndSaveItinerary,
        () => {
          this.maintainServiceManualPrices = false;
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message: "Ups! something went wrong, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          this.$store.dispatch("shortcuts/setShortcuts", null);
        }
      );
    },
  },
};
</script>
<style>
.infoIcon {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.iconText {
  font-weight: 700;
  font-size: 30px;
  line-height: 40px;
}
.infoParagraph {
  max-width: 40rem;
  margin: auto;
  text-align: justify;
}
.infoParagraph > span {
  font-size: 1rem;
  line-height: 1rem;
}
.updateModalButtons {
  justify-content: space-evenly;
}
.updateModalButtons .updateModalButton {
  padding: 0 4rem;
}
</style>
