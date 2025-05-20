<template>
  <BaseButton
    v-if="!hideElementByCondition && !disableQuoteByStatus"
    class="is-color4"
    @click.prevent="emitUpdateForm('saveService', true)"
    size="large"
    action="tercery"
    :disabled="loading || disableQuoteByStatus"
    :data-test-id="
      constants.DATA_TEST_ID_VALUES.ITINERARY_SERVICE_SIDEBAR_SAVE_BUTTON
    "
  >
    <i slot="icon" class="is-size mr-5">
      <BaseButtonLock v-if="disableQuoteByStatus" />
      <IconCheck v-else class="icon is-small" />
    </i>
    <p slot="text">Save</p>
  </BaseButton>
</template>

<script>
import { mapGetters } from "vuex";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "BottomButtonSaveSideBar",
  data() {
    return {
      constants: {
        DATA_TEST_ID_VALUES,
      },
    };
  },
  computed: {
    ...mapGetters({
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      loading: "utils/getLoading",
    }),
  },
  methods: {
    emitUpdateForm(key, value) {
      this.$emit("update", [key, value]);
    },
  },
};
</script>
