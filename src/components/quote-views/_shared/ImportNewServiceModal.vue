<template>
  <b-modal
    title="Importing a new Service"
    :width="500"
    v-model="isOpen"
    @close="closeModal()"
  >
    <div class="service_replace_modal p-4">
      <h1 class="is-relative is-inline" style="width: fit-content">
        Importing a new Service
        <b-tag
          type="is-info"
          class="px-2"
          style="
            position: absolute;
            top: -0.75rem;
            right: -2.5rem;
            height: fit-content;
          "
        >
          <p>BETA</p>
        </b-tag>
      </h1>
      <p class="has-text-left mb-2">Enter the Service Code to import it.</p>
      <p v-if="currentServicesImporting.length > 0" class="has-text-left mb-2">
        <b-icon
          size="is-small"
          custom-size="mdi-18px"
          icon="alert"
          class="mx-2"
          style="color: #ff9316"
        ></b-icon>
        <strong>Services currently importing: </strong>
        {{ currentServicesImporting }}
      </p>
      <div class="mb-4">
        <b-input
          :value="serviceCode"
          @input="($event) => (serviceCode = `${$event}`.toLocaleUpperCase())"
          placeholder="Service CODE to import"
          style="font-size: 0.8rem"
        />
        <span class="is-flex is-align-items-center mt-1">
          <b-icon
            size="is-small"
            custom-size="mdi-18px"
            icon="clock"
            class="mx-2"
          ></b-icon>
          The estimated time to import a service is around 5 minutes
        </span>
      </div>
      <div class="is-flex is-justify-content-end">
        <BaseButton action="principal" @click="onContinueClick">
          <p slot="text">Continue</p>
        </BaseButton>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "ImportNewServiceModal",
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    closeModal: {
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
      isOpen: this.isModalOpen,
      serviceCode: "",
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
    }),
    currentServicesImporting() {
      const servicesImporting =
        this.itinerary?.queue?.importing?.services || [];
      const uniqueServicesImporting = [...new Set(servicesImporting)];
      return uniqueServicesImporting?.join(",") || "";
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
      this.onContinue(this.serviceCode);
      this.serviceCode = "";
    },
  },
};
</script>
<style scoped>
.service_replace_modal {
  width: 100%;
}
.service_replace_modal h1 {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
  color: #000;
}
.service_replace_modal p,
.service_replace_modal span,
.service_replace_modal input {
  font-size: 0.8rem;
}
.service_replace_modal .input:focus {
  color: #363636 !important;
  border: none;
  box-shadow: none;
}
</style>
