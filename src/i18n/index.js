import Vue from "vue";
import VueI18n from "vue-i18n";

import config from "./config";

import en from "./languages/en";

Vue.use(VueI18n);

const messages = { en };
const locale = config.defaultLocale;
const i18n = new VueI18n({ messages, locale });

export default i18n;
