<template>
  <div class="pax_card">
    <h3>Pax {{ index + 1 }}: {{ getFullNamePassenger(pax) }}</h3>
    <div class="pax_card_container">
      <div
        class="pax_box_level"
        v-for="(paxLevel, indexPax) in pax.price_levels"
        :key="indexPax"
      >
        <div class="input_group">
          <label for="pax_price">Pax price</label>
          <input
            type="number"
            id="pax_price"
            v-model.number="paxLevel.price"
            @input="calculateTotalPaxPrice"
            readonly
          />
        </div>
        <div
          class="input_group"
          :disabled="disableQuoteByStatus || hideElementByCondition"
        >
          <label for="markup"
            >Upsales
            <CopyPaxChanges
              field="Upsales"
              :actionClick="copyPaxPricesChanges"
              :valueToCopy="paxLevel.mkt_percentage"
              :box="paxLevel"
            />
          </label>
          <input
            type="number"
            id="markup"
            v-model.number="paxLevel.mkt_coin"
            @input="calculateTotalPaxPrice"
            min="0"
            disabled
          />
        </div>
        <div
          class="input_percentage"
          :disabled="disableQuoteByStatus || hideElementByCondition"
        >
          <input
            type="range"
            id="pax_markup"
            min="0"
            max="100"
            v-model.number="paxLevel.mkt_percentage"
            @input="calculateTotalPaxPrice(true)"
          />
          <div id="pax_markup_number">
            <input
              style="width: 85%"
              type="number"
              v-model.number="paxLevel.mkt_percentage"
              @input="
                removeInitialZero($event);
                calculateTotalPaxPrice(true);
              "
              min="0"
            />
            <span>%</span>
          </div>
        </div>
        <div
          class="input_group"
          :disabled="disableQuoteByStatus || hideElementByCondition"
        >
          <label for="pax_fee"
            >Fee
            <CopyPaxChanges
              field="Fee"
              :actionClick="copyPaxPricesChanges"
              :valueToCopy="paxLevel.fee"
              :box="paxLevel"
            />
          </label>
          <input
            type="number"
            id="pax_fee"
            v-model.number="paxLevel.fee"
            min="0"
            @input="
              removeInitialZero($event);
              calculateTotalPaxPrice();
            "
          />
        </div>
        <div class="input_group">
          <label for="pax_finalprice">Final Price</label>
          <input
            type="number"
            id="pax_finalprice"
            v-model.number="paxLevel.total_price"
            @input="calculateFieldsByTotal"
            :min="Math.round(paxLevel.price)"
            :disabled="disableQuoteByStatus || hideElementByCondition"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CopyPaxChanges from "./CopyPaxChanges.vue";

export default {
  name: "PaxPriceCard",
  components: { CopyPaxChanges },
  props: {
    pax: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    copyPaxPricesChanges: {
      type: Function,
      default: () => {},
    },
    calculateTotalPaxPrice: {
      type: Function,
      default: () => {},
    },
    calculateFieldsByTotal: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
  },
  methods: {
    removeInitialZero(event) {
      const digits = event.target.value.split("");
      if ((digits[0] === "0" && digits.length === 1) || event.data === ".")
        return;
      const digitsWithOutInitialZero = digits.filter(
        (item, index) => item !== "0" && index !== 0
      );
      event.target.value = digitsWithOutInitialZero.join("");
    },
    getFullNamePassenger(pax) {
      if (pax.passenger)
        return `${pax.passenger.last_name}, ${pax.passenger.first_name}`;
      return "-";
    },
  },
};
</script>
<style>
.pax_card {
  padding: 1.5rem;
  background-color: #d9d9d954;
  border-radius: 1rem;
  margin: 1rem 0 0.5rem 0;
}
.pax_card:nth-child(even) {
  background-color: #ffffff;
  box-shadow: 0px 4px 50px -15px rgba(0, 0, 0, 0.1);
}
.pax_card_container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
}
.pax_card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #6d6d6d;
}
.pax_box_level {
  width: clamp(13rem, 14vw, 20rem);
}
#pax_price {
  border: none;
  padding-right: 0;
}
#pax_markup {
  width: 100%;
  display: block;
  margin-bottom: 0.5rem;
}
.pax_card .input_group input:nth-of-type(1) {
  margin-left: auto;
}
.pax_card .input_group:last-of-type label {
  font-weight: 600;
}
.pax_card .input_group input {
  background-color: transparent;
  border-radius: 0.5rem;
  border: 1px solid #aaaaaa;
  padding: 0.2rem 0.5rem;
  width: 5rem;
}
.pax_card .input_group input:focus {
  border: 1px solid #aaaaaa;
  outline: none;
}
.pax_card .input_group {
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}
.pax_card .input_group label {
  color: #aaaaaa;
}
.pax_card .input_group svg {
  display: inline-block;
  width: 0.8rem;
}
.input_percentage {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.input_percentage #pax_markup_number {
  width: 60%;
  margin: 0.25rem 0 0;
  border-radius: 0.5rem;
  position: relative;
  bottom: 0.25rem;
  color: #aaaaaa;
}
.input_percentage #pax_markup_number input {
  color: #aaaaaa;
  background-color: transparent;
  border: none !important;
  outline: none;
  text-align: right;
  border: 1px solid #aaaaaa;
  padding: 0.2rem 0.5rem;
}
.input_percentage input {
  width: 75%;
}
@media screen and (max-width: 480px) {
  .pax_card {
    width: fit-content;
  }
}
</style>
