<template>
  <div v-if="loading">
    <div class="columns" style="margin: 0rem 0 1rem">
      <b-skeleton height="60px" :active="loading"></b-skeleton>
    </div>
    <div class="columns" style="margin: 0rem 0 1rem">
      <b-skeleton height="60px" :active="loading"></b-skeleton>
    </div>
    <div class="columns" style="margin: 0rem 0 1rem">
      <b-skeleton height="60px" :active="loading"></b-skeleton>
    </div>
    <div class="columns" style="margin: 0rem 0 1rem">
      <b-skeleton
        height="40px"
        width="20%"
        :active="loading"
        style="float: right"
      ></b-skeleton>
    </div>
  </div>
</template>
<script>
export default {
  name: "SkeletonServicesTable",
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
  margin-left: auto;
}
</style>
