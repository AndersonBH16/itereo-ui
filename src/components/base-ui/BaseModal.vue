<template>
  <section class="modalContainer">
    <b-modal
      v-if="type === 'preview'"
      v-model="updatedIsComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Modal"
      aria-modal
      @close="closeModal()"
      :can-cancel="cancel"
      v-bind="$attrs"
    >
      <p class="image">
        <slot name="body"></slot>
        <slot name="footer"></slot>
      </p>
    </b-modal>
    <b-modal
      v-if="type === 'default'"
      v-model="updatedIsComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Modal"
      aria-modal
      @close="closeModal()"
      :can-cancel="cancel"
      v-bind="$attrs"
    >
      <div class="card" :style="`max-height: ${height};min-width: ${width};`">
        <div class="card-content pb-0">
          <slot name="body"></slot>
          <div class="content">
            <p class="has-text-centered">
              <slot name="icon"></slot>
            </p>
            <p class="is-h2 has-text-centered">
              <slot name="title"></slot>
            </p>
            <p class="is-h2 has-text-centered">
              <slot name="paragraph"></slot>
            </p>
          </div>
        </div>
        <footer class="card-footer py-5 is-flex is-justify-content-center">
          <slot name="buttons"></slot>
        </footer>
      </div>
    </b-modal>
    <b-modal
      v-if="type === 'shortcuts'"
      v-model="updatedIsComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Modal"
      aria-modal
      @close="closeModal()"
    >
      <div class="card">
        <div class="header">
          <p class="title">
            <slot name="title"></slot>
          </p>
          <button @click="closeModal(false)">
            <IconClose class="icon is-small"></IconClose>
          </button>
        </div>
        <div class="body">
          <slot name="body"></slot>
          <div v-if="shortcuts.length > 0" class="shortcutsContainer">
            <div
              v-for="(item, index) in shortcuts"
              :key="index"
              class="shortcutsGroup"
            >
              <h2>{{ item.title }}</h2>
              <div
                v-for="(item, index) in item.shortcuts"
                :key="index"
                class="shortcutList"
              >
                <span class="name">{{ item.name }}</span>
                <div class="keyboardGroup">
                  <span class="keyboard">{{ item.combination[0] }}</span>
                  <span class="plus" v-if="item.combination.length > 1">+</span
                  ><span v-if="item.combination.length > 1" class="keyboard">{{
                    item.combination[1]
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <div
      v-if="type === 'loading' && updatedIsComponentModalActive"
      :class="
        'transitionmodal' + (updatedIsComponentModalActive ? ' show' : '')
      "
    >
      <div class="transitionmodal__bg"></div>
      <div class="transitionmodal__content">
        <picture>
          <img
            class="ImageUnderConstruction"
            src="/img/under-constuction.jpg"
            alt="Under construction"
          />
        </picture>
        <div class="transitionmodal__text">
          <slot name="title"></slot>
          <slot name="paragraph"></slot>
          <div class="snippet__container">
            <slot name="icon"></slot>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-if="type === 'guide'"
      v-model="updatedIsComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Modal"
      aria-modal
      @close="closeModal()"
      :can-cancel="cancel"
      v-bind="$attrs"
    >
      <div class="guidemodal__content image">
        <div class="transitionmodal__text">
          <slot name="title"></slot>
          <slot name="paragraph"></slot>
        </div>
        <picture>
          <slot name="image"></slot>
        </picture>
        <div class="guidemodal__buttons">
          <button
            @click="closeModal()"
            class="cancel"
            v-if="showSecondaryButton"
          >
            Not now
          </button>
          <button @click="actionButtonOne()" class="confirm">
            {{ primaryButtonText }}
          </button>
        </div>
      </div>
    </b-modal>
  </section>
</template>
<script>
export default {
  name: "BaseModal",
  components: {},
  props: {
    isComponentModalActive: {
      type: Boolean,
      default: false,
    },
    actionButtonOne: {
      type: Function,
      default: () => {},
    },
    type: {
      type: String,
      default: "default",
    },
    shortcuts: {
      type: [Array, Object],
      default: () => [],
    },
    closeModal: {
      type: Function,
      default: () => {},
    },
    cancel: {
      type: Array,
      default: () => ["escape", "x", "outside"],
    },
    showSecondaryButton: {
      type: Boolean,
      default: true,
    },
    primaryButtonText: {
      type: String,
      default: "Let's start",
    },
    height: {
      type: String,
      default: "35rem",
    },
    width: {
      type: String,
      default: "40rem",
    },
  },
  computed: {
    updatedIsComponentModalActive: {
      get() {
        return this.isComponentModalActive;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
};
</script>

<style scoped>
.card {
  min-width: 40rem;
  max-height: 35rem;
  overflow-y: scroll;
}
.header {
  background: #f6f6f9;
  border-radius: 19px 19px 0px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75rem 0.5rem;
  justify-content: space-between;
}
.header .title {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 14px;
  color: #32324d;
  margin: auto;
}
.header button {
  border-radius: 100px;
  height: 30px;
  width: 30px;
  background: white;
  border: 1px solid #dcdce4;
}
.header button:hover {
  background: #dcdce4;
}
.body {
  width: 100%;
}
.shortcutsContainer {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  padding: 1.5rem 0;
}
.shortcutsGroup {
  display: flex;
  flex-direction: column;
  margin-right: 2rem;
  max-width: 45%;
}
.shortcutsGroup:first-child {
  margin-left: 2rem;
}
h2 {
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 1rem;
}
.shortcutList {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.25rem;
}
.shortcutList .name {
  width: auto;
  font-weight: 500;
  font-size: 0.8rem;
  line-height: 20px;
}
.keyboardGroup {
  margin-left: 1rem;
}
.keyboard {
  background: #ffffff;
  border: 0.5px solid #8e8ea9;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 0.1em 0.5em 0.1em 0.5em;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  color: #32324d;
  text-align: center;
}
.plus {
  margin: 0 0.2em;
}
/*MODAL*/
.transitionmodal {
  position: fixed;
  top: 0;
  left: 0;
  width: 0vw;
  height: 100vh;
  overflow: hidden;
  z-index: 999;
}
.transitionmodal.show {
  width: 100vw;
}
.transitionmodal__bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
}
.transitionmodal__content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0%;
  height: 60%;
  overflow: hidden;
  background-color: #fff;
  border-radius: 1rem;
  padding: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  flex-direction: row;
}
.transitionmodal.show .transitionmodal__content {
  width: 80%;
  padding: 2rem;
}
.transitionmodal__text {
  padding: 0 3rem;
}
.transitionmodal__text h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.transitionmodal__text p {
  color: #aaa;
  font-size: 1rem;
}
.transitionmodal__content picture {
  position: relative;
  border-radius: 1rem;
  width: 90%;
  height: 40%;
  display: flex;
  overflow: hidden;
}
.transitionmodal__content picture img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.snippet__container {
  display: grid;
  place-items: center;
  padding: 3rem 3rem 0 0;
}
.guidemodal__content {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 28rem;
  height: 100%;
  border-radius: 1rem;
  padding: 3rem 1rem;
  text-align: center;
}
.guidemodal__buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  margin-top: 2rem;
  padding: 0 3rem;
}
.guidemodal__buttons .cancel {
  background: transparent;
  border: none;
  text-decoration: underline;
  color: #aaa;
}
.guidemodal__buttons .confirm {
  background: #f00b81;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
@media screen and (max-width: 480px) {
  .card {
    width: 90%;
  }
}
</style>
