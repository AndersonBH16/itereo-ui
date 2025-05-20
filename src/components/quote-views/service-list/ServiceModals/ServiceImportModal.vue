<template>
  <b-modal
    title="Do you want to import it again?"
    :width="480"
    v-model="isOpen"
    @close="closeModal()"
  >
    <div class="service_replace_modal p-4">
      <h1>Do you want to udpate it again?</h1>
      <p class="has-text-left mb-4">
        This service <strong>{{ selectedService.code }}</strong> was already
        updated today {{ lastServiceImportText }}. Do you want to update it
        again?
      </p>
      <div class="is-flex is-justify-content-space-between">
        <BaseButton action="secondary" @click="onCancel">
          <p slot="text">No, cancel</p>
        </BaseButton>
        <BaseButton action="principal" @click="onContinueClick">
          <p slot="text">Yes, update service</p>
        </BaseButton>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { datesHelper } from "@/utils/dates";

export default {
  name: "ServiceImportModal",
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    selectedService: {
      type: Object,
      default: () => ({}),
    },
    closeModal: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onContinue: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      helpers: { ...datesHelper },
      isOpen: this.isModalOpen,
    };
  },
  computed: {
    ...mapGetters({
      datesFormat: "itinerary/getDatesFormat",
    }),
    lastServiceImportText() {
      if (this.selectedService.last_import === null) return "";
      return `${this.helpers.getDatetimeFromUTC(
        this.selectedService.last_import,
        this.datesFormat
      )}`;
    },
  },
  watch: {
    isModalOpen(newValue) {
      this.isOpen = newValue;
    },
  },
  methods: {
    onContinueClick() {
      this.closeModal();
      this.onContinue(this.selectedService);
      this.$emit("update:selectedService", null);
    },
  },
};
</script>
<style scoped>
.service_replace_modal {
  width: 30rem;
}
.service_replace_modal h1 {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
  color: #000;
}
</style>
