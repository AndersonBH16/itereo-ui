<template>
  <div class="resetFormContainer">
    <Loading :loading="loading" />
    <div class="logoContainer"><Logo class="logo" /></div>
    <section v-if="stepActive === 1" class="resetForm">
      <form @submit.prevent="sendResetPasswordLink">
        <b-field class="title">
          <h1>Reset Your Password</h1>
        </b-field>
        <b-field class="label"
          >Enter your user account's verified email address and we will send you
          a password reset link.</b-field
        >
        <BaseInput
          customSize="xlarge"
          type="email"
          placeholder="some@example.com"
          v-model="email"
          required
          class="field"
        />

        <b-field class="formResetButton">
          <BaseButton :disabled="disabledButton" size="xlarge"
            ><p slot="text">Send Password Reset Email</p>
            <p
          /></BaseButton>
        </b-field>
        <b-field class="field-newAccount">
          <a href="/">Do you remember your password? <span>Sign In</span></a>
        </b-field>
      </form>
    </section>
    <div v-if="stepActive === 2" class="success__message">
      <IconCheckCircle />
      <div>
        <h2>Your request has been sent</h2>
        <p class="mt-0">
          {{ responseMessage }}<br />
          Now, you can close this window.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/_shared/Loading.vue";
import Logo from "@/components/_shared/Logo.vue";

export default {
  name: "SendResetPasswordForm",
  data() {
    return {
      loading: null,
      email: "",
      responseMessage: null,
      stepActive: 1,
    };
  },
  components: {
    Loading,
    Logo,
  },
  computed: {
    disabledButton() {
      if (this.email === "") {
        return true;
      }
      return false;
    },
  },
  methods: {
    async sendResetPasswordLink() {
      this.loading = true;
      try {
        const response = await this.$store.dispatch(
          "users/sendResetPasswordLink",
          { email: this.email }
        );

        this.responseMessage = response?.message;
        this.stepActive = 2;

        this.$buefy.toast.open({
          duration: 5000,
          message:
            response?.message || "Password reset link sent successfully!",
          position: "is-top",
          type: "is-success",
        });
      } catch (err) {
        console.error("Error sending password reset link", err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Error sending password reset link, please try again!",
          position: "is-top",
          type: "is-danger",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.resetFormContainer {
  padding-top: 1rem;
}
.logoContainer {
  padding: 1rem;
}
.logo {
  height: 3.5rem;
  object-fit: contain;
}
.resetForm {
  background: white;
  border-radius: 15px;
  padding: 10px 59px;
  width: 30rem;
  margin: 5% 0;
}
.resetForm .title {
  margin-bottom: 2rem;
}
.resetForm .label {
  font-size: 13px;
  line-height: 16px;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2rem;
}
form .field {
  margin-bottom: 1.5rem;
}
h1 {
  font-size: 30px;
  font-weight: 600;
  line-height: 45px;
}
.field-newAccount {
  text-align: center;
}
.field-newAccount a {
  color: black;
}
.field-newAccount a span {
  text-decoration: underline;
  color: var(--info-color);
  font-weight: 500;
}
.success__message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  margin: 1rem 0;
  gap: 1rem;
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1rem;
  }
}
.success__message svg {
  width: 3rem;
  height: 3rem;
}
.success__message :is(path, circle) {
  color: green;
}
</style>
