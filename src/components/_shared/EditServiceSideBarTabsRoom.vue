<template>
  <b-tab-item
    label="ROOM TYPE"
    :visible="
      isAccommodationPackageService(formItineraryService.id_service_type)
    "
  >
    <div>
      <div class="notification is-info is-light has-text-centered">
        Below you can check the price and change the room type.
      </div>
      <div class="pb-5 bg pt-0">
        <div class="card">
          <div class="card-content py-2">
            <div class="media-content">
              <div class="columns infoService mt-3">
                <div class="column">
                  <p class="color-7 mb-2">Code</p>
                  <p class="has-text-weight-semibold">
                    {{ formItineraryService ? formItineraryService.code : "-" }}
                  </p>
                </div>
                <div
                  class="column is-one-fifth"
                  v-if="hasViewServiceProviderPermission"
                >
                  <p class="color-7 mb-2">Supplier</p>
                  <p>{{ providerName }}</p>
                </div>
                <div class="column">
                  <p class="color-7 mb-2">COU</p>
                  <p>{{ providerCountry }}</p>
                </div>
                <div class="column">
                  <p class="color-7 mb-2">DEST</p>
                  <p>{{ providerDestination }}</p>
                </div>
                <div class="column is-one-fifth">
                  <p class="color-7 mb-2">Title</p>
                  <p class="has-text-weight-semibold">
                    {{
                      formItineraryService && formItineraryService.name
                        ? formItineraryService.name.value
                        : "-"
                    }}
                  </p>
                </div>
                <div class="column">
                  <p class="color-7 mb-2">Category</p>
                  <p>Superior</p>
                </div>
                <div class="column">
                  <p class="color-7 mb-2">Pax(x)</p>
                  <p class="has-text-weight-semibold">
                    {{ formItineraryService.num_pax }}
                  </p>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="columns EditroomDetails">
                <div
                  class="column"
                  :is-room-selection-completed="isRoomSelectionCompleted"
                >
                  <b-table
                    v-if="formItineraryServiceRoom"
                    :disabled="hideElementByCondition || disableQuoteByStatus"
                    :data="formItineraryServiceRoom"
                    :row-class="(row) => getRowClass(row)"
                  >
                    <b-table-column
                      label="Room type"
                      field="room"
                      v-slot="props"
                      width="40%"
                    >
                      <b-tooltip
                        v-if="props.row.notAvailableByDatesRange"
                        label="Room is not available in this date range"
                        type="is-warning"
                        position="is-right"
                      >
                        <IconWarning
                          class="mx-1"
                          style="width: 1rem; height: 1rem"
                        />
                      </b-tooltip>
                      <strong>{{ props.row.name }}</strong>
                      <b-tooltip
                        v-if="
                          hasViewSalePricePermission &&
                          hasNewPriceAvailable(props.row) &&
                          !disableQuoteByStatus
                        "
                        :label="
                          'Price is outdated. Click to use new price: ' +
                          getRoomPriceCurrency(props) +
                          props.row.new_price_unit
                        "
                        type="is-warning"
                        style="margin-left: 10px"
                      >
                        <button
                          class="new_room_price_button"
                          @click="
                            handleUpdate(
                              ROW_KEY.NEW_PRICE_AVAILABLE,
                              $event,
                              props.row
                            )
                          "
                        >
                          Now
                          <span class="has-text-weight-bold">{{
                            `${getRoomPriceCurrency(props)}${
                              props.row.new_price_unit
                            }`
                          }}</span>
                          <IconChange class="ml-2 heartIcon" />
                          <IconWarning
                            class="icon__warning"
                            style="width: 1rem; height: 1rem"
                          />
                        </button>
                      </b-tooltip>
                    </b-table-column>

                    <!-- <b-table-column label="Meals" field="meals" width="2rem">
                      Meals here
                    </b-table-column> -->

                    <b-table-column
                      label="Cost"
                      field="cost"
                      v-slot="props"
                      v-if="helpers.hasViewCostPricePermission(authData)"
                      width="5rem"
                    >
                      <span class="color-11 costField">
                        {{ getRoomCostCurrency(props) }}
                        {{
                          props.row.cost_service &&
                          props.row.cost_service[0].costs_ranges &&
                          props.row.cost_service[0].costs_ranges[0].cost
                            ? props.row.cost_service[0].costs_ranges[0].cost
                            : 0
                        }}</span
                      >
                    </b-table-column>

                    <b-table-column
                      v-if="hasViewSalePricePermission"
                      field="sales"
                      v-slot="props"
                      width="7rem"
                      label="Room Price"
                      centered
                    >
                      <div
                        class="p_p_n_r_field"
                        :data-test-id="
                          constants.DATA_TEST_ID_VALUES
                            .ITINERARY_SERVICE_SIDEBAR_ROOM_PRICE_UNIT
                        "
                        :disabled="isServiceDatesRangeEdited"
                      >
                        <span>{{ getRoomPriceCurrency(props) }}</span>
                        <BaseInput
                          type="number"
                          v-model.number="props.row.price_unit"
                          size="is-small"
                          @input="
                            handleUpdate(
                              constants.ROOM_FIELDS.PRICE_UNIT,
                              $event,
                              props.row
                            )
                          "
                        />
                      </div>
                    </b-table-column>

                    <b-table-column
                      field="roomNumberInput"
                      label="Room Qty"
                      v-slot="props"
                      width="6rem"
                      centered
                    >
                      <b-select
                        v-model="props.row.qty"
                        size="is-small"
                        expanded
                        class="addServiceSelect"
                        :disabled="
                          'cost_service' in props.row &&
                          props.row.cost_service &&
                          !props.row.cost_service.length
                        "
                        @input="
                          emitUpdateForm('room', $event);
                          handleUpdate(
                            constants.ROOM_FIELDS.QTY,
                            $event,
                            props.row
                          );
                        "
                      >
                        <option :value="0">0</option>
                        <option
                          v-for="(item, index) in serviceQty(props.row)"
                          :key="index"
                          :value="item"
                        >
                          {{ item }}
                        </option>
                      </b-select>
                    </b-table-column>

                    <b-table-column
                      v-if="hasViewSalePricePermission"
                      field="total"
                      v-slot="props"
                      width="7rem"
                      :label="
                        helpers.isAccommodationService(service.id_service_type)
                          ? 'Price.p.Night'
                          : 'Total Price'
                      "
                      centered
                    >
                      <div
                        class="p_p_n_r_field"
                        :disabled="isServiceDatesRangeEdited"
                      >
                        <span class="has-text-weight-bold">{{
                          getRoomPriceCurrency(props)
                        }}</span>
                        <BaseInput
                          type="number"
                          v-model.number="props.row.price"
                          size="is-small"
                          @input="
                            ($event) =>
                              handleUpdate(
                                constants.ROOM_FIELDS.PRICE,
                                $event,
                                props.row
                              )
                          "
                        />
                      </div>
                    </b-table-column>

                    <b-table-column
                      v-if="
                        hasViewSalePricePermission && isAccommodationService
                      "
                      field="total"
                      v-slot="props"
                      width="10rem"
                      label="Subtotal Price (*)"
                      centered
                    >
                      <div
                        class="p_p_n_r_field"
                        :data-test-id="
                          constants.DATA_TEST_ID_VALUES
                            .ITINERARY_SERVICE_SIDEBAR_ROOM_PRICE
                        "
                        :disabled="isServiceDatesRangeEdited"
                      >
                        <span class="has-text-weight-bold">{{
                          getRoomPriceCurrency(props)
                        }}</span>
                        <BaseInput
                          type="number"
                          v-model.number="props.row.finalPrice"
                          size="is-small"
                          @keydown.native="checkDigit"
                          @input="
                            ($event) =>
                              handleUpdate(
                                constants.ROOM_FIELDS.FINAL_PRICE,
                                $event,
                                props.row
                              )
                          "
                        />
                      </div>
                    </b-table-column>
                  </b-table>
                  <p class="color-2 font-weight-500 my-3">
                    (*) Subtotal and total prices are rounded: &lt; 0.5 down,
                    &ge; 0.5 up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-tab-item>
</template>

<script>
import { mapGetters } from "vuex";
import helpers from "@/helpers";
import { calculateDays } from "@/utils/utils";
import { serviceHelper } from "@/utils/service";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { PERMISSION, SERVICE_TYPE, USER_ROLE } from "@/constants";
import { ROOM_FIELDS } from "@/constants/services";
import { isAccommodationService } from "@/utils/service";

export default {
  name: "EditServiceSideBarTabsRoom",
  data() {
    return {
      constants: { DATA_TEST_ID_VALUES, ROOM_FIELDS },
      helpers: { ...helpers, ...serviceHelper },
      isRoomSelectionCompleted: false,
      ROW_KEY: {
        NEW_PRICE_AVAILABLE: ROOM_FIELDS.NEW_PRICE_UNIT,
      },
    };
  },
  computed: {
    ...mapGetters({
      service: "services/getService",
      itinerary: "itinerary/getItinerary",
      user: "auth/getAuthUserData",
      authData: "auth/getAuthData",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    formItineraryServiceRoom: {
      get: function () {
        return this.formItineraryService.room;
      },
      set: function (newValue) {
        return newValue;
      },
    },
    hasViewServiceProviderPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    hasViewSalePricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_SALE_PRICE, PERMISSION.VIEW_PRICE_SEARCHED]
      );
    },
    providerDestination() {
      const fistDestination = this.serviceLocation?.find(
        (location) => ![undefined, null, 0].includes(location.parent)
      );
      return fistDestination !== undefined
        ? fistDestination.location_name
        : "-";
    },
    providerCountry() {
      const firstCountry = this.serviceLocation?.find((location) =>
        [undefined, null, 0].includes(location.parent)
      );
      return firstCountry !== undefined ? firstCountry.location_name : "-";
    },
    providerName() {
      return (
        this.formItineraryService?.supplier_service?.[0]?.name?.value ?? "-"
      );
    },
    isAccommodationService() {
      return isAccommodationService(this.formItineraryService.id_service_type);
    },
  },
  methods: {
    hasNewPriceAvailable(room) {
      return room.new_price_unit !== room.price_unit;
    },
    checkDigit(event) {
      if (event.key.length === 1 && isNaN(Number(event.key))) {
        event.preventDefault();
      }
    },
    async handleUpdate(key, value, item) {
      const nights =
        this.formItineraryService.id_service_type !== SERVICE_TYPE.PACKAGE
          ? calculateDays(
              this.formItineraryService.start_date,
              this.formItineraryService.end_date
            ) - 1
          : 1;

      if (key === ROOM_FIELDS.QTY) this.setRoomsValidation();
      if (key === ROOM_FIELDS.PRICE) item.price_unit = value / item.qty;

      const newRooms = serviceHelper.updateRoomPrices(
        this.formItineraryService.room,
        key,
        item,
        nights
      );

      await this.emitUpdateForm("rooms_price", newRooms);
    },
    isAccommodationPackageService(id_service_type) {
      return (
        id_service_type === SERVICE_TYPE.ACCOMMODATION ||
        id_service_type === SERVICE_TYPE.PACKAGE
      );
    },
    getItineraryCurrency() {
      const currency_sign = this.itinerary?.data?.currency?.currency_sign || "";
      return currency_sign;
    },
    getRoomPriceCurrency(props) {
      if (props?.row?.price_service_sm === null)
        return this.getItineraryCurrency();
      if (props?.row?.price_service_sm === undefined)
        return this.getItineraryCurrency();
      const currency_sign = props.row.price_service_sm[0].currency_sign;
      return currency_sign;
    },
    getRoomCostCurrency(props) {
      if (props?.row?.cost_service === null) return this.getItineraryCurrency();
      if (props?.row?.cost_service === undefined)
        return this.getItineraryCurrency();
      const currency_sign = props.row.cost_service[0].currency_sign;
      return currency_sign;
    },
    emitUpdateForm(key, value) {
      this.$emit("update", [key, value]);
    },
    serviceQty(room) {
      const { num_pax = 1 } = this.itinerary.data;
      return serviceHelper.getUpdatedRoomQtyOptions(
        num_pax,
        this.formItineraryServiceRoom,
        room
      );
    },
    setRoomsValidation() {
      const { num_pax = 1 } = this.itinerary.data;
      this.isRoomSelectionCompleted = serviceHelper.getIsRoomSelectionCompleted(
        num_pax,
        this.formItineraryServiceRoom ?? []
      );
    },
    getRowClass(room = {}) {
      if (this.hideElementByCondition || this.disableQuoteByStatus)
        return "is_not_allowed_room";
      const { num_pax = 1 } = this.itinerary.data;
      const rooms = this.formItineraryServiceRoom ?? [];
      return serviceHelper.getRoomRowClass(
        num_pax,
        rooms,
        room,
        this.formItineraryService
      );
    },
    hasServicePriceContent(servicePrice) {
      return servicePrice?.every((room) => {
        return room?.name?.length > 0;
      });
    },
  },
  props: {
    isServiceDatesRangeEdited: {
      type: Boolean,
      default: false,
    },
    itineraryService: {
      type: Object,
      default: () => {},
    },
    formItineraryService: {
      type: [Array, Object],
      default: () => {},
    },
    serviceLocation: {
      type: Array,
      default: () => [],
    },
    automaticPriceCalculate: {
      type: Boolean,
      default: true,
    },
    handleAutomaticPriceCalculate: {
      type: Function,
      default: () => {},
    },
    handleServiceFirstTime: {
      type: Function,
      default: () => {},
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    this.setRoomsValidation();
  },
};
</script>
<style>
.EditroomDetails tbody tr {
  position: relative;
}
.is_selected_room {
  background-color: #fdffbc;
  border-radius: 0.5rem;
}
.is_selected_room :is(input, select) {
  background-color: transparent !important;
}
.is_selected_room .costField {
  font-weight: 600;
}
div[is-room-selection-completed="true"] tbody tr:not(.is_selected_room) {
  opacity: 0.5;
  position: relative;
  pointer-events: none;
}
.is_not_allowed_room {
  opacity: 0.3;
}
.p_p_n_r_field {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  padding-left: 0.75rem;
  border: 1px solid #8e8ea9;
}
.p_p_n_r_field input[type="number"] {
  border: 0 !important;
  padding: 0.4rem 0 0.4rem 0.25rem;
}
.p_p_n_r_field input[type="number"]:focus,
.p_p_n_r_field input[type="number"]:hover {
  border: 0 !important;
  box-shadow: none !important;
}
.p_p_n_r_field input::-webkit-outer-spin-button,
.p_p_n_r_field input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.p_p_n_r_field input[type="number"] {
  -moz-appearance: textfield;
}
.new_room_price_button {
  cursor: pointer;
  border: none;
  background-color: #ffd43d;
  color: #444444;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}
svg.icon__warning {
  position: absolute;
  top: -0.5rem;
  right: -0.4rem;
  color: #444444;
  z-index: 2;
}

@media screen and (max-width: 480px) {
  .infoService {
    padding-bottom: 1rem;
  }
  .infoService > .column {
    padding: 0.25rem 0.75rem;
  }
}
</style>
