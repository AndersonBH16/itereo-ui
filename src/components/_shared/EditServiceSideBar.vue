<template>
  <div v-if="serviceItinerary !== null">
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :overlay="true"
      :right="true"
      v-model="editServiceModal"
      class="sidebarRight"
      @close="() => handleCloseEditServiceSidebar"
    >
      <div
        class="topCloseSideBar is-flex pr-5 p-2"
        :is-editing-top-info="editingServiceInfo"
      >
        <div v-if="editingServiceInfo" class="is-flex">
          <a @click="handleCloseEditServiceSidebar" class="is-flex color-8">
            <IconChevronLeft class="icon is-small mr-2 mt-3" />
          </a>
          <BaseInput
            v-if="editingServiceInfo"
            :value="formItineraryService.name.value"
            label="Name"
            placeholder="Edit service name here"
            style="height: 2rem; width: 22rem"
            :maxlength="200"
            @input="updateFormItineraryServiceFromChild(['name', $event])"
          />
          <LocationSelector
            v-if="editingServiceInfo"
            :location="serviceItinerary.location"
            @update="updateFormItineraryServiceFromChild(['location', $event])"
          />
        </div>
        <div v-else class="is-flex">
          <a @click="handleCloseEditServiceSidebar" class="is-flex color-8">
            <IconChevronLeft class="icon is-small mr-2 mt-3" />
          </a>
          <div>
            <a @click="handledToggleEditServiceInfo()">
              <div>
                <span
                  class="color-4 has-text-weight-medium is-h3 edit_service_sidebar__name"
                  >{{
                    formItineraryService.name.value
                      ? formItineraryService.name.value
                      : "-"
                  }}</span
                >
                <span class="color-7">
                  {{ serviceItinerary ? serviceItinerary.code : "-" }}
                </span>
                <span class="mx-1">
                  {{ serviceSuppliers ? `${serviceSuppliers}` : "" }}
                </span>
                <strong class="edit_service_sidebar__check_in">
                  - {{ formItineraryService.check_in }}</strong
                >
              </div>
            </a>
            <a @click="handledToggleEditServiceInfo()">
              <div>
                <span class="mr-2">
                  <IconPax class="color-7" />
                  {{ formItineraryService.num_pax }}
                </span>
                <span class="mr-1"
                  >{{ getDays }}
                  {{
                    helper.getComplementTextByServiceType(
                      serviceItinerary.id_service_type
                    )
                  }}
                </span>
                <span v-for="(location, index) in handleLocations" :key="index">
                  {{ location.location_name }}
                </span>
              </div>
            </a>
          </div>
        </div>
        <div class="is-flex align-items-center">
          <i
            class="button is-info button-saas is-small sidebarConfirmEditButton"
            @click="
              () => {
                handledToggleEditServiceInfo();
                updateFormItineraryServiceFromChild(['saveService', false]);
              }
            "
            v-if="editingServiceInfo"
          >
            <IconCheck class="icon is-small" />
          </i>
          <i
            @click="
              handledToggleEditServiceInfo();
              discardChangesItineraryTitle();
            "
            class="button button-saas is-small color-8 sideBarCloseButton"
            v-if="editingServiceInfo"
          >
            <IconClose class="icon is-small" />
          </i>
          <i
            class="button is-color4 is-info button-saas is-small sidebarEditButton"
            @click="handledToggleEditServiceInfo"
            v-if="
              !editingServiceInfo &&
              hasViewEditServiceTitleDestinationPermission &&
              !hideElementByCondition &&
              !disableQuoteByStatus
            "
          >
            <IconPencil class="icon is-small" />
          </i>
        </div>
      </div>
      <div
        class="p-3 SideBarBox SideBarEdit"
        :data-test-id="constants.DATA_TEST_ID_VALUES.ITINERARY_SERVICE_SIDEBAR"
      >
        <div v-if="hasNotSMServicePrice" class="no_price_alert__container">
          <div>
            <IconInfo />

            <p class="ml-2" style="display: inline-block">
              <strong>There are not prices for this service</strong>, please try
              updating the service using the option:
            </p>

            <BaseButton
              @click="importQuoteService"
              action="principal"
              class="ml-2"
            >
              <i slot="icon" class="ml-1">
                <b-icon
                  size="is-small"
                  custom-size="mdi-18px"
                  icon="swap-vertical-bold"
                  class="mr-1"
                ></b-icon>
              </i>
              <p slot="text">Update Service</p>
            </BaseButton>
          </div>

          <p class="my-2">
            Be aware the service requiere to be included in the Sales Manual for
            the dates from {{ formItineraryService.start_date }} to
            {{ formItineraryService.end_date }} if this a accommodation or
            package you would need to also considerate the Room Type Single,
            Double, Triple, Etc. this is requirement to confirm the itinerary,
            you would be able to change the status to Sent but not Confirm it.
          </p>

          <p>if the problem persist, contact us at support@itereo.travel</p>
        </div>

        <EditServiceSideBarDates
          :disabled_dates="disabled_dates"
          :formItineraryService="formItineraryService"
          :min="min"
          :handleAutomaticPriceCalculate="handleAutomaticPriceCalculate"
          :handleServiceFirstTime="handleServiceFirstTime"
          @update="updateFormItineraryServiceFromChild"
        />
        <EditServiceSideBarTabs
          v-on:handled-toggle-switch="handledToggleSwitch"
          :isServiceDatesRangeEdited="isServiceDatesRangeEdited"
          :formItineraryService="formItineraryService"
          :serviceLocation="handleLocations"
          :serviceItinerary="serviceItinerary"
          :passengers="passengers_itinerary"
          :open="editServiceModal"
          :hasNotSMServicePrice="hasNotSMServicePrice"
          :automaticPriceCalculate="automaticPriceCalculate"
          :setLoading="setLoading"
          :handleAutomaticPriceCalculate="handleAutomaticPriceCalculate"
          :serviceFirstTime="serviceFirstTime"
          :handleServiceFirstTime="handleServiceFirstTime"
          :defaultOpenedTab="defaultOpenedTab"
          :editServiceSidebarFocusedElement="editServiceSidebarFocusedElement"
          :passengerOptions="passengerOptions"
          :originalServicePrice="originalServicePrice"
          :validateFunctionExecution="validateFunctionExecution"
          :updateServiceViewState="updateServiceViewState"
          @update="updateFormItineraryServiceFromChild"
        />
        <div class="BottomButtonsSideBar">
          <BottomButtonSaveSideBar
            @update="updateFormItineraryServiceFromChild"
          />
          <BaseModal
            :isComponentModalActive="paxAssignAlert"
            :cancel="['x', 'outside', 'escape']"
          >
            <IconWarning slot="icon" class="icon is-xsmall color-12" />
            <span slot="title"
              >Passsengers assigned don't match your room distribution
              selection</span
            >
            <span slot="paragraph">
              Are you sure to
              <span class="has-text-weight-semibold">save</span> this changes?
            </span>
            <div slot="buttons" class="is-flex">
              <BaseButton
                @click="paxAssignAlert = false"
                action="secondary"
                size="medium"
                class="mr-4"
              >
                <p slot="text">No, take me back</p>
              </BaseButton>
              <BaseButton
                @click="
                  saveMultipleServices();
                  paxAssignAlert = false;
                "
                action="tercery"
                size="medium"
              >
                <p slot="text">Yes, continue</p>
              </BaseButton>
            </div>
          </BaseModal>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
import { mapGetters } from "vuex";
import { parse, getYear, getMonth, getDaysInMonth } from "date-fns";
import EditServiceSideBarDates from "@/components/_shared/EditServiceSideBarDates.vue";
import EditServiceSideBarTabs from "@/components/_shared/EditServiceSideBarTabs.vue";
import BottomButtonSaveSideBar from "@/components/_shared/BottomButtonSaveSideBar.vue";
import {
  addDaysToDate,
  calculateDays,
  setDay,
  transformTextArrayToArray,
} from "@/utils/utils";
import LocationSelector from "@/components/_shared/LocationSelector.vue";
import {
  SERVICE_ROW_FIELDS,
  FORM_ITINERARY_SERVICE_DEFAULT,
} from "@/constants/services";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { serviceHelper } from "@/utils/service";
import { SERVICE_TYPE, STATUS, USER_ROLE } from "@/constants";
import helpers from "@/helpers";
import { datesHelper } from "@/utils/dates";

export default {
  name: "EditServiceSideBar",
  components: {
    LocationSelector,
    EditServiceSideBarDates,
    EditServiceSideBarTabs,
    BottomButtonSaveSideBar,
  },
  data() {
    return {
      constants: {
        DATA_TEST_ID_VALUES,
      },
      switchUpdateAllServices: false,
      disabled_dates: [],
      min: null,
      max: null,
      helper: serviceHelper,
      formItineraryService: FORM_ITINERARY_SERVICE_DEFAULT,
      automaticPriceCalculate: true,
      serviceFirstTime: false,
      editingServiceInfo: false,
      paxAssignAlert: false,
      passengerOptions: this.passengers_itinerary,
      hasNotSMServicePrice: false,
    };
  },
  props: {
    updateServiceViewState: {
      type: Function,
      default: () => {},
    },
    defaultOpenedTab: {
      type: Number,
      default: 0,
    },
    editServiceSidebarFocusedElement: {
      type: String,
      default: "",
    },
    serviceIdToEdit: {
      type: String,
      default: "",
    },
    editServiceModal: {
      type: Boolean,
      default: false,
    },
    importService: {
      type: Function,
      default: () => {},
    },
    handleModalEditServiceModal: {
      type: Function,
      default: () => {},
    },
    handleSearchService: {
      type: Function,
      default: () => {},
    },
    serviceItinerary: {
      type: [Array, Object],
      default: () => [],
    },
    getServicePrice: {
      type: Function,
      default: () => {},
    },
    passengers_itinerary: {
      type: [Array, Object],
      default: () => [],
    },
    selected: {
      type: Boolean,
      default: false,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    setEndDateToNewServiceByIdServiceType: {
      type: Function,
      default: () => {},
    },
    setStartDateToNewServiceByIdServiceType: {
      type: Function,
      default: () => {},
    },
    sendItineraryServiceUpdatedToAPI: {
      type: Function,
      default: () => {},
    },
    setRoomsSelectedAccomPack: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    serviceIdToEdit() {
      this.loadService();
    },
    editServiceModal() {
      if (!this.editServiceModal) {
        this.editingServiceInfo = false;
        this.updateServiceViewState("defaultOpenedTab", 0);
      }
    },
  },
  computed: {
    handleLocations() {
      return this.formItineraryService.location
        ? this.formItineraryService.location.filter((loc) => loc.status !== -1)
        : [];
    },
    ...mapGetters({
      authData: "auth/getAuthData",
      client_contracts: "client/getClientContracts",
      itinerary: "itinerary/getItinerary",
      itineraryStatus: "itinerary/getItineraryStatus",
      service: "services/getService",
      services_itinerary: "itinerary/getServicesItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    getDays() {
      if (
        this.helper.isAccommodationPackageService(
          this.formItineraryService.id_service_type
        )
      ) {
        return this.formItineraryService?.nights;
      }
      return this.formItineraryService?.days || 0;
    },
    serviceSuppliers() {
      const isAdmin = helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.ADMIN],
        true
      );
      return isAdmin
        ? serviceHelper.getServiceSuppliers(this.formItineraryService)
        : "";
    },
    hasViewEditServiceTitleDestinationPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    isServiceDatesRangeEdited() {
      const isServiceStartDateEdited =
        this.serviceItinerary.start_date !==
        this.formItineraryService.start_date;
      const isServiceEndDateEdited =
        this.serviceItinerary.end_date !== this.formItineraryService.end_date;
      return isServiceStartDateEdited || isServiceEndDateEdited;
    },
    originalServicePrice() {
      if (!this.formItineraryService?.prices_costs_margins) return 0;
      if (!this.formItineraryService?.prices_costs_margins?.price) return 0;

      if (
        this.serviceItinerary.service_price &&
        this.serviceItinerary.service_price.length !== 0
      ) {
        const rooms = this.getFullRooms(this.serviceItinerary);
        return this.getCalculatedPrice(rooms);
      }

      return this.formItineraryService.prices_costs_margins?.price;
    },
  },
  methods: {
    async importQuoteService() {
      this.setLoading(true);
      await this.importService(this.serviceItinerary);
      await this.resetService();
      this.handleCloseEditServiceSidebar();
      this.setLoading(false);
    },
    async resetService() {
      await this.$store.dispatch("services/resetService");
    },
    handleServiceHasNoServicePrice() {
      const hasSMOringalServicePrice = this.service.service_price?.length > 0;

      const hasServiceSupplierOringal =
        this.service.supplier_service?.length > 0;

      this.hasNotSMServicePrice =
        !hasSMOringalServicePrice || !hasServiceSupplierOringal;
    },
    discardChangesItineraryTitle() {
      this.formItineraryService.name = JSON.parse(
        JSON.stringify(this.serviceItinerary.name)
      );
      this.formItineraryService.location = JSON.parse(
        JSON.stringify(this.serviceItinerary.location)
      );
    },
    handleCloseEditServiceSidebar() {
      this.handleModalEditServiceModal();
      this.resetState();
    },
    resetState() {
      this.formItineraryService = FORM_ITINERARY_SERVICE_DEFAULT;
      this.editingServiceInfo = false;
      this.hasNotSMServicePrice = false;
    },
    calculatePrice(key, value) {
      if (this.service && this.service.id) {
        const cost = Number(this.formItineraryService.cost);
        const cost_unit = Number(this.formItineraryService.cost_unit || cost);
        const days = Number(this.formItineraryService.days) || 1;

        if (key === "percentage_margin") {
          this.formItineraryService.price_unit =
            parseFloat(cost_unit) > 0
              ? isNaN(cost_unit * (1 + Number(value) / 100))
                ? 0
                : (cost_unit * (1 + Number(value) / 100)).toFixed(2)
              : this.formItineraryService.price_unit;
          this.formItineraryService.price =
            this.formItineraryService.price_unit * days;

          const calc = isNaN(this.formItineraryService.price_unit - cost_unit)
            ? 0
            : this.formItineraryService.price_unit - cost_unit;

          this.formItineraryService.margin = isFinite(calc)
            ? parseFloat(calc).toFixed(2)
            : 0;
        } else if (key === "price_unit") {
          this.formItineraryService.price = Number(value)
            ? Number(value) * days
            : 0;
          const calc =
            Number(value) - cost_unit ? Number(value) - cost_unit : 0;

          this.formItineraryService.margin = isFinite(calc)
            ? parseFloat(calc).toFixed(2)
            : 0;
          const percentage_margin =
            (Number(this.formItineraryService.margin) / cost_unit) * 100;
          this.formItineraryService.percentage_margin = isFinite(
            percentage_margin
          )
            ? parseFloat(percentage_margin).toFixed(2)
            : 0;
        } else if (key === "margin") {
          this.formItineraryService.price_unit =
            Number(value) + cost_unit
              ? (Number(value) + cost_unit).toFixed(2)
              : 0;
          this.formItineraryService.price =
            Number(this.formItineraryService.price_unit) * days;

          const percentage_margin = (Number(value) / cost_unit) * 100;
          this.formItineraryService.percentage_margin = isFinite(
            percentage_margin
          )
            ? parseFloat(percentage_margin).toFixed(2)
            : 0;
        }
      }
    },
    handleAutomaticPriceCalculate(value) {
      this.automaticPriceCalculate = value;
    },
    handleServiceFirstTime(value) {
      this.serviceFirstTime = value;
    },
    handledToggleEditServiceInfo() {
      if (!this.hasViewEditServiceTitleDestinationPermission) return;
      if (this.hideElementByCondition) return;
      if (this.disableQuoteByStatus) return;
      this.editingServiceInfo = !this.editingServiceInfo;
    },
    exitEditSidebar() {
      this.editingServiceInfo = false;
    },
    handledToggleSwitch(value) {
      this.switchUpdateAllServices = value;
    },
    selectRoomsQty(service, roomsSelected) {
      return service.room?.map((item) => {
        if (roomsSelected?.length) {
          const sameRoomName = roomsSelected.filter(
            (room) =>
              room.romm_name.trim().toUpperCase() ==
                item.name.trim().toUpperCase() && room.status !== -1
          );
          if (sameRoomName?.length) {
            return {
              ...item,
              qty: sameRoomName[0].room_qty ? sameRoomName[0].room_qty : 1,
            };
          } else {
            return {
              ...item,
              qty: 0,
            };
          }
        }
        return {
          ...item,
          qty: 0,
        };
      });
    },
    async loadService() {
      try {
        if (this.serviceItinerary !== null) {
          this.setLoading(true);
          this.serviceFirstTime = true;
          this.inactivityDates();
          const {
            start_date,
            end_date,
            num_pax,
            service: id,
            service_price: roomsSelected,
          } = this.serviceItinerary;

          const service = await this.handleSearchService({
            from: start_date,
            to: end_date,
            num_pax,
            id,
          });
          if (service) {
            this.formItineraryService = this.updateFormItineraryService(
              service,
              this.serviceItinerary
            );
            this.formItineraryService = this.getCostUnitPriceUnit(
              this.formItineraryService
            );
            this.formItineraryService.room = this.selectRoomsQty(
              service,
              roomsSelected
            );
            this.formItineraryService.room = this.adapterServiceRooms(
              this.formItineraryService
            );
            const passengersPreAssignedIds =
              this.formItineraryService.service_price?.flatMap(
                (service_price) => service_price.passengers
              );
            this.passengerOptions = this.passengers_itinerary.filter(
              (passenger) => !passengersPreAssignedIds.includes(passenger.id)
            );

            this.handleServiceHasNoServicePrice();
          }
          this.setLoading(false);
        }
      } catch (err) {
        this.setLoading(false);
        console.info(err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong please try again.",
          position: "is-top",
          type: "is-danger",
        });
        throw err;
      }
    },
    getServiceNights(service) {
      if (service.id_service_type !== SERVICE_TYPE.PACKAGE) {
        return calculateDays(service.start_date, service.end_date) - 1;
      }
      return 1;
    },
    adapterServiceRooms(service, recalculated = false) {
      const nights = this.getServiceNights(service);

      const rooms = service?.room?.map((room) => {
        const roomSelected = service.service_price.find(
          (sp) => sp.romm_id === room.id
        );
        const prices_ranges = room?.price_service_sm
          ? room?.price_service_sm[0]?.price_service[0]?.prices_ranges
          : null;
        const new_price_unit = prices_ranges ? prices_ranges[0].price || 0 : 0;

        if (roomSelected === undefined || recalculated) {
          return {
            ...room,
            new_price_unit: Math.round(new_price_unit),
            price_unit: Math.round(new_price_unit),
            price: Math.round(new_price_unit * room?.qty),
            finalPrice: Math.round(new_price_unit * room?.qty),
          };
        }

        const price_unit = roomSelected.price_unit ?? 0;

        return {
          ...room,
          new_price_unit: Math.round(new_price_unit),
          price_unit: price_unit / (roomSelected.room_qty ?? 1),
          price: roomSelected.price / (nights || 1),
          passengers: this.getFullPassengers(roomSelected),
          finalPrice: roomSelected.price,
        };
      });

      const roomsNotAvailable = service.service_price
        .filter(
          (servicePrice) =>
            !rooms?.find((room) => room.id === servicePrice.romm_id)
        )
        .map((servicePrice) => {
          const price = servicePrice.price / (nights || 1);

          const factor = serviceHelper.isAccommodationPackageService(
            service.id_service_type
          )
            ? 1
            : service.num_pax;

          const price_unit = price / (servicePrice.room_qty * factor);
          const new_price_unit =
            this.getNewPriceUnit(service, servicePrice) ?? price_unit;

          return {
            ...servicePrice,
            new_price_unit: new_price_unit ?? 0,
            price_unit: price_unit,
            price: price,
            finalPrice: price,
            qty: servicePrice.room_qty,
            name: servicePrice.romm_name,
            passengers: this.getFullPassengers(servicePrice),
            max_passengers: 1,
            notAvailableByDatesRange: true,
          };
        });
      return !rooms ? roomsNotAvailable : [...rooms, ...roomsNotAvailable];
    },
    getNewPriceUnit(service, servicePrice) {
      if (serviceHelper.isAccommodationPackageService(service.id_service_type))
        return null;

      const price_service_sm = service.price_service_sm?.find(
        (psm) => psm.sales_manual_id === servicePrice.sales_manual_id
      );
      const price_service = price_service_sm?.price_service.find(
        (ps) => ps.supplier_code === servicePrice.romm_name
      );

      const supplier = service.supplier_service.find(
        (ss) => ss.code === servicePrice.romm_name
      );

      const individual =
        price_service?.individual_price || supplier?.individual_cost;

      const qty = service.num_pax * (individual ? 1 : servicePrice.room_qty);

      const price_range = price_service?.prices_ranges.find(
        (pr) =>
          pr.from_qty <= servicePrice.room_qty &&
          servicePrice.room_qty <= pr.to_qty
      );

      if (price_range) return price_range.price / qty;

      return null;
    },
    getFullPassengers(roomSelected) {
      return (
        this.passengers_itinerary.filter((fullPassenger) =>
          roomSelected.passengers.includes(fullPassenger.id)
        ) || []
      );
    },
    loadAssets(payload = {}) {
      return this.$store.dispatch("assets/list", payload);
    },
    getCostUnitPriceUnit(formItineraryService) {
      const { service_price } = formItineraryService;
      formItineraryService.price_unit = service_price.reduce((price, room) => {
        return price + room.price_unit;
      }, 0);
      return formItineraryService;
    },
    getMaxNightQtyRoom({ room = null, days = 0 }) {
      if (room) {
        let maxNightQty = days;
        room.forEach((item) => {
          if (
            item.price_service_sm &&
            item.price_service_sm[0].price_service &&
            item.price_service_sm[0].price_service[0].prices_ranges &&
            item.qty > 0
          ) {
            const nightQty =
              item.price_service_sm[0].price_service[0].prices_ranges[0]
                .night_qty || 0;
            if (nightQty > maxNightQty) {
              maxNightQty = nightQty;
            }
          }
        });
        return maxNightQty;
      }
      return days;
    },
    getAccommPackCostsPricesAndMargins(formItineraryService) {
      const { id_service_type, room = null } = formItineraryService;
      if (
        room &&
        serviceHelper.isAccommodationPackageService(id_service_type)
      ) {
        // se obtiene el costo total del accommodation y/o package por noche
        const cost_unit =
          room && room.length
            ? room.reduce((a, b) => {
                const sum =
                  b.cost_service &&
                  b.cost_service[0].costs_ranges &&
                  b.cost_service[0].costs_ranges.length > 0 &&
                  b.qty > 0
                    ? parseFloat(
                        Number(b.cost_service[0].costs_ranges[0].cost) *
                          Number(b.qty)
                      )
                    : 0;
                return a + sum;
              }, 0)
            : 0;

        // se obtiene el precio total del accommodation y/o package por noche
        const price_unit =
          room && room.length
            ? room.reduce((a, b) => {
                // en caso el room cuente con costo pero no con precio, se toma el costo y se multiplica por la cantidad de habitaciones seleccionadas
                let sum =
                  b.price_service_sm &&
                  b.price_service_sm[0].price_service &&
                  b.price_service_sm[0].price_service[0].prices_ranges &&
                  b.qty > 0
                    ? Number(
                        b.price_service_sm[0].price_service[0].prices_ranges[0]
                          .price
                      ) * Number(b.qty)
                    : b.cost_service &&
                      b.cost_service[0].costs_ranges &&
                      b.cost_service[0].costs_ranges.length > 0 &&
                      b.qty > 0
                    ? Number(b.cost_service[0].costs_ranges[0].cost) *
                      Number(b.qty)
                    : 0;
                return a + sum;
              }, 0)
            : 0;

        let cost = 0;
        let price = 0;
        let nights = formItineraryService.days;
        if (id_service_type === 9) {
          cost = cost_unit;
          price = price_unit;
          nights = this.getMaxNightQtyRoom(this.formItineraryService);
        }
        if (id_service_type === SERVICE_TYPE.ACCOMMODATION) {
          cost = cost_unit * nights;
          price = price_unit * nights;
        }
        const margin = price - cost;
        const percentage_margin_cu = isNaN(margin) ? 0 : margin;
        const calc_margen =
          ((percentage_margin_cu ? percentage_margin_cu : 0) * 100) / cost;
        const percentage_margin = isFinite(calc_margen) ? calc_margen : 0;
        this.formItineraryService.price_unit = price_unit.toFixed(2);
        this.formItineraryService.cost_unit = cost_unit.toFixed(2);
        this.formItineraryService.cost = cost.toFixed(2);
        this.formItineraryService.price = price.toFixed(2);
        this.formItineraryService.margin = margin.toFixed(2);
        this.formItineraryService.percentage_margin =
          percentage_margin.toFixed(2);
        this.formItineraryService.days = nights;
        this.formItineraryService.end_date = addDaysToDate(
          this.formItineraryService.start_date,
          nights
        );
        this.formItineraryService.day = setDay(
          this.formItineraryService.start_date,
          this.formItineraryService.end_date,
          this.itinerary.data
        );
      }
    },
    inactivityDates() {
      if (
        !this.service.start_date_inactivity ||
        !this.service.end_date_inactivity
      ) {
        this.disabled_dates = [];
      } else {
        const start_date = this.service.start_date_inactivity.split("-");
        const end_date = this.service.end_date_inactivity.split("-");

        for (
          var a = [],
            d = new Date(start_date[0], start_date[1] - 1, start_date[2]);
          d <= new Date(end_date[0], end_date[1] - 1, end_date[2]);
          d.setDate(d.getDate() + 1)
        ) {
          a.push(new Date(d));
        }
        this.disabled_dates = a;
      }
    },
    getFullRooms(service, isFirstService = true) {
      if (!service) return [];
      if (!this.formItineraryService.servicesRelated) return [];
      if (!this.formItineraryService.room) return [];

      const assignedRooms =
        this.formItineraryService.servicesRelated
          .flatMap((serviceRelated) => serviceRelated.service_price)
          ?.map((service_price) => service_price.romm_id) || [];

      const noAssignedRooms = this.formItineraryService.room.filter(
        (room) => !assignedRooms.includes(room.id)
      );

      const serviceAssignedRooms = service.service_price.map(
        (service_price) => service_price.romm_id
      );

      const roomsToUpdate = this.formItineraryService.room.filter((room) =>
        serviceAssignedRooms.includes(room.id)
      );

      return isFirstService
        ? [...noAssignedRooms, ...roomsToUpdate]
        : roomsToUpdate;
    },
    getCalculatedPrice(rooms = []) {
      const num_pax = this.helper.isAccommodationPackageService(
        this.formItineraryService.id_service_type
      )
        ? 1
        : this.formItineraryService.num_pax;

      const factor = this.getFactor();

      return Math.round(
        factor *
          num_pax *
          rooms.reduce((price, room) => {
            return price + room.qty * room.new_price_unit;
          }, 0)
      );
    },
    getFactor() {
      return this.helper.isPackageService(
        this.formItineraryService.id_service_type
      )
        ? 1
        : this.getDays;
    },
    async saveMultipleServices(params = {}) {
      try {
        const language_code = this.itinerary.data.language.language_code;

        if (params?.closeSidebar) this.handleModalEditServiceModal();
        this.setLoading(true);

        const factor = this.getFactor();

        const servicePrice =
          factor *
          this.formItineraryService.room.reduce((price, room) => {
            return price + room.price;
          }, 0);

        const priceToUpdate = serviceHelper.getGroupedServicePriceToUpdate(
          this.formItineraryService.price,
          servicePrice,
          this.formItineraryService.servicesRelated.length
        );

        const services = this.formItineraryService.servicesRelated.map(
          (service, index) => {
            const isFirstService = index === 0;
            const isLastService =
              this.formItineraryService.servicesRelated?.length === 1;

            const rooms = this.getFullRooms(service, isFirstService);
            const calculated_price = this.getCalculatedPrice(rooms);

            const roomsQty = rooms.reduce((acc, room) => acc + room.qty, 0);

            const price =
              factor * rooms.reduce((acc, room) => acc + room.price, 0);

            const deleteServiceByNoRoomsAssigned =
              (rooms?.length === 0 || roomsQty === 0) && !isLastService;

            helpers.applyTranslation(
              language_code,
              service.name,
              this.formItineraryService.name.value
            );
            helpers.applyTranslation(
              language_code,
              service.description,
              this.formItineraryService.description.value
            );

            return {
              ...service,
              price: price + priceToUpdate,
              calculated_price: calculated_price,
              check_in: this.formItineraryService.check_in,
              check_in_without_format:
                this.formItineraryService.check_in_without_format,
              check_out: this.formItineraryService.check_out,
              check_out_without_format:
                this.formItineraryService.check_out_without_format,
              start_date: this.formItineraryService.start_date,
              end_date: this.formItineraryService.end_date,
              day: this.formItineraryService.day,
              days: this.formItineraryService.days,
              nights: this.formItineraryService.nights,
              level: this.formItineraryService.level,
              location: this.formItineraryService.location,
              images: this.formItineraryService.images,
              images_full: this.formItineraryService.images_full,
              notes: {
                ...service.notes,
                value: this.formItineraryService.notes.value,
              },
              passengers: this.formItineraryService.passengers,
              num_pax: this.formItineraryService.passengers.length,
              recommendations: {
                ...service.recommendations,
                value: this.formItineraryService.recommendations.value,
              },
              room: rooms,
              deleteServiceByNoRoomsAssigned,
            };
          }
        );
        if (services?.length > 1)
          this.$emit("update:updateServiceTableSkeleton", true);

        const servicesToSave = services.filter(
          (service) => !service.deleteServiceByNoRoomsAssigned
        );

        const { servicesValidated, fieldUpdated } = await servicesToSave.reduce(
          async (acc, serviceToSave) => {
            const { servicesToSave, fieldUpdated } =
              await this.getServiceValidated(serviceToSave);

            const servicesValidated = (await acc).servicesValidated;

            return {
              servicesValidated: [...servicesValidated, ...servicesToSave],
              fieldUpdated: fieldUpdated,
            };
          },
          Promise.resolve({ servicesValidated: [], fieldUpdated: "" })
        );

        const servicesToDelete = services.filter(
          (service) => service.deleteServiceByNoRoomsAssigned
        );
        const TOTAL_STEPS_TO_PERFORM = servicesToDelete.length + 1;

        for (let index = 0; index < servicesToDelete.length; index++) {
          const service = servicesToDelete[index];
          await this.deleteService(service, index + 1, TOTAL_STEPS_TO_PERFORM);
        }

        await this.saveServices(
          servicesValidated,
          fieldUpdated,
          TOTAL_STEPS_TO_PERFORM,
          TOTAL_STEPS_TO_PERFORM,
          params?.calculate_room_distribution,
          params?.calculate_prices
        );

        this.$emit("update:updateServiceTableSkeleton", false);
        this.setLoading(false);
        if (params?.closeSidebar) this.resetState();
      } catch (error) {
        this.setLoading(false);
        console.info(error);
        this.$buefy.toast.open({
          duration: 5000,
          message:
            "Ups! something went wrong please try again. If the problem persists, please contact us and we will help you.",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    async deleteService(service = {}, cur_step = 0, last_step = 0) {
      return await this.$store.dispatch("itinerary/delete_service", {
        id: service.id,
        itinerary: this.itinerary.data.id,
        accumulateHighlight: true,
        cur_step,
        last_step,
      });
    },
    async saveServices(
      services = [],
      fieldUpdated = "",
      cur_step = 0,
      last_step = 0,
      calculate_room_distribution = 0,
      calculate_prices = 0
    ) {
      await this.sendItineraryServiceUpdatedToAPI(
        services,
        {
          calculate_room_distribution,
          calculate_prices,
        },
        fieldUpdated,
        cur_step,
        last_step
      );

      const serviceItinerary = this.services_itinerary.find(
        (service) => service.id === this.formItineraryService.id
      );
      this.formItineraryService = this.updateFormItineraryService(
        this.formItineraryService,
        serviceItinerary
      );
    },
    async getServiceValidated(service = {}) {
      let passengerListTxt = JSON.stringify(service.passengers)
        .replace("[", "{")
        .replace("]", "}")
        .replaceAll('"', "");

      if (
        Math.abs(
          datesHelper.getDatesDiffByDates(service.start_date, service.end_date)
        ) <= 0 &&
        serviceHelper.isAccommodationPackageService(service.id_service_type)
      ) {
        this.$buefy.toast.open({
          duration: 5000,
          message:
            "The end date must be at least 1 day higher than the start date.",
          position: "is-top",
          type: "is-warning",
        });
        return {
          servicesToSave: [],
          fieldUpdated: "",
        };
      }

      const cleanImages =
        service.images_full && service.images_full.length
          ? service.images_full.map((img) => {
              return img.id;
            })
          : [];

      service.images = "{" + cleanImages.join(",") + "}";

      service.check_in = serviceHelper.transformTimeToHourMinuteSecondFormat(
        service.check_in_without_format
      );
      service.check_out = serviceHelper.transformTimeToHourMinuteSecondFormat(
        service.check_out_without_format
      );

      service.day = setDay(
        service.start_date,
        service.end_date,
        this.itinerary.data
      );

      if (
        serviceHelper.isAccommodationPackageService(service.id_service_type)
      ) {
        //se calcula el nuevo service_price para accommodations y/o packages
        service.service_price = this.setRoomsSelectedAccomPack(service);
        service.service_supplier = this.getSelectedServiceSuppliers(service);

        service.cost = service.service_supplier.reduce(
          (cost, service_supplier) => {
            return (
              cost +
              (service_supplier.status !== STATUS.DISABLED
                ? service_supplier.cost
                : 0)
            );
          },
          0
        );

        service.passengers =
          "{" +
          service.service_price
            .filter((sp) => sp.status !== STATUS.DISABLED)
            .flatMap((sp) => sp.passengers)
            .join(",") +
          "}";
      }

      const isEndDateEdited =
        this.serviceItinerary.end_date !== service.end_date &&
        !serviceHelper.isPackageService(service.id_service_type);

      const isStartDateEdited =
        this.serviceItinerary.start_date !== service.start_date;

      const fieldUpdated =
        isEndDateEdited || isStartDateEdited ? SERVICE_ROW_FIELDS.DAY : "";

      let formItineraryServices = [];
      if (this.switchUpdateAllServices) {
        let currentItineraryService = service;
        for (let services_itinerary_item of this.services_itinerary) {
          let itineraryService =
            services_itinerary_item.id === currentItineraryService.id
              ? currentItineraryService
              : services_itinerary_item;
          formItineraryServices.push(
            this.newItemToForm(itineraryService, passengerListTxt)
          );
        }
      } else {
        if (
          !serviceHelper.isAccommodationPackageService(service.id_service_type)
        ) {
          service.passengers = passengerListTxt;
          if (service?.service_price?.[0]?.passengers) {
            service.service_price[0].passengers =
              transformTextArrayToArray(passengerListTxt);
          }
          const { validatedServicePrice, validatedServiceSupplier } =
            serviceHelper.validateSyncServicePriceAndSupplierForRestServices(
              service
            );
          service.service_price = validatedServicePrice;
          service.service_supplier = validatedServiceSupplier;
        }
        formItineraryServices.push(service);
      }

      if (
        this.helper.isAccommodationPackageService(service.id_service_type) &&
        !this.paxAssignAlert &&
        !service.isGrouped
      ) {
        const passengersAssigned = service.service_price.reduce(
          (acc, room) =>
            room.status !== STATUS.DISABLED ? acc + room.passengers.length : 0,
          0
        );
        const maxPassengersToAssign = service.room.reduce(
          (acc, room) =>
            room.qty > 0 ? acc + room.max_passengers * room.qty : acc,
          0
        );
        if (passengersAssigned !== maxPassengersToAssign)
          this.paxAssignAlert = true;
      }

      return {
        servicesToSave: formItineraryServices,
        fieldUpdated,
      };
    },
    getSelectedServiceSuppliers(service = {}) {
      const roomsSelected = service.service_supplier || [];
      const rooms = service.room;
      const nights =
        service.id_service_type === SERVICE_TYPE.ACCOMMODATION
          ? service.days
          : 1;
      const servicePrices = service.service_price || [];
      const supplier_service = this.formItineraryService.supplier_service[0];
      const serviceSuppliers = [];

      servicePrices.forEach((servicePrice, index) => {
        const serviceSupplier = roomsSelected[index];
        const room = rooms.find((r) => r.id === servicePrice.romm_id);
        const cost_service = room?.cost_service ? room.cost_service[0] : null;
        const cost_range = cost_service?.costs_ranges
          ? cost_service.costs_ranges[0]
          : null;
        const cost =
          room && cost_range ? cost_range.cost * room.qty * nights : 0;

        serviceSuppliers.push({
          id: Number(serviceSupplier?.id) || null,
          code: supplier_service?.code ?? "",
          name: supplier_service?.name?.value ?? "",
          cost: Math.ceil(cost),
          costs_ranges_id: cost_range?.id ?? 0,
          currency_id: cost_service?.currency_id ?? 0,
          cost_unit: Math.ceil(cost_range?.cost ?? 0),
          romm_id: servicePrice.romm_id,
          status: servicePrice.status,
        });
      });

      roomsSelected.forEach((serviceSupplier, index) => {
        if (index >= servicePrices.length) {
          serviceSuppliers.push({
            ...serviceSupplier,
            status: -1,
          });
        }
      });

      return serviceSuppliers;
    },
    countDaysByItineraryService(itineraryService) {
      var days = 1;
      if (
        itineraryService.start_date != null &&
        itineraryService.end_date != null
      ) {
        for (
          var a = [], d = new Date(itineraryService.start_date);
          d <= new Date(itineraryService.end_date);
          d.setDate(d.getDate() + 1)
        ) {
          a.push(d);
        }
        days = a.length;
      }
      return days - 1;
    },
    async foundImagesById(serviceItinerary, key) {
      const images = [];
      if (serviceItinerary[key] && typeof serviceItinerary[key] === "string") {
        const imagesId = serviceItinerary[key]
          .replace(/[{}]/g, "")
          .trim()
          .split(",");
        if (imagesId && imagesId.length && imagesId[0]) {
          const promises = [];
          imagesId.forEach(async (id) => {
            promises.push(this.loadAssets({ search: id }));
          });
          const responses = await Promise.all(promises);
          if (responses && responses.length) {
            responses.forEach((response) => {
              if (response && response.data && response.data.length) {
                images.push(response.data[0]);
              }
            });
          }
        }
      }
      return images;
    },
    updateFormItineraryService(service, serviceItinerary) {
      const formUpdated = {
        ...service,
        ...this.formItineraryService,
        ...cloneDeep(serviceItinerary),
      };
      formUpdated.service_supplier = formUpdated.service_supplier || [];
      const check_in = formUpdated.check_in
        ? formUpdated.check_in.split(":")
        : ["00", "00", "00"];
      const check_out = formUpdated.check_out
        ? formUpdated.check_out.split(":")
        : ["00", "00", "00"];
      const startDate = parse(formUpdated.start_date);
      const endDate = parse(formUpdated.end_date);
      const days = calculateDays(startDate, endDate);
      formUpdated.days = this.helper.isAccommodationPackageService(
        formUpdated.id_service_type
      )
        ? days - 1
        : days;

      formUpdated.nights = formUpdated.days;

      formUpdated.check_in = new Date(
        getYear(startDate),
        getMonth(startDate),
        getDaysInMonth(startDate),
        check_in[0] || "00",
        check_in[1] || "00",
        check_in[2] || "00"
      );

      formUpdated.check_out = new Date(
        getYear(endDate),
        getMonth(endDate),
        getDaysInMonth(endDate),
        check_out[0] || "00",
        check_out[1] || "00",
        check_out[2] || "00"
      );

      formUpdated.check_in_without_format = formUpdated.check_in;
      formUpdated.check_out_without_format = formUpdated.check_out;

      const service_passengers = formUpdated.passengers
        .replace(/[{}]/g, "")
        .trim();
      if (service_passengers === "") {
        formUpdated.passengers = [];
      } else {
        let passengers_arr = service_passengers.split(",");
        formUpdated.passengers = passengers_arr;
      }
      return formUpdated;
    },
    updateFormItineraryServiceRoomQty(room, formItineraryRoom) {
      const roomUpdated = cloneDeep(room);
      roomUpdated.forEach((item) => {
        formItineraryRoom.forEach((roomItem) => {
          if (item.id === roomItem.id) {
            item.qty = roomItem.qty;
            item.passengers = roomItem.passengers;
          }
        });
      });
      return roomUpdated;
    },
    updateServicePriceRooms(prices_costs_margins) {
      const newRoomIds = prices_costs_margins.service_price.map(
        (sp) => sp.romm_id
      );

      return prices_costs_margins.service_price
        .map((servicePrice) => {
          const oldServicePrice = this.formItineraryService.service_price.find(
            (sp) => sp.romm_id === servicePrice.romm_id
          );
          return {
            ...servicePrice,
            id: oldServicePrice?.id || servicePrice.id,
          };
        })
        .concat(
          this.formItineraryService.service_price
            .filter(
              (servicePrice) => !newRoomIds.includes(servicePrice.romm_id)
            )
            .map((servicePrice) => ({
              ...servicePrice,
              status: -1,
            }))
        );
    },
    async updateCostsPricesAndMarginsAccordingToNewDates(formItineraryService) {
      // get service by id according to new dates
      const {
        room = null,
        prices_costs_margins,
        id_service_type,
      } = await this.handleSearchService({
        from: formItineraryService.start_date,
        to: formItineraryService.end_date,
        id: formItineraryService.service,
        num_pax: formItineraryService.num_pax,
      });
      if (serviceHelper.isAccommodationPackageService(id_service_type)) {
        formItineraryService.service_price =
          this.updateServicePriceRooms(prices_costs_margins);

        const roomUpdated = this.updateFormItineraryServiceRoomQty(
          room,
          formItineraryService.room ?? []
        );
        formItineraryService.room = roomUpdated;
        this.getAccommPackCostsPricesAndMargins(formItineraryService);
      } else {
        formItineraryService.cost = prices_costs_margins.cost ?? 0;
        formItineraryService.cost_unit = prices_costs_margins.cost_unit ?? 0;
        formItineraryService.price = prices_costs_margins.price ?? 0;
        formItineraryService.price_unit = prices_costs_margins.price_unit ?? 0;
        formItineraryService.margin = prices_costs_margins.margin ?? 0;
        formItineraryService.percentage_margin =
          prices_costs_margins.percentage_margin ?? 0;
        formItineraryService.service_supplier =
          prices_costs_margins.service_supplier ?? [];
      }
      formItineraryService.start_date = prices_costs_margins.start_date;
      formItineraryService.end_date = prices_costs_margins.end_date;
      formItineraryService.nights = prices_costs_margins.nights;
      return formItineraryService;
    },
    checkServicePriceCostMargins(price_cost_margins) {
      if (
        !this.helper.isAccommodationPackageService(
          this.formItineraryService.id_service_type
        ) &&
        this.formItineraryService.service_price.length === 0 &&
        this.formItineraryService.service_supplier.length === 0
      ) {
        this.formItineraryService.service_price =
          price_cost_margins.service_price;
        this.formItineraryService.service_supplier =
          price_cost_margins.service_supplier;

        this.formItineraryService.servicesRelated.forEach((service) => {
          service.service_price = price_cost_margins.service_price;
          service.service_supplier = price_cost_margins.service_supplier;
        });
      }
    },
    updateServicePrice(servicePrices) {
      this.formItineraryService.service_price = cloneDeep(servicePrices);
      this.formItineraryService.servicesRelated.forEach((service) => {
        service.service_price = cloneDeep(servicePrices);
      });
    },
    checkServiceNights() {
      if (
        !serviceHelper.isPackageService(
          this.formItineraryService.id_service_type
        )
      )
        return;

      const nights =
        this.formItineraryService.room.reduce((nightQty, newRoom) => {
          if (newRoom.qty) {
            return Math.max(nightQty, serviceHelper.getRoomNightQty(newRoom));
          }
          return nightQty;
        }, 0) || this.formItineraryService.nights;

      this.formItineraryService.end_date = addDaysToDate(
        this.formItineraryService.start_date,
        nights
      );
      this.formItineraryService.nights = nights;
    },
    updatePriceRoomTypes(servicePrices = []) {
      const id_service_type = this.formItineraryService.id_service_type;
      if (serviceHelper.isAccommodationPackageService(id_service_type)) {
        const factor = serviceHelper.isPackageService(id_service_type)
          ? 1
          : this.formItineraryService.days;

        this.formItineraryService.room.forEach((room) => {
          const foundServicePrice = servicePrices.find(
            (sp) => sp.romm_id === room.id
          );
          if (room.qty && foundServicePrice) {
            const calculatedPrice = Math.round(
              foundServicePrice.price / factor
            );
            room.price_unit = Math.round(calculatedPrice / room.qty);
            room.price = calculatedPrice;
            room.finalPrice = Math.round(foundServicePrice.price);
          }
        });
      }
    },
    async updateFormItineraryServiceFromChild(data) {
      try {
        const [key, value] = data;
        const { id_service_type } = this.formItineraryService;
        if (key === "images_full") {
          this.formItineraryService.images_full = value;
        } else if (key === "recommendations") {
          this.formItineraryService.recommendations.value = value;
        } else if (key === "description") {
          this.formItineraryService.description.value = value;
        } else if (key === "notes") {
          this.formItineraryService.notes.value = value;
        } else if (key === "status") {
          this.formItineraryService.status = value;
        } else if (key === "price") {
          const servicePrices = serviceHelper.calculateServicePrice(
            this.serviceItinerary,
            value
          );
          this.updateServicePrice(servicePrices);
          this.formItineraryService.price = value;
          this.updatePriceRoomTypes(servicePrices);
          this.formItineraryService.price_unit = Number(
            servicePrices
              .reduce((price, room) => price + room.price_unit, 0)
              .toFixed(2)
          );
        } else if (key === "prices_costs_margins") {
          this.checkServicePriceCostMargins(value);
          this.formItineraryService.price = value.price;
          this.formItineraryService.price_unit = value.price_unit;
        } else if (key === "name") {
          this.formItineraryService.name.value = value;
        } else if (key === "rooms_price") {
          this.formItineraryService.price_unit = Number(
            value.reduce((price, room) => price + room.price, 0).toFixed(2)
          );
          const days = this.helper.isAccommodationService(
            this.formItineraryService.id_service_type
          )
            ? this.formItineraryService.days
            : 1;
          this.formItineraryService.price = Math.round(
            this.formItineraryService.price_unit * days
          );
          this.formItineraryService.room = value.map(
            this.getRoomWithPassengersDistribution
          );
          this.checkServiceNights();
        } else if (key === "room") {
          this.getAccommPackCostsPricesAndMargins(this.formItineraryService);
          this.formItineraryService.num_pax =
            serviceHelper.getServiceAccumulatePaxsByRooms(
              this.formItineraryService.room
            );
        } else if (key === "passengers") {
          const passengersAssignedIds = value
            .flatMap((room) => room.passengers)
            .map((passenger) => passenger?.id);
          this.passengerOptions = this.passengers_itinerary.filter(
            (passenger) => !passengersAssignedIds.includes(passenger.id)
          );
          this.formItineraryService.room = value;
        } else if (key === "saveService") {
          await this.saveMultipleServices({
            closeSidebar: true,
            calculate_room_distribution: value?.calculate_room_distribution,
            calculate_prices: value?.calculate_prices,
          });
        } else {
          this.formItineraryService[key] = value;
          if (key === "start_date") {
            if (this.helper.isPackageService(id_service_type)) {
              this.formItineraryService.end_date = addDaysToDate(
                this.formItineraryService.start_date,
                this.formItineraryService.days
              );
            } else {
              this.formItineraryService.end_date =
                this.setEndDateToNewServiceByIdServiceType(
                  id_service_type,
                  this.formItineraryService
                );
            }
          }
          if (key === "end_date") {
            this.formItineraryService.start_date =
              this.setStartDateToNewServiceByIdServiceType(
                id_service_type,
                this.formItineraryService
              );
            this.formItineraryService.day = setDay(
              this.formItineraryService.start_date,
              this.formItineraryService.end_date,
              this.itinerary.data
            );
          }
          if (key === "start_date" || key === "end_date") {
            const days = calculateDays(
              this.formItineraryService.start_date,
              this.formItineraryService.end_date
            );
            this.formItineraryService.days =
              this.helper.isAccommodationPackageService(id_service_type)
                ? days - 1
                : days;
            this.formItineraryService =
              await this.updateCostsPricesAndMarginsAccordingToNewDates(
                this.formItineraryService
              );
            this.formItineraryService.room = this.adapterServiceRooms(
              this.formItineraryService,
              true
            );
          }
          if (
            key === "price_unit" ||
            key === "percentage_margin" ||
            key === "margin"
          ) {
            this.calculatePrice(key, value);
          }
        }
      } catch (err) {
        console.info(err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong please try again.",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    getRoomWithPassengersDistribution(room = null) {
      const currentPassengers = room.passengers || [];
      const totalMaxPassengers = room.max_passengers * room.qty;
      const redistributePassengers =
        currentPassengers.length !== totalMaxPassengers;
      if (!redistributePassengers) return room;
      const passengersToAssign = this.recalculatePassengerOptions(
        totalMaxPassengers,
        currentPassengers
      );
      return { ...room, passengers: passengersToAssign };
    },
    recalculatePassengerOptions(maxPassengers, currentPassengers = []) {
      const passengerOptions = JSON.parse(
        JSON.stringify([...currentPassengers, ...this.passengerOptions])
      );
      const passengersToAssign = passengerOptions.splice(0, maxPassengers);
      this.passengerOptions = passengerOptions;
      return passengersToAssign;
    },
    newItemToForm(serviceIn, passengerListTxt) {
      let item = new Object();
      const start_date = serviceIn.start_date;
      const end_date = serviceIn.end_date;
      item.id = serviceIn.id;
      item.code = serviceIn.code;
      item.name = serviceIn.name;
      item.price = serviceIn.price;
      item.cost = serviceIn.cost;
      item.images = serviceIn.images;
      item.margin = serviceIn.margin;
      item.percentage_margin = serviceIn.percentage_margin;
      item.status = serviceIn.status;
      item.num_pax = serviceIn.num_pax;
      item.service = serviceIn.service.id;
      item.visible = serviceIn.visible;
      item.start_date = new Date(start_date + " 00:00:00");
      item.end_date = new Date(end_date + " 00:00:00");
      item.service_price = serviceIn.service_price
        ? {
            ...serviceIn.service_price,
            passengers: transformTextArrayToArray(passengerListTxt),
          }
        : [];
      item.service_supplier = serviceIn.service_supplier
        ? serviceIn.service_supplier
        : [];
      item.description = serviceIn.description;
      item.recommendations = serviceIn.recommendations;
      item.passengers = passengerListTxt;
      item.level = serviceIn.level.toString();

      item.days = this.countDaysByItineraryService(serviceIn);
      item.price_unit = serviceIn.price_unit;
      item.cost_unit = serviceIn.cost_unit;

      return item;
    },
  },
  updated() {
    if (this.itinerary && this.itinerary.data && !this.min) {
      this.min = this.itinerary.data
        ? new Date(this.itinerary.data.start_date + " 00:00:00")
        : new Date();
    }
  },
};
</script>
<style>
.sidebarRight {
  position: relative;
  z-index: 99;
}
.BottomButtonsSideBar {
  padding: 1rem;
}
.BottomButtonsSideBar .field:not(:last-child) {
  margin-bottom: 0rem;
}
.SideBarEdit .edit_service_sidebar__dates {
  margin-top: 2rem !important;
}

.no_price_alert__container {
  background-color: #ff00005d;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 2rem;
}

.no_price_alert__container svg {
  width: 1rem;
}

.no_price_alert__container .field {
  display: inline-block;
}

@media screen and (max-width: 480px) {
  .b-sidebar.sidebarRight .sidebar-content {
    width: 100% !important;
  }
  .topCloseSideBar {
    gap: 0.5rem;
  }
  .SideBarBox {
    margin-top: 4rem;
  }
  .edit_service_sidebar__check_in {
    display: none;
  }
  .BottomButtonsSideBar {
    width: 100%;
    left: 0;
  }
  .SideBarEdit .edit_service_sidebar__dates {
    padding: 1rem 0.5rem !important;
    margin-top: 1rem !important;
  }
  .SideBarEdit .edit_service_sidebar__dates .form-control {
    padding: 0.25rem 0rem 0.25rem 0.5rem;
  }
  .SideBarEdit .edit_service_sidebar__dates .columns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
  .SideBarEdit .edit_service_sidebar__dates .column {
    display: inline-block;
    padding: 0rem;
  }
  .SideBarEdit .edit_service_sidebar__dates .column:nth-of-type(1),
  .SideBarEdit .edit_service_sidebar__dates .column:nth-of-type(3) {
    min-width: 45%;
    width: 12rem;
  }
  .SideBarEdit .edit_service_sidebar__dates .column:nth-of-type(2) {
    display: grid;
    place-items: center;
  }
  .edit_service_sidebar__name {
    width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    height: 1.5rem;
  }
  .sidebarEditButton {
    margin: 0rem;
  }
  .SideBarEdit .tab-content .tab-item .EditServiceSideBarBox {
    padding: 1rem;
  }
}
</style>
