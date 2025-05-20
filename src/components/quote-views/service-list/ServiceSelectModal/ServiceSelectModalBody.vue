<template>
  <div class="body" :data-test-id="constants.DATA_TEST_ID_VALUES.SERVICE_LIST">
    <div class="services" v-if="resultsLength > 0">
      <button
        class="service"
        v-for="service in filteredServices"
        :key="service.id"
        @click="setNewService(service)"
      >
        <div class="service__info">
          <div class="is-flex is-align-items-center gap-2">
            <div class="service_code">
              {{ service.code }}
            </div>
            <div v-if="service.category !== null" class="service_tags">
              {{ service.category.name }}
            </div>
          </div>
          <div class="service_name">
            {{ service.name.value }}
          </div>
        </div>
      </button>
    </div>
    <p class="services__placeholder" v-else>
      There are no services, please try again
    </p>
  </div>
</template>
<script>
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "ServiceSelectModalBody",
  props: {
    filteredServices: {
      type: Array,
      default: () => [],
    },
    setNewService: {
      type: Function,
      default: () => {},
    },
    resultsLength: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      constants: { DATA_TEST_ID_VALUES },
    };
  },
};
</script>
<style>
.serviceselect_modal .body {
  max-height: 100%;
  overflow-y: auto;
  width: 100%;
}
.serviceselect_modal .body .service {
  background-color: #fff;
  border: none;
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(217, 217, 217, 0.25);
  cursor: pointer;
}
.serviceselect_modal .body .service:hover {
  background-color: rgba(217, 217, 217, 0.25);
  border-radius: 0.5rem;
  color: #fff;
}
.serviceselect_modal .body .service_code {
  font-size: 0.7rem;
  font-weight: 600;
  color: #444444;
}
.serviceselect_modal .body .service_name {
  font-size: 0.8rem;
  font-weight: 400;
  color: #6d6d6d;
}
.services__placeholder {
  margin-top: 2rem;
  font-size: 0.8rem;
  font-weight: 400;
  color: #6d6d6d;
  opacity: 0.8;
}
.service_tags {
  padding: 0.1rem 0.4rem;
  background-color: #d9d9d9;
  color: #404040;
  font-size: 0.7rem;
  border-radius: 0.5rem;
}
</style>
