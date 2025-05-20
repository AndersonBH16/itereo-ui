<template>
  <div>
    <div class="columns itineraryDay" style="margin: 0rem 0 1rem">
      <div class="column is-one-quarter" style="margin-left: 1.2rem">
        <div class="PhotoImage">
          <b-skeleton height="170px" :active="loading"></b-skeleton>
        </div>
      </div>
      <div class="column">
        <b-skeleton
          height="40px"
          width="40%"
          :active="loading"
          style="border-radius: 1rem"
        ></b-skeleton>
        <b-skeleton
          height="120px"
          :active="loading"
          style="border-radius: 1rem"
        ></b-skeleton>
      </div>
    </div>
    <div class="columns itineraryDay" style="margin: 1rem 0 1rem">
      <div class="column is-one-quarter" style="margin-left: 1.2rem">
        <div class="PhotoImage">
          <b-skeleton height="170px" :active="loading"></b-skeleton>
        </div>
      </div>
      <div class="column">
        <b-skeleton
          height="40px"
          width="40%"
          :active="loading"
          style="border-radius: 1rem"
        ></b-skeleton>
        <b-skeleton
          height="120px"
          :active="loading"
          style="border-radius: 1rem"
        ></b-skeleton>
      </div>
    </div>
    <div class="columns itineraryDay" style="margin: 1rem 0 1rem">
      <div class="column is-one-quarter" style="margin-left: 1.2rem">
        <div class="PhotoImage">
          <b-skeleton height="170px" :active="loading"></b-skeleton>
        </div>
      </div>
      <div class="column">
        <b-skeleton
          height="40px"
          width="40%"
          :active="loading"
          style="border-radius: 1rem"
        ></b-skeleton>
        <b-skeleton
          height="120px"
          :active="loading"
          style="border-radius: 1rem"
        ></b-skeleton>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Skeleton",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.b-skeleton-item.is-rounded {
  border-radius: 1rem;
}
</style>
