<template>
  <b-field>
    <IconCompass />
    <div class="spanShortcut">Start</div>
    <a class="linkShortcut" @click="handleClick">
      {{ text }}
    </a>
  </b-field>
</template>

<script>
import IconCompass from "../icons/IconCompass.vue";

export default {
  name: "BaseTourGuideLink",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    handleClick: {
      type: Function,
      default: () => {},
    },
    text: {
      type: String,
      default: "Tour guide",
    },
  },
  components: { IconCompass },
};
</script>

<style scoped>
.spanShortcut,
.linkShortcut {
  font-size: 12px;
  line-height: 18px;
}
.spanShortcut {
  color: #32324d;
  margin: 0 5px;
}
.linkShortcut {
  color: #666687;
  text-decoration-line: underline;
}
.linkShortcut:hover {
  color: var(--info-color);
}
</style>
