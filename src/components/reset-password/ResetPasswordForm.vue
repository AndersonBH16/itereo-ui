<template>
  <div class="resetFormContainer">
    <Loading :loading="loading" />
    <div class="logoContainer"><Logo class="logo" /></div>
    <section class="resetForm">
      <form @submit.prevent="resetPassword">
        <b-field class="title">
          <h1>Reset Your Password</h1>
        </b-field>
        <BaseInputPassword
          customSize="medium"
          type="password"
          placeholder="New password"
          v-model="form.password"
          required
          label="New Password*"
          class="field"
        />
        <BaseInputPassword
          customSize="medium"
          type="password"
          placeholder="Password confirmation"
          v-model="form.password_confirmation"
          required
          label="Password Confirmation*"
          class="field"
        />

        <b-field class="formResetButton">
          <BaseButton :disabled="disabledButton" size="xlarge"
            ><p slot="text">Reset Password</p>
            <p
          /></BaseButton>
        </b-field>
      </form>
    </section>
  </div>
</template>

<script>
import Loading from "@/components/_shared/Loading.vue";
import Logo from "@/components/_shared/Logo.vue";
import { PATH_INFO } from "@/router/path";

export default {
  name: "ResetPasswordForm",
  data() {
    return {
      loading: null,
      form: {
        password: "",
        password_confirmation: "",
      },
    };
  },
  components: {
    Loading,
    Logo,
  },
  computed: {
    disabledButton() {
      if (this.form.password === "" || this.form.password_confirmation === "") {
        return true;
      }
      return false;
    },
  },
  mounted() {
    if (!this.$route.query.token || !this.$route.query.id) {
      this.$router.push(PATH_INFO.HOME.path);
      return;
    }
  },
  methods: {
    async resetPassword() {
      this.loading = true;
      try {
        const token = this.$route.query.token;
        const id = this.$route.query.id;
        if (!token || !id) {
          this.$router.push(PATH_INFO.HOME.path);
          return;
        }
        if (this.form.password !== this.form.password_confirmation) {
          this.loading = null;
          this.$buefy.toast.open({
            duration: 5000,
            message: "Passwords do not match",
            position: "is-top",
            type: "is-danger",
          });
          return;
        }
        const data = { ...this.form, id, token };
        const response = await this.$store.dispatch(
          "users/resetPassword",
          data
        );
        if (response) {
          this.loading = null;
          this.$buefy.toast.open({
            duration: 5000,
            message: response.message,
            position: "is-top",
            type: "is-success",
          });
          this.$router.push({ path: PATH_INFO.HOME.path });
        } else {
          this.loading = null;
          return this.$buefy.toast.open({
            duration: 5000,
            message: "An unexpected error has ocurred, please try again",
            position: "is-top",
            type: "is-danger",
          });
        }
      } catch (err) {
        this.loading = null;
        return this.$buefy.toast.open({
          duration: 5000,
          message: "An unexpected error has ocurred, please try again",
          position: "is-top",
          type: "is-danger",
        });
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
</style>
