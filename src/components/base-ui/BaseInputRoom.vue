<template>
  <div class="base-input-container">
    <label class="label" v-if="label">{{ label }} </label>
    <div
      :class="[
        size === 'large' ? 'large' : '',
        size === 'medium' ? 'medium' : '',
        size === 'xlarge' ? 'xlarge' : '',
        size === 'small' ? 'small' : '',
        size === 'thin' ? 'thin' : '',
        'base-input',
        'is-flex align-items-center',
      ]"
    >
      <slot name="icon"></slot>
      <input
        v-bind="$attrs"
        :placeholder="placeholder"
        v-model="description"
        :disabled="disabled"
      />
      <!-- <span class="input">{{ description }}</span> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseInputRoom",
  inheritAttrs: false,
  data() {
    return {
      description: "",
    };
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "large",
    },
    data: {
      type: [Array],
    },
  },
  methods: {
    showRooms() {
      let text = "";
      if (this.data && this.data.length > 0) {
        this.data.forEach((item) => {
          if (item && item.qty > 0) {
            text += ` ${item.qty} ${item.name}  ·  `;
          }
        });
      }
      this.description = text;
    },
  },
  updated() {
    this.showRooms();
  },
};
</script>

<style scoped>
.base-input-container {
  display: flex;
  flex-direction: column;
}
.base-input-container .label {
  margin-bottom: 0.5em;
  font-size: 1em;
}
.base-input {
  padding: 0;
  justify-content: space-evenly;
}
input {
  padding: 0.441em 0.2em;
  width: 80%;
  border: transparent;
  outline: none;
}
</style>
