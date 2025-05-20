<template>
  <div v-if="isCurrentGuideStep">
    <div class="modal__bg" v-if="overlay"></div>
    <div class="guidebox" :style="position">
      <div class="guidebox__header">
        <h3 class="guidebox__title">{{ title }}</h3>
        <button class="icon__close" @click="handleStopGuide()">
          <IconClose class="icon is-small" />
        </button>
      </div>
      <p>{{ description }}</p>
      <div class="guidebox__buttons">
        <button
          class="guide__button--back"
          @click="prevStep"
          v-if="showBackButton"
        >
          Back
        </button>
        <button
          class="guide__button--next"
          @click="
            nextStep();
            primaryButtonAction();
          "
          v-if="showNextButton"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "GuideBox",
  props: {
    title: {
      type: String,
      default: "Default Title",
    },
    description: {
      type: String,
      default: "Default Description",
    },
    step: {
      type: Number,
      default: 0,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    positionX: {
      type: Number,
      default: 0,
    },
    positionY: {
      type: Number,
      default: 0,
    },
    showNextButton: {
      type: Boolean,
      default: true,
    },
    showBackButton: {
      type: Boolean,
      default: true,
    },
    primaryButtonAction: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      tour: null,
    };
  },
  computed: {
    ...mapGetters({
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
    }),
    isCurrentGuideStep() {
      return this.isUserGuideActive && this.userGuideStep === this.step;
    },
    position() {
      const position = `transform: translate(${this.positionX}px,${this.positionY}px);`;
      return position;
    },
  },
  methods: {
    prevStep() {
      this.$store.dispatch("userguide/prevStep");
    },
    nextStep() {
      this.$store.dispatch("userguide/nextStep");
    },
    handleStopGuide() {
      this.$store.dispatch("userguide/setIsGuideActive", false);
    },
  },
};
</script>
<style scoped>
/* GUIDEBOX */
.modal__bg {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 99;
}
.guidebox {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
  position: absolute;
  z-index: 9999;
  text-align: left;
  max-width: 16rem;
}
.icon__close {
  border: none;
  border-radius: 0.25rem;
  background-color: none;
  position: relative;
  top: -0.5rem;
}
.guidebox__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.guidebox__buttons {
  display: flex;
  justify-content: space-between;
}
.guide__button--next {
  background: #f00b81;
  border: none;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  margin-left: auto;
  margin-top: 1rem;
}
.guide__button--back {
  background: none;
  border: none;
  color: #aaa;
  margin-top: 1rem;
}
.guidebox__title {
  font-weight: 700;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  text-align: left;
}
</style>
