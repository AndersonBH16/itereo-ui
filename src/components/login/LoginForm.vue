<template>
  <section class="p-5 w-80">
    <div class="mb-5"><Logo /></div>
    <form @submit.prevent="handleSubmit">
      <b-message
        type="is-danger"
        size="is-small"
        aria-close-label="Close message"
        v-if="errorMessage"
      >
        {{ errorMessage }}
      </b-message>
      <div class="loginForm-field">
        <BaseInput
          customSize="xlarge"
          type="email"
          placeholder="some@example.com"
          :value="email || ''"
          required
          label="Email"
          @input="email = $event"
          @blur.native="$v.email.$touch()"
        />
      </div>
      <div class="field-password loginForm-field">
        <BaseInputPassword
          customSize="xlarge"
          type="password"
          placeholder="Enter your password"
          label="Password"
          v-model="password"
          required
        />
        <a
          type="is-text no-decoration mt-2"
          @click.prevent="redirectToResetPassword"
        >
          Forgot Password?
        </a>
      </div>

      <div class="field-password loginForm-field">
        <BaseSelect
          size="xl"
          :list="tenantsList"
          optionValue="domain"
          optionText="name"
          placeholder="Select a Tenant"
          v-model="tenantSelected"
          class="mb-3"
          label="Tenant (*)"
          required
          @input="handleTenantChange"
        />
      </div>

      <div class="loginForm-field">
        <BaseButton
          :loading="loading"
          :disabled="loading || $v.$invalid"
          size="xlarge"
          ><p slot="text">Sign In</p></BaseButton
        >
      </div>

      <b-field class="field-newAccount">
        <span>New to Itereo? <a href="/signup">Create an account</a></span>
      </b-field>
    </form>
  </section>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import Logo from "@/components/_shared/Logo.vue";
import { mapGetters } from "vuex";
import { setBaseUrlByTenant } from "@/services/request";
import { PATH_INFO } from "@/router/path";

export default {
  name: "LoginForm",
  data() {
    return {
      loading: null,
      errorMessage: null,
      email: "",
      password: "",
      tenantSelected: "",
    };
  },
  validations: {
    email: {
      email,
      required,
    },
    password: {
      required,
    },
    tenantSelected: {
      required,
    },
  },
  components: { Logo },
  computed: {
    ...mapGetters({
      tenantsBase: "tenants/getTenants",
    }),
    tenantsList() {
      if (this.tenantsBase?.length < 1) return [];
      return this.tenantsBase?.data
        ?.map((tenant, ind) => {
          return {
            id: `${ind}-${tenant.domain}`,
            name: `${tenant.name}`,
            domain: tenant.domain,
            baseURL: tenant.baseURL,
          };
        })
        .filter((tenant) => ["ela", "demo"].includes(tenant.name));
    },
  },
  methods: {
    redirectToResetPassword() {
      this.$router.push({ path: PATH_INFO.SEND_RESET_PASSWORD.path });
    },
    handleTenantChange() {
      setBaseUrlByTenant(this.tenantSelected.baseURL);
    },
    handleSubmit() {
      this.loading = true;
      this.errorMessage = null;
      const credentials = {
        email: this.email,
        password: this.password,
        tenant: this.tenantSelected,
      };
      this.$store
        .dispatch("auth/getToken", credentials)
        .then(() => {
          this.loading = null;
          // Redirect to the originally requested page, or to the home page
          this.$router.replace(this.$route.query.redirect || { name: "home" });
        })
        .catch((error) => {
          this.loading = null;
          this.errorMessage =
            error && error.response && error.response.data
              ? error.response.data.error
              : null;
        });
    },
    async fetchTenants() {
      this.loading = true;
      await this.$store.dispatch("tenants/list");
      this.selectDefaultTenant();
      this.loading = false;
    },
    selectDefaultTenant() {
      this.tenantSelected = this.tenantsList[0];
    },
  },
  created() {
    this.fetchTenants();
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 10%;
  margin-top: 2rem;
}
form .loginForm-field {
  margin-bottom: 1rem;
}
.loginForm-field .selectContainer .base-select {
  padding: 1rem 0.8rem;
}
.loginTitle {
  font-size: 30px;
  font-weight: 600;
  line-height: 45px;
  text-align: center;
  margin-bottom: 1rem;
}
.field-password {
  display: flex;
  flex-direction: column;
}
.field-password a {
  text-align: end;
  font-size: 13px;
  line-height: 15px;
  margin-top: 0.5em;
  color: black;
}
.field-password a:hover {
  color: var(--info-color);
}
.field-newAccount {
  text-align: center;
  font-size: 16px;
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
</style>
