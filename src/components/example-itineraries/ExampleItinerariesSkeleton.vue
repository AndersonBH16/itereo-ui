<template>
  <section class="skeleton__container">
    <div
      class="skeleton__card"
      v-for="(card, index) in skeletonCards"
      :key="index"
    >
      <div style="margin: 0rem 0 0.5rem" class="skeleton__cover">
        <b-skeleton
          height="14rem"
          width="14rem"
          :active="isLoading"
        ></b-skeleton>
      </div>
      <div style="margin: 0rem 0.5rem 0.5rem">
        <b-skeleton height="1rem" width="8rem" :active="isLoading"></b-skeleton>
      </div>
      <div style="margin: 0rem 0.5rem 2rem">
        <b-skeleton
          height="1rem"
          width="12.7rem"
          :active="isLoading"
        ></b-skeleton>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "ExampleItinerariesSkeleton",
  props: {
    cardsNumber: {
      type: Number,
      default: 4,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      skeletonCards: [],
    };
  },
  mounted() {
    this.skeletonCards = Array.from({ length: this.cardsNumber });
  },
};
</script>
<style>
.skeleton__container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 240px);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}
.skeleton__cover {
  height: 14rem;
  width: 14rem;
  border-radius: 1rem;
  overflow: hidden;
}
</style>
