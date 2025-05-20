<template>
  <b-collapse :class="`show`" animation="slide" v-model="isOpen">
    <template #trigger>
      <div>
        <p>
          Day {{ templateDay.start_day }}
          <span class="ml-2" style="text-align: left; font-weight: 300">{{
            templateDayLocations
          }}</span>
        </p>
        <span>{{ templateDay.title.value }}</span>
      </div>
    </template>
    <section>
      <div
        v-for="dayService in templateDay.services"
        :key="dayService.id"
        :class="`p-2 day__service${dayService.isBlocked ? ' is__blocked' : ''}`"
      >
        <b-icon
          :icon="helper.getServiceIconByServiceType(dayService.id_service_type)"
          alt="icon"
          class="card-icon"
        ></b-icon>
        <span class="color-7">{{ dayService.code }}</span>
        <span>{{ dayService.name.value }}</span>
      </div>
    </section>
  </b-collapse>
</template>
<script>
import { serviceHelper } from "@/utils/service";

export default {
  name: "ModuleSubCard",
  props: {
    templateDay: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      helper: {
        ...serviceHelper,
      },
      isOpen: false,
    };
  },
  computed: {
    templateDayLocations() {
      return this.templateDay.location
        .map((location) => location.location_name)
        .join(", ");
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
  grid-template-columns: 1fr 2fr 8fr;
  border-bottom: 1px solid #eee;
  align-items: center;
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
