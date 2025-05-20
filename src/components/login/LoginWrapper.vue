<template>
  <section class="hero is-fullheight">
    <div class="hero-body p-0">
      <div class="container is-fluid p-0">
        <div class="columns is-gapless">
          <div
            class="column is-two-fifths-desktop is-three-fifths-tablet is-flex is-justify-content-center is-align-self-center"
          >
            <slot />
          </div>
          <div class="column is-hidden-mobile">
            <slot name="carousel" />
          </div>
        </div>
      </div>
    </div>
    <slot name="footer" />
  </section>
</template>

<script>
export default {
  name: "LoginWrapper",
};
</script>
