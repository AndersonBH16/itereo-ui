<template>
  <div class="card">
    <picture>
      <img
        :src="destinationImage.thumbnail_1200X725"
        :alt="destinationImage.name"
        v-if="destinationImage"
      />
      <img
        src="https://place-hold.it/610x380/DDDDDD/fff.jpg?bold&fontsize=35&text=Cover+Image"
        alt="placeholder"
        v-else
      />
      <div class="bg_gradient"></div>
      <div class="text__content">
        <p class="text__location">
          {{ destination.country.location_name }}
        </p>
        <p class="text__data">
          Itineraries:
          <span>{{ destination.itineraries }}</span>
        </p>
        <p class="text__data">
          Services:
          <span>{{ destination.services }}</span>
        </p>
      </div>
      <BaseButton
        size="large"
        @click="handleGetItineraries(destination)"
        action="tercery"
        class="card__button"
      >
        <p slot="text">View itineraries</p>
      </BaseButton>
    </picture>
  </div>
</template>
<script>
import helpers from "@/helpers";
import { PATH_INFO } from "@/router/path";

export default {
  name: "Card",
  methods: {
    handleGetItineraries(destination) {
      const destinationName = destination.country.location_name;
      const formattedDestinationName = helpers.kebabCase(destinationName);
      this.$router.push({
        name: PATH_INFO.ITINERARIES_BY_DESTINATION.name,
        params: {
          destination: formattedDestinationName,
        },
      });
    },
  },
  props: {
    destination: {
      type: Object,
      default: () => {},
    },
    destinationImage: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<style scoped>
.card {
  width: clamp(100px, 70vh, 220px);
  height: clamp(200px, 50vh, 300px);
  display: flex;
  box-shadow: none;
  border: none;
}
.card picture {
  position: relative;
  border-radius: 1rem;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
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
.card picture:hover .text__content {
  bottom: 4rem;
  transition: bottom 0.3s ease;
}
.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  transition: filter 0.5s ease, transform 0.5s ease;
}
.text__content {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}
.text__location {
  font-size: 1rem;
  font-weight: 800;
  color: #ebebeb;
}
.text__data {
  font-size: 0.8rem;
  font-weight: 400;
  color: #a9a9a9;
}
.text__location span,
.text__data span {
  font-weight: 500;
  color: #ebebeb;
}
.card__button {
  transition: bottom 0.5s ease;
  position: absolute;
  bottom: -4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
}
.bg_gradient {
  position: absolute;
  width: 100%;
  height: 70%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 99.71%);
  bottom: 0;
  left: 0;
}
</style>
