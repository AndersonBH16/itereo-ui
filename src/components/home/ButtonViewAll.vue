<template>
  <center>
    <GlobalEvents @keydown.alt.65="keymap" />
    <router-link :to="{ path: paths.QUOTES.path }" class="px-5 mt-5">
      <div class="buttonViewAllCenter">
        <BaseButton size="large" action="principal">
          <p slot="text">View all</p>
        </BaseButton>
      </div>
    </router-link>
  </center>
</template>

<script>
import GlobalEvents from "vue-global-events";
import { PATH_INFO } from "@/router/path";

export default {
  name: "ButtonViewAll",
  components: {
    GlobalEvents,
  },
  data() {
    return {
      paths: { ...PATH_INFO },
    };
  },
  methods: {
    keymap(e) {
      e = e || window.event;
      const code = e.which || e.keyCode;
      switch (code) {
        case 65:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
      this.$router.push(PATH_INFO.QUOTES.path);
    },
  },
};
</script>

<style scoped>
.buttonViewAllCenter {
  margin: auto;
  width: 10rem;
}
</style>
