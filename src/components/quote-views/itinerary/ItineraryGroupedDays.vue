<template>
  <section>
    <div class="columns days_grouped_container">
      <div class="column" v-for="(day, index) in groupedDays" :key="day.id">
        <b-collapse
          class="card mb-5 itineraryReorderDayCard"
          id="itineraryReorderDayCard"
          animation="slide"
          aria-id="contentIdForA11y3"
          :open="isCollapsed"
        >
          <template #trigger="props">
            <div
              class="itineraryReorderDayHeader"
              role="button"
              aria-controls="contentIdForA11y3"
              :aria-expanded="props.open"
              :class="{ isHighlighted: isSelected }"
            >
              <div>
                <p class="title is-5">
                  <span class="has-text-weight-medium mr-3 color-1"
                    >Day {{ index !== -1 ? index + 1 : day.start_day }}</span
                  >
                  <span class="has-text-weight-bold">{{
                    day.title.value
                  }}</span>
                </p>
                <p class="subtitle is-6 pt-2">
                  {{ day.start_date }}
                  <span class="ml-3">{{
                    day.location && day.location[0].location_name
                  }}</span>
                </p>
              </div>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-up' : 'menu-down'"> </b-icon>
              </a>
            </div>
          </template>

          <div class="card-content pt-0">
            <b-table :data="day.services" v-if="day.services.length">
              <b-table-column
                field="service_type"
                label="Type"
                v-slot="props"
                width="50"
              >
                <b-icon
                  :icon="showIconByServiceType(props.row.id_service_type)"
                  alt="icon"
                  class="card-icon"
                ></b-icon>
              </b-table-column>

              <b-table-column
                field="service_code"
                label="Code"
                v-slot="props"
                width="105"
              >
                <span class="color-7">{{ props.row.code }}</span>
              </b-table-column>

              <b-table-column
                field="level"
                label="Level"
                v-slot="props"
                width="40"
              >
                {{ props.row.level_text }}
              </b-table-column>

              <b-table-column field="service_name" label="Name" v-slot="props">
                {{ props.row.name.value }}
              </b-table-column>
            </b-table>
          </div>
        </b-collapse>
      </div>
    </div>
  </section>
</template>
<script>
import servicesTypes from "@/data/servicesTypes.json";

export default {
  name: "ItineraryGroupedDays",
  props: {
    isNewDay: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    dayServicesLoaded: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: -1,
    },
    isCollapsed: {
      type: Boolean,
      default: true,
    },
    groupedDays: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    showIconByServiceType(id) {
      const serviceType = servicesTypes.filter(
        (service) => service.entity_id === id
      );
      return serviceType.length !== 0
        ? serviceType[0].icon
        : "check-circle-outline";
    },
  },
};
</script>

<style lang="scss" scoped>
.collapse:not(.show) {
  display: block;
}
.isHighlighted {
  background-color: #fdffbc;
}
.itineraryReorderDayHeader {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  border-radius: 15px;
}
.itineraryReorderDayCard {
  border-radius: 15px;
}
.column[is-grouped="true"] .itineraryReorderDayCard {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-left: 6px solid rgba(0, 0, 0, 0.125);
  margin-bottom: 0 !important;
  border-radius: 0 0.5rem 0.5rem 0;
}
.column[is-firstgrouped="true"] .itineraryReorderDayCard {
  border-radius: 0.5rem 0.5rem 0.5rem 0;
}
.column[is-lastgrouped="true"] .itineraryReorderDayCard {
  border-radius: 0 0.5rem 0.5rem 0.5rem;
  margin-bottom: 0.5rem !important;
}
.column[is-grouped="true"] .itineraryReorderDayCard .itineraryReorderDayHeader {
  border-radius: 0;
}
.column[is-grouped="true"] {
  padding-bottom: 0;
}
.column[is-lastgrouped="true"] {
  padding-bottom: 0.75rem;
}
.days_grouped_container {
  padding-top: 0.75rem;
  flex-direction: column;
}
.days_grouped_container > div {
  padding: 0 0.75rem;
}
</style>
