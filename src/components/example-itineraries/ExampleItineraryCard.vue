<template>
  <div class="card">
    <div class="icon_container">
      <b-tooltip
        v-if="itinerary.itinerary_public === 1"
        position="is-bottom"
        label="This is a Public Itinerary, all clients have access to it."
        type="is-warning"
      >
        <IconPublic />
      </b-tooltip>
    </div>
    <picture>
      <img
        :src="itinerary.background_image.images_full[0].thumbnail_350X240"
        alt="background_image"
        v-if="
          itinerary.background_image &&
          itinerary.background_image.images_full.length
        "
      />
      <img
        src="https://place-hold.it/610x380/DDDDDD/fff.jpg?bold&fontsize=35&text=Quote+Image"
        alt="placeholder"
        v-else
      />
      <p class="text__description">{{ itinerary.title }}</p>
      <BaseButton
        v-if="!isExperienceType"
        size="large"
        action="outline"
        class="card__button card__button--preview"
        @click="handlePreview(itinerary)"
      >
        <p slot="text">Preview</p>
      </BaseButton>
      <b-navbar-item
        v-if="isExperienceType"
        tag="router-link"
        :to="{
          path: constants.PATH_INFO.BASIC_INFO.path,
          query: { itinerary: itinerary.id },
        }"
        class="card__button card__button--edit"
        style="cursor: pointer"
      >
        <p>Edit</p>
      </b-navbar-item>
      <BaseButton
        size="large"
        @click="handleDuplicate(itinerary)"
        action="tercery"
        class="card__button"
        :data-test-id="
          constants.DATA_TEST_ID_VALUES.EX_ITINERARY_CUSTOMIZE_BUTTON
        "
      >
        <p slot="text">Customize!</p>
      </BaseButton>
    </picture>
    <div class="text__content">
      <p class="text__price mb-1">
        <span v-if="itinerary.price">from</span>
        {{
          (itinerary.price &&
            itinerary.currency &&
            itinerary.currency.currency_sign) ||
          ""
        }}
        {{ itinerary.price || "-" }}
      </p>
      <div class="is-flex is-justify-content-space-between">
        <p class="text__num_pax">
          <span class="has-text-weight-bold">{{ itinerary.num_day || 0 }}</span>
          day(s)
        </p>
        <p class="text__num_pax">
          <span class="has-text-weight-bold">{{ itinerary.num_pax || 0 }}</span>
          pax(s)
        </p>
        <p class="text__location">
          {{ exampleItineraryLocation }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { ITINERARY_TYPES } from "@/constants/itinerary";
import { PATH_INFO } from "@/router/path";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import helpers from "@/helpers";

export default {
  name: "ExampleItineraryCard",
  props: {
    itinerary: {
      type: Object,
      default: () => {},
    },
    handleDuplicate: {
      type: Function,
      default: () => {},
    },
    handlePreview: {
      type: Function,
      default: () => {},
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      constants: {
        ITINERARY_TYPES,
        PATH_INFO,
        DATA_TEST_ID_VALUES,
      },
      payload: {
        page: 1,
        limit: 4,
        type: 2,
        country: null,
      },
      preview: null,
      showModal: false,
    };
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
    }),
    backgroundImage() {
      return helpers.backgroundImage(
        "https://305c511294116d47a2eb-8984c8bf4382d773df005374b9639769.ssl.cf2.rackcdn.com/itereo/ttc/background_app.jpg"
      );
    },
    exampleItineraryLocation() {
      return this.itinerary?.location?.reduce((acc, curr, index) => {
        const postText =
          index === this.itinerary.location.length - 1 ? "" : ",";
        return acc + curr.location_code + postText;
      }, "");
    },
    isExperienceType() {
      return this.type === this.constants.ITINERARY_TYPES.EXPERIENCE.id;
    },
  },
};
</script>
<style scoped>
.icon_container {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 3;
}
.card {
  width: clamp(100px, 70vh, 220px);
  height: 20rem;
  display: flex;
  box-shadow: none;
  border: none;
}
.card picture {
  display: flex;
  position: relative;
  border-radius: 0.5rem;
  width: 100%;
  height: 70%;
  cursor: pointer;
  overflow: hidden;
}
.card picture::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 1;
}
.card picture:hover::after {
  display: none;
}
.card picture:hover img {
  filter: grayscale(70%) blur(1px);
  transform: scale(1.2);
  transition: filter 0.5s ease, transform 0.5s ease;
}
.card picture:hover .card__button {
  bottom: 1rem;
  transition: bottom 0.3s ease;
  background-size: 200% 200%;
  animation: gradient 1s ease infinite;
}
.card picture:hover .card__button--edit,
.card picture:hover .card__button--preview {
  bottom: 3.5rem;
}
.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.5s ease, transform 0.5s ease;
}
.text__content {
  padding: 0.5rem 0.25rem;
}
.card picture:hover .text__description {
  animation: disappearFromBottomAndAppearAtTop 0.5s ease;
  animation-fill-mode: forwards;
}
@keyframes disappearFromBottomAndAppearAtTop {
  0% {
    bottom: 0rem;
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  100% {
    top: 0.5rem;
    opacity: 1;
  }
}
.text__description {
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  position: absolute;
  z-index: 2;
  bottom: 0rem;
  left: 0rem;
  padding: 0.5rem;
  display: block;
  height: fit-content;
  max-width: 100%;
  overflow: hidden;
  cursor: default;
}
.text__location {
  opacity: 0.5;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.text__price {
  font-weight: 700;
  font-size: 0.8rem;
  text-align: left;
}
.text__price span {
  font-size: 0.8rem;
  color: #4a4a4a;
  opacity: 0.7;
  padding-right: 0.25rem;
}
.text__num_pax {
  font-size: 0.8rem;
}
.card__button {
  transition: bottom 0.5s ease;
  position: absolute;
  bottom: -4rem;
  left: 50%;
  transform: translateX(-50%);
}
.card__button--edit {
  background-color: #fff;
  padding: 0.5rem 2rem;
  border-radius: 1rem;
}
</style>
