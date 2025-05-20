<template>
  <section class="signup__container">
    <SignUpStep1
      v-if="stepActive === 1"
      :form="form"
      :loading="loading"
      :onSubmit="onSubmit"
      @updateForm="updateForm"
    />
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
    <!-- <SignUpStep2
      v-if="stepActive === 2"
      :form="form"
      @updateForm="updateForm"
      @createUser="createAccount"
      :loading="loading"
    /> -->
  </section>
</template>

<script>
import SignUpStep1 from "@/components/sign-up/SignUpStep1";
import IconCheckCircle from "../icons/IconCheckCircle.vue";

export default {
  name: "SingUpForm",
  data() {
    return {
      form: {
        name: "",
        lastName: "",
        email: "",
        step: 1,
        message: "",
      },
      loading: null,
      stepActive: 1,
      responseMessage: null,
    };
  },
  components: {
    SignUpStep1,
    IconCheckCircle,
  },
  methods: {
    updateForm(event) {
      this.loading = true;
      if (event.step === 2) {
        this.form = { ...this.form, event };
        this.stepActive = event.step;
      }
      this.loading = null;
    },
    errorToast() {
      return this.$buefy.toast.open({
        duration: 5000,
        message:
          "An unexpected error has ocurred, please contact to support@itereo.travel.",
        position: "is-top",
        type: "is-danger",
      });
    },
    login(credentials) {
      this.$store
        .dispatch("auth/getToken", credentials)
        .then(() => {
          this.isLoading = false;
          this.$router.replace(this.$route.query.redirect || { name: "home" });
        })
        .catch((err) => {
          this.loading = null;
          this.errorToast();
          this.form = {};
          console.info(err);
        });
    },
    async createAccount(event) {
      this.loading = true;
      try {
        const data = { ...this.form.event, plan: event };
        const response = await this.$store.dispatch("users/registerUser", data);
        if (response) {
          this.loading = null;
          this.$buefy.toast.open({
            duration: 5000,
            message: response.message,
            position: "is-top",
            type: "is-success",
          });
          this.login({ email: data.email, password: data.password });
        } else {
          this.loading = null;
          this.errorToast();
        }
      } catch (err) {
        this.loading = null;
        this.errorToast();
        this.form = {};
      }
    },
    async onSubmit(form) {
      this.loading = true;
      try {
        const response = await this.$store.dispatch("users/sendContactUs", {
          first_name: form.name,
          last_name: form.lastName,
          email: form.email,
          description: form.message ?? "",
          company: form?.company ?? "",
        });
        if (response) {
          this.loading = null;
          this.responseMessage = response.data.message;
          this.$buefy.toast.open({
            duration: 5000,
            message: response.data.message,
            position: "is-top",
            type: "is-success",
          });
          this.stepActive = 2;
        } else {
          this.loading = null;
          this.errorToast();
        }
      } catch (err) {
        this.loading = null;
        this.errorToast();
        this.form = {
          name: "",
          lastName: "",
          email: "",
          step: 1,
          message: "",
        };
      }
    },
  },
};
</script>

<style scoped>
.signup__container {
  display: grid;
  place-items: center;
  height: 80vh;
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
