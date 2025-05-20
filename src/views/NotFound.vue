<template>
  <PageWrapper :showFooter="false">
    <section class="section is-large has-text-centered">
      <picture class="image" v-if="itineraryErrorMessage.message.length > 0">
        <img
          class="ImageUnderConstruction"
          src="/img/under-constuction.jpg"
          alt="Under construction"
        />
      </picture>
      <h1 class="title">{{ message.title }}</h1>
      <h2 class="subtitle mt-2" v-html="message.subtitle" />
      <b-button
        tag="router-link"
        :to="{ path: paths.HOME.path }"
        type="is-info is-light"
      >
        Go home</b-button
      >
    </section>
  </PageWrapper>
</template>

<script>
import PageWrapper from "@/components/_shared/PageWrapper.vue";
import { mapGetters } from "vuex";
import { PATH_INFO } from "@/router/path";

export default {
  name: "NotFound",
  components: {
    PageWrapper,
  },
  data() {
    return {
      paths: { ...PATH_INFO },
    };
  },
  computed: {
    ...mapGetters({
      itineraryErrorMessage: "itinerary/getErrorMessage",
    }),
    message() {
      return this.itineraryErrorMessage.message?.length > 0
        ? {
            title: this.itineraryErrorMessage.status,
            subtitle: this.itineraryErrorMessage.message,
          }
        : {
            title: "404 - Page not Found",
            subtitle: `Sorry we can't seem to find the page you're looking for.`,
          };
    },
  },
};
</script>

<style scoped>
.section {
  padding: 12rem 0;
}
.image {
  width: 30rem;
  height: 20rem;
  display: flex;
  margin: 0 auto 2rem;
  object-fit: cover;
}
.image img {
  width: 100%;
  height: 100%;
}
</style>
