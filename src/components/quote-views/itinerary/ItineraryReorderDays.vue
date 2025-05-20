<template>
  <section>
    <div class="columns">
      <div
        class="column"
        :is-grouped="data.isGrouped"
        :is-lastgrouped="data.isLastGroupedDay"
        :is-firstgrouped="data.isFirstGroupedDay"
      >
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
                    >Day {{ index !== -1 ? index + 1 : data.start_day }}</span
                  >
                  <span class="has-text-weight-bold">{{
                    data.title.value
                  }}</span>
                </p>
                <p class="subtitle is-6 pt-2">
                  {{ data.start_date }}
                  <span class="ml-3">{{
                    locationsFormatted | customJoin("location_name")
                  }}</span>
                </p>
              </div>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-up' : 'menu-down'"> </b-icon>
              </a>
            </div>
          </template>

          <div class="card-content pt-0">
            <b-table
              :data="servicesPerDay"
              v-if="servicesPerDay.length"
              :row-class="(row) => (row.visible ? '' : 'hidden_row')"
            >
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
                <span class="field_name">
                  {{ props.row.name.value }}
                  <b-tooltip
                    label="Service is hidden, you can toggle it in the service list"
                    position="is-left"
                  >
                    <b-icon
                      v-if="!props.row.visible"
                      :icon="'eye-off'"
                    ></b-icon>
                  </b-tooltip>
                </span>
              </b-table-column>
            </b-table>
          </div>
        </b-collapse>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import servicesTypes from "@/data/servicesTypes.json";

export default {
  name: "ItineraryReorderDays",
  props: {
    data: {
      type: Object,
      require: true,
    },
    selectedDay: {
      type: Object,
    },
    isNewDay: {
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
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      itineraryDays: "itineraryDays/getItineraryDays",
      locations: "client/getDestinations",
      services_itinerary: "itinerary/getServicesItinerary",
    }),
    locationsFormatted() {
      if (this.locations.length === 0) {
        return [];
      }
      if (!this.data.location) {
        return [];
      }
      if (Array.isArray(this.data.nestedDays)) {
        return this.data.location;
      }
      return this.data.location.map((l) => {
        const location = this.locations.filter((il) => il.id === l.id);
        return {
          id: location[0]?.id,
          location_name: location[0]?.location_name,
          order: l.order,
        };
      });
    },
    isSelected() {
      if (this.isNewDay) return true;
      if (this.selectedDay && this.data) {
        return this.selectedDay.id === this.data.id;
      }
      return false;
    },
    showServices() {
      return this.data.services;
    },
    servicesPerDay() {
      const services = [];
      if (this.dayServicesLoaded && this.dayServicesLoaded.length > 0) {
        return this.dayServicesLoaded;
      }
      if (this.data.services && this.services_itinerary) {
        this.data?.services.forEach((srv) => {
          const day_serv = this.services_itinerary.filter(
            (f) => f.service === srv.uuid
          );
          if (day_serv.length > 0) {
            services.push(day_serv[0]);
          }
        });
      }
      return services;
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

.hidden_row {
  opacity: 0.5;
}
.field_name {
  display: flex;
  align-items: center;
  text-align: left;
}
.field_name > .b-tooltip {
  margin-left: 0.5rem;
}
.field_name > .b-tooltip .tooltip-content {
  font-size: 0.5rem;
}
</style>
