<template>
  <div class="mb-5 mt-5 content">
    <p class="has-text-weight-bold template-card-title mb-2">Select Colors</p>
    <section
      class="colors__container"
      :disabled="disableQuoteByStatus || hideElementByCondition"
    >
      <ColorPicker
        :colorValue="color.value"
        :id="color.type"
        :label="color.type || color.type"
        v-for="(color, ind) in templateColors"
        :key="ind"
        @update="updateColors"
      />
    </section>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ColorPicker from "@/components/_shared/ColorPicker.vue";

export default {
  name: "ExportAccordionColors",
  components: { ColorPicker },
  props: {
    templateColors: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
  },
  methods: {
    updateColors({ key, value }) {
      this.$emit("update", { key, value });
    },
  },
};
</script>
