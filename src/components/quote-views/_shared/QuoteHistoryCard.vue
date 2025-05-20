<template>
  <div
    class="is-flex is-justify-content-space-between quote_history_card__container w-100"
  >
    <div class="is-flex is-flex-direction-column is-align-items-start">
      <div class="mb-2 is-flex">
        <b-tooltip
          :label="itinerary.code"
          type="is-dark"
          class="quote_history_card__code_tooltip"
        >
          <b-tag class="quote_history_card__code">
            {{ itinerary ? itinerary.code : "" }}
          </b-tag>
        </b-tooltip>
        <b-tag class="ml-2">
          {{ itineraryTypeName }}
        </b-tag>
      </div>
      <h3 class="quote_history_card__title mb-2">
        {{ itinerary.title ? itinerary.title.value : "" }}
      </h3>
      <div class="quote_history_card__location">
        <b-icon icon="map-marker" size="is-small" custom-size="mdi-18px" />
        <span style="font-weight: 400">
          {{ itineraryCountries }}
        </span>
        <span>
          {{ itineraryDestinations }}
        </span>
        <p class="is-inline ml-2 quote_history_card__secondary__info">
          <span>Status </span>
          {{ itinerary.status.name }}
        </p>
        <p class="is-inline ml-2 quote_history_card__secondary__info">
          <span>Language </span>
          {{ itinerary.language.language_name }}
        </p>
      </div>
      <div class="mt-2 quote_history_card__secondary__info">
        <p class="is-inline">
          <span>Client </span>
          {{ itinerary.client.name }}
        </p>
        <p class="is-inline ml-2">
          <span>Contract </span>
          {{ itinerary.contract.name }}
        </p>
        <p class="is-inline ml-2">
          <span>Currency </span>
          {{ itinerary.currency.currency_name }}
        </p>
      </div>
    </div>

    <div class="is-flex is-flex-direction-column is-align-items-end pt-2">
      <div>
        <span class="mr-2">
          {{ itinerary.num_pax }}
          <b-icon icon="account" size="is-small" custom-size="mdi-18px" />
        </span>

        <span> {{ itinerary.num_days }} day(s) / </span>

        <span> {{ itinerary.service_itinerary.length }} services </span>
      </div>

      <div
        class="is-flex is-justify-content-space-between mt-3"
        style="gap: 0.5rem"
      >
        <div
          v-for="price in itinerary.prices[0].prices"
          :key="price.type"
          class="price__container p-3"
        >
          <h4>
            {{ itinerary.currency.currency_sign }}
            {{ price ? price.total : 0 }}
          </h4>
          <small class="small">{{ price.type }}</small>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { helper } from "@/utils/itinerary";
export default {
  name: "QuoteHistoryCard",
  props: {
    itinerary: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      clientContracts: "client/getClientContracts",
    }),
    itineraryTypeName() {
      const itineraryTypes = helper.getItineraryTypesMapped();
      return itineraryTypes.find(
        (itineraryType) => itineraryType.id === this.itinerary.itinerary_type_id
      )?.name;
    },
    itineraryCountries() {
      return this.itinerary.location
        .filter((location) => [null, 0].includes(location.parent))
        .map((location) => location.location_name)
        .join(", ");
    },
    itineraryDestinations() {
      return this.itinerary.location
        .filter((location) => ![null, 0].includes(location.parent))
        .map((location) => location.location_name)
        .join(", ");
    },
  },
  methods: {
    getContractById(contractId) {
      return (
        this.clientContracts.find((clientContract) => {
          return clientContract.id === contractId;
        })?.name || "No contract"
      );
    },
  },
};
</script>
<style>
.quote_history_card__container {
  border-radius: 0.75rem;
  font-size: 0.8rem;
}
.quote_history_card__title {
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
}
.quote_history_card__location {
  font-size: 0.8rem;
  color: #aaa;
}
.quote_history_card__secondary__info {
  font-weight: 300;
  color: #444;
}
.price__container {
  border: 1px solid #eee;
  border-radius: 0.5rem;
}
.quote_history_card__code {
  max-width: 25rem;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: horizontal;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: flex-start !important;
}
.quote_history_card__code_tooltip.b-tooltip.is-top .tooltip-content {
  left: 87%;
}
</style>
