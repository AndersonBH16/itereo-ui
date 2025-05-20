<template>
  <b-modal
    v-model="isOpen"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Modal"
    aria-modal
    @close="closeModal"
    v-bind="$attrs"
  >
    <div class="external_export_modal__container is-relative p-4">
      <header>
        <h1 class="header_title has-text-centered w-100">Congratulations!</h1>
        <p class="has-text-centered w-100 mb-2">
          Your dedication and expertise shine through. Wishing you continued
          success with all your upcoming plans!
        </p>
        <picture class="is-flex is-justitfy-content-center">
          <img
            slot="image"
            src="/img/confetti.svg"
            alt="congratulations image"
            style="max-width: 40%; margin: 0 auto"
          />
        </picture>
      </header>
    </div>
  </b-modal>
</template>
<script>
import confetti from "@/assets/confetti.min.js";

export default {
  name: "CongratulationsModal",
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isOpen: this.isModalOpen,
    };
  },
  watch: {
    isModalOpen(newValue) {
      this.isOpen = newValue;
      if (newValue) {
        confetti.start();
        setTimeout(() => {
          confetti.stop();
        }, 5000);
      }
    },
  },
};
</script>
<style scoped>
.external_export_modal__container {
  background-color: #fff;
  border-radius: 1rem;
  width: 30rem;
}
.external_export_modal__container header {
  position: relative;
  width: 100%;
  text-align: left;
  padding-bottom: 0.2rem;
}
.header_title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
}
.card__content {
  border: 1px solid #eee;
  border-radius: 1rem;
  padding: 2rem 0;
}
.card__content:hover {
  box-shadow: 0 0 30px -10px #ddd;
  transition: all 0.3s ease;
}
.external_export_modal__container .active {
  border: 1px solid #f00b81;
  outline: 1px solid #f00b81;
}
.external_export_modal__container .active::after {
  content: "Selected ✔";
  position: absolute;
  left: 0;
  top: -1rem;
  width: 100%;
  border: 1px solid #f00b81;
  outline: 2px solid #f00b81;
  text-align: center;
  color: #fff;
  background-color: #f00b81;
  border-radius: 0.8rem 0.8rem 0 0;
  padding: 0.25rem 0;
}
</style>
