<template>
  <div>
    <BaseModal
      :isComponentModalActive="modalReorder"
      :closeModal="handleReorderModal"
    >
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title">Service dates and prices will be updated!</span>
      <span slot="paragraph">Are you sure to continue? </span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="handleReorderModal"
          action="secondary"
          size="medium"
          :disabled="loading"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="
            handleReorderModal();
            reorderServices(serviceItinerary, serviceIndex);
          "
          action="tercery"
          size="medium"
          :disabled="loading"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>
    <label class="actionsButtons">
      <label class="upAndDownMenu mr-1">
        <button
          @click="
            validateServiceDatesWhenReorder(
              serviceItinerary,
              serviceIndex,
              'up'
            )
          "
          class="upAndDownButton up"
          :disabled="disableQuoteByStatus"
        >
          <IconMenuUp class="icon color-13"></IconMenuUp>
        </button>
        <button
          @click="
            validateServiceDatesWhenReorder(
              serviceItinerary,
              serviceIndex,
              'down'
            )
          "
          class="upAndDownButton down"
          :disabled="disableQuoteByStatus"
        >
          <IconMenuDown class="icon color-13"></IconMenuDown>
        </button>
      </label>
      <button
        @click="onShowMoreButtonClick"
        class="upAndDownButton"
        :disabled="disableQuoteByStatus"
        :data-test-id="constants.DATA_TEST_ID_VALUES.SERVICE_ACTIONS_BUTTON"
      >
        <IconMore class="icon color-13"></IconMore>
      </button>
    </label>
    <b-message
      :ref="`popup-${serviceItinerary.id}`"
      class="PopoverActions"
      title="Choose an Action"
      v-model="isActive"
      aria-close-label="Close message"
    >
      <div
        @click="
          closeServiceActions();
          handleModalEditServiceModal(
            serviceItinerary,
            constants.EDIT_SERVICE_SIDEBAR_TABS_IDS.INFO
          );
        "
        class="edit_option__container"
      >
        <a :disabled="disableQuoteByStatus">
          <IconPencil class="icon color-8 is-xsmall" /> Edit
        </a>
      </div>
      <div
        @click="
          closeServiceActions();
          handleDuplicateServiceItinerary(serviceItinerary.id);
        "
      >
        <a
          :disabled="disableQuoteByStatus"
          :data-test-id="constants.DATA_TEST_ID_VALUES.DUPLICATE_SERVICE_BUTTON"
        >
          <IconDuplicate class="icon color-8 is-xsmall" /> Duplicate
          <b-tooltip
            v-if="isAccommodationPackageService"
            label="Keep in mind that if service dates are equal, duplicated service will be merged"
            type="is-warning"
            position="is-left"
            style="padding: 0"
          >
            <IconWarning
              class="icon is-xsmall color-12"
              style="width: 1.2rem; height: 1.2rem"
            />
          </b-tooltip>
        </a>
      </div>
      <div
        v-if="isAvailableToReplaceService"
        @click="
          closeServiceActions();
          onReplaceClick(serviceItinerary);
        "
      >
        <a :disabled="disableQuoteByStatus"> <IconReplace /> Replace </a>
      </div>
      <div
        @click.prevent="
          closeServiceActions();
          deleteGroupedServices();
        "
      >
        <a :data-test-id="constants.DATA_TEST_ID_VALUES.DELETE_SERVICE_BUTTON">
          <IconTrash class="icon color-8 is-xsmall" /> Delete</a
        >
      </div>
      <div
        v-if="hasHistory"
        @click.prevent="
          closeServiceActions();
          displayServiceHistoryModal(serviceItinerary.id);
        "
        class="history_option__container"
      >
        <a> <IconInfo class="icon color-8 is-xsmall" /> Display history</a>
      </div>
      <div
        v-if="
          [
            constants.SERVICE_OPTIONAL_TYPES.OPTIONAL,
            constants.SERVICE_OPTIONAL_TYPES.REGULAR,
          ].includes(serviceItinerary.optional)
        "
        @click.prevent="
          closeServiceActions();
          updateServiceOptionalField(serviceItinerary);
        "
      >
        <a>
          <IconGrowthArrow
            :class="`icon color-8 is-xsmall ${
              [
                constants.SERVICE_OPTIONAL_TYPES.OPTIONAL,
                constants.SERVICE_OPTIONAL_TYPES.CONFIRMED,
              ].includes(serviceItinerary.optional)
                ? 'inverted'
                : ''
            }`"
          />
          {{
            serviceItinerary.optional ===
            constants.SERVICE_OPTIONAL_TYPES.REGULAR
              ? "Make"
              : "Undo"
          }}
          optional</a
        >
      </div>
      <div
        v-if="
          [
            constants.SERVICE_OPTIONAL_TYPES.CONFIRMED,
            constants.SERVICE_OPTIONAL_TYPES.OPTIONAL,
          ].includes(serviceItinerary.optional)
        "
        @click.prevent="
          closeServiceActions();
          updateServiceOptionalField(serviceItinerary, true);
        "
      >
        <a>
          <IconCheckCircle
            v-if="
              constants.SERVICE_OPTIONAL_TYPES.OPTIONAL ===
              serviceItinerary.optional
            "
            :class="`icon color-8 is-xsmall`"
          />
          <IconGrowthArrow v-else :class="`icon color-8 is-xsmall inverted`" />
          {{
            serviceItinerary.optional ===
            constants.SERVICE_OPTIONAL_TYPES.OPTIONAL
              ? "Confirm optional"
              : "Undo confirmation"
          }}
        </a>
      </div>
      <div
        v-if="displayImportServiceButton"
        @click.prevent="
          closeServiceActions();
          validateServiceImport();
        "
        class="update_option__container"
      >
        <a>
          <b-tooltip
            type="is-dark"
            position="is-top"
            style="padding: 0rem"
            :active="serviceItinerary.last_import !== null"
          >
            <b-icon
              size="is-small"
              custom-size="mdi-24px"
              icon="swap-vertical-bold"
              class="mr-1"
            ></b-icon>
            Update Service
            <template v-slot:content>
              <span style="font-weight: 300">
                Last update on
                <strong>{{ lastServiceImportText }}</strong></span
              >
            </template>
          </b-tooltip>
        </a>
      </div>
      <div>
        <div style="font-size: 0.7rem; max-width: 9rem">
          <strong>{{ serviceItinerary.edition.user.name }}</strong> edited on
          {{ lastServiceEditionText }}
        </div>
      </div>
    </b-message>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import helpers from "@/helpers";
import { datesHelper } from "@/utils/dates";
import { setDay, calculateDuration, addDaysToDate } from "@/utils/utils";
import { SERVICE_TYPE, USER_ROLE } from "@/constants";
import { serviceHelper } from "@/utils/service";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import {
  EDIT_SERVICE_SIDEBAR_TABS_IDS,
  SERVICE_OPTIONAL_TYPES,
} from "@/constants/services";
import { SERVICE_ROW_FIELDS } from "@/constants/services";

export default {
  name: "ServicesTableActions",
  data() {
    return {
      constants: {
        DATA_TEST_ID_VALUES,
        EDIT_SERVICE_SIDEBAR_TABS_IDS,
        SERVICE_OPTIONAL_TYPES,
      },
      helpers: { ...datesHelper },
      clicks: 0,
      timer: null,
      delay: 700,
      modalReorder: null,
    };
  },
  props: {
    handleSearchService: {
      type: Function,
      default: () => {},
    },
    handleChangeTimerCount: {
      type: Function,
      default: () => {},
    },
    handleItineraryServiceRecentlyAdded: {
      type: Function,
      default: () => {},
    },
    handleModalEditServiceModal: {
      type: Function,
      default: () => {},
    },
    saveItineraryServiceUpdated: {
      type: Function,
      default: () => {},
    },
    serviceItinerary: {
      type: [Array, Object],
      default: () => [],
      required: true,
    },
    serviceIndex: {
      type: Number,
      required: true,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    onReplaceClick: {
      type: Function,
      default: () => {},
    },
    preventCreateNewService: {
      type: Function,
      default: () => {},
    },
    displayServiceHistoryModal: {
      type: Function,
      default: () => {},
    },
    servicesItinerary: {
      type: Array,
      default: () => [],
    },
    udpateLocalSaving: {
      type: Function,
      default: () => {},
    },
    updateItineraryServicesOrder: {
      type: Function,
      default: () => {},
    },
    saveItineraryService: {
      type: Function,
      default: () => {},
    },
    importService: {
      type: Function,
      default: () => {},
    },
    openServiceImportModal: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      itineraryStatus: "itinerary/getItineraryStatus",
      itinerary: "itinerary/getItinerary",
      loading: "utils/getLoading",
      serviceActionsModal: "utils/getServiceActionsModal",
      datesFormat: "itinerary/getDatesFormat",
      authData: "auth/getAuthData",
    }),
    isAccommodationPackageService() {
      return serviceHelper.isAccommodationPackageService(
        this.serviceItinerary.id_service_type
      );
    },
    hasHistory() {
      return this.serviceItinerary.servicesRelated?.length === 1;
    },
    isAvailableToReplaceService() {
      return this.serviceItinerary.id_service_type !== SERVICE_TYPE.PACKAGE;
    },
    lastServiceEditionText() {
      return `${this.helpers.getDatetimeFromUTC(
        this.serviceItinerary.edition.date,
        this.datesFormat
      )}`;
    },
    lastServiceImportText() {
      if (this.serviceItinerary.last_import === null) return "";
      return `${this.helpers.getDatetimeFromUTC(
        this.serviceItinerary.last_import,
        this.datesFormat
      )}`;
    },
    displayImportServiceButton() {
      const isAdmin = helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.ADMIN],
        true
      );
      return isAdmin;
    },
    isActive: {
      get() {
        const isService =
          this.serviceActionsModal?.serviceId === this.serviceItinerary.id;
        return this.serviceActionsModal.opened && isService;
      },
      set(value) {
        this.$store.dispatch("utils/setServiceActionsModal", {
          serviceId: this.serviceItinerary.id,
          opened: value,
        });
      },
    },
  },
  methods: {
    async validateServiceImport() {
      const nowTime = new Date();
      const lastServiceImportTime = new Date(this.serviceItinerary.last_import);

      const differenceInMillis = Math.abs(nowTime - lastServiceImportTime);

      const differenceInHours = differenceInMillis / (1000 * 60 * 60);

      const isServiceAlreadyImportedToday = differenceInHours <= 24;

      if (isServiceAlreadyImportedToday) {
        this.$emit("update:selectedService", this.serviceItinerary);
        this.openServiceImportModal();
        return;
      }

      await this.importService(this.serviceItinerary);
    },
    async updateServiceOptionalField(service, confirm = false) {
      const { REGULAR, OPTIONAL, CONFIRMED } =
        this.constants.SERVICE_OPTIONAL_TYPES;

      const stateTransitionMap = {
        [REGULAR]: OPTIONAL,
        [OPTIONAL]: confirm ? CONFIRMED : REGULAR,
      };

      const newOptionalValue = stateTransitionMap[service.optional] || REGULAR;

      const adaptedService = {
        index: this.serviceIndex,
        id: service.id,
        item: {
          ...service,
          optional: newOptionalValue,
        },
        previousValue: service.optional,
        field: SERVICE_ROW_FIELDS.OPTIONAL,
        value: newOptionalValue,
      };
      await this.saveItineraryService(adaptedService);
    },
    async duplicateGroupedServices() {
      await Promise.allSettled(
        this.serviceItinerary.services.servicesRelated.map((service) =>
          this.handleDuplicateServiceItinerary(service.id)
        )
      );
    },
    closeServiceActions() {
      this.isActive = false;
    },
    setLoadingText(value) {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    findServicesWithSameStartDate(droppedRow) {
      const servicesWithSameStartDate = [];

      this.servicesItinerary.forEach((service, index) => {
        if (service.start_date === droppedRow.start_date) {
          servicesWithSameStartDate.push({ ...service, index });
          this.servicesItinerary[index] = { ...service, index };
        }
      });
      return servicesWithSameStartDate;
    },
    async handleDuplicateServiceItinerary(id) {
      try {
        if (this.isAccommodationPackageService) {
          return this.preventCreateNewService(this.serviceItinerary);
        }
        this.setLoadingText("Duplicating service, please wait...");
        this.setLoading(true);
        const TOTAL_STEPS_TO_PERFORM = 1;
        const response = await this.$store.dispatch(
          "itinerary/duplicate_service",
          {
            id: this.itinerary.data.id,
            services: [id],
            cur_step: 1,
            last_step: TOTAL_STEPS_TO_PERFORM,
          }
        );
        this.handleChangeTimerCount(30);
        this.$buefy.toast.open({
          duration: 5000,
          message: response.message,
          position: "is-top",
          type: "is-success",
        });
        this.setLoading(false);
      } catch (error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: error.message,
          position: "is-top",
          type: "is-success",
        });
        this.setLoading(false);
      }
    },
    async deleteGroupedServices() {
      this.setLoadingText("Deleting service, please wait...");
      this.setLoading(true);

      const serviceIds = this.serviceItinerary.servicesRelated.map(
        (service) => service.id
      );

      const TOTAL_STEPS_TO_PERFORM = serviceIds.length;
      for (let index = 0; index < serviceIds.length; index++) {
        await this.handleDeleteServiceItinerary(
          serviceIds[index],
          1 + index,
          TOTAL_STEPS_TO_PERFORM
        );
      }
      this.setLoading(false);
    },
    async handleDeleteServiceItinerary(serviceId = "", cur_step, last_step) {
      return await this.$store
        .dispatch("itinerary/delete_service", {
          id: serviceId,
          itinerary: this.itinerary.data.id,
          cur_step,
          last_step,
        })
        .then((response) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: response.message,
            position: "is-top",
            type: "is-success",
          });
        })
        .catch((error) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: error.message,
            position: "is-top",
            type: "is-success",
          });
        });
    },
    handleReorderModal() {
      this.modalReorder = !this.modalReorder;
    },
    async reorderServices(service, serviceIndex) {
      try {
        this.setLoading(true);
        let droppedOnRowIndex = serviceIndex;
        if (service.direction === "up") {
          droppedOnRowIndex -= 1;
        }
        if (service.direction === "down") {
          droppedOnRowIndex += 1;
        }
        const result = await this.saveReorderServices(
          service,
          droppedOnRowIndex
        );
        if (result) {
          this.$buefy.toast.open({
            duration: 5000,
            message: `Moved ${service.code} from row ${serviceIndex + 1} to ${
              droppedOnRowIndex + 1
            }`,
            position: "is-top",
            type: "is-success",
          });
          // highlight
          this.handleItineraryServiceRecentlyAdded(service.id);
          this.setLoading(false);
        } else {
          throw new Error("Ups! Something went wrong, please try again");
        }
      } catch (err) {
        this.setLoading(false);
        console.info(err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! Something went wrong, please try again",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    updateDatesPricesAndOrder(
      id_service_type,
      draggingRow,
      droppedRow,
      servicesWithSameStartDate
    ) {
      draggingRow.start_date = droppedRow.start_date;
      if (id_service_type === 2 || id_service_type === 9) {
        const duration = calculateDuration(draggingRow.day);
        draggingRow.end_date = addDaysToDate(draggingRow.start_date, duration);
      }
      if (id_service_type !== 2 && id_service_type !== 9) {
        draggingRow.end_date = draggingRow.start_date;
      }
      if (draggingRow.direction === "up") {
        draggingRow.order -= droppedRow.servicesRelated.length;
        droppedRow.order += draggingRow.servicesRelated.length;
      } else if (draggingRow.direction === "down") {
        draggingRow.order += droppedRow.servicesRelated.length;
        droppedRow.order -= draggingRow.servicesRelated.length;
      }
      // Aquí se debe realizar la consulta de precios, costos y márgenes según las nuevas fechas del servicio, después de obtener esta información se debe actualizar el json
      servicesWithSameStartDate.push(draggingRow);
    },
    updateOnlyOrder(draggingRow, droppedRow, servicesWithSameStartDate) {
      const targetService = servicesWithSameStartDate.find(
        (item) => item.id === draggingRow.id
      );
      const sourceService = servicesWithSameStartDate.find(
        (item) => item.id === droppedRow.id
      );

      if (draggingRow.direction === "up") {
        targetService.order -= sourceService.servicesRelated.length;
        sourceService.order += targetService.servicesRelated.length;
      } else if (draggingRow.direction === "down") {
        targetService.order += sourceService.servicesRelated.length;
        sourceService.order -= targetService.servicesRelated.length;
      }

      servicesWithSameStartDate.forEach((service) => {
        service.calculate_prices = 0;
      });
    },
    async saveReorderServices(draggingRowData, droppedOnRowIndex) {
      const draggingRow = draggingRowData;
      const { id_service_type, start_date } = draggingRow;
      const droppedRow = this.servicesItinerary[droppedOnRowIndex];
      if (this.servicesItinerary && this.servicesItinerary.length) {
        const servicesWithSameStartDate =
          this.findServicesWithSameStartDate(droppedRow);
        if (servicesWithSameStartDate.length > 0) {
          if (start_date !== droppedRow.start_date) {
            // update dates, prices and order
            this.updateDatesPricesAndOrder(
              id_service_type,
              draggingRow,
              droppedRow,
              servicesWithSameStartDate
            );
          } else if (start_date === droppedRow.start_date) {
            // update only order
            this.updateOnlyOrder(
              draggingRow,
              droppedRow,
              servicesWithSameStartDate
            );
          }
          servicesWithSameStartDate.forEach((service) => {
            service.day = setDay(
              service.start_date,
              service.end_date,
              this.itinerary.data
            );
            service.calculate_prices = service.calculate_prices ?? 1;
          });
          const groupedServicesExpanded = servicesWithSameStartDate?.reduce(
            (acc, service) => {
              const servicesRelated = service.servicesRelated.map(
                (serviceRelated, index) => ({
                  ...serviceRelated,
                  order: service.order + index,
                  start_date: service.start_date,
                  end_date: service.end_date,
                  day: service.day,
                  servicesRelated: [serviceRelated],
                })
              );
              return [...acc, ...servicesRelated];
            },
            []
          );

          const TOTAL_STEPS_TO_PERFORM = 1;
          return this.saveItineraryServiceUpdated(
            {
              services: groupedServicesExpanded,
              cur_step: 1,
              last_step: TOTAL_STEPS_TO_PERFORM,
            },
            false
          );
        }
      }
    },
    validateServiceDatesWhenReorder(draggingRow, serviceIndex, direction) {
      let droppedOnRowIndex = serviceIndex;
      draggingRow.direction = direction;
      if (direction === "up") {
        droppedOnRowIndex -= 1;
      }
      if (direction === "down") {
        droppedOnRowIndex += 1;
      }
      if (
        droppedOnRowIndex >= 0 &&
        this.servicesItinerary &&
        droppedOnRowIndex < this.servicesItinerary.length
      ) {
        const { start_date } = draggingRow;
        const droppedRow = this.servicesItinerary[droppedOnRowIndex];
        if (start_date === droppedRow.start_date) {
          this.reorderServices(draggingRow, serviceIndex);
        } else if (start_date !== droppedRow.start_date) {
          this.handleReorderModal();
        }
      }
    },
    onShowMoreButtonClick() {
      this.$store.dispatch("utils/setServiceActionsModal", {
        serviceId: this.serviceItinerary.id,
        opened: !this.isActive,
      });
    },
    handleClickOutside(event) {
      const popup = this.$refs?.[`popup-${this.serviceItinerary.id}`];
      if (this.isActive && popup && !popup.$el.contains(event.target)) {
        this.$store.dispatch("utils/setServiceActionsModal", {
          serviceId: this.serviceItinerary.id,
          opened: !this.isActive,
        });
      }
    },
  },
  watch: {
    isActive(newValue) {
      if (newValue) {
        setTimeout(() => {
          document.addEventListener("click", this.handleClickOutside);
        }, 1);
      } else document.removeEventListener("click", this.handleClickOutside);
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
<style scoped>
.actionsButtons {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.upAndDownMenu {
  flex-direction: column;
  align-items: center;
  display: flex;
}
.upAndDownButton {
  margin: 0;
  padding: 0;
  border-color: transparent;
  height: max-content;
  background: transparent;
  border-radius: 0;
}
.upAndDownButton:focus {
  outline: none !important;
}
.upAndDownButton .icon:hover {
  color: var(--info-color) !important;
}
svg.inverted {
  transform: rotate(180deg);
}
.PopoverActions {
  z-index: 99;
}
@media screen and (max-width: 480px) {
  .update_option__container,
  .history_option__container,
  .edit_option__container {
    display: none;
  }
}
</style>
