<template>
  <table aria-describedby="table skeleton">
    <thead>
      <th style="width: 10rem">Client</th>
      <th style="width: 10rem">Type</th>
      <th style="width: 18rem">Code</th>
      <th style="width: 8rem">User</th>
      <th style="width: 12rem">Title</th>
      <th style="width: 4rem">Pax</th>
      <th style="width: 6rem">Price</th>
      <th style="width: 6rem">Dates</th>
      <th style="width: 8rem">Creation</th>
      <th style="width: 8rem">Status</th>
      <th style="width: 6rem">Actions</th>
    </thead>
    <b-skeleton
      v-for="row in helper.getArrayFromNumber(rows)"
      :key="row"
      height="42px"
      width="100%"
      class="skeleton_row"
      :active="true"
    ></b-skeleton>
  </table>
</template>
<script>
import helper from "@/helpers";

export default {
  name: "QuotesTableSkeleton",
  props: {
    rows: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      helper: { ...helper },
    };
  },
};
</script>
<style scoped>
table {
  display: block;
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 15%),
    0 0 0 1px rgb(10 10 10 / 2%);
  padding: 1.5rem;
}
thead th {
  color: #aeaeae;
  font-weight: 600;
  padding-bottom: 1rem;
}
table > div {
  margin-bottom: 0.5rem;
}
</style>
