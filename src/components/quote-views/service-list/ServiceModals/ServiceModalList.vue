<template>
  <div class="body">
    <div class="services" v-if="resultsLength > 0">
      <ServiceModalRow
        v-for="service in filteredServices"
        :key="service.id"
        :service="service"
        :handleClick="onServiceClick"
      />
    </div>
    <p class="services__placeholder" v-else>
      There are no services, please try again
    </p>
  </div>
</template>
<script>
import ServiceModalRow from "./ServiceModalRow.vue";

export default {
  name: "ServiceModalList",
  components: {
    ServiceModalRow,
  },
  props: {
    filteredServices: {
      type: Array,
      default: () => [],
    },
    onServiceClick: {
      type: Function,
      default: () => {},
    },
    resultsLength: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style scoped>
.body {
  max-height: 100%;
  overflow-y: auto;
  margin-top: 1rem;
  width: 100%;
}
.body .service {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(217, 217, 217, 0.25);
  cursor: pointer;
}
.body .service:hover {
  background-color: rgba(217, 217, 217, 0.25);
  border-radius: 0.5rem;
  color: #fff;
}
.body .service_code {
  font-size: 0.7rem;
  font-weight: 600;
  color: #444444;
}
.body .service_name {
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
</style>
