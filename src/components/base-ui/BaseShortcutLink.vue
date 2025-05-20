<template>
  <b-field>
    <IconKeyboard v-on="$listeners" />
    <div class="spanShortcut">See</div>
    <a
      class="linkShortcut"
      v-on="$listeners"
      v-bind="$attrs"
      :disabled="loading || disabled"
    >
      Keyboard shortcuts
    </a>
  </b-field>
</template>

<script>
export default {
  name: "BaseShortcutLink",
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
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
