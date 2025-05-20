<template>
  <span>
    <span v-if="!showOnlyIcon">{{ content }}</span>
    <button
      class="btn_copy_content"
      @click="handleCopyContent($event, content)"
    >
      <IconCopyOutlined />
    </button>
  </span>
</template>
<script>
export default {
  name: "CopyContent",
  props: {
    content: {
      type: String,
      required: true,
    },
    showOnlyIcon: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async handleCopyContent(evt, textToCopy = "") {
      evt.stopPropagation();
      try {
        await navigator.clipboard.writeText(textToCopy);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Copied to clipboard!",
          position: "is-top",
          type: "is-success",
        });
      } catch ($e) {
        this.$buefy.toast.open({
          duration: 5000,
          message: "Not copied to clipboard",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
  },
};
</script>
<style scoped>
.btn_copy_content {
  opacity: 0;
  background-color: transparent;
  border: none;
  transition: opacity 0.3s ease;
}
</style>
