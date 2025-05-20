import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import { AUTH_STORAGE_KEY } from "@/config.js";
import {
  OLD_QUOTE_SUB_ROUTES,
  OLD_QUOTE_SUB_ROUTES_QUOTE_SUB_ROUTES_MAP,
} from "@/router/path";

Vue.use(VueRouter);

const mode = "history";

const router = new VueRouter({
  mode,
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((routeTo, routeFrom, next) => {
  const loggedIn = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
  const isLoggedIn = loggedIn || false;
  const hasRequiresAuthMeta = routeTo.matched.some(
    (record) => record.meta.requiresAuth
  );
  if (hasRequiresAuthMeta && !isLoggedIn) {
    // If auth is required and the user is NOT currently logged in,
    // redirect to login then pass the original route to the login component
    return next({ name: "login", query: { redirect: routeTo.fullPath } });
  }
  if (!hasRequiresAuthMeta && isLoggedIn) {
    return next();
  }
  if (OLD_QUOTE_SUB_ROUTES.includes(routeTo.path)) {
    return next({
      path: OLD_QUOTE_SUB_ROUTES_QUOTE_SUB_ROUTES_MAP[routeTo.path],
      query: { itinerary: routeTo.query.itinerary },
    });
  }
  if (process.env.NODE_ENV === "production") {
    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: 2905957, hjsv: 6 };
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script");
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
  }
  next();
});

export default router;
