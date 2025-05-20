<template>
  <div>
    <div class="total_prices">
      <DotAlert
        v-for="price in adaptedPriceArray.prices"
        :key="price.type"
        :displayAlert="getDotAlertConfig(price).displayAlert"
        :tooltip="getDotAlertConfig(price).tooltip"
      >
        <template #baseText>
          <div class="total_price_box">
            <p class="is-relative">
              {{ price.type }}
            </p>
            <input
              type="number"
              :id="price.type"
              v-model.number="price.total"
              disabled
            />
          </div>
        </template>
      </DotAlert>
    </div>
    <div class="pax_list" v-if="adaptedPaxsPrices.length > 0">
      <PaxPriceCard
        v-for="(pax, index) in adaptedPaxsPrices"
        :key="index"
        :index="index"
        :pax="pax"
        :copyPaxPricesChanges="copyPaxPricesChanges"
        :calculateTotalPaxPrice="calculateTotalPaxPrice"
        :calculateFieldsByTotal="calculateFieldsByTotal"
      />
    </div>
  </div>
</template>
<script>
import helpers from "@/helpers";
import { pricesHelper } from "@/utils/prices";
import { PRICE_TYPES } from "@/constants/prices";
import PaxPriceCard from "./PaxPriceCard.vue";
import DotAlert from "../../_shared/DotAlert.vue";

export default {
  name: "PriceTab",
  components: { PaxPriceCard, DotAlert },
  props: {
    priceArray: {
      type: Object,
      required: true,
    },
    paxsPrices: {
      type: Array,
      required: true,
    },
    levelsUpsalesAlert: {
      type: Array,
      required: true,
    },
    getDotAlertConfig: {
      type: Function,
      required: () => {},
    },
  },
  data() {
    return {
      constants: { PRICE_TYPES },
      helper: { ...helpers, ...pricesHelper },
      adaptedPaxsPrices: this.paxsPrices,
      adaptedPriceArray: this.priceArray,
    };
  },
  computed: {
    displayAlertByPriceType() {
      const resellerPrice = this.paxsPrices?.[0]?.price_levels.find(
        (price) => price.type === this.constants.PRICE_TYPES.RESELLER.type
      );
      if (resellerPrice === undefined) {
        return (
          this.adaptedPriceArray.type === this.constants.PRICE_TYPES.SELLER.type
        );
      } else {
        return (
          this.adaptedPriceArray.type ===
          this.constants.PRICE_TYPES.RESELLER.type
        );
      }
    },
  },
  watch: {
    adaptedPaxsPrices() {
      this.adaptedPriceArray = {
        ...this.adaptedPriceArray,
        prices: this.calculateTotalPriceLevels(),
      };
      this.udpateParentProps();
    },
  },
  mounted() {
    this.initialLoad();
  },
  methods: {
    udpateParentProps() {
      const payload = {
        paxsPrices: this.adapterPaxsPricesToWrite(this.adaptedPaxsPrices),
        priceArray: this.adaptedPriceArray,
      };
      this.$emit("update", payload);
    },
    initialLoad() {
      const adaptedPaxsPrices = this.adapterPaxsPricesToRead(this.paxsPrices);
      this.adaptedPaxsPrices = this.filterPaxsPricesEmpty(adaptedPaxsPrices);
    },
    adapterPaxsPricesToWrite(paxsPrices = []) {
      return paxsPrices.map((pax, ind) => {
        const filteredPriceLevels = this.paxsPrices?.[ind].price_levels.filter(
          (priceLevel) => {
            return priceLevel.id !== this.priceArray.id;
          }
        );
        return {
          ...pax,
          price_levels: [
            ...filteredPriceLevels,
            { ...this.priceArray, prices: pax.price_levels },
          ],
        };
      });
    },
    adapterPaxsPricesToRead(paxsPrices = []) {
      return paxsPrices?.map((pax) => {
        const price_levels = pax.price_levels.find((priceLevel) => {
          return priceLevel.id === this.priceArray.id;
        });
        return { ...pax, price_levels: price_levels.prices };
      });
    },
    copyPaxPricesChanges(
      actionType = "",
      valueType = "",
      value = 0,
      paxLevel = {}
    ) {
      this.adaptedPaxsPrices = this.helper.calculatePaxPricesByActionType(
        this.adaptedPaxsPrices,
        actionType,
        valueType,
        value,
        paxLevel
      );
      return this.$buefy.toast.open({
        duration: 5000,
        message: "Pax Prices were updated sucessfully!",
        position: "is-top",
        type: "is-success",
      });
    },
    calculateTotalPaxPrice(fromMktPercentage = false) {
      const newPaxsPrices = this.adaptedPaxsPrices.map((pax) => {
        const newPax = { ...pax };
        const newPricesLevels = pax.price_levels.map((priceLevel) => {
          let newPriceLevel =
            pricesHelper.formatPaxPriceTo2Decimals(priceLevel);
          if (typeof fromMktPercentage === "boolean" && fromMktPercentage) {
            newPriceLevel.mkt_coin =
              (priceLevel.price * newPriceLevel.mkt_percentage) / 100;
          } else {
            newPriceLevel.mkt_percentage =
              (newPriceLevel.mkt_coin / newPriceLevel.price) * 100;
          }
          newPriceLevel.price = priceLevel.price;
          newPriceLevel.total_price = Math.round(
            newPriceLevel.price + newPriceLevel.mkt_coin + newPriceLevel.fee
          );
          return newPriceLevel;
        });
        return { ...newPax, price_levels: newPricesLevels };
      });
      this.adaptedPaxsPrices = this.filterPaxsPricesEmpty(newPaxsPrices);
    },
    calculateFieldsByTotal() {
      const newPaxsPrices = this.adaptedPaxsPrices.map((pax) => {
        const newPax = { ...pax };
        const newPricesLevels = pax.price_levels.map((priceLevel) => {
          let newPriceLevel =
            pricesHelper.formatPaxPriceTo2Decimals(priceLevel);
          newPriceLevel.price = priceLevel.price;

          const newMktCoin =
            priceLevel.total_price - (priceLevel.price + newPriceLevel.fee);
          const newMktPercentage =
            newMktCoin === 0
              ? 0
              : Number(((newMktCoin / newPriceLevel.price) * 100).toFixed(2));
          const newFee =
            priceLevel.total_price -
            (priceLevel.price + newPriceLevel.mkt_coin);

          if (newMktCoin >= 0) {
            newPriceLevel.mkt_coin = newMktCoin;
            newPriceLevel.mkt_percentage = newMktPercentage;
          } else if (newFee >= 0) {
            newPriceLevel.fee = newFee;
          }

          return newPriceLevel;
        });
        return { ...newPax, price_levels: newPricesLevels };
      });
      this.adaptedPaxsPrices = newPaxsPrices;
    },
    calculateTotalPriceLevels() {
      if (this.adaptedPriceArray.prices.length === 0)
        return this.prices_itinerary_source;
      return this.helper.calculatePriceLevels(
        this.adaptedPriceArray.prices,
        this.adaptedPaxsPrices
      );
    },
    filterPaxsPricesEmpty(paxsPrices) {
      const newPaxsPricesFormattedToInteger =
        this.formatPaxPricesToInteger(paxsPrices);
      return newPaxsPricesFormattedToInteger;
    },
    formatPaxPricesToInteger(paxsPrices) {
      const newPaxsPrices = paxsPrices.map((pax) => {
        const newPricesLevels = pax.price_levels.map(
          pricesHelper.formatPaxPriceTo2Decimals
        );
        return { ...pax, price_levels: newPricesLevels };
      });
      return newPaxsPrices;
    },
  },
};
</script>
<style>
.total_prices {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}
.total_price_box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 4rem;
  background-color: #ffffff;
  box-shadow: 0px 4px 50px -15px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  margin-bottom: 1rem;
}
.total_price_box p {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1d3b83;
}
.total_price_box input {
  font-size: 1.2rem;
  font-weight: 600;
  color: #444444;
  width: 5rem;
  border: none;
  position: relative;
  left: 1rem;
}
.total_price_box input:focus {
  outline: none;
}
.pax_list {
  overflow-y: auto;
  max-height: 55vh;
  padding-bottom: 3rem;
}
@media screen and (max-width: 480px) {
  .total_prices {
    justify-content: space-between;
  }
  .pax_list {
    overflow-y: visible;
  }
}
</style>
