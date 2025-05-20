<template>
  <div v-if="loading" class="parent-loader">
    <div class="loader__content">
      <clip-loader :loading="loading" color="#032647" size="40px"></clip-loader>
      <p
        class="text-loader color-3 has-text-centered mt-2"
        v-html="loadingText"
      ></p>
      <b-progress
        v-if="displayProgress"
        :value="progressValue"
        size="is-medium"
        type="is-info"
        class="mt-3"
        style="width: 24rem"
        show-value
      >
        {{ progressText }}
      </b-progress>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

export default {
  name: "Loading",
  components: {
    ClipLoader,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    loadingText: {
      type: String,
      default: "Loading content, please wait...",
    },
  },
  computed: {
    ...mapGetters({
      displayProgress: "utils/getDisplayLoadingProgress",
      progressValue: "utils/getLoadingProgressValue",
      progressText: "utils/getLoadingProgressText",
    }),
  },
};
</script>
<style>
progress::-moz-progress-bar {
  background: #1d3b83 !important;
}
progress::-webkit-progress-value {
  background-color: #1d3b83 !important;
}
.loader__content {
  background-color: #fff;
  border-radius: 1rem;
  padding: 2rem;
}
</style>
