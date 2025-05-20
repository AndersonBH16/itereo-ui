<template>
  <div class="book_level_card skeleton">
    <header>
      <b-skeleton
        height="30px"
        width="50%"
        :active="true"
        position="is-centered"
      ></b-skeleton>
      <b-skeleton
        height="20px"
        width="30%"
        :active="true"
        position="is-centered"
      ></b-skeleton>
    </header>

    <body>
      <b-skeleton height="30px" width="100%" :active="true"></b-skeleton>
      <b-skeleton height="120px" width="100%" :active="true"></b-skeleton>
      <div class="level_card_services skeleton">
        <b-skeleton
          v-for="n in 3"
          :key="n"
          height="20px"
          width="100%"
          :active="true"
        ></b-skeleton>
      </div>
    </body>
  </div>
</template>
<script>
export default {
  name: "BookLevelCardSkeleton",
};
</script>
<style src="./BookLevelCard.css"></style>
