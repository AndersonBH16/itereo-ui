<template>
  <div class="copy_pax_container">
    <button v-if="!isOpenMenu" @click="toggleIsOpenMenu" class="copy_pax_icon">
      <IconCopyOutlined />
    </button>
    <button v-else @click="toggleIsOpenMenu" class="copy_pax_icon">
      <IconCopyFilled />
    </button>
    <section v-if="isOpenMenu" class="copy_pax_menu">
      <h1><IconCopyOutlined /> Clone {{ field }}</h1>
      <div>
        <button
          @click="
            actionClick('row', field, valueToCopy, box);
            toggleIsOpenMenu();
          "
        >
          <IconRowArrow />Apply to pax
        </button>
        <button
          @click="
            actionClick('column', field, valueToCopy, box);
            toggleIsOpenMenu();
          "
        >
          <IconColumnArrow />Apply to level
        </button>
        <button
          @click="
            actionClick('all', field, valueToCopy, box);
            toggleIsOpenMenu();
          "
        >
          <IconColumnRowArrow />Apply to all
        </button>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "CopyPaxChanges",
  props: {
    field: {
      type: String,
      default: "",
    },
    actionClick: {
      type: Function,
      default: () => {},
    },
    valueToCopy: {
      type: Number,
      default: 0,
    },
    box: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isOpenMenu: false,
    };
  },
  methods: {
    toggleIsOpenMenu() {
      this.isOpenMenu = !this.isOpenMenu;
    },
  },
};
</script>
<style scoped>
.copy_pax_container {
  display: inline-flex;
  position: relative;
}
.copy_pax_icon {
  cursor: pointer;
  border: none;
  background-color: transparent;
}
.copy_pax_menu {
  background: #ffffff;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: 0.8rem;
  min-width: 9rem;
  position: absolute;
  z-index: 999;
  left: 2rem;
}
.copy_pax_menu > h1 {
  color: #d9d9d9;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.copy_pax_menu > h1 :is(svg, path) {
  fill: #d9d9d9 !important;
}

.copy_pax_menu button {
  width: 100%;
  border: none;
  background-color: transparent;
  padding: 0.2rem 0;
  text-align: left;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 0.7rem;
  color: #aaaaaa;
}
.copy_pax_menu button:hover {
  color: #000000;
  background-color: #f2f2f2;
  border-radius: 0.25rem;
}
.copy_pax_menu button svg {
  margin-right: 0.25rem;
}
</style>
