<template>
  <div
    class="book_level_card"
    :is-active="isSelected"
    :is-disabled="isDisabledToUpdate"
  >
    <header>
      <h3 class="level_card_title">{{ level.type }}</h3>
      <h3 class="level_card_subtitle">{{ `${currency} ${level.total}` }}</h3>
      <button class="btn_select_level" @click="selectLevel">
        {{ isSelected ? `${level.type} selected` : `Select ${level.type}` }}
      </button>
    </header>
    <body>
      <b-carousel :autoplay="false" v-if="levelImages.length > 0">
        <b-carousel-item v-for="(image, i) in levelImages" :key="i">
          <picture>
            <img :src="image.src" :alt="image.alt" />
          </picture>
        </b-carousel-item>
      </b-carousel>
      <div class="level_card_services">
        <h3>Services included:</h3>
        <div v-for="service in levelServices" :key="service.id">
          <span class="level_card_service_subtitle">
            <p>
              {{ service.code }}
            </p>
            <ServiceTag
              v-if="
                service.optional === constants.SERVICE_OPTIONAL_TYPES.CONFIRMED
              "
              type="dark"
              :message="`Optional Experience Confirmed`"
            >
              <template #icon>
                <IconCheckCircle style="height: 0.6rem; width: 0.8rem" />
              </template>
              <template #message>
                <span> Optional Experience Confirmed</span>
              </template>
            </ServiceTag>
            <ServiceTag
              v-else-if="service.optional"
              :message="`Optional Experience`"
            >
              <template #icon>
                <IconGrowthArrow style="height: 0.6rem" />
              </template>
              <template #message>
                <span> Optional Experience </span>
              </template>
            </ServiceTag>
          </span>
          <p class="level_card_service_title">{{ service.name.value }}</p>
        </div>
      </div>
    </body>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { SERVICE_LEVELS, SERVICE_OPTIONAL_TYPES } from "@/constants/services";

import ServiceTag from "@/components/quote-views/service-list/ServiceTag.vue";

export default {
  name: "BookLevelCard",
  components: {
    ServiceTag,
  },
  props: {
    price: {
      type: Object,
      default: () => ({}),
    },
    level: {
      type: Object,
      required: true,
    },
    selectedLevel: {
      type: Object,
      default: () => ({}),
    },
    selectedPrice: {
      type: Object,
      default: () => ({}),
    },
    isDisabledToUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      constants: { SERVICE_LEVELS, SERVICE_OPTIONAL_TYPES },
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      servicesItinerary: "itinerary/getServicesItinerary",
    }),
    isSelected() {
      return (
        this.selectedLevel?.level === this.level?.level &&
        this.selectedPrice?.id === this.price?.id
      );
    },
    currency() {
      return this.itinerary?.data?.currency?.currency_sign;
    },
    levelServices() {
      const validation = ({ level }) =>
        [this.level.level, this.constants.SERVICE_LEVELS.ALL.id].includes(
          level
        );
      return this.servicesItinerary.filter(validation);
    },
    levelImages() {
      const serviceImages = this.levelServices.map((service) => {
        return {
          src: service?.images_full?.[0]?.thumbnail_1200X725,
          alt: service?.images_full?.[0]?.name,
        };
      });
      return serviceImages.filter((image) => image.src);
    },
  },
  methods: {
    selectLevel() {
      this.$emit("selectLevel", {
        level: this.level,
        services: this.levelServices,
        price: { ...this.price, selected_level: this.level.level },
      });
    },
  },
};
</script>
<style src="./BookLevelCard.css"></style>
