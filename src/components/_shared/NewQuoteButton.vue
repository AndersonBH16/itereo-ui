<template>
  <section>
    <BaseButton
      size="large"
      @click="
        nextStep();
        openQuoteSidebar();
      "
      action="tercery"
      :class="focusedGuideBoxClass('is-pulled-right', 1)"
    >
      <IconPlus slot="icon" class="icon is-small" />
      <p
        slot="text"
        :data-test-id="constants.DATA_TEST_ID_VALUES.NEW_QUOTE_BUTTON"
      >
        New Quote
      </p>
    </BaseButton>
    <GuideBox
      title="Creating a new quote"
      description="Let´s open the sidebar, for that click on 'New Quote' to continue"
      :showNextButton="false"
      :step="1"
      :positionX="150"
      :positionY="-50"
    />
    <GuideBox
      title="Creating a new quote"
      description="As you can see, we can create a quote in 3 different ways, to create a quote from scratch, click on 'SCRATCH'"
      :step="2"
      :overlay="false"
      :showNextButton="false"
      :positionX="-50"
      :positionY="-100"
    />
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import GuideBox from "./GuideBox.vue";
import { PATH_INFO } from "@/router/path";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "NewQuoteButton",
  components: {
    GuideBox,
  },
  data() {
    return {
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: false,
      constants: {
        paths: { ...PATH_INFO },
        DATA_TEST_ID_VALUES,
      },
    };
  },
  computed: {
    ...mapGetters({
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
    }),
  },
  methods: {
    openQuoteSidebar() {
      this.$store.dispatch("utils/setShowSideBar", true);
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
    focusedGuideBoxClass(classDefault, step) {
      return this.isUserGuideActive && this.userGuideStep === step
        ? `${classDefault} is-guide-step`
        : classDefault;
    },
  },
};
</script>
<style>
.newQuoteExItinerary {
  width: 100%;
}
</style>
