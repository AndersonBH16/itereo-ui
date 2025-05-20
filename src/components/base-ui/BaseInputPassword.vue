<template>
  <div class="passwordContainer">
    <label v-if="label">{{ label }}</label>
    <a class="password">
      <input
        v-bind="$attrs"
        :class="[
          customSize === 'large' ? 'large' : '',
          customSize === 'medium' ? 'medium' : '',
          customSize === 'xlarge' ? 'xlarge' : '',
          customSize === 'small' ? 'small' : '',
          'base-password',
        ]"
        :placeholder="placeholder"
        v-model="updatedValue"
        :disabled="disabled"
        :type="type"
        :required="required"
      />
      <a class="black" @click.prevent="showAndHidePassword">
        <IconCloseEye v-if="showPassword" />
        <IconEye v-else />
      </a>
    </a>
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  inheritAttrs: false,
  data() {
    return {
      showPassword: false,
      type: "password",
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
    customText: {
      type: Function,
    },
    customSize: {
      type: String,
      default: "large",
    },
    value: {
      type: [String, Number],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    updatedValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  methods: {
    showAndHidePassword() {
      this.showPassword = !this.showPassword;
      if (this.type === "password") {
        this.type = "text";
      } else {
        this.type = "password";
      }
    },
  },
};
</script>

<style scoped>
.passwordContainer {
  display: flex;
  flex-direction: column;
}
.passwordContainer label {
  font-weight: 600;
  line-height: 16px;
  margin-bottom: 0.7em;
}
.password {
  width: 100%;
  border: 1px solid #8e8ea9 !important;
  font-size: 14px;
  border-radius: 15px !important;
  padding-left: 0.5em;
  height: 100%;
  outline: none;
}
.password:focus,
.password:hover {
  border: 1px solid var(--info-color) !important;
  background: white !important;
  box-shadow: -0.1em -0.1em 0 var(--info-color),
    0.1em -0.1em 0 var(--info-color), 0.1em 0.1em 0 var(--info-color),
    -0.1em 0.1em var(--info-color);
}
.password input {
  width: 85%;
  font-size: 14px;
  height: 100%;
  height: 100%;
  outline: none;
  border-radius: 15px;
  border: 1px transparent !important;
  padding: 1.3em 0em 1.3em 0.5em;
  font-size: 15px;
  line-height: 18px;
  background-color: white !important;
  -webkit-box-shadow: 0 0 0px 1000px white inset;
}
.password input.large {
  width: 90% !important;
}
.password input.medium {
  width: 85% !important;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}
.password .black {
  outline: none;
  border: transparent;
  background: white;
  color: rgb(64, 64, 64);
}
</style>
