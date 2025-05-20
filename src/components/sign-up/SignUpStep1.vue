<template>
  <div class="signUpFormContainer">
    <a href="/"><Logo class="logo" /></a>
    <section class="signUpForm">
      <form @submit.prevent="handleSubmit">
        <div class="signUpFormHeader field">
          <h1 class="pb-2">Joining Itereo is easy.</h1>
          <p>
            Complete the form, we will review your request and contact you
            shortly.
          </p>
        </div>
        <div class="InputsContainerName field">
          <BaseInput
            style="width: 48%"
            customSize="xlarge"
            type="text"
            placeholder="Enter your first name"
            v-model="formChild.name"
            label="Your First Name *"
            required
            @blur.native="$v.formChild.name.touch()"
          />
          <BaseInput
            style="width: 48%"
            customSize="xlarge"
            type="text"
            placeholder="Enter your last name"
            v-model="formChild.lastName"
            required
            label="Your Last Name *"
          />
        </div>
        <BaseInput
          customSize="xlarge"
          type="email"
          placeholder="some@example.com"
          v-model="formChild.email"
          required
          label="Your Email*"
          class="field"
        />

        <BaseInput
          customSize="xlarge"
          type="text"
          placeholder="Enter your company name"
          v-model="formChild.company"
          required
          label="Company*"
          class="field"
        />

        <BaseTextarea
          v-model="formChild.message"
          placeholder="Enter your message"
          label="Your Message"
          class="mb-5"
        />

        <b-field>
          <BaseButton
            :disabled="disabledButton"
            :loading="loading"
            size="xlarge"
            ><p slot="text">Send</p>
            <p
          /></BaseButton>
        </b-field>
        <b-field class="field-newAccount">
          <span>Already have an account? <a href="/">Sign In</a></span>
        </b-field>
      </form>
    </section>
  </div>
</template>

<script>
import Logo from "@/components/_shared/Logo.vue";

export default {
  name: "SingUpStep1",
  data() {
    return {
      errorMessage: null,
      formChild: {
        name: "",
        lastName: "",
        email: "",
        password: "",
        step: 1,
      },
    };
  },
  components: {
    Logo,
  },
  props: {
    form: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    disabledButton() {
      if (
        this.formChild.name !== "" &&
        this.formChild.lastName !== "" &&
        this.formChild.email !== "" &&
        this.formChild.message !== ""
      ) {
        return false;
      }
      return true;
    },
  },
  methods: {
    async handleSubmit() {
      this.$emit("updateForm", this.formChild);
      await this.onSubmit(this.formChild);
      this.formChild.step = 2;
    },
  },
};
</script>

<style scoped>
.signUpFormContainer {
  padding-top: 1rem;
}
.logo {
  height: 3.5rem;
  object-fit: contain;
}
.signUpForm {
  background: white;
  border-radius: 15px;
  padding: 10px 59px;
  width: 38rem;
  margin: 5% 0;
}
.signUpFormHeader {
  display: flex;
  flex-direction: column;
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
.InputsContainerName {
  display: flex;
  justify-content: space-between;
}
.InputsContainerName .field {
  width: 48%;
}
.field-password a {
  text-align: end;
  font-size: 13px;
  line-height: 15px;
  padding-bottom: 0.2rem;
}
.field-newAccount {
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
}
.field-newAccount a {
  text-decoration: underline;
  color: var(--info-color);
  font-weight: 500;
}
.field-newAccount a:hover {
  text-decoration: underline;
  font-weight: 600;
  color: var(--info-color);
}
.field-newAccount span {
  font-weight: 400;
}
h4 {
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
}
h1 {
  font-size: 35px;
  font-weight: 600;
  line-height: 52px;
}
.icon-eye {
  position: relative;
  bottom: 35%;
  left: 90%;
}
</style>
