<template>
  <b-modal
    v-if="isAlertOpen"
    v-model="isAlertOpen"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Alert Modal"
    aria-modal
    @close="isAlertOpen = false"
    v-bind="$attrs"
  >
    <div class="alert_modal__container">
      <p v-html="alertText"></p>
      <div class="is-flex is-justify-content-center mt-4" style="gap: 1rem">
        <BaseButton action="secondary" @click="onCancel">
          <p slot="text">No, cancel</p>
        </BaseButton>
        <BaseButton action="tercery" @click="onContinue">
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "LinkToItineraryAlert",
  props: {
    alertText: {
      type: String,
      default: "",
    },
    isLinkToItineraryAlertOpen: {
      type: Boolean,
      default: false,
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
  watch: {
    isAlertOpen(newValue) {
      if (this.isLinkToItineraryAlertOpen === newValue) return;
      this.$emit("update:isLinkToItineraryAlertOpen", newValue);
    },
    isLinkToItineraryAlertOpen(newValue) {
      this.isAlertOpen = newValue;
      this.$store.dispatch("utils/setIsModalOpen", newValue);
    },
  },
  data() {
    return {
      isAlertOpen: this.isLinkToItineraryAlertOpen,
    };
  },
};
</script>

<style>
.alert_modal__container {
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  background-color: #fff;
  border-radius: 1rem;
}
</style>
