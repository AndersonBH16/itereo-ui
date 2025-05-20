<template>
  <div class="printFloat">
    <b-tooltip label="Print Version" type="is-dark">
      <NuxtLink
        target="_blank"
        :to="{ path: '/print/', query: { uuid: id } }"
        class="printFloatButton"
        ><b-icon icon="printer" class="my-float"></b-icon
      ></NuxtLink>
    </b-tooltip>
  </div>
</template>

<script>
export default {
  name: "PrintFloatButton",
  props: {
    id: {
      type: String,
      default: () => "",
    },
  },
  watch: {
    id(old, newv) {
      return newv;
    },
  },
};
</script>
