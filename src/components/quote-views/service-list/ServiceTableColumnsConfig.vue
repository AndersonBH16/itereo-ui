<template>
  <section>
    <BaseButton @click="openColumnsConfigModal" action="principal">
      <i slot="icon" class="ml-1">
        <IconColumns class="icon is-small" />
      </i>
      <p slot="text">Columns</p>
    </BaseButton>
    <b-modal
      v-if="isColumnsConfigModalActive"
      v-model="isColumnsConfigModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Modal"
      aria-modal
      @close="closeColumnsConfigModal()"
      v-bind="$attrs"
    >
      <div class="columns_config_modal">
        <h1 class="columns_config_title">Columns configuration</h1>
        <p class="columns_config_paragraph">
          Here you can select wich columns should appear on the service table
        </p>
        <h2 class="columns_config_subtitle">Fields</h2>
        <div class="columns_config_options">
          <div
            v-for="field in fields"
            :key="field.key"
            class="color__picker__box"
          >
            <input
              type="checkbox"
              :id="field.key"
              v-model="isColumnsConfigModalActive"
            />
            <label :for="field.key">{{ field.label }}</label>
          </div>
        </div>
      </div>
    </b-modal>
  </section>
</template>
<script>
import { SERVICE_TABLE_FIELDS } from "@/constants";

export default {
  name: "ServiceTableColumnsConfig",
  data() {
    return {
      isColumnsConfigModalActive: false,
      fields: { ...SERVICE_TABLE_FIELDS },
    };
  },
  methods: {
    handleClick() {
      console.log("clicked");
    },
    openColumnsConfigModal() {
      this.isColumnsConfigModalActive = true;
    },
    closeColumnsConfigModal() {
      this.isColumnsConfigModalActive = false;
    },
  },
};
</script>
<style>
.columns_config_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 28rem;
  height: auto;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: left;
}
:is(.columns_config_title, .columns_config_subtitle) {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: left;
  width: 100%;
}
.columns_config_subtitle {
  margin: 2rem 0 0;
  font-size: 1rem;
  font-weight: 500;
}
.colors__container {
  padding-left: 1rem;
}
.columns_config_options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  margin: 1rem 0;
  column-gap: 2rem;
  row-gap: 1rem;
}
.color__picker__box {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 0.5rem;
  padding: 0.25rem 0.25rem;
  border-radius: 0.25rem;
  outline: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;
}
.color__picker__box:hover {
  outline: 1px solid #d9d9d9;
}
.color__picker__box input {
  width: 1.2rem;
  height: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
.color__picker__box label {
  color: #6d6d6d;
  font-weight: 600;
  cursor: pointer;
}
</style>
