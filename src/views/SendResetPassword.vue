<template>
  <BackgroundWrapper>
    <template #default>
      <SendResetPasswordForm />
    </template>
  </BackgroundWrapper>
</template>

<script>
import BackgroundWrapper from "@/components/_shared/BackgroundWrapper.vue";
import SendResetPasswordForm from "@/components/reset-password/SendResetPasswordForm.vue";

export default {
  name: "SendResetPassword",
  components: {
    BackgroundWrapper,
    SendResetPasswordForm,
  },
};
</script>
