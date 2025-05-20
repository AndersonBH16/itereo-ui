<template>
  <img loading="lazy" v-on="$listeners" v-bind="$attrs" />
</template>

<script>
export default {
  name: "BaseImage",
  inheritAttrs: false,
};
</script>
