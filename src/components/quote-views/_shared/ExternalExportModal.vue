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
        <h1 class="header_title" style="text-align: left; width: 100%">
          Status Change And Export
        </h1>
        <p class="has-text-left w-100">
          After the confirmation your quote will be exported to:
        </p>
      </header>
      <div class="external_export_modal__options mt-5">
        <div class="is-flex is-justify-content-center mb-4">
          <b-radio
            v-for="externalSource in constants.EXTERNAL_SOURCES"
            v-model="selectedExternalSource"
            :key="externalSource.id"
            name="name"
            :native-value="externalSource.id"
            :class="[
              selectedExternalSource === externalSource.id ? 'active' : '',
              'card__content is-flex is-justify-content-center w-50',
            ]"
          >
            {{ externalSource.name }}
          </b-radio>
        </div>
        <span
          ><strong>Note: </strong>The export will be ready in 10 to 15min after
          confirming</span
        >
      </div>
      <div slot="buttons" class="is-flex is-justify-content-center mt-5">
        <BaseButton
          @click="closeModal"
          action="secondary"
          size="medium"
          :disabled="loading"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="() => onExternalExportContinue(selectedExternalSource)"
          action="tercery"
          size="medium"
          :disabled="loading || selectedExternalSource === null"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </div>
  </b-modal>
</template>
<script>
import {
  EXTERNAL_SOURCES,
  EXTERNAL_SOURCES_IDS,
} from "@/constants/exportConfig";

export default {
  name: "ExternalExportModal",
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    onExternalExportContinue: {
      type: Function,
      default: () => {},
    },
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isOpen: this.isModalOpen,
      selectedExternalSource: EXTERNAL_SOURCES_IDS.OPPEN,
      constants: {
        EXTERNAL_SOURCES,
      },
    };
  },
  watch: {
    isModalOpen(newValue) {
      this.isOpen = newValue;
      if (!newValue) {
        this.selectedExternalSource = EXTERNAL_SOURCES_IDS.OPPEN;
      }
    },
  },
};
</script>
<style scoped>
.external_export_modal__container {
  background-color: #fff;
  border-radius: 1rem;
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
