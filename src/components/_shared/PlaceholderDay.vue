<template>
  <div>
    <div class="columns skeletonDay" v-for="i in count" :key="i">
      <div class="column is-one-quarter">
        <div class="SkeletonImage">
          <b-skeleton></b-skeleton>
        </div>
      </div>
      <div class="column pr-6">
        <div class="mb-3">
          <div class="media mb-3">
            <div class="media-content">
              <div class="skeleton-title"><b-skeleton></b-skeleton></div>
              <div class="skeleton-date"><b-skeleton></b-skeleton></div>
              <div class="skeleton-paragraph">
                <b-skeleton></b-skeleton>
                <b-skeleton></b-skeleton>
                <b-skeleton></b-skeleton>
                <b-skeleton></b-skeleton>
              </div>
            </div>
          </div>
        </div>
        <footer class="skeleton-footer">
          <div class="card-footer-item pb-0 skeleton-buttons">
            <b-skeleton circle></b-skeleton>
            <b-skeleton circle></b-skeleton>
            <b-skeleton circle></b-skeleton>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlaceholderDay",
  props: {
    count: {
      type: Number,
      default: 1,
    },
  },
};
</script>
