<template>
  <div class="stepTwoContainer">
    <a href="/"><Logo class="logo" /></a>
    <section class="signUpForm">
      <b-form>
        <div class="signUpFormHeader field">
          <h4>Step 2<span></span> of 2</h4>
          <h1>Choose the plan that's right for you</h1>
        </div>
        <div class="cards">
          <div class="firstCard">
            <FreeCard
              :items="freeItems"
              @choosePlan="updateForm"
              :loading="loading"
            />
          </div>
          <ProCard
            :items="proItems"
            class="secondCard"
            @choosePlan="updateForm"
            :loading="loading"
          />
        </div>
      </b-form>
    </section>
  </div>
</template>

<script>
import Logo from "@/components/_shared/Logo.vue";
import FreeCard from "@/components/sign-up/FreeCard.vue";
import ProCard from "@/components/sign-up/ProCard.vue";

export default {
  name: "SingUpStep2",
  data() {
    return {
      errorMessage: null,
      freeItems: [
        {
          value:
            "Access to quoting module. Content module is not available stand alone.",
        },
        {
          value:
            "Restricted access to web itineraries, limited to 15 saved quotes.",
        },
        { value: "ITP Brand, free for 1 User, 10 saved Example Itineraries." },
      ],
      proItems: [
        "2-week trial option using ELA content and product. ",
        "Price quoting module +  Web Itinerary generation.",
        "ITP/Client Co-Branded, pay per 1 User, 20 saved Example Itineraries.",
        "Access to web itineraries, limited to 100 total saved quotes.",
        "Multiple Currencies, Passenger Details Integration.",
      ],
    };
  },
  components: {
    Logo,
    FreeCard,
    ProCard,
  },
  props: {
    form: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateForm(event) {
      this.$emit("createUser", event);
    },
  },
};
</script>

<style scoped>
.stepTwoContainer {
  width: 100vw;
  background: rgba(255, 255, 255, 0.7);
  height: 100%;
  left: 0;
  padding: 1rem 0;
}
.logo {
  height: 2.5rem;
  object-fit: contain;
  margin: 0 0 1rem 3rem !important;
  width: auto;
}
.signUpFormHeader {
  display: flex;
  flex-direction: column;
}
.signUpForm {
  width: 60%;
  margin: auto;
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
.cards {
  display: flex;
  padding: 4rem 1rem;
  width: 100%;
}
.cards .firstCard {
  width: 45%;
  padding-top: 3rem;
}
.cards .secondCard {
  width: 55%;
}
</style>
