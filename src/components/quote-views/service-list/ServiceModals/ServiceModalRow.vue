<template>
  <button
    :class="disabled ? 'service disabled' : 'service'"
    :key="service.id"
    @click="handleClick(service)"
  >
    <div class="service__info">
      <div class="is-flex is-align-items-center gap-2">
        <div class="service_code">
          {{ service.code }}
        </div>
        <div v-if="serviceCategory.length > 0" class="service_tags">
          {{ serviceCategory }}
        </div>
      </div>
      <div class="service_name">
        {{ service.name.value }}
      </div>
    </div>
  </button>
</template>
<script>
export default {
  name: "ServiceModalRow",
  props: {
    handleClick: {
      type: Function,
      default: () => {},
    },
    service: {
      type: Object,
      default: () => {
        return {
          id: "",
          code: "",
          name: {
            value: "",
          },
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    serviceCategory() {
      return this.service?.category?.name || "";
    },
  },
};
</script>
<style scoped>
.service {
  background-color: #fff;
  border: none;
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(217, 217, 217, 0.25);
  cursor: pointer;
  border-radius: 0.5rem;
}
.service.disabled {
  cursor: not-allowed;
  background-color: #eeeeee;
}
.service:hover {
  background-color: rgba(217, 217, 217, 0.25);
  border-radius: 0.5rem;
  color: #fff;
}
.service_code {
  font-size: 0.7rem;
  font-weight: 600;
  color: #444444;
}
.service_name {
  font-size: 0.8rem;
  font-weight: 400;
  color: #6d6d6d;
}
</style>
