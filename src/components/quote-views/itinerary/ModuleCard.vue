<template>
  <b-collapse :class="getCardClass()" animation="slide" v-model="isOpen">
    <template #trigger>
      <div :class="`module__collapsed`" :aria-expanded="isOpen">
        <p v-if="startDay !== 0 && endDay !== 0">
          <strong> From day {{ startDay }} to {{ endDay }} </strong>
        </p>
        <p>
          {{ module.moduleDays.length }} days /
          <span> {{ module.moduleServices.length }} services </span>
        </p>
        <p style="text-align: left; font-weight: 400">
          {{ moduleLocations }}
        </p>
        <h4>
          {{ module.name }}
        </h4>
      </div>
    </template>
    <section class="is-flex is-flex-direction-column module__days">
      <div
        v-for="templateDay in module.moduleDays"
        :key="templateDay.id"
        class="module__collapsed"
      >
        <ModuleSubCard
          :templateDay="templateDay"
          :numDay="templateDay.start_day"
        />
      </div>
    </section>
  </b-collapse>
</template>
<script>
import { serviceHelper } from "@/utils/service";

import ModuleSubCard from "@/components/quote-views/itinerary/ModuleSubCard.vue";

export default {
  name: "ModuleCard",
  components: {
    ModuleSubCard,
  },
  props: {
    module: {
      type: Object,
      default: () => {},
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    startDay: {
      type: Number,
      default: 0,
    },
    endDay: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isOpen: false,
      helper: {
        ...serviceHelper,
      },
    };
  },
  computed: {
    moduleLocations() {
      const moduleLocations = this.module.moduleDays
        .flatMap((day) => day.location)
        .map((location) => location.location_name);
      const uniqueModuleLocations = [...new Set(moduleLocations)];
      return uniqueModuleLocations.join(", ");
    },
  },
  methods: {
    getCardClass() {
      return {
        show: true,
        is__highlight: this.highlight,
      };
    },
  },
};
</script>
<style scoped>
.module__collapsed {
  border: 1px solid #a0a0a5;
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 1rem;
  text-align: left;
}
.module__collapsed :is(span, p, h4) {
  text-align: left;
}
.module__collapsed :is(p) {
  display: inline-block;
  margin-right: 1rem;
}
.module__collapsed :is(h4) {
  font-size: 1rem;
  font-weight: 600;
  padding-top: 0.5rem;
}
.module__days .module__collapsed {
  border-radius: 0rem;
  border: none;
  p {
    text-align: left;
    display: inline-block;
    width: 100%;
  }
  span {
    display: inline-block;
    font-weight: 600;
  }
}
.is__highlight .module__collapsed {
  background-color: #fefeda;
}
</style>
