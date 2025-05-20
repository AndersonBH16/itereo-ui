<template>
  <footer class="footer py-3 px-6">
    <div class="content">
      <p>
        <strong><small>Powered by</small></strong
        ><br /><img
          src="/img/logo-degradient.svg"
          width="80"
          class="mt-1"
        /><small class="copyright"
          ><span class="is-hidden-mobile">All rights reserved:</span> ©Global
          Encounters™ 1999-{{ year }}</small
        >
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>
