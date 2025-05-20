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
    <div class="modal__container">
      <header class="w-100 mb-5">
        <h1 class="is-relative">Restoring Itinerary Version</h1>
        <p class="mt-3 has-text-left" style="font-size: 1rem">
          Are you sure you want to restore this version?
        </p>
      </header>
      <main
        class="w-100 is-flex is-flex-direction-column is-align-items-start mb-2 p-3"
      >
        <b-taglist attached class="mb-2 is-relative">
          <b-tag
            type="is-dark"
            class="mb-0 mr-2"
            style="border-radius: 0.25rem"
          >
            Version
            <strong style="color: #fff">{{
              itineraryVersion.version
            }}</strong></b-tag
          >
          <b-tag
            rounded
            type="is-dark"
            class="mb-0"
            style="background-color: #444"
          >
            {{ itineraryVersion.edition.user.name }} -
            <strong style="color: #fff">{{
              getItineraryEditionDatetime(itineraryVersion)
            }}</strong>
          </b-tag>
        </b-taglist>
        <QuoteHistoryCard :itinerary="itineraryVersion" />
      </main>
      <footer class="w-100">
        <div class="is-flex is-justify-content-end is-align-items-center mt-4">
          <BaseButton
            class="m-0 mr-2"
            action="secondary"
            @click="() => (isModalOpen = false)"
          >
            <p slot="text">No, cancel</p>
          </BaseButton>
          <BaseButton
            action="principal"
            @click="
              () => restoreItineraryByVersion(this.itineraryVersion, true)
            "
          >
            <p slot="text">Ok, continue</p>
          </BaseButton>
        </div>
      </footer>
    </div>
  </b-modal>
</template>
<script>
import QuoteHistoryCard from "@/components/quote-views/_shared/QuoteHistoryCard.vue";

export default {
  name: "RestoreItineraryVersionAlert",
  components: {
    QuoteHistoryCard,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    itineraryVersion: {
      type: Object,
      default: () => {},
    },
    restoreItineraryByVersion: {
      type: Function,
      default: () => {},
    },
    getItineraryEditionDatetime: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    isModalOpen: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("update:setItineraryRestoreVersionModal", value);
      },
    },
  },
};
</script>
<style scoped>
.modal__container {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 54rem;
  height: auto;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  font-family: Poppins, sans-serif;
  position: relative;
}
.modal__container > header > h1 {
  color: #1e1e1e;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: left;
}
.modal__container > main {
  box-shadow: 0 0 30px -15px #aaa;
}
</style>
