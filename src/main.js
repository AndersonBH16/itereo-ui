import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import Vuelidate from "vuelidate";

import { testId } from "./directives";
import CustomDateFilter from "@/filters/custom-date";
import JoinArrayFilter from "@/filters/join-array";
import helpers from "@/helpers";
import "vue-search-select/dist/VueSearchSelect.css";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueExpandableImage from "vue-expandable-image";

// Import Bootstrap and BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue/dist/bootstrap-vue.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(VueExpandableImage);
Vue.use(Vuelidate);

import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

const isPro = process.env.NODE_ENV === "production";

Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing({
      // Use the older BrowserTracing integration
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracePropagationTargets: [
    "localhost",
    process.env.VUE_APP_SENTRY_TRACE_PROPAGATION_TARGETS,
  ],
  tracesSampleRate: parseFloat(
    process.env.VUE_APP_SENTRY_TRACES_SAMPLE_RATE || "1.0"
  ),
  replaysSessionSampleRate: isPro
    ? parseFloat(
        process.env.VUE_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || "0.1"
      )
    : 0.0,
  replaysOnErrorSampleRate: isPro
    ? parseFloat(
        process.env.VUE_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || "1.0"
      )
    : 0.0,
  environment: process.env.NODE_ENV || "development",
});

import Buefy from "buefy";

import "@/components/base-ui/_globals";
import "@/components/icons/_globals";

import "buefy/dist/buefy.css";
import "@/styles/style.css";
import "@/styles/responsive.css";
Vue.config.productionTip = false;
Vue.use(i18n);
Vue.use(Buefy);

testId(Vue);
Vue.use(CustomDateFilter);
Vue.use(JoinArrayFilter);

var filter = function (text, length, clamp) {
  clamp = clamp || "...";
  var node = document.createElement("div");
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.config.warnHandler = function (msg, vm, trace) {
  console.warn(`[Vue warn]: ${msg}\nfound in\n--->${trace}`);
};

Vue.filter("truncate", filter);

i18n.locale = "en";

Vue.directive("scroll", {
  inserted: function (el, binding) {
    const onScroll = () => {
      if (window.scrollY > binding.value.threshold) {
        el.classList.add(binding.value.className);
      } else {
        el.classList.remove(binding.value.className);
      }
    };
    window.addEventListener("scroll", onScroll);
    el.__onScroll__ = onScroll;
  },
  unbind: function (el) {
    window.removeEventListener("scroll", el.__onScroll__);
    delete el.__onScroll__;
  },
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

helpers.printCopyright();
