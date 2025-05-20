<template>
  <div class="textIntro">
    <span class="is-h2 mr-2"
      ><strong>WELCOME | {{ showFirstNameAndRole }} </strong></span
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "WelcomeText",
  computed: {
    ...mapGetters({
      userData: "auth/getAuthUserData",
    }),
    showFirstNameAndRole() {
      const names = this.userData.name.split(" ");
      const role = this.userData.roles
        ? this.userData.roles.data
          ? this.userData.roles.data[0].name
          : "SALES AGENT"
        : "SALES AGENT";
      return `${names[0].toUpperCase()} (${role.toUpperCase()})`;
    },
  },
};
</script>

<style scoped>
.name {
  font-size: 20px;
}
@media screen and (max-width: 480px) {
  .textIntro {
    margin-top: 1rem;
  }
}
</style>
