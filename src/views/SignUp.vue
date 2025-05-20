<template>
  <BackgroundWrapper>
    <template #default>
      <SignUpForm />
    </template>
  </BackgroundWrapper>
</template>

<script>
import BackgroundWrapper from "@/components/_shared/BackgroundWrapper.vue";
import SignUpForm from "@/components/sign-up/SignUpForm.vue";

export default {
  name: "SignUp",
  components: {
    BackgroundWrapper,
    SignUpForm,
  },
};
</script>
