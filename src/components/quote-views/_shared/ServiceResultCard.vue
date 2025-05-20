<template>
  <div class="card">
    <div class="card-content pt-2">
      <div class="media-content">
        <div class="columns infoService mt-3">
          <div class="column">
            <p class="color-7 mb-2">Code</p>
            <p class="has-text-weight-semibold">{{ service.code }}</p>
          </div>
          <div
            v-if="hasViewServiceProviderPermission"
            class="column is-one-fifth"
          >
            <p class="color-7 mb-2">Supplier</p>
            <p>
              {{
                service.supplier_service && service.supplier_service.length
                  ? service.supplier_service[0].name.value
                  : service.name.value
              }}
            </p>
          </div>

          <div class="column">
            <p class="color-7 mb-2">Type</p>
            <p>
              {{ service.name_type_service.service_type_name }}
            </p>
          </div>

          <div class="column">
            <p class="color-7 mb-2">COU</p>
            <p>
              {{
                service.location && service.location.length > 0
                  ? service.location[0].location_code
                  : ""
              }}
            </p>
          </div>
          <div class="column">
            <p class="color-7 mb-2">DEST</p>
            <p v-for="(location, index) in service.location" :key="index">
              {{ location.location_code }}
            </p>
          </div>
          <div class="column is-one-fifth">
            <p class="color-7 mb-2">Title</p>
            <p class="has-text-weight-semibold">
              {{ service.name.value }}
            </p>
          </div>
          <div class="column">
            <p class="color-7 mb-2">Category</p>
            <p>All</p>
          </div>
          <div class="column">
            <p class="color-7 mb-2">Pax(s)</p>
            <p>{{ numPax }}</p>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="columns">
          <div
            class="column"
            :is-room-selection-completed="isRoomSelectionCompleted"
          >
            <table
              class="table table is-hoverable table is-fullwidth"
              v-if="
                (service.id_service_type === 2 ||
                  service.id_service_type === 9) &&
                service.room
              "
            >
              <thead>
                <tr>
                  <td class="color-2 has-text-weight-medium" style="width: 20%">
                    Room type
                  </td>
                  <!-- <td class="color-2 has-text-weight-medium" style="width: 15%">
                    Meal Plan
                  </td> -->
                  <td
                    class="color-2 has-text-weight-medium"
                    style="width: 6%"
                    v-if="hasViewCostPricePermission"
                  >
                    Cost
                  </td>
                  <td
                    v-if="hasViewSalePricePermission"
                    class="color-2"
                    style="width: 2%"
                  />
                  <td
                    v-if="hasViewSalePricePermission"
                    class="color-2 has-text-weight-medium"
                    style="width: 8%"
                  >
                    Room Price
                  </td>
                  <td class="color-2 has-text-weight-medium" style="width: 8%">
                    Room Qty.
                  </td>
                  <td
                    v-if="hasViewSalePricePermission"
                    class="color-2 has-text-weight-bold has-text-centered"
                    style="width: 6%"
                  >
                    Price.p.Night
                  </td>
                  <td
                    v-if="hasViewSalePricePermission"
                    class="color-2 has-text-weight-bold has-text-centered"
                    style="width: 6%"
                  >
                    Total Price
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="room in service.room"
                  :key="room.id"
                  :class="getRowClass(room, service.room)"
                >
                  <td>{{ room.name }}</td>
                  <!-- <td>{{ room.includes.value }}</td> -->
                  <td class="color-7" v-if="hasViewCostPricePermission">
                    {{ getRoomCostCurrency(room) }}
                    {{
                      room &&
                      room.cost_service &&
                      room.cost_service[0].costs_ranges &&
                      room.cost_service[0].costs_ranges[0].cost
                        ? room.cost_service[0].costs_ranges[0].cost
                        : 0
                    }}
                  </td>
                  <td v-if="hasViewSalePricePermission">
                    <b-tooltip
                      v-if="
                        room.price_service_sm &&
                        room.price_service_sm[0].price_service &&
                        room.price_service_sm[0].price_service[0] &&
                        room.price_service_sm[0].price_service[0].risk_price ===
                          1
                      "
                      label="Price calculated with risk"
                      type="is-dark"
                    >
                      <IconRisk class="heartIcon" />
                    </b-tooltip>
                  </td>
                  <td v-if="hasViewSalePricePermission">
                    {{ getPriceCurrency(service) }}
                    {{
                      room &&
                      room.price_service_sm &&
                      room.price_service_sm[0].price_service &&
                      room.price_service_sm[0].price_service[0].prices_ranges &&
                      room.price_service_sm[0].price_service[0].prices_ranges[0]
                        ? room.price_service_sm[0].price_service[0]
                            .prices_ranges[0].price
                        : room &&
                          room.cost_service &&
                          room.cost_service[0].costs_ranges &&
                          room.cost_service[0].costs_ranges[0].cost
                        ? room.cost_service[0].costs_ranges[0].cost
                        : 0
                    }}
                  </td>

                  <td>
                    <b-select
                      v-model.number="room.qty"
                      size="is-small"
                      expanded
                      class="addServiceSelect"
                      @input="setRoomsValidation(service.room)"
                    >
                      <option :value="0">0</option>
                      <option
                        v-for="(item, index) in serviceQty(room, service.room)"
                        :key="index"
                        :value="item"
                      >
                        {{ item }}
                      </option>
                    </b-select>
                  </td>

                  <td
                    v-if="hasViewSalePricePermission"
                    class="has-text-weight-bold has-text-centered"
                  >
                    {{ getPriceCurrency(service) }}
                    {{
                      calculateTotalRoom(
                        room &&
                          room.price_service_sm &&
                          room.price_service_sm[0].price_service &&
                          room.price_service_sm[0].price_service[0]
                            .prices_ranges &&
                          room.price_service_sm[0].price_service[0]
                            .prices_ranges[0]
                          ? room.price_service_sm[0].price_service[0]
                              .prices_ranges[0].price
                          : room &&
                            room.cost_service &&
                            room.cost_service[0].costs_ranges &&
                            room.cost_service[0].costs_ranges[0].cost
                          ? room.cost_service[0].costs_ranges[0].cost
                          : 0,
                        room.qty
                      )
                    }}
                  </td>

                  <td
                    v-if="hasViewSalePricePermission"
                    class="has-text-weight-bold has-text-centered"
                  >
                    {{ getPriceCurrency(service) }}
                    {{
                      calculateTotalRoom(
                        room &&
                          room.price_service_sm &&
                          room.price_service_sm[0].price_service &&
                          room.price_service_sm[0].price_service[0]
                            .prices_ranges &&
                          room.price_service_sm[0].price_service[0]
                            .prices_ranges[0]
                          ? room.price_service_sm[0].price_service[0]
                              .prices_ranges[0].price
                          : room &&
                            room.cost_service &&
                            room.cost_service[0].costs_ranges &&
                            room.cost_service[0].costs_ranges[0].cost
                          ? room.cost_service[0].costs_ranges[0].cost
                          : 0,
                        room.qty
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="table table is-hoverable table is-fullwidth"
              v-if="
                service.id_service_type !== 2 &&
                service.id_service_type !== 9 &&
                service.prices_costs_margins
              "
            >
              <thead>
                <tr>
                  <td
                    v-if="hasViewServiceProviderPermission"
                    class="color-2 has-text-weight-medium has-text-centered"
                    style="width: 12%"
                  >
                    Supplier
                  </td>
                  <td
                    class="color-2 has-text-weight-medium has-text-centered"
                    style="width: 8%"
                    v-if="hasViewSalePricePermission"
                  >
                    Price Unit
                  </td>
                  <td
                    class="color-2 has-text-weight-medium has-text-centered"
                    style="width: 6%"
                    v-if="hasViewCostPricePermission"
                  >
                    Cost
                  </td>
                  <td
                    v-if="hasViewSalePricePermission"
                    class="color-2"
                    style="width: 2%"
                  />
                  <td
                    v-if="hasViewSalePricePermission"
                    class="color-2 has-text-weight-medium has-text-centered"
                    style="width: 12%"
                  >
                    Sales
                    <b-tooltip size="is-small" multilined class="tooltipSales">
                      <template v-slot:content>
                        <b>p.r:</b> Price per range.<br /><b>p.p:</b>
                        Price per person.
                      </template>
                      <IconInfo class="infoIconSales color-4" />
                    </b-tooltip>
                  </td>
                  <td
                    v-if="hasViewSalePricePermission"
                    class="color-2 has-text-weight-medium has-text-centered"
                    style="width: 12%"
                  >
                    Price Per Person
                  </td>
                  <td
                    class="color-2 has-text-weight-medium has-text-centered"
                    style="width: 8%"
                  >
                    Qty.
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="supplier in service.prices_costs_margins
                    .service_supplier"
                  :key="supplier.id"
                  :class="
                    getRowClass(
                      supplier,
                      service.prices_costs_margins.service_supplier
                    )
                  "
                >
                  <td
                    v-if="hasViewServiceProviderPermission"
                    class="has-text-centered"
                    nowrap
                  >
                    {{ supplier !== null && supplier.code }}
                    <b-tooltip label="Favorite Supplier">
                      <IconHeart
                        class="heartIcon"
                        v-if="supplier.default_sup === 1"
                      />
                    </b-tooltip>
                  </td>
                  <td
                    v-if="hasViewSalePricePermission"
                    class="has-text-weight-semibold text-center"
                  >
                    {{ getPriceUnitBySupplierCode(service.id, supplier.code) }}
                  </td>
                  <td
                    class="color-7 text-center"
                    nowrap
                    v-if="hasViewCostPricePermission"
                  >
                    {{ getSupplierCostCurrency(service, supplier.code) }}
                    {{ getSupplierValue(service, supplier, "cost", "") }}
                  </td>
                  <td v-if="hasViewSalePricePermission">
                    <b-tooltip
                      label="Price calculated with risk"
                      type="is-dark"
                    >
                      <IconRisk
                        class="heartIcon"
                        v-if="
                          service.prices_costs_margins.risk_price &&
                          service.prices_costs_margins.risk_price === 1
                        "
                      />
                    </b-tooltip>
                  </td>
                  <td
                    v-if="hasViewSalePricePermission"
                    class="has-text-weight-semibold has-text-centered"
                  >
                    {{ getPriceCurrency(service) }}
                    {{ getServiceValue(service, supplier, "price") }}
                    {{
                      getServiceValue(service, supplier, "individual")
                        ? "p.p."
                        : "p.r"
                    }}
                  </td>
                  <td
                    v-if="hasViewSalePricePermission"
                    class="color-2 has-text-weight-semibold has-text-centered"
                  >
                    {{ getPriceCurrency(service) }}
                    {{ getServiceValue(service, supplier, "price_unit") }}
                    p.p
                  </td>
                  <td>
                    <b-select
                      v-model.number="supplier.room_qty"
                      size="is-small"
                      expanded
                      class="addServiceSelect"
                      @input="
                        changeServiceQty(
                          $event,
                          service,
                          supplier,
                          service.prices_costs_margins.service_supplier
                        )
                      "
                    >
                      <option :value="0">0</option>
                      <option
                        v-for="(item, index) in serviceQty(
                          supplier,
                          service.prices_costs_margins.service_supplier
                        )"
                        :key="index"
                        :value="item"
                      >
                        {{ item }}
                      </option>
                    </b-select>
                  </td>
                </tr>
              </tbody>
            </table>
            <BaseNotAvaliable
              v-if="notAvaliableService(service)"
              text="Service not avaliable to be used"
            >
            </BaseNotAvaliable>

            <div
              class="is-flex is-justify-content-flex-end"
              v-if="!notAvaliableService(service)"
            >
              <BaseButton
                size="small"
                :loading="service.loading"
                :disabled="disableQuoteByStatus"
                @click="
                  nextStep();
                  createItineraryServices(service);
                "
                action="tercery"
                :class="focusedGuideBoxClass('', 21, false, () => index === 0)"
              >
                <i slot="icon">
                  <BaseButtonLock
                    v-if="disableQuoteByStatus"
                    class="icon-check"
                  />
                  <IconPlus v-else class="icon is-small" />
                </i>
                <div slot="text">Add Service</div>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import cloneDeep from "lodash.clonedeep";
import { serviceHelper } from "@/utils/service";
import { addDaysToDate } from "@/utils/utils";

import { PERMISSION, USER_ROLE } from "@/constants";
import helpers from "@/helpers";

export default {
  name: "ServiceResultCard",
  props: {
    service: {
      type: Object,
      default: () => {},
    },
    setRoomsSelectedAccomPack: {
      type: Function,
      default: () => {},
    },
    computedServices: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    createItineraryServiceForm: {
      type: Function,
      default: () => {},
    },
    getServicePrice: {
      type: Function,
      default: () => {},
    },
    updateServices: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isRoomSelectionCompleted: false,
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      authData: "auth/getAuthData",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      numPax: "itinerary/getNumPax",
      currencies: "currency/getCurrencies",
      searchServicesPayload: "services/getSearchServicesPayload",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
    }),
    hasViewServiceProviderPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    hasViewCostPricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_COST_PRICE, PERMISSION.VIEW_PRICE_SEARCHED]
      );
    },
    hasViewSalePricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_SALE_PRICE, PERMISSION.VIEW_PRICE_SEARCHED]
      );
    },
  },
  methods: {
    getRowClass(room = {}, rooms = []) {
      const { num_pax = 1 } = this.itinerary.data;
      const adaptedRooms = rooms.map((room) => ({
        ...room,
        qty: room.qty ?? room.room_qty,
        max_passengers: room.max_passengers || 1,
      }));
      return serviceHelper.getRoomRowClass(num_pax, adaptedRooms, {
        ...room,
        qty: room.qty ?? room.room_qty,
        max_passengers: room.max_passengers || 1,
      });
    },
    setRoomsValidation(rooms = []) {
      const { num_pax = 1 } = this.itinerary.data;
      const adaptedRooms = rooms.map((room) => ({
        ...room,
        qty: room.qty ?? room.room_qty,
        max_passengers: room.max_passengers || 1,
      }));
      this.isRoomSelectionCompleted = serviceHelper.getIsRoomSelectionCompleted(
        num_pax,
        adaptedRooms
      );
    },
    notAvaliableService(service = {}) {
      const result =
        (service.id_service_type !== 2 &&
          service.id_service_type !== 9 &&
          service.prices_costs_margins &&
          service.prices_costs_margins.price === null) ||
        ((service.id_service_type === 2 || service.id_service_type === 9) &&
          (!service.room || service.room.length === 0));
      return result;
    },
    getRoomCostCurrency(room) {
      if (room.cost_service == null) return "";
      if (room.cost_service == undefined) return "";
      const costCurrency = room?.cost_service[0]?.currency_sign;
      return costCurrency;
    },
    getPriceCurrency(service) {
      return service.prices_costs_margins?.currency.currency_sign;
    },
    getCurrencyFromCurrencies(currency_id = 0) {
      const currency_sign =
        this.currencies.find((curr) => curr.id === currency_id)
          ?.currency_sign ?? "";
      return currency_sign;
    },
    getSupplierCostCurrency(service = {}, codeSupplier = "") {
      if (service.supplier_service == null) return "";
      if (service.supplier_service == undefined) return "";
      const supplier = service?.prices_costs_margins.service_supplier.find(
        (sup) => sup.code === codeSupplier
      );

      let costCurrency = supplier?.currency_sign;

      costCurrency = this.getCurrencyFromCurrencies(supplier.currency_id) ?? "";

      return costCurrency;
    },
    calculateTotalRoom(price, qty) {
      return Number(price) * Number(qty)
        ? (Number(price) * Number(qty)).toFixed(2)
        : 0;
    },
    async changeServiceQty(num_pax, service = {}, supplier = {}, rooms = []) {
      const { id } = service;
      const { from, to, sm } = this.searchServicesPayload;

      let service_prices = service.prices_costs_margins.service_price ?? [];

      const newServicePrice = {
        romm_id: supplier.romm_id,
        romm_name: supplier.code,
        room_qty: num_pax,
      };

      service_prices = service_prices
        .map((item) => {
          return item.romm_name !== supplier.code ? item : newServicePrice;
        })
        .filter((item) => item.room_qty > 0);

      if (
        !service_prices.find((item) => item.romm_name === supplier.code) &&
        num_pax > 0
      ) {
        service_prices.push(newServicePrice);
      }

      const data = {
        service_price: service_prices,
      };

      const pricePayload = { id, from, to, sm, num_pax, data };
      const servicePrice = await this.getServicePrice(pricePayload);
      this.updateSeviceWithPriceKeyValue(
        id,
        "prices_costs_margins",
        servicePrice
      );
      this.setRoomsValidation(rooms);
    },
    createItineraryServices(service) {
      if (service.id_service_type === 9 || service.id_service_type === 2) {
        return this.createItineraryService(service);
      }
      service.prices_costs_margins.service_supplier.forEach((supp) => {
        let service_price = service.prices_costs_margins.service_price.find(
          (item) => item.romm_name === supp.code
        );
        if (service_price) {
          let newService = cloneDeep(service);
          newService.service_supplier = [supp];
          newService.prices_costs_margins.service_supplier = [supp];
          newService.prices_costs_margins.num_pax = service_price.room_qty;
          newService.prices_costs_margins.cost = supp.cost;
          newService.prices_costs_margins.cost_unit = supp.cost_unit;
          newService.prices_costs_margins.price = service_price.price;
          newService.prices_costs_margins.price_unit = service_price.price_unit;
          newService.service_price = [service_price];
          this.createItineraryService(newService);
        }
      });
    },
    createItineraryService(service) {
      const { id_service_type } = service;
      const formItineraryService = cloneDeep(service);
      const { from, to } = this.searchServicesPayload;
      formItineraryService.country = service.location?.find((location) =>
        [0, null].includes(location?.parent)
      )?.location_name;
      formItineraryService.start_date = from;
      if (id_service_type === 2 || id_service_type === 9) {
        formItineraryService.service_price =
          this.setRoomsSelectedAccomPack(service);
        formItineraryService.end_date = to;
        if (from === to) {
          formItineraryService.end_date = addDaysToDate(from, 1);
        }
        if (id_service_type === 9) {
          const nights = this.findMaxNights(formItineraryService);
          formItineraryService.end_date = addDaysToDate(from, nights);
        }
      } else {
        formItineraryService.end_date = to;
      }
      return this.createItineraryServiceForm(formItineraryService);
    },
    getPriceUnitBySupplierCode(serviceId, supplierCode) {
      const service = this.computedServices?.data.find(
        (service) => service.id === serviceId
      );
      const supplier = service?.price_service_sm?.[0]?.price_service.find(
        (supplier) => supplier.supplier_code === supplierCode
      );
      const { price_unit = "--", price = "--" } =
        supplier?.prices_ranges?.[0] ?? {};
      const finalPrice = price_unit ?? price ?? "--";
      const currency = service?.price_service_sm?.[0]?.currency_sign;
      return `${finalPrice !== "--" ? currency : ""} ${finalPrice}`;
    },
    getServiceValue(service, supplier, key) {
      const service_price = service.prices_costs_margins.service_price?.find(
        (item) => item.romm_name === supplier.code
      );
      return service_price ? service_price[key] : 0;
    },
    getSupplierValue(service, supplier, key, key2) {
      const supplierFound = service.prices_costs_margins.service_supplier?.find(
        (sup) => sup.code === supplier.code
      );
      return supplierFound ? supplierFound[key] ?? supplierFound[key2] : 0;
    },
    findMaxNights(service) {
      const rooms = service.room ?? [];
      return rooms
        .filter((room) => room.qty > 0)
        .map((room) => {
          try {
            if (room.price_service_sm)
              return room.price_service_sm[0].price_service[0].prices_ranges[0]
                .night_qty;

            return room.cost_service[0].costs_ranges[0].night_qty;
          } catch (e) {
            return 0;
          }
        })
        .reduce((nightsA, nightsB) => Math.max(nightsA, nightsB), 0);
    },
    getMargin(cost, price) {
      return (price - cost).toFixed(2);
    },
    serviceQty(room = {}, rooms = []) {
      const { num_pax = 1 } = this.itinerary.data;
      const adaptedRooms = rooms.map((room) => ({
        ...room,
        qty: room.qty ?? room.room_qty,
        max_passengers: room.max_passengers || 1,
      }));
      return serviceHelper.getUpdatedRoomQtyOptions(num_pax, adaptedRooms, {
        ...room,
        qty: room.qty ?? room.room_qty,
        max_passengers: room.max_passengers || 1,
      });
    },
    updateSeviceWithPriceKeyValue(serviceId, key, value) {
      if (this.computedServices && this.computedServices.data) {
        const serviceIndex = this.computedServices.data.findIndex(
          (e) => e.id === serviceId
        );
        if (serviceIndex >= 0) {
          const servicesUpdated = cloneDeep(this.computedServices);
          servicesUpdated.data[serviceIndex][key] = value;
          this.updateServices(servicesUpdated);
        }
      }
    },
    focusedGuideBoxClass(
      classDefault,
      step,
      bgWhite = false,
      extraValidator = null
    ) {
      const bgWhiteClass = bgWhite ? "bg-white" : "";
      const resultExtraValidator = !extraValidator || extraValidator();
      const finalClass =
        !this.loading &&
        this.isUserGuideActive &&
        this.userGuideStep === step &&
        resultExtraValidator
          ? `${classDefault} is-guide-step ${bgWhiteClass}`
          : classDefault;
      return finalClass;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
  },
};
</script>
