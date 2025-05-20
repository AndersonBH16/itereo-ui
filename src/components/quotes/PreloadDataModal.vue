<template>
  <BaseModal
    :isComponentModalActive="displayModal"
    :height="'38rem'"
    :width="'22rem'"
  >
    <span slot="title">
      <h3>{{ preloadedTemplateInfo.name }}</h3>
    </span>
    <span slot="paragraph">
      <p class="my-4">
        When this Trip would
        <span class="has-text-weight-semibold">start</span>?
      </p>
      <div style="pointer-events: none">
        <BaseDatePicker
          placeholder="Start date"
          :value="preloadedTemplateInfo.start_date"
          size="medium"
          class="field"
        />
      </div>
      <BaseDatePickerByRange
        class="mt-2"
        inline
        placeholder="Select a date..."
        size="is-small"
        v-model="preloadedTemplateInfo.start_date"
      >
      </BaseDatePickerByRange>
    </span>
    <div slot="buttons" class="is-flex">
      <BaseButton
        @click="displayModal = false"
        action="secondary"
        size="medium"
        class="mr-4"
      >
        <p slot="text">Close modal</p>
      </BaseButton>
      <BaseButton
        @click="
          displayModal = false;
          handleDuplicate(preloadedTemplateInfo);
        "
        action="tercery"
        size="medium"
        :data-test-id="
          constants.DATA_TEST_ID_VALUES.EX_ITINERARY_CUSTOMIZE_BUTTON_CONFIRM
        "
      >
        <p slot="text">Continue</p>
      </BaseButton>
    </div>
  </BaseModal>
</template>
<script>
import BaseModal from "@/components/base-ui/BaseModal.vue";
import BaseDatePicker from "@/components/base-ui/BaseDatePicker.vue";
import BaseDatePickerByRange from "@/components/base-ui/BaseDatePickerByRange.vue";
import BaseButton from "@/components/base-ui/BaseButton.vue";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "PreloadDataModal",
  components: {
    BaseModal,
    BaseDatePicker,
    BaseDatePickerByRange,
    BaseButton,
  },
  props: {
    showPreloadTemplateInfoModal: {
      type: Boolean,
      default: false,
    },
    preloadedTemplateInfo: {
      type: Object,
      default: () => {},
    },
    handleDuplicate: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: {
        DATA_TEST_ID_VALUES,
      },
    };
  },
  computed: {
    displayModal: {
      get() {
        return this.showPreloadTemplateInfoModal;
      },
      set(value) {
        this.$emit("update:showPreloadTemplateInfoModal", value);
      },
    },
    preloadedData: {
      get() {
        return this.preloadedTemplateInfo;
      },
      set(value) {
        this.$emit("update:preloadedTemplateInfo", value);
      },
    },
  },
};
</script>
