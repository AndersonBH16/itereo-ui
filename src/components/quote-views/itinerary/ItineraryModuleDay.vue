<template>
  <b-collapse
    :class="getCardClass()"
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
        v-for="dayService in day.services"
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
          <span>
            <ServiceTag
              v-if="
                dayService.optional ===
                constants.SERVICE_OPTIONAL_TYPES.CONFIRMED
              "
              type="dark"
              :message="`Optional Experience Confirmed`"
            >
              <template #icon>
                <IconCheckCircle style="height: 0.6rem; width: 0.8rem" />
              </template>
              <template #message>
                <span> Optional Experience Confirmed</span>
              </template>
            </ServiceTag>
            <ServiceTag
              v-else-if="dayService.optional"
              type="light"
              :message="`Optional Experience`"
            >
              <template #icon>
                <IconGrowthArrow style="height: 0.6rem" />
              </template>
              <template #message>
                <span> Optional Experience </span>
              </template>
            </ServiceTag>
            <p>
              {{ dayService.name.value }}
            </p>
          </span>
        </div>
      </b-tooltip>
    </section>
  </b-collapse>
</template>
<script>
import { SERVICE_OPTIONAL_TYPES } from "@/constants/services";
import { serviceHelper } from "@/utils/service";
import ServiceTag from "@/components/quote-views/service-list/ServiceTag.vue";

export default {
  name: "ItineraryModuleDay",
  components: {
    ServiceTag,
  },
  props: {
    day: {
      type: Object,
      default: () => {},
    },
    isReordering: {
      type: Boolean,
      default: false,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
      constants: { SERVICE_OPTIONAL_TYPES },
      helper: {
        ...serviceHelper,
      },
    };
  },
  methods: {
    getCardClass() {
      const isReorderingClass = this.isReordering ? "is__reordering" : "";
      const highlightClass = this.highlight ? "is__highlight" : "";
      return `show ${isReorderingClass} ${highlightClass}`;
    },
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
.is__reordering {
  background-color: #f7f7f7;
}
.is__highlight .panel-heading {
  background-color: #fefeda;
}
</style>
