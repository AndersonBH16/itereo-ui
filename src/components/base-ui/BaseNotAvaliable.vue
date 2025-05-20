<template>
  <b-field class="w-100 notAvaliable">
    {{ text }}
  </b-field>
</template>

<script>
export default {
  name: "BaseNotAvaliable",
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.notAvaliable {
  background-color: #eaeaef !important;
  color: #8e8ea9;
  font-size: 14px;
  text-align: center;
  padding: 1rem 0;
}
</style>
