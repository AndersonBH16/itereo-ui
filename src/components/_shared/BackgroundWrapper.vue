<template>
  <section class="hero is-fullheight">
    <div class="overlayContainer">
      <img
        src="/img/Slider.svg"
        alt="Workflow"
        class="m-auto image background"
        width="100%"
      />
    </div>
    <div class="signUpBody">
      <slot />
      <Footer class="is-bottom" />
    </div>
  </section>
</template>

<script>
import Footer from "@/components/_shared/Footer.vue";

export default {
  name: "SignUpWrapper",
  components: { Footer },
};
</script>
<style scoped>
.is-fullheight {
  display: flex;
}
.overlayContainer {
  height: 100vh;
  width: 100vw;
  z-index: 0;
}
.background {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  object-fit: cover;
}
.overlay {
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1;
}
.signUpBody {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: none;
  align-items: center;
  padding: 0 !important;
}
</style>
