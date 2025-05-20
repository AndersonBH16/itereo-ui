<template>
  <div class="base-textarea-container">
    <label class="label" v-if="label">{{ label }} </label>
    <textarea
      v-bind="$attrs"
      :class="[
        size === 'large' ? 'large' : '',
        size === 'medium' ? 'medium' : '',
        size === 'xlarge' ? 'xlarge' : '',
        size === 'small' ? 'small' : '',
        'base-textarea',
        value !== '' ? 'hideDangerIcon' : 'showDangerIcon',
      ]"
      :rows="rows"
      :cols="cols"
      :placeholder="placeholder"
      v-model="value"
      :disabled="disabled"
      @input="updateValue"
      :required="required"
      :maxlength="maxlength"
    >
    </textarea>
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
    },
    size: {
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
    rows: {
      type: Number,
      default: 4,
    },
    cols: {
      type: Number,
      default: 50,
    },
    maxlength: {
      type: Number,
    },
  },
  methods: {
    updateValue() {
      this.$emit("input", this.value);
    },
  },
};
</script>

<style scoped>
.base-textarea-container {
  display: flex;
  flex-direction: column;
}
.base-textarea-container .label {
  margin-bottom: 0.5em;
  font-size: 1em;
}
.base-textarea {
  border-radius: 15px;
  border: 1px solid #8e8ea9 !important;
  font-size: 14px;
  padding: 0.9em 0.4em;
  outline: none;
  -webkit-box-shadow: 0 0 0px 1000px white inset;
}
.base-textarea:focus,
.base-textarea:hover {
  border: 1px solid var(--info-color) !important;
  background: white !important;
  box-shadow: -0.1em -0.1em 0 var(--info-color),
    0.1em -0.1em 0 var(--info-color), 0.1em 0.1em 0 var(--info-color),
    -0.1em 0.1em var(--info-color);
}
.control.has-icons-left .icon,
.control.has-icons-right .icon {
  display: none;
}
.base-textarea.xlarge input {
  padding: 1.8em 1em;
  font-size: 15px;
  line-height: 18px;
}

.help.is-danger {
  display: flex;
  flex-direction: column;
}
.help.is-danger:after {
  content: "This field is required";
  background: white;
  top: -1rem;
  position: relative;
  color: #f14668;
}
.base-textarea.large {
  line-height: 0.9;
}
.base-textarea input:hover,
input:focus {
  border: 2px solid var(--info-color) !important;
  background: white !important;
  box-shadow: none !important;
}

/**Disabled */
[disabled].input {
  opacity: 0.99;
  color: #8e8ea9 !important;
  background-color: #eaeaef !important;
  pointer-events: none;
  cursor: default;
}
/**Disabled */
</style>
