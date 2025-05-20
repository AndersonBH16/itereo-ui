<template>
  <b-message
    v-if="quoteExportFailed.isOpen"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Modal"
    aria-modal
    @close="closeModal"
    v-bind="$attrs"
    class="quote_export_failed_alert"
  >
    <div class="quote_export_failed_alert__container">
      <header class="w-100 mb-5">
        <h1 class="is-relative">
          {{ quoteExportFailed.title }}
        </h1>
      </header>
      <main
        class="w-100 is-flex is-flex-direction-column is-align-items-start mb-2"
      >
        <p class="has-text-left" style="font-size: 0.8rem">
          This items have issues:
        </p>

        <div class="quote_export_failed_alert__container--list w-100">
          <ul class="mt-2">
            <li
              v-for="item in quoteExportFailed.items"
              :key="item.id"
              class="text-left"
            >
              <a :href="item.link" target="_blank" class="has-text-link">
                {{ item.message }}
              </a>
            </li>
          </ul>
        </div>

        <strong class="mt-4" style="font-size: 0.8rem"
          >Please, check the items and try again or contact
          support.(support@itereo.travel)</strong
        >
      </main>
      <footer class="w-100">
        <div class="is-flex is-justify-content-end is-align-items-center mt-4">
          <BaseButton class="m-0 mr-2" action="primary" @click="closeModal">
            <p slot="text">Ok</p>
          </BaseButton>
        </div>
      </footer>
    </div>
  </b-message>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "QuoteExportFailedAlert",
  computed: {
    ...mapGetters({
      quoteExportFailed: "itinerary/getQuoteExportFailed",
    }),
  },
  methods: {
    closeModal() {
      this.$store.dispatch("itinerary/closeQuoteExportFailedAlert");
    },
  },
};
</script>
<style>
.quote_export_failed_alert__container {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40rem;
  height: auto;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  font-family: Poppins, sans-serif;
  position: fixed;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
}
.quote_export_failed_alert__container > header > h1 {
  color: #1e1e1e;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: left;
}

.quote_export_failed_alert__container--list {
  max-height: 10rem;
  overflow-y: auto;
}
.quote_export_failed_alert__container ul {
  margin-left: 1.5rem;
  list-style: disc;
}

.quote_export_failed_alert__container li {
  list-style: disc;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  text-align: left;
}

.quote_export_failed_alert {
  z-index: 999;
  position: fixed;
}

.quote_export_failed_alert .modal-background {
  display: none;
}
</style>
