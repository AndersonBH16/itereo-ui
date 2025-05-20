<template>
  <b-navbar v-scroll="{ className: 'navbar_main__fixed', threshold: 50 }">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: paths.HOME.path }">
        <picture class="navbar_main__logo">
          <img src="/img/logo-degradient.svg" alt="Logo" />
        </picture>
      </b-navbar-item>
    </template>
    <template #start>
      <div
        v-if="historyView.isActive && itinerary.data"
        class="history__header__container"
      >
        <div>
          <p
            class="history__view__opener"
            @click="() => setItineraryHistoryModal(true)"
          >
            <IconInfo class="icon color-8 is-xsmall" /> Quote History
          </p>
          <b-taglist attached class="mb-0 is-relative">
            <b-tag
              type="is-dark"
              class="mt-2 mr-2"
              style="border-radius: 0.25rem"
            >
              Version
              <strong style="color: #fff">{{ itinerary.data.version }}</strong>
            </b-tag>
            <b-tag
              rounded
              type="is-dark"
              class="mb-0"
              style="background-color: #444"
            >
              {{ itinerary.data.edition.user.name }} -
              <strong style="color: #fff">{{
                getItineraryEditionDatetime(itinerary.data)
              }}</strong>
            </b-tag>
          </b-taglist>
        </div>
      </div>
    </template>
    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons navbar_links__list">
          <b-navbar-item
            tag="router-link"
            :to="{ path: paths.REQUESTS.path }"
            class="has-text-weight-semi-bold is-6 grey-principal pb-0 is-relative"
          >
            <b-tag
              type="is-dark"
              style="
                position: absolute;
                top: -1.5rem;
                right: -1rem;
                padding: 0.25rem;
              "
            >
              New!
            </b-tag>
            Requests
          </b-navbar-item>

          <hr />

          <b-navbar-item
            v-if="showQuotesNavlink"
            tag="router-link"
            :to="{ path: paths.QUOTES.path }"
            class="has-text-weight-semi-bold is-6 grey-principal pb-0"
            >Quotes</b-navbar-item
          >

          <b-navbar-item
            v-if="showExperiencesNavlink"
            tag="router-link"
            :to="{ path: paths.EXPERIENCES.path }"
            class="has-text-weight-semi-bold is-6 grey-principal pb-0 is-relative"
          >
            {{ paths.EXPERIENCES.name }}
          </b-navbar-item>

          <b-navbar-item
            v-if="showItinerariesNavlink"
            tag="router-link"
            :to="{ path: paths.ITINERARIES.path }"
            class="has-text-weight-semi-bold is-6 grey-principal pb-0"
            >{{ paths.ITINERARIES.name }}</b-navbar-item
          >

          <hr />

          <b-navbar-item
            v-if="showNewQuoteNavlink"
            tag="router-link"
            :to="{ path: paths.REQUESTS_CREATION.path }"
            class="has-text-weight-semi-bold is-6 grey-principal pb-0"
          >
            <b-tag
              type="is-dark"
              style="
                position: absolute;
                top: -1.5rem;
                right: -1rem;
                padding: 0.25rem;
              "
            >
              New!
            </b-tag>
            <span @click="resetCurrentItinerary"> + New Request </span>
          </b-navbar-item>

          <b-navbar-item
            v-if="showNewQuoteNavlink"
            tag="router-link"
            :to="getCurrentLocation()"
            class="has-text-weight-semi-bold is-6 grey-principal pb-0"
            :data-test-id="constants.DATA_TEST_ID_VALUES.NEW_QUOTE_LINK"
            ><span @click="openQuoteSidebar">+ New Quote</span>
          </b-navbar-item>

          <b-tooltip
            position="is-bottom"
            label="Clear cache and hard refresh"
            type="is-warning"
          >
            <button
              style="background-color: transparent; border: none"
              @click="onHardRefreshClick"
            >
              <IconCacheRefresh class="icon color-9" />
            </button>
          </b-tooltip>
          <b-navbar-item @click="handleLogout" class="navbar_main__logout"
            >Logout</b-navbar-item
          >
          <b-dropdown
            position="is-bottom-left"
            append-to-body
            aria-role="menu"
            class="navbar_main__profile"
          >
            <template #trigger>
              <a class="avatar-box mr-3" role="button">
                <span class="name mr-2">{{ userData.name }} </span>
                <picture class="navbar_main__avatar">
                  <img
                    class="avatar is-rounded"
                    src="/img/user-avatar.png"
                    alt="Profile avatar"
                  />
                  <ProUserSign v-if="isProUser" />
                </picture>
              </a>
            </template>
            <b-dropdown-item>
              <b-navbar-item
                tag="router-link"
                :to="{ path: paths.PROFILE.path }"
              >
                Profile
              </b-navbar-item>
            </b-dropdown-item>
            <b-dropdown-item v-if="canViewReportsLink">
              <b-navbar-item
                tag="router-link"
                :to="{ path: paths.REPORTS.path }"
                class="is-relative"
              >
                <b-tag
                  type="is-dark"
                  style="
                    position: absolute;
                    top: -1rem;
                    right: 2rem;
                    padding: 0.25rem;
                  "
                >
                  New!
                </b-tag>
                Reports
              </b-navbar-item>
            </b-dropdown-item>
            <b-dropdown-item @click="redirectToResetPassword">
              Change password
            </b-dropdown-item>
            <hr class="dropdown-divider" />
            <b-dropdown-item @click="handleLogout">Logout</b-dropdown-item>
          </b-dropdown>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";
import ProUserSign from "./ProUserSign.vue";
import { PATH_INFO } from "@/router/path";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { USER_ROLE } from "@/constants";
import helpers from "@/helpers";
import { datesHelper } from "@/utils/dates";

export default {
  name: "NavbarMain",
  props: {
    showLogo: {
      type: Boolean,
      default: true,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      paths: { ...PATH_INFO },
      constants: { DATA_TEST_ID_VALUES },
    };
  },
  computed: {
    ...mapGetters({
      authData: "auth/getAuthData",
      historyView: "utils/getHistoryView",
      datesFormat: "itinerary/getDatesFormat",
      itinerary: "itinerary/getItinerary",
    }),
    userData() {
      return this.authData.user;
    },
    isProUser() {
      return this.authData.user_type.name === "pro";
    },
    hasViewNewExperienceLinkPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    showExperiencesNavlink() {
      return (
        this.hasViewNewExperienceLinkPermission && !this.historyView.isActive
      );
    },
    showItinerariesNavlink() {
      return !this.historyView.isActive;
    },
    showQuotesNavlink() {
      return !this.historyView.isActive;
    },
    showNewQuoteNavlink() {
      return !this.historyView.isActive;
    },
    canViewReportsLink() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
  },
  methods: {
    resetCurrentItinerary() {
      this.$store.dispatch("itineraryDays/resetItineraryDays");
      this.$store.dispatch("itinerary/resetCurrentItinerary");
      this.$store.dispatch("itinerary/resetPaxPrices");
      this.$store.dispatch("assets/resetAssetsData");
      this.$store.dispatch("request/resetRequestState");
      this.$store.dispatch("request/resetQuoteToLinkToRequest");
    },
    async getItineraryHistory(payload = null) {
      this.setLoading(true);
      await this.$store.dispatch("itinerary/getItineraryHistory", payload);
      this.setLoading(false);
    },
    setItineraryHistoryModal(newValue = false) {
      this.$store.dispatch("utils/setHistoryView", {
        historyView: {
          isModalOpen: newValue,
        },
      });
      if (newValue) this.getItineraryHistory();
    },
    getItineraryEditionDatetime(itinerary) {
      return `${datesHelper.getDatetimeFromUTC(
        itinerary.updated_date,
        this.datesFormat
      )}`;
    },
    getCurrentLocation() {
      return {
        path: this.$route.path,
        query: this.$route.query,
      };
    },
    openQuoteSidebar() {
      this.$store.dispatch("utils/setShowSideBar", true);
    },
    redirectToResetPassword() {
      this.$router.push({ path: PATH_INFO.SEND_RESET_PASSWORD.path });
    },
    async handleLogout() {
      await this.$store.dispatch("auth/logout", { redirect: true });
      this.$store.dispatch("utils/hardRefresh", {
        refreshAuthData: false,
      });
    },
    onHardRefreshClick() {
      this.$store.dispatch("utils/hardRefresh", {
        refreshAuthData: true,
      });
    },
  },
  components: { ProUserSign },
};
</script>
<style>
a:hover {
  color: var(--info-color) !important;
}
.navbar_main__avatar {
  position: relative;
  max-height: 2.5rem;
  max-width: 2.5rem;
  display: inline-block;
}
.navbar_main__avatar > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.navbar_links__list .sign__container {
  bottom: -0.75rem;
  /* left: -25%; */
  transform: translateX(-20%);
}
.navbar_main__logo {
  width: 8rem;
  max-width: 8rem;
  height: 2.5rem;
  max-height: 2.5rem;
  object-fit: cover;
  display: flex;
}
.navbar_main__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.navbar_links__list {
  gap: 1.5rem;
}
.navbar_links__list hr {
  height: 1rem;
  width: 1px;
  background-color: #444;
}
.navbar_links__list .router-link-active {
  font-weight: 700;
}
.navbar_main__logout {
  display: none;
}
@media screen and (max-width: 480px) {
  .navbar,
  .navbar-brand {
    padding: 0;
  }
  .navbar-brand {
    width: 100%;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
  }
  .navbar_main__logo {
    width: 6rem;
    max-width: 6rem;
    height: 1.8rem;
    max-height: 1.8rem;
  }
  .navbar_links__list {
    flex-direction: column;
    row-gap: 1rem;
    padding: 0.25rem 0 0rem;
  }
  .navbar-menu {
    border-radius: 1rem;
    position: fixed;
    right: 2rem;
    top: 5.5rem;
  }
  .navbar_links__list .navbar-item {
    padding: 0 0.75rem;
  }
  .clear_cache__button,
  .navbar_main__profile {
    display: none;
  }
  .navbar_main__fixed {
    position: fixed !important;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    min-height: 4rem;
    height: 4rem;
    background-color: #fff !important;
  }
  .navbar_main__fixed .navbar-menu {
    top: 4rem;
    right: 1rem;
  }
  .navbar_main__fixed .navbar-brand {
    padding: 0rem 1rem;
  }
  .navbar-brand .navbar-item {
    padding: 0;
  }
  .navbar_main__logout {
    display: block;
    padding: 0rem !important;
    text-align: center !important;
  }
}
</style>
