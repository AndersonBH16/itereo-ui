<template>
  <section>
    <GlobalEvents @keydown.alt.78="keymap" />
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :overlay="true"
      :right="true"
      v-model="open"
      class="sidebarRight newQuoteSidebar"
    >
      <div class="topCloseSideBar is-flex pr-5 p-2">
        <a @click="open = false" class="is-flex color-8">
          <IconChevronLeft class="icon is-small mr-2" />
          <span class="color-4 has-text-weight-medium">New Quote</span>
        </a>
        <a @click="open = false" class="color-8 sideBarCloseButton">
          <IconClose class="icon is-small" />
        </a>
      </div>
      <div class="p-5 SideBarBox">
        <p>Congratulations! Select one of the options to start creating it.</p>
        <div :class="focusedGuideBoxClass('newQuoteSidebarDiv mt-5 p-3', 2)">
          <div class="columns">
            <div class="column">
              <b-navbar-item
                tag="router-link"
                :to="{
                  path: constants.paths.BASIC_INFO.path,
                  query: { type: 'quote' },
                }"
                class="p-0"
                :data-test-id="
                  constants.DATA_TEST_ID_VALUES.NEW_QUOTE_BUTTON_SCRATCH
                "
              >
                <div
                  class="new_quote__link"
                  style="width: 100%"
                  @click="
                    ($event) => {
                      nextStep();
                      onLinkClick($event);
                    }
                  "
                >
                  SCRATCH
                </div>
              </b-navbar-item>
            </div>
            <div class="column">
              <b-navbar-item
                tag="router-link"
                class="p-0"
                :to="{
                  path: constants.paths.BASIC_INFO.path,
                  query: { type: constants.ITINERARY_TYPES.MODULE.type },
                }"
                :data-test-id="
                  constants.DATA_TEST_ID_VALUES.NEW_QUOTE_BUTTON_MODULE
                "
              >
                <div class="new_module__link w-100" @click="onLinkClick">
                  MODULE
                </div>
              </b-navbar-item>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-navbar-item
                tag="router-link"
                :to="{
                  path: constants.paths.BASIC_INFO.path,
                  query: { type: constants.ITINERARY_TYPES.TEMPLATE.type },
                }"
                :data-test-id="
                  constants.DATA_TEST_ID_VALUES
                    .NEW_QUOTE_BUTTON_EXAMPLE_ITINERARY
                "
              >
                <div class="new_itinerary__link w-100" @click="onLinkClick">
                  EX. ITINERARY
                </div>
              </b-navbar-item>
            </div>
            <div class="column">
              <b-navbar-item
                tag="router-link"
                :to="{
                  path: constants.paths.BASIC_INFO.path,
                  query: { type: constants.ITINERARY_TYPES.EXPERIENCE.type },
                }"
                :data-test-id="
                  constants.DATA_TEST_ID_VALUES.NEW_QUOTE_BUTTON_EXPERIENCE
                "
              >
                <div class="new_experience__link w-100" @click="onLinkClick">
                  EXPERIENCE
                </div>
              </b-navbar-item>
            </div>
          </div>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>

<script>
import GlobalEvents from "vue-global-events";
import { mapGetters } from "vuex";
import { PATH_INFO } from "@/router/path";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { ITINERARY_TYPES } from "@/constants/itinerary";

export default {
  name: "NewQuoteSideBar",
  components: {
    GlobalEvents,
  },
  data() {
    return {
      open: false,
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: false,
      constants: {
        paths: { ...PATH_INFO },
        DATA_TEST_ID_VALUES,
        ITINERARY_TYPES,
      },
    };
  },
  watch: {
    isShowSideBar(newValue) {
      this.open = newValue;
    },
    open(newValue) {
      this.setShowSideBar(newValue);
    },
  },
  computed: {
    ...mapGetters({
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      isShowSideBar: "utils/isShowSideBar",
    }),
  },
  beforeDestroy() {
    this.setShowSideBar(false);
  },
  methods: {
    keymap(e) {
      e = e || window.event;
      const code = e.which || e.keyCode;
      switch (code) {
        case 78:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
      this.open = !this.open;
    },
    setShowSideBar(value) {
      this.$store.dispatch("utils/setShowSideBar", value);
    },
    resetCurrentItinerary() {
      this.$store.dispatch("itineraryDays/resetItineraryDays");
      this.$store.dispatch("itinerary/resetCurrentItinerary");
      this.$store.dispatch("itinerary/resetPaxPrices");
      this.$store.dispatch("assets/resetAssetsData");
      this.$store.dispatch("request/resetRequestState");
    },
    onLinkClick(event) {
      if (!event.ctrlKey) {
        this.resetCurrentItinerary();
        this.setShowSideBar(false);
      }
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
@media screen and (max-width: 480px) {
  .b-sidebar.sidebarRight.newQuoteSidebar .sidebar-content {
    width: 100% !important;
  }
  .topCloseSideBar {
    width: 100%;
  }
  .newQuoteSidebarDiv .navbar-item {
    padding: 0rem;
  }
}
</style>
