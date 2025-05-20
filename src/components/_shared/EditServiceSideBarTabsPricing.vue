<template>
  <b-tab-item label="PRICING">
    <div class="table-layout-auto tableEditPricing EditServiceSideBarBox mb-6">
      <div class="b-table">
        <div class="table-wrapper has-mobile-cards">
          <table class="table">
            <tbody class="is-block">
              <tr
                v-if="helpers.hasViewCostPricePermission(authData)"
                class="is-flex is-justify-content-center is-align-items-center py-1"
              >
                <td>Cost Unit</td>
                <td class="color-7">
                  {{ getCostCurrency(formItineraryService) }}
                  {{
                    formItineraryService.cost_unit ||
                    formItineraryService.cost ||
                    0
                  }}
                </td>
              </tr>

              <tr
                class="is-flex is-justify-content-center is-align-items-center py-1"
              >
                <td>Supplier</td>
                <td>
                  {{ serviceSuppliers }}
                </td>
              </tr>

              <tr
                class="is-flex is-justify-content-center is-align-items-center py-1"
              >
                <td>
                  {{
                    helpers.getComplementTextByServiceType(
                      service.id_service_type
                    )
                  }}
                </td>
                <td>
                  {{ formItineraryService.days }}
                </td>
              </tr>

              <tr
                v-if="hasViewSalesManualPermission"
                class="is-flex is-justify-content-center"
              >
                <td class="has-text-centered">Sales Manual</td>
                <td class="color-7">
                  {{ getServiceSalesManualCode() }}
                </td>
              </tr>

              <tr
                v-if="hasViewSalesManualPermission"
                class="is-flex is-justify-content-center"
              >
                <td class="has-text-centered">Risk</td>
                <td class="color-7">{{ getServicePriceRisk() }} %</td>
              </tr>

              <tr v-if="helpers.hasViewCostPricePermission(authData)">
                <td class="has-text-centered">Cost</td>
                <td class="color-7">
                  {{ getCostCurrency(formItineraryService) }}
                  {{ formItineraryService.cost || 0 }}
                </td>
              </tr>
              <tr
                class="is-flex is-justify-content-center is-align-items-center py-1"
              >
                <td>
                  {{
                    helpers.isAccommodationPackageService(
                      formItineraryService.id_service_type
                    )
                      ? "Price P. Night"
                      : "Sales Price / Unit"
                  }}
                </td>
                <td class="color-7">
                  {{ getSalesPriceCurrency(formItineraryService) }}
                  {{ formItineraryService.price_unit || "0.00" }}
                </td>
              </tr>
              <tr
                class="is-flex is-justify-content-center is-align-items-center pt-1 is-relative"
              >
                <td class="has-text-centered">Total Price (*)</td>
                <td
                  v-if="
                    hasViewSalePricePermission &&
                    hasNewPriceAvailable &&
                    !disableQuoteByStatus
                  "
                >
                  <AlertButton
                    v-if="hasViewSalePricePermission && hasNewPriceAvailable"
                    :label="
                      'Price is outdated. Click to use new price: ' +
                      getSalesPriceCurrency(formItineraryService) +
                      originalServicePrice
                    "
                    :text="
                      getSalesPriceCurrency(formItineraryService) +
                      originalServicePrice
                    "
                    :onButtonClick="updateServicePrice"
                  />
                </td>
                <td
                  class="color-7 edit_service_sidebar__total_price"
                  style="width: 60%"
                >
                  <div
                    class="is-flex is-justify-content-center is-align-items-center"
                    style="height: 2rem; gap: 0.5rem"
                    :data-test-id="
                      constants.DATA_TEST_ID_VALUES
                        .ITINERARY_SERVICE_SIDEBAR_PRICE
                    "
                  >
                    <BaseInput
                      v-if="
                        hasEditSalePricePermission &&
                        !hideElementByCondition &&
                        !disableQuoteByStatus &&
                        !isServiceDatesRangeEdited
                      "
                      @input="emitUpdateForm('price', $event)"
                      :value="formItineraryService.price"
                      size="large"
                      type="number"
                    />
                    <span v-else>{{
                      formItineraryService.price || "0.00"
                    }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="color-2 font-weight-500 mt-4">
            (*) Subtotal and Total price are rounded: &lt; 0.5 down, &ge; 0.5
            up.
          </p>
        </div>
      </div>
    </div>
  </b-tab-item>
</template>

<script>
import { mapGetters } from "vuex";
import helpers from "@/helpers";
import { serviceHelper } from "@/utils/service";
import { USER_ROLE, SERVICE_TYPE, PERMISSION } from "@/constants";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import AlertButton from "@/components/_shared/AlertButton.vue";
import { ROOM_FIELDS } from "@/constants/services";
import { calculateDays } from "@/utils/utils";

export default {
  name: "EditServiceSideBarTabsPricing",
  components: {
    AlertButton,
  },
  data() {
    return {
      constants: {
        DATA_TEST_ID_VALUES,
      },
      helpers: { ...helpers, ...serviceHelper },
    };
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
      type: Object,
      default: () => {},
    },
    automaticPriceCalculate: {
      type: Boolean,
      default: true,
    },
    serviceFirstTime: {
      type: Boolean,
      default: false,
    },
    originalServicePrice: {
      type: Number,
      default: 0,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    getServiceSalesManualCode() {
      return (
        this.itineraryService?.service_price?.[0]?.sales_manual_code || "-"
      );
    },
    async updateServicePrice() {
      if (
        !serviceHelper.isAccommodationPackageService(
          this.formItineraryService.id_service_type
        )
      ) {
        await this.emitUpdateForm(
          "prices_costs_margins",
          this.formItineraryService?.prices_costs_margins
        );
      } else {
        const nights =
          this.formItineraryService.id_service_type !== SERVICE_TYPE.PACKAGE
            ? calculateDays(
                this.formItineraryService.start_date,
                this.formItineraryService.end_date
              ) - 1
            : 1;
        const newRooms = serviceHelper.updateRoomPrices(
          this.formItineraryService.room,
          ROOM_FIELDS.NEW_PRICE_UNIT,
          null,
          nights
        );
        await this.emitUpdateForm("rooms_price", newRooms);
      }

      const hasSelectedRooms =
        this.formItineraryService.service_price?.length > 0;

      await this.emitUpdateForm("saveService", {
        closeSidebar: true,
        calculate_room_distribution: hasSelectedRooms ? 0 : 1,
        calculate_prices: hasSelectedRooms ? 0 : 1,
      });
    },
    getItineraryCurrencyCode() {
      const currency_code = this.itinerary?.data?.currency?.currency_code || "";
      return currency_code;
    },
    getItineraryCurrencySign() {
      const currency_sign = this.itinerary?.data?.currency?.currency_sign || "";
      return currency_sign;
    },
    getSalesPriceCurrency(formItineraryService) {
      if (formItineraryService.service_price === null)
        return `${this.getItineraryCurrencyCode()} ${this.getItineraryCurrencySign()}`;
      if (formItineraryService.service_price === undefined)
        return `${this.getItineraryCurrencyCode()} ${this.getItineraryCurrencySign()}`;
      const currency_sign =
        formItineraryService?.service_price[0]?.currency_sign ??
        this.getItineraryCurrencySign();
      const currency_code =
        formItineraryService?.service_price[0]?.currency_code ??
        this.getItineraryCurrencyCode();
      return `${currency_code} ${currency_sign}`;
    },
    getCostCurrency(formItineraryService) {
      if (formItineraryService.service_supplier === null)
        return `${this.getItineraryCurrencyCode()} ${this.getItineraryCurrencySign()}`;
      if (formItineraryService.service_supplier === undefined)
        return `${this.getItineraryCurrencyCode()} ${this.getItineraryCurrencySign()}`;
      const currency_sign =
        formItineraryService?.service_supplier[0]?.currency_sign ??
        this.getItineraryCurrencySign();
      const currency_code =
        formItineraryService?.service_supplier[0]?.currency_code ??
        this.getItineraryCurrencyCode();
      return `${currency_code} ${currency_sign}`;
    },
    getServicePriceRisk() {
      const isHotel = serviceHelper.isAccommodationPackageService(
        this.formItineraryService.id_service_type
      );

      const subServices = isHotel
        ? this.formItineraryService?.room
        : [this.formItineraryService];

      const price_service_sm = subServices?.flatMap(
        (subService) => subService.price_service_sm
      );

      return price_service_sm?.[0]?.price_service[0]?.risk_amount || "-";
    },
    async emitUpdateForm(key, value) {
      this.$emit("update", [key, value]);
    },
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      service: "services/getService",
      user: "auth/getAuthUserData",
      authData: "auth/getAuthData",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    hasViewSalePricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_SALE_PRICE, PERMISSION.VIEW_PRICE_SEARCHED]
      );
    },
    hasNewPriceAvailable() {
      return (
        this.originalServicePrice !== this.formItineraryService?.price &&
        ![null, 0].includes(this.originalServicePrice)
      );
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
    hasEditSalePricePermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    hasViewSalesManualPermission() {
      return helpers.hasAnyRoles(this.authData.user, [USER_ROLE.ADMIN], true);
    },
  },
};
</script>

<style scoped>
.sidebar_import_service__button {
  font-size: 0.8rem;
  float: right;
  margin-bottom: 0.5rem;
  /* position: absolute;
  top: 1rem;
  right: 1rem; */
}

@media screen and (max-width: 480px) {
  .tableEditPricing {
    width: 100%;
  }
  .tableEditPricing .b-table .table-wrapper.has-mobile-cards tr {
    box-shadow: none;
  }
  .edit_service_sidebar__total_price {
    width: 25% !important;
  }
}
</style>
