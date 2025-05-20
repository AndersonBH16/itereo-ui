<template>
  <div class="template-cards mb-5">
    <p class="has-text-weight-bold template-card-title mb-2">
      Select a template
    </p>
    <!-- <b-carousel-list v-model="step" :data="templates" :items-to-show="3">
      <template #item="template"> -->
    <div v-for="template in templates" :key="template.id">
      <div
        :class="[
          templateOption === template.id ? 'active' : '',
          'template-card border-radius-20 is-flex p-2 w-40',
        ]"
      >
        <div class="PhotoImage sideBar">
          <img :src="template.image_cover" :alt="template.name" />
          <b-radio
            v-model="templateOption"
            name="name"
            :native-value="Number(template.id)"
            class="card__content"
          >
            {{ template.name }}
          </b-radio>
        </div>
      </div>
    </div>
    <!-- </template>
    </b-carousel-list> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "ExportTemplates",
  props: {
    templateOption: {
      type: Number,
    },
  },
  data() {
    return {
      templateOptionLocal: this.templateOption,
      step: 0,
      // templates: [
      //   {
      //     id: 1,
      //     name: "Saas Template",
      //     url: "saas",
      //     image_cover: "https://itp-saas-api-dev.s3.us-east-2.amazonaws.com/thumbnails/CR/CR-SJO/350X240/saas_template_thumbnail_350X240.png"
      //   },
      //   {
      //     id: 2,
      //     name: "Ela Template",
      //     url: "",
      //     image_cover: "https://itp-saas-api-dev.s3.us-east-2.amazonaws.com/thumbnails/CR/CR-SJO/350X240/ela_template_thumbnail_350X240.png"
      //   },
      //   {
      //     id: 3,
      //     name: "WhiteLabel Template",
      //     url: "whitelabel",
      //     image_cover: "https://itp-saas-api-dev.s3.us-east-2.amazonaws.com/thumbnails/CR/CR-SJO/350X240/saas_template_thumbnail_350X240.png"
      //   },
      // ],
    };
  },
  watch: {
    templateOptionLocal: function (oldVal, newVal) {
      console.log(oldVal + " " + newVal);
      this.templateOption = oldVal;
    },
  },
  computed: {
    ...mapGetters({
      templates: "itinerary/getWebTemplates",
    }),
    // templateOptionLocal: {
    //   get() {
    //     console.log("getting", this.templateOption)
    //     return this.templateOption;
    //   },
    //   set(newValue) {
    //     console.log("setting", newValue)
    //     this.templateOption = newValue;
    //     this.$emit("templateOption", newValue);
    //   },
    // }
  },
  mounted() {
    this.$store
      .dispatch("itinerary/getWebTemplates")
      .finally(() => console.log("termine"));
  },
};
</script>
<style>
.carousel-arrow .icon {
  color: #fff;
  border: #fff;
}
.carousel-list.has-shadow {
  box-shadow: none;
}
.carousel-list {
  width: 100%;
  gap: 2rem;
  margin: 0 auto;
}
.carousel-slides {
  overflow-x: scroll;
}
.carousel-slides::-webkit-scrollbar {
  height: 0.8rem;
}
.carousel-slide {
  margin: 0 2rem;
  max-width: 15rem;
  min-width: 15rem;
}
.template-card.active {
  filter: none;
}
.template-card {
  margin: 2rem auto;
  width: fit-content;
  filter: grayscale(100%);
}
.template-card {
  border: 2px solid var(--gray-600);
  justify-content: space-between;
}
.template-card.active {
  border-color: var(--secondary-color);
}
.collapse:not(.show) {
  display: block;
}
.card-header {
  padding: 0;
  border-radius: 15px !important;
  border-bottom: 0;
}
.publish.color-11 {
  transition: transform 0.3s, border 0.3s, background 0.3s, color 0.3s;
}
.publish.color-11:hover {
  color: var(--info-color) !important;
}
.checkbox-container {
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 15%),
    0 0 0 1px rgb(10 10 10 / 2%);
  width: max-content;
}
.PhotoImage.sideBar img {
  height: 10rem;
}
.PhotoImage {
  justify-content: center;
  align-items: center;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
.card__content {
  padding: 1rem 0;
}
</style>
