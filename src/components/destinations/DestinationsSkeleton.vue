<template>
  <section class="skeleton__container">
    <div
      class="skeleton__card"
      v-for="(card, index) in skeletonCards"
      :key="index"
    >
      <div class="skeleton__cover">
        <b-skeleton
          height="18rem"
          width="14rem"
          :active="isLoading"
        ></b-skeleton>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "DestinationsSkeleton",
  props: {
    cardsNumber: {
      type: Number,
      default: 8,
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-gap: 2rem;
  grid-auto-rows: minmax(100px, auto);
}
.skeleton__cover {
  height: 18rem;
  width: 14rem;
  border-radius: 1rem;
  overflow: hidden;
}
</style>
