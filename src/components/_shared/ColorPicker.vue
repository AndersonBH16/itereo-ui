<template>
  <div class="color__picker__container">
    <p>{{ label }}</p>
    <div class="color__picker__box">
      <input type="color" :id="id" v-model="value" />
      <label :for="id">{{ value }}</label>
    </div>
  </div>
</template>
<script>
export default {
  name: "ColorPicker",
  props: {
    colorValue: {
      type: String,
      default: "#ffffff",
    },
    label: {
      type: String,
      default: "Main Color",
    },
    id: {
      type: String,
      default: "main_color",
    },
  },
  data() {
    return {
      value: this.colorValue,
    };
  },
  watch: {
    value(newValue = "") {
      this.updateColors(newValue);
    },
    colorValue(newValue = "") {
      this.value = newValue;
    },
  },
  methods: {
    updateColors(newValue) {
      const key = this.id;
      const value = newValue;
      this.$emit("update", { key, value });
    },
  },
};
</script>
<style>
.colors__container {
  padding-left: 1rem;
}
.color__picker__container {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.5rem;
  margin-right: 1.5rem;
}
.color__picker__container > p {
  display: inline-flex;
}
.color__picker__box {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
}
.color__picker__box:hover {
  border: 1px solid #6d6d6d;
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
}
@media screen and (max-width: 480px) {
  .colors__container {
    padding: 0;
  }
  .color__picker__container:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
}
</style>
