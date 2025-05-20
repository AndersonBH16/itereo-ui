<template>
  <b-modal
    v-if="isModalOpen"
    v-model="isModalOpen"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Modal"
    aria-modal
    @close="isModalOpen = false"
    v-bind="$attrs"
  >
    <div class="entity_history_modal">
      <h1 class="header_title mb-4" style="text-align: left; width: 100%">
        Service Prices History
      </h1>
      <table style="width: 28rem">
        <thead style="height: 2rem">
          <tr>
            <th>User</th>
            <th>Date & Time</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody class="pt-2">
          <tr v-for="entity in entityHistory" :key="entity.id">
            <td style="width: 5rem">{{ entity.edition.user.name }}</td>
            <td style="width: 5rem">
              {{ helpers.format(entity.edition.date, datesFormat) }}
            </td>
            <td style="width: 5rem">{{ entity.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";

export default {
  name: "EntityHistoryModal",
  props: {
    servicePriceHistoryModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      helpers: {
        format,
      },
    };
  },
  computed: {
    ...mapGetters({
      entityHistory: "itinerary/getEntityHistory",
      datesFormat: "itinerary/getDatesFormat",
    }),
    isModalOpen: {
      get() {
        return this.servicePriceHistoryModal;
      },
      set(value) {
        this.$emit("update:servicePriceHistoryModal", value);
      },
    },
  },
};
</script>
<style scoped>
.entity_history_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30rem;
  height: auto;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: center;
}
.header_title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
}
</style>
