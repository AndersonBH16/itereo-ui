<template>
  <section class="request__nav">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center is-relative"
      style="margin-left: -1rem; gap: 0.5rem"
    >
      <div class="is-flex is-align-items-center" style="cursor: pointer">
        <b-button class="toggle__button" @click="toggleShowRequestQuotes">
          <b-icon
            :icon="showRequestQuotes ? 'chevron-down' : 'chevron-right'"
            size="is-medium"
            custom-size="mdi-24px"
          />
        </b-button>
        <b-tooltip :label="adaptedRequest.title" type="is-light">
          <h5
            @click="redirectToRequestEdition"
            class="request__tittle has-one-line-ellipsis"
            style="max-width: 8rem"
          >
            {{ adaptedRequest.title }}
          </h5>
        </b-tooltip>
      </div>

      <div class="is-flex is-align-items-center" style="gap: 0.5rem">
        <b-tooltip
          :label="adaptedRequest.stage.name"
          type="is-light"
          position="is-right"
        >
          <b-tag
            class="request_stage__tag"
            :style="`background-color: ${adaptedRequest.stage.color};width: 1.25rem;`"
            @click="toggleShowStageTag"
          >
            <span class="request_stage__tag">
              {{ adaptedRequest.stage.acronym }}
            </span>
          </b-tag>
        </b-tooltip>

        <b-tag
          type="is-dark"
          style="
            position: absolute;
            top: -1.25rem;
            right: -1.5rem;
            padding: 0.25rem;
          "
        >
          New!
        </b-tag>

        <b-button
          style="border-radius: 0.25rem; padding: 0rem 0.5rem; height: 1.75rem"
          @click="toggleIsRequestActionsPopupOpen(!isRequestActionsPopupOpen)"
        >
          <b-icon icon="dots-vertical" size="is-small" custom-size="mdi-18px" />
        </b-button>
        <b-message
          ref="popup"
          class="PopoverActions request_actions__container"
          title="Choose an Action"
          v-model="isRequestActionsPopupOpen"
          aria-close-label="Close message"
        >
          <div class="is-flex is-flex-direction-column is-align-items-center">
            <b-button
              class="is-block w-100 py-2"
              @click="
                () => {
                  toggleIsLinkToItineraryModalOpen(true);
                  toggleIsRequestActionsPopupOpen(false);
                }
              "
              style="font-size: 0.8rem; border-radius: 0.25rem; height: 2.5rem"
            >
              Select Quote(s)
            </b-button>
            <b-navbar-item
              :disabled="isNewQuoteButtondisabled"
              tag="router-link"
              :to="{
                path: constants.PATH_INFO.BASIC_INFO.path,
                query: { type: 'quote' },
              }"
              class="has-text-weight-semi-bold is-6 grey-principal py-2 w-100 text-center is-flex is-justify-content-center"
            >
              <span
                @click="
                  () => {
                    onNewQuoteClick();
                    toggleIsRequestActionsPopupOpen(false);
                  }
                "
                >+ New Quote</span
              >
            </b-navbar-item>
          </div>
        </b-message>
      </div>

      <!-- <b-select
        v-else
        v-model="adaptedRequest.stage.id"
        :class="`${adaptedRequest.stage.name} request_stage__select`"
        size="is-small"
        @change="() => {}"
      >
        <option
          v-for="stage in constants.REQUEST_STAGES_ARRAY"
          :value="stage.id"
          :key="stage.id"
        >
          {{ stage.name }}
        </option>
      </b-select> -->
    </div>
    <ul>
      <li
        v-for="quote in adaptedRequest.items"
        :key="quote.id"
        :class="`is-flex is-align-items-center is-justify-content-space-between my-2 request_item__container ${getRequestItemClass(
          quote
        )}`"
      >
        <b-tooltip :label="quote.title" type="is-light">
          <a
            :href="getQuoteLink(quote.id)"
            class="cursor quote__link has-one-line-ellipsis"
            style="cursor: pointer; max-width: 12rem"
          >
            <h6 class="has-one-line-ellipsis" style="max-width: 10rem">
              {{ quote.title }}
            </h6>
          </a>
        </b-tooltip>

        <b-tooltip
          :label="quote.status.name"
          type="is-light"
          position="is-right"
        >
          <b-tag
            :style="`background-color: ${quote.status.color};width: 1.25rem;`"
          >
            {{ quote.status.acronym }}
          </b-tag>
        </b-tooltip>
      </li>
    </ul>
    <div class="request__footer pl-5 mt-4">
      <LinkToItineraryModal
        :setLoading="setLoading"
        :requestToLink="adaptedRequest"
        :isLinkToItineraryModalOpen="isLinkToItineraryModalOpen"
        @update:isLinkToItineraryModalOpen="
          toggleIsLinkToItineraryModalOpen($event)
        "
      />
    </div>
  </section>
</template>

<script>
import { helper } from "@/utils/itinerary";
import { REQUEST_STAGES_ARRAY, REQUEST_STAGES } from "@/constants/itinerary";
import { PATH_INFO } from "@/router/path";
import { mapGetters } from "vuex";
import LinkToItineraryModal from "@/components/requests/LinkToItineraryModal.vue";

export default {
  name: "RequestNav",
  components: {
    LinkToItineraryModal,
  },
  props: {
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: {
        REQUEST_STAGES_ARRAY,
        PATH_INFO,
      },
      showRequestQuotes: true,
      showStageTag: true,
      isLinkToItineraryModalOpen: false,
      isRequestActionsPopupOpen: false,
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      formItinerary: "itinerary/getFormItinerary",
      request: "request/getRequest",
    }),
    adaptedRequest() {
      if (!this.request?.id) {
        return {
          title: "",
          stage: {},
          items: [],
        };
      }
      return {
        ...this.request,
        stage: helper.getFullRequestStage(this.request.stage.id),
        items: this.request.items.map((quote) => ({
          ...quote,
          status: helper.getFullQuoteStatus(quote.status.id),
          active: this.$route.query.itinerary === quote.id,
        })),
      };
    },
    isNewQuoteButtondisabled() {
      if (!this.request.id) return true;
      return [REQUEST_STAGES.WON.id, REQUEST_STAGES.LOST.id].includes(
        this.request.stage.id
      );
    },
  },
  methods: {
    toggleIsRequestActionsPopupOpen(newValue) {
      this.isRequestActionsPopupOpen = newValue;
    },
    toggleIsLinkToItineraryModalOpen(newValue) {
      this.isLinkToItineraryModalOpen = newValue;
    },
    getQuoteLink(quoteId) {
      const origin = window.location.origin;
      const url = `${origin}${PATH_INFO.BASIC_INFO.path}?itinerary=${quoteId}`;
      return url;
    },
    toggleShowRequestQuotes() {
      this.showRequestQuotes = !this.showRequestQuotes;
    },
    toggleShowStageTag() {
      this.showStageTag = !this.showStageTag;
    },
    getRequestItemClass(quote) {
      if (this.$route.path === PATH_INFO.REQUESTS_CREATION.path) return "show";
      if (quote.active) return "active";
      if (this.showRequestQuotes) return "show";
      return "";
    },
    resetCurrentQuote() {
      this.$store.dispatch("itinerary/resetItineraryAndRelatedData");
    },
    onNewQuoteClick() {
      this.resetCurrentQuote();
      this.validateAutofillByRequest();
    },
    updateformItinerary(key, value) {
      this.$store.dispatch("itinerary/udpateFormItineraryByKey", {
        key,
        value,
      });
    },
    generateCode() {
      this.$store.dispatch("itinerary/generateCode");
    },
    validateAutofillByRequest() {
      if (this.request?.id && !this.itinerary?.data?.id) {
        this.updateformItinerary("client_id", this.request.client.id);
        this.updateformItinerary("contract_id", this.request.contract.id);
        this.updateformItinerary("title", {
          ...this.formItinerary[0].title,
          value: `${this.request.title}`,
        });
        this.generateCode();
      }
    },
    redirectToRequestEdition() {
      if (this.$route.path === PATH_INFO.REQUESTS_CREATION.path) return;

      this.resetCurrentQuote();

      this.$router.push({
        path: PATH_INFO.REQUESTS_CREATION.path,
        query: { request: this.request.id },
      });
    },
  },
  // mounted() {
  // window.addEventListener("click", ($event) => {
  //   if ($event.target.className === "request_stage__tag" || this.showStageTag)
  //     return;
  //   if ($event.target.closest(".request_stage__select") === null) {
  //     this.showStageTag = true;
  //   }
  // });
  // },
  // beforeDestroy() {
  //   window.removeEventListener("click", () => {});
  // },
};
</script>

<style>
.request__nav {
  width: 12rem;
}
.request__tittle {
  font-size: 0.9rem;
  font-weight: 600;
}
.toggle__button {
  background-color: transparent;
  border: none;
  box-shadow: none !important;
}
.toggle__button:focus {
  outline: none;
  border: none;
  box-shadow: none;
}
.request__new__quote {
  color: #000;
}

.request_item__container {
  display: none !important;
}

.request_item__container.show,
.request_item__container.active {
  display: flex !important;
}

.request_item__container h6:hover {
  text-decoration: underline;
  cursor: pointer;
}

.request_item__container.active h6 {
  font-weight: 700 !important;
  color: #1d3b83;
}

.request__nav .control select {
  max-width: 7rem;
  border-radius: 0.5rem;
  border: none !important;
}
.request__nav .control.Negotiation select {
  background-color: #ffcf97;
}
.request__nav .control option {
  background-color: #fff !important;
  text-align: center;
}

.request_actions__container {
  top: 2.5rem;
  right: -9rem;
}

.request_actions__container .message-body,
.request_actions__container .message-body .media-content > div {
  padding: 0 0.25rem;
}

.request_actions__container .message-body .media-content > div button,
.request_actions__container .message-body .media-content > div a {
  border: none;
}

.request_actions__container .message-body .media-content > div a:hover,
.request_actions__container .message-body .media-content > div button:hover {
  background-color: #eee;
}

@media screen and (max-width: 480px) {
  .request__nav {
    width: 100%;
  }

  .request__tittle {
    max-width: 10rem;
  }

  .request_actions__container {
    right: 0rem;
  }
}
</style>
