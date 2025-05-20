<template>
  <BaseModal
    :isComponentModalActive="modal"
    :closeModal="
      () =>
        handleModal(
          this.openModal === 'infoModal' ? 'infoModal' : 'errorModal',
          false
        )
    "
  >
    <div slot="icon" class="is-flex infoIcon">
      <IconInfoWithoutBackground
        v-if="openModal === 'infoModal'"
        class="icon is-large color-4"
      />
      <IconError
        v-if="openModal === 'errorModal'"
        class="icon is-large color-danger"
      />
      <span class="iconText">{{
        openModal === "infoModal" ? "INFO" : "Ups"
      }}</span>
    </div>
    <div slot="paragraph" class="infoParagraph">
      <span>{{ message }}</span>
    </div>
    <div slot="buttons" class="is-flex w-100 updateModalButtons">
      <BaseButton
        v-if="openModal === 'errorModal'"
        :disabled="loading"
        @click="handleModal('errorModal', false)"
        action="secondary"
        size="large"
        class="mr-2"
      >
        <p slot="text" class="updateModalButton">Cancel</p>
      </BaseButton>
      <BaseButton
        v-if="openModal === 'infoModal'"
        :disabled="loading"
        @click="action('only')"
        action="blue"
        size="large"
        class="mr-2"
      >
        <p slot="text" class="updateModalButton">Update only this service</p>
      </BaseButton>
      <BaseButton
        v-if="openModal === 'infoModal'"
        :disabled="loading"
        @click="action('all')"
        action="principal"
        size="large"
        class="ml-2"
      >
        <p slot="text" class="updateModalButton">Update all services dates</p>
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ServicesUpdateDateModals",
  data() {
    return {
      modal: false,
    };
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
    }),
  },
  props: {
    openModal: {
      type: String,
      required: true,
    },
    action: {
      type: Function,
      default: () => {},
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    handleOpenModal: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    handleModal(key, value = false) {
      this.modal = value;
      if (value) {
        this.$store.dispatch("utils/setModalOpenName", `services${key}`);
      }
      if (!value) {
        this.$store.dispatch("utils/setModalOpenName", "");
        this.handleOpenModal("");
      }
    },
  },
  watch: {
    openModal(newValue) {
      if (newValue !== "") {
        this.handleModal(newValue, true);
      }
      if (newValue === "") {
        this.handleModal(newValue, false);
      }
    },
  },
};
</script>
<style>
.infoIcon {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.iconText {
  font-weight: 700;
  font-size: 30px;
  line-height: 40px;
}
.infoParagraph {
  max-width: 40rem;
  margin: auto;
}
.infoParagraph > span {
  font-size: 16px;
  line-height: 35px;
}
.updateModalButtons {
  justify-content: space-evenly;
}
.updateModalButtons .updateModalButton {
  padding: 0 4rem;
}
</style>
