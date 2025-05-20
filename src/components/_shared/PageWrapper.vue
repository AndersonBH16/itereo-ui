<template>
  <section class="hero is-fullheight">
    <GlobalNotification />
    <NewQuoteSideBar />
    <div class="container is-fluid py-5 gradientBackground">
      <div class="boxSaas">
        <slot />
      </div>
    </div>
    <Footer v-if="showFooter" />
  </section>
</template>

<script>
import GlobalNotification from "@/global-notification.vue";
import Footer from "@/components/_shared/Footer.vue";
import helpers from "@/helpers";
import NewQuoteSideBar from "@/components/_shared/NewQuoteSideBar.vue";

export default {
  name: "PageWrapper",
  components: {
    NewQuoteSideBar,
    GlobalNotification,
    Footer,
  },
  props: {
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.$store.dispatch("tags/getItinerariesTags");
  },
  computed: {
    backgroundImage() {
      return helpers.backgroundImage(
        "https://itp-saas-api-dev.s3.us-east-2.amazonaws.com/tenancy/assets/CR/CR-PVS/gradient_background_2.jpeg"
        // "https://305c511294116d47a2eb-8984c8bf4382d773df005374b9639769.ssl.cf2.rackcdn.com/itereo/ttc/background_app.jpg"
      );
    },
  },
};
</script>

<style>
.background-gradient {
  background-size: contain !important;
}
</style>
