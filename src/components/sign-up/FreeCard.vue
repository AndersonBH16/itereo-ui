<template>
  <section class="cardContainer">
    <b-button
      class="iconWarningButton"
      v-b-popover.hover.top="
        'Travel itinerary quoting platform. Quickly build a basic itemized quote and final price, using their company’s pricing database and inventory.'
      "
    >
      <IconWarningCircle class="iconWarning" />
    </b-button>

    <div class="header">
      <h3>LITE</h3>
      <h1>Free</h1>
      <p class="paragraph">Per user, per month</p>
      <BaseButton
        @click.prevent="next"
        class="buttonFreecard"
        size="xlarge"
        action="secondary"
        :loading="loading && localLoading"
        :disabled="loading"
        ><p slot="text">NEXT</p>
        <p
      /></BaseButton>
      <div class="line" />

      <div class="body">
        <div v-for="(item, index) in items" :key="index" class="item">
          <IconCheck />
          {{ item["value"] }}
          <div @click="isOpen = !isOpen">
            <a v-if="!isOpen"><p>More Details</p></a>
            <a v-else><p>Hidde</p></a>
          </div>
          <b-collapse
            class="card mb-2"
            animation="slide"
            :open="isOpen"
            @open="isOpen"
          >
            <div class="card-content">
              <div class="content">{{ item["value"] }}</div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FreeCard",
  data() {
    return {
      isOpen: false,
      localLoading: false,
    };
  },
  props: {
    items: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    next() {
      this.localLoading = true;
      this.$emit("choosePlan", "free");
      setTimeout(() => {
        this.localLoading = null;
      }, 2000);
    },
  },
};
</script>

<style scoped>
.cardContainer {
  background: white;
  border-radius: 15px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  width: 100%;
  height: max-content;
}
.header {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.iconWarningButton {
  margin-left: 90%;
  margin-top: 0.5rem;
  padding: 0;
  border-radius: 100%;
  height: 1rem;
  border: transparent;
}
.iconWarning {
  width: 100%;
}
h3 {
  font-size: 30px;
  line-height: 45px;
  font-weight: bold;
  letter-spacing: 0.04em;
  margin-bottom: 2rem;
}
h1 {
  font-weight: bold;
  font-size: 60px;
  line-height: 70px;
  letter-spacing: 0.04em;
  margin: 0 !important;
}
.paragraph {
  font-size: 15px;
  line-height: 22px;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}
.buttonFreecard {
  width: 80%;
}

.line {
  border: 1px solid #404040;
  transform: rotate(-180deg);
  background: #404040;
  width: 40%;
  margin: 1rem 0;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.body {
  width: 90%;
  padding: 1rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.body .item {
  margin-bottom: 0.8rem;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 00.04em;
}

.body .item a {
  text-decoration: underline;
  color: #8e8ea9;
  font-size: 13px;
  line-height: 19px;
  font-weight: normal;
  margin-top: 0.4em;
}
.collapse:not(.show) {
  display: block;
}
.collapse.card {
  border: none;
  box-shadow: none;
  margin-top: 0.5em;
}
.collapse.card .card-content {
  padding: 0;
}
.collapse.card .card-content .content {
  font-size: 14px;
  line-height: 21px;
  font-weight: normal;
  border: transparent;
}
</style>
