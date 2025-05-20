<template>
  <div
    class="sidebar-page"
    v-scroll="{ className: 'navbar_secondary__fixed', threshold: 50 }"
    :is-reduced="reduceNavbarSecondary"
  >
    <GlobalEvents
      @keydown.alt.49="keymap"
      @keydown.alt.50="keymap"
      @keydown.alt.51="keymap"
      @keydown.alt.52="keymap"
      @keydown.alt.53="keymap"
      @keydown.alt.54="keymap"
      @keydown.alt.81="keymap"
    />
    <section class="sidebar-layout sidebar-secondary-nav">
      <b-sidebar
        position="static"
        :mobile="mobile"
        :expand-on-hover="expandOnHover"
        :reduce="reduceNavbarSecondary"
        open
      >
        <div class="sidebar_container">
          <div class="nav-sidebar-logo is-flex is-justify-content-center">
            <b-switch class="button-nav-sidebar" @input="toggleNavbarSecondary">
              <b-tooltip position="is-right" class="tooltipMenu">
                <IconChevronRight class="icon is-small color-10" />
                <template v-slot:content>
                  <span class="show-ismini">Show menu detail</span>
                  <span class="hide-ismini">Hide menu detail</span>
                </template>
              </b-tooltip>
            </b-switch>
          </div>

          <b-menu class="is-custom-mobile secondary-nav">
            <b-menu-list>
              <div
                v-for="(tab, index) in allowedTabs"
                :key="index"
                :class="
                  tab.step ? focusedGuideBoxClass('', tab.step, true) : ''
                "
                @click="tab.step ? nextStep() : null"
              >
                <b-navbar-item
                  tag="router-link"
                  :to="getToPath(tab)"
                  :title="tab.title"
                  :data-test-id="
                    constants.DATA_TEST_ID_VALUES.NAVBAR_SECONDARY_LINK
                  "
                  :disabled="tab.isDisabled"
                >
                  <div
                    :class="
                      'step-number' + (index === 0 ? ' step-line-none' : '')
                    "
                  >
                    <span class="step-number-circle">{{ index + 1 }}</span>
                  </div>
                  <div v-if="!reduceNavbarSecondary" class="step-title">
                    {{ tab.title }}
                  </div>
                </b-navbar-item>
              </div>
            </b-menu-list>
          </b-menu>
        </div>
      </b-sidebar>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GlobalEvents from "vue-global-events";
import { QUOTE_SUB_ROUTES, PATH_INFO } from "@/router/path";
import { KEYBOARD_KEYS } from "@/constants/shortcuts";
import { SHORTCUT_ROUTE_MAP } from "@/constants/utils";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "NavbarSecondary",
  components: {
    GlobalEvents,
  },
  data() {
    return {
      constants: { DATA_TEST_ID_VALUES },
      expandOnHover: false,
      mobile: "reduce",
      reduce: false,
      paths: { ...PATH_INFO },
    };
  },
  computed: {
    ...mapGetters({
      reduceNavbarSecondary: "itinerary/getReduceNavbarSecondary",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      authData: "auth/getAuthData",
      itinerary: "itinerary/getItinerary",
      historyView: "utils/getHistoryView",
    }),
    itineraryId() {
      return this.$route.query.itinerary || this.itinerary.data?.id || "";
    },
    allowedTabs() {
      if (!this.authData) return [];
      const tabs = [
        {
          display: true,
          name: "information",
          to: this.historyView.isActive
            ? PATH_INFO.HISTORY_BASIC_INFO.path
            : PATH_INFO.BASIC_INFO.path,
          title: "Basic Information",
          step: null,
          isDisabled: false,
        },
        {
          display: true,
          name: "services",
          to: this.historyView.isActive
            ? PATH_INFO.HISTORY_SERVICES.path
            : PATH_INFO.SERVICES.path,
          title: "Services",
          step: null,
          isDisabled: !this.itinerary.data?.id,
        },
        {
          display: true,
          name: "itinerary",
          to: this.historyView.isActive
            ? PATH_INFO.HISTORY_ITINERARY.path
            : PATH_INFO.ITINERARY.path,
          title: "Itinerary",
          step: 32,
          isDisabled: !this.itinerary.data?.id,
        },
        {
          display: !this.historyView.isActive,
          name: "book",
          to: this.historyView.isActive
            ? PATH_INFO.BOOK.path
            : PATH_INFO.BOOK.path,
          title: "Book",
          step: null,
          isDisabled: !this.itinerary.data?.id,
        },
        {
          display: true,
          name: "export",
          to: this.historyView.isActive
            ? PATH_INFO.HISTORY_EXPORT.path
            : PATH_INFO.EXPORT.path,
          title: "Export",
          step: null,
          isDisabled: !this.itinerary.data?.id,
        },
        {
          display: true,
          name: "pax",
          to: this.historyView.isActive
            ? PATH_INFO.HISTORY_PAX_INFO.path
            : PATH_INFO.PAX_INFO.path,
          title: "Pax Information",
          step: null,
          isDisabled: !this.itinerary.data?.id,
        },
      ];
      return tabs.filter(
        (tab) =>
          this.authData.user_type.restrictions.tabs[tab.name] && tab.display
      );
    },
  },
  methods: {
    getToPath(route) {
      const initialToPath = {
        path: route.to,
        query: this.itineraryId ? { itinerary: this.itineraryId } : {},
      };
      if (this.historyView.isActive) {
        initialToPath.query.version = this.historyView.version;
      }
      return initialToPath;
    },
    async keymap(e) {
      e = e || window.event;
      const code = e.which || e.keyCode;
      const isShortcutToNavigate = [
        KEYBOARD_KEYS.NUM_1,
        KEYBOARD_KEYS.NUM_2,
        KEYBOARD_KEYS.NUM_3,
        KEYBOARD_KEYS.NUM_4,
        KEYBOARD_KEYS.NUM_5,
        KEYBOARD_KEYS.NUM_6,
        KEYBOARD_KEYS.KEY_Q,
      ].includes(code);

      const isInQuoteView = QUOTE_SUB_ROUTES.includes(this.$route.path);
      const isKeyInExceptions = [KEYBOARD_KEYS.KEY_AT].includes(e.key);

      if (isShortcutToNavigate && isInQuoteView && !isKeyInExceptions) {
        e.preventDefault();
        e.stopPropagation();
        return this.redirectToTabByShortcut(code);
      }
    },
    redirectToTabByShortcut(code = null) {
      return this.$router.push({
        path: SHORTCUT_ROUTE_MAP[code],
        query: { itinerary: this.itineraryId },
      });
    },
    toggleNavbarSecondary(value) {
      this.$store.commit("itinerary/SET_REDUCE_NAVBAR_SECONDARY", value);
    },
    focusedGuideBoxClass(classDefault, step, bgWhite = false) {
      const bgWhiteClass = bgWhite ? "bg-white" : "";
      return this.isUserGuideActive && this.userGuideStep === step
        ? `${classDefault} is-guide-step ${bgWhiteClass}`
        : classDefault;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
  },
};
</script>
<style>
.b-sidebar .sidebar-content.is-mini {
  width: 70px;
}
.sidebar_container {
  /* height: auto;
  position: fixed;
  z-index: 0;
  left: 4rem; */
}
.sidebar_container > .secondary-nav {
  height: auto;
}
.sidebar-page {
  padding-top: 1rem;
}
.sidebar-page[is-reduced="true"] {
  padding-top: 0rem;
}
.sidebar-page[is-reduced="true"] .logo-sidebar-nav {
  width: 4rem !important;
}
.navbar_secondary__fixed .sidebar_container {
  top: 2rem;
}
@media screen and (max-width: 480px) {
  .sidebar_container,
  .navbar_secondary__fixed .sidebar_container {
    position: relative;
    top: 0rem;
  }

  .sidebar-page {
    padding-top: 0rem;
  }
  .nav-sidebar-logo {
    display: none !important;
  }
  .b-sidebar .sidebar-content.is-mini-mobile {
    width: 100%;
  }
  .sidebar_container .menu-list {
    display: flex;
    width: 100%;
    overflow: auto;
    display: flex;
    align-items: center;
    padding: 0.5rem 0 0.75rem;
  }
  .sidebar_container .menu-list a {
    align-items: center;
    width: 10rem;
    text-align: left;
    justify-content: center;
    padding: 0 1rem;
  }
  .secondary-nav .menu-list .navbar-item .step-number {
    margin-right: 0.5rem;
    position: relative;
  }
  .secondary-nav .menu-list .navbar-item .step-number:before {
    display: none;
  }
  .secondary-nav .menu-list .navbar-item .step-title {
    font-size: 0.8rem;
  }
  .secondary-nav .menu-list > div:not(:last-of-type) .navbar-item:after {
    content: "";
    position: absolute;
    top: 40%;
    right: 0.25rem;
    transform: translateY(-50%);
    border: solid #1d3b83;
    border-width: 0 3px 3px 0;
    padding: 5px;
    transform: rotate(-45deg);
  }
  .sidebar-secondary-nav {
    border-bottom: 1px solid #eee;
  }
  .blnavsecondary {
    border-left: 0px;
  }
  .navbar_secondary__fixed {
    position: fixed !important;
    top: 4rem;
    left: 0;
    z-index: 9;
    width: 100%;
    overflow-x: auto;
    background-color: #fff;
  }
}
</style>
