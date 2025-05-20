<template>
  <b-pagination
    :total="data.total"
    v-model="data.currentPage"
    :range-before="1"
    :range-after="2"
    :rounded="false"
    size="is-small"
    :per-page="perPage"
    order="is-centered"
    class="mt-3"
  >
    <template #default="props">
      <b-pagination-button
        :page="props.page"
        tag="button"
        :id="`page${props.page.number}`"
        @click.native="onPageChange(props.page.number, props)"
      >
        {{ props.page.number }}
      </b-pagination-button>
    </template>

    <template #previous="props">
      <b-pagination-button
        :page="props.page"
        @click.native="onPageChange(props.page.number)"
      >
        <IconArrowLeft class="icon_previous" />
      </b-pagination-button>
    </template>

    <template #next="props">
      <b-pagination-button
        :page="props.page"
        @click.native="onPageChange(props.page.number)"
      >
        <IconArrowRight class="icon_next" />
      </b-pagination-button>
    </template>
  </b-pagination>
</template>
<script>
export default {
  name: "ExampleItinerariesPagination",
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    onPageChange: {
      type: Function,
      default: () => {},
    },
    perPage: {
      type: Number,
      default: 6,
    },
  },
};
</script>
<style scoped>
.pagination {
  width: fit-content;
  margin: 0 auto;
}
</style>
