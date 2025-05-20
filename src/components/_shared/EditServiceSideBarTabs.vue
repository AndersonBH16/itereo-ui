<template>
  <section class="is-relative">
    <CustomDotAlert
      :displayAlert="
        hasViewSalePricePermission &&
        (hasNewPriceAvailable || hasPriceLowerThanCost)
      "
      :tooltip="pricingTabTooltipText"
      :customStyle="`left: ${isAccommodationPackageService ? '58%' : '50%'}`"
    />
    <b-tabs
      :value="defaultOpenedTab"
      position="is-centered"
      class="block mb-0"
      @input="updateDefaultOpenedTab"
    >
      <EditServiceSideBarTabsInfo
        :isEditServiceSidebarOpen="open"
        :editServiceSidebarFocusedElement="editServiceSidebarFocusedElement"
        :formItineraryService="formItineraryService"
        :itineraryService="serviceItinerary"
        :validateFunctionExecution="validateFunctionExecution"
        @update="emitUpdateForm"
      />
      <EditServiceSideBarTabsRoom
        :isServiceDatesRangeEdited="isServiceDatesRangeEdited"
        :formItineraryService="formItineraryService"
        :serviceLocation="serviceLocation"
        :itineraryService="serviceItinerary"
        :hasNotSMServicePrice="hasNotSMServicePrice"
        :setLoading="setLoading"
        :handleAutomaticPriceCalculate="handleAutomaticPriceCalculate"
        :handleServiceFirstTime="handleServiceFirstTime"
        @update="emitUpdateForm"
      />
      <EditServiceSideBarTabsPricing
        v-if="hasViewSalePricePermission"
        :isServiceDatesRangeEdited="isServiceDatesRangeEdited"
        :itineraryService="serviceItinerary"
        :formItineraryService="formItineraryService"
        :originalServicePrice="originalServicePrice"
        :open="open"
        :hasNotSMServicePrice="hasNotSMServicePrice"
        :setLoading="setLoading"
        :automaticPriceCalculate="automaticPriceCalculate"
        :handleAutomaticPriceCalculate="handleAutomaticPriceCalculate"
        :serviceFirstTime="serviceFirstTime"
        :handleServiceFirstTime="handleServiceFirstTime"
        @update="emitUpdateForm"
      />
      <EditServiceSideBarTabsPaxs
        v-on:handled-toggle-switch="handledToggleSwitch"
        :itinerary="itinerary"
        :formItineraryService="formItineraryService"
        :passengers="passengers"
        :passengerOptions="passengerOptions"
        @update="emitUpdateForm"
      />
    </b-tabs>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import EditServiceSideBarTabsInfo from "@/components/_shared/EditServiceSideBarTabsInfo.vue";
import EditServiceSideBarTabsRoom from "@/components/_shared/EditServiceSideBarTabsRoom.vue";
import EditServiceSideBarTabsPricing from "@/components/_shared/EditServiceSideBarTabsPricing.vue";
import EditServiceSideBarTabsPaxs from "@/components/_shared/EditServiceSideBarTabsPaxs.vue";
import { serviceHelper } from "@/utils/service";
import { PERMISSION } from "@/constants";
import CustomDotAlert from "@/components/_shared/CustomDotAlert.vue";

export default {
  name: "EditServiceSideBarTabs",
  components: {
    EditServiceSideBarTabsInfo,
    EditServiceSideBarTabsRoom,
    EditServiceSideBarTabsPricing,
    EditServiceSideBarTabsPaxs,
    CustomDotAlert,
  },
  props: {
    isServiceDatesRangeEdited: {
      type: Boolean,
      default: false,
    },
    updateServiceViewState: {
      type: Function,
      default: () => {},
    },
    defaultOpenedTab: {
      type: Number,
      default: () => 1,
    },
    editServiceSidebarFocusedElement: {
      type: String,
      default: "",
    },
    formItineraryService: {
      type: Object,
      default: () => {},
    },
    serviceLocation: {
      type: Array,
      default: () => [],
    },
    serviceItinerary: {
      type: Object,
      default: () => {},
    },
    passengers: {
      type: [Array, Object],
      default: () => [],
    },
    open: {
      type: Boolean,
      default: () => false,
    },
    hasNotSMServicePrice: {
      type: Boolean,
      default: false,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    handleAutomaticPriceCalculate: {
      type: Function,
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
    handleServiceFirstTime: {
      type: Function,
      default: () => {},
    },
    passengerOptions: {
      type: Array,
      default: () => [],
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
    originalServicePrice: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      authData: "auth/getAuthData",
    }),
    hasViewSalePricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_SALE_PRICE]
      );
    },
    hasNewPriceAvailable() {
      return (
        this.originalServicePrice !== this.formItineraryService?.price &&
        ![null, 0].includes(this.originalServicePrice)
      );
    },
    hasPriceLowerThanCost() {
      return (
        this.formItineraryService?.cost > 1 &&
        this.formItineraryService?.cost > this.formItineraryService?.price
      );
    },
    pricingTabTooltipText() {
      return this.hasPriceLowerThanCost
        ? "The price is lower than the cost"
        : this.hasNewPriceAvailable
        ? "Service price is outdated"
        : "";
    },
    isAccommodationPackageService() {
      return serviceHelper.isAccommodationPackageService(
        this.formItineraryService?.id_service_type
      );
    },
  },
  methods: {
    handledToggleSwitch: function (value) {
      this.$emit("handled-toggle-switch", value);
    },
    emitUpdateForm(value) {
      this.$emit("update", value);
    },
    updateDefaultOpenedTab(value) {
      this.updateServiceViewState("defaultOpenedTab", value);
    },
  },
};
</script>
