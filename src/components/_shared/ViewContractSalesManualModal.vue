<template>
  <b-modal
    id="view-contract-sales-manual-modal"
    title="View Contract Sales Manual"
    size="xl"
    @hidden="onClose"
    v-model="isModalOpenLocal"
  >
    <div class="service_replace_modal">
      <h1
        v-if="selectedContract !== null"
        class="header__title"
        style="text-align: left; width: 100%"
      >
        <strong> Contract: </strong> {{ selectedContract.code }} -
        {{ selectedContract.name }}
        <div class="is-flex is-align-items-center gap-2 mt-2">
          <b-tag
            v-for="location in selectedContract.locations"
            :key="location.id"
          >
            {{ location.location_label }}
          </b-tag>
        </div>
      </h1>
      <h2 class="my-4"><strong> Sales Manuals </strong></h2>
      <div class="modal__body__content">
        <b-table
          v-if="selectedContractSalesManuals.data.length > 0"
          :data="selectedContractSalesManuals.data"
          hoverable
        >
          <b-table-column
            field="code"
            label="Code"
            v-slot="props"
            width="30"
            centered
          >
            {{ props.row.code }}
          </b-table-column>
          <b-table-column
            field="code"
            label="From"
            v-slot="props"
            width="35"
            centered
          >
            {{ helpers.format(props.row.start_date, datesFormat) }}
          </b-table-column>
          <b-table-column
            field="end_date"
            label="To"
            v-slot="props"
            width="35"
            centered
          >
            {{ helpers.format(props.row.end_date, datesFormat) }}
          </b-table-column>
        </b-table>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";

export default {
  name: "ViewContractSalesManualModal",
  computed: {
    ...mapGetters({
      clientContracts: "client/getClientContracts",
      itinerary: "itinerary/getItinerary",
      isViewContractSalesManualModalOpen:
        "utils/getIsViewContractSalesManualModalOpen",
      datesFormat: "itinerary/getDatesFormat",
    }),
    selectedContract() {
      return (
        this.clientContracts.find(
          (contract) => contract.id === this.itinerary?.data?.contract_id
        ) || null
      );
    },
    selectedContractSalesManuals() {
      return this.selectedContract?.sales_manual_contract || { data: [] };
    },
    isModalOpenLocal: {
      get() {
        return this.isViewContractSalesManualModalOpen;
      },
      set(value) {
        this.$store.dispatch(
          "utils/setIsViewContractSalesManualModalOpen",
          value
        );
      },
    },
  },
  data() {
    return {
      helpers: {
        format,
      },
    };
  },
  methods: {
    onClose() {
      this.isModalOpenLocal = false;
    },
  },
};
</script>
<style>
.service_replace_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: center;
}
.service_replace_modal :is(h1, h2) {
  text-align: left;
}
.modal__body__content {
  width: 100%;
}
.service_replace_modal table :is(th, td) {
  font-size: 1rem;
}
@media screen and (max-width: 480px) {
  #view-contract-sales-manual-modal .animation-content {
    width: 90% !important;
  }
  .service_replace_modal {
    padding: 1.5rem !important;
  }
}
</style>
