<template>
  <b-collapse
    class="show"
    aria-id="contentIdForA11y2"
    animation="slide"
    v-model="isOpen"
  >
    <template #trigger>
      <div
        class="panel-heading"
        role="button"
        aria-controls="contentIdForA11y2"
        :aria-expanded="isOpen"
        style="text-align: left"
      >
        {{ day.title.value }}
      </div>
    </template>
    <section class="is-flex is-flex-direction-column">
      <b-tooltip
        v-for="dayService in day.servicesToDisplay"
        :key="dayService.id"
        :active="dayService.isBlocked === true"
        label="Accommodation/Package services from templates won´t be saved"
        type="is-warning"
      >
        <div
          :class="`p-2 day__service${
            dayService.isBlocked ? ' is__blocked' : ''
          }`"
        >
          <b-icon
            :icon="
              helper.getServiceIconByServiceType(dayService.id_service_type)
            "
            alt="icon"
            class="card-icon"
          ></b-icon>
          <span class="color-7">{{ dayService.code }}</span>
          <span>{{ dayService.name.value }}</span>
        </div>
      </b-tooltip>
    </section>
  </b-collapse>
</template>
<script>
import { serviceHelper } from "@/utils/service";

export default {
  name: "ItineraryModulesDay",
  props: {
    day: {
      type: Object,
      default: () => {},
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
};
</script>
<style scoped>
.panel-heading {
  background-color: #f7f7f7;
  border-radius: 0.5rem;
}
.day__service {
  display: grid;
  gap: 1rem;
  text-align: left;
  grid-template-columns: 1fr 2fr 6fr;
  border-bottom: 1px solid #eee;
}
.day__service.is__blocked {
  background-color: #f7f7f7;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
