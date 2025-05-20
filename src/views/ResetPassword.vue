<template>
  <BackgroundWrapper>
    <template #default>
      <ResetPasswordForm />
    </template>
  </BackgroundWrapper>
</template>

<script>
import BackgroundWrapper from "@/components/_shared/BackgroundWrapper.vue";
import ResetPasswordForm from "@/components/reset-password/ResetPasswordForm.vue";

export default {
  name: "ResetPassword",
  components: {
    BackgroundWrapper,
    ResetPasswordForm,
  },
};
</script>
