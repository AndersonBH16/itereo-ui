<template>
  <div
    class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center"
  >
    <p class="color-4 mb-2">
      Displaying
      <span class="has-text-weight-bold">{{ resultsInfo.displaying }}</span>
      of
      <span class="has-text-weight-bold">{{ resultsInfo.results }}</span>
      results
    </p>
    <b-progress
      :value="resultsInfo.displayingPercentage"
      size="is-small"
      class="w-25 m-auto"
    >
    </b-progress>
    <BaseButton
      v-if="resultsInfo.displaying < resultsInfo.results"
      class="mt-2"
      size="large"
      action="principal"
      @click="loadMoreItems"
    >
      <p slot="text">Load more results</p>
    </BaseButton>
  </div>
</template>
<script>
export default {
  name: "ResultsInfo",
  props: {
    resultsInfo: {
      type: Object,
      default: () => ({}),
    },
    displayPagination: {
      type: Boolean,
      default: false,
    },
    loadMoreItems: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
<style></style>
