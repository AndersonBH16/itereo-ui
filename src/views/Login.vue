<template>
  <LoginWrapper>
    <template #default>
      <LoginForm />
    </template>
    <template #carousel>
      <LoginCarousel />
    </template>
    <template #footer>
      <Footer class="absolute is-bottom" />
    </template>
  </LoginWrapper>
</template>

<script>
import { AUTH_STORAGE_KEY } from "@/config.js";
import { PATH_INFO } from "@/router/path";

import LoginWrapper from "@/components/login/LoginWrapper.vue";
import LoginForm from "@/components/login/LoginForm.vue";
import LoginCarousel from "@/components/login/LoginCarousel.vue";
import Footer from "@/components/_shared/Footer.vue";

export default {
  name: "Login",
  components: {
    LoginWrapper,
    LoginForm,
    LoginCarousel,
    Footer,
  },
  beforeRouteEnter(to, from, next) {
    const isAuthenticated =
      JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY))?.token?.length > 0;
    if (isAuthenticated) {
      next({ name: PATH_INFO.HOME.name });
    } else {
      next();
    }
  },
};
</script>
