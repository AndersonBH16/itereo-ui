<template>
  <div class="sign__container">
    <span>{{ PRO_USER_TEXT }}</span>
    <IconStar class="icon color-8 is-xsmall" />
  </div>
</template>
<script>
import IconStar from "../icons/IconStar.vue";
export default {
  name: "ProUserSign",
  components: {
    IconStar,
  },
  data() {
    return {
      PRO_USER_TEXT: "PRO",
    };
  },
};
</script>
<style scoped>
.sign__container {
  position: absolute;
  width: 3rem;
  height: 1.25rem;
  background: linear-gradient(63.18deg, #ffd43d 0%, #ff003d 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.sign__container > span {
  font-weight: 700;
  font-size: 10px;
  line-height: 15px;
  color: #fff;
}
.sign__container svg {
  width: 0.75rem !important;
  height: 0.75rem !important;
}
</style>
