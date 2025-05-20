import { PATH_INFO } from "./path";

const routes = [
  {
    path: PATH_INFO.LOGIN.path,
    name: PATH_INFO.LOGIN.name,
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: PATH_INFO.SIGN_UP.path,
    name: PATH_INFO.SIGN_UP.name,
    component: () =>
      import(/* webpackChunkName: "sign-up" */ "../views/SignUp.vue"),
  },
  {
    path: PATH_INFO.SEND_RESET_PASSWORD.path,
    name: PATH_INFO.SEND_RESET_PASSWORD.name,
    component: () =>
      import(
        /* webpackChunkName: "send-reset-password" */ "../views/SendResetPassword.vue"
      ),
  },
  {
    path: PATH_INFO.RESET_PASSWORD.path,
    name: PATH_INFO.RESET_PASSWORD.name,
    component: () =>
      import(
        /* webpackChunkName: "reset-password" */ "../views/ResetPassword.vue"
      ),
  },
  {
    path: PATH_INFO.PROFILE.path,
    name: PATH_INFO.PROFILE.name,
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.REPORTS.path,
    name: PATH_INFO.REPORTS.name,
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/Reports.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.HOME.path,
    name: PATH_INFO.HOME.name,
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.ITINERARIES_OLD.path,
    name: PATH_INFO.ITINERARIES_OLD.name,
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/Destinations.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.ITINERARIES.path,
    name: PATH_INFO.ITINERARIES.name,
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/Destinations.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.EXPERIENCES.path,
    name: PATH_INFO.EXPERIENCES.name,
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/Experiences.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.REQUESTS.path,
    name: PATH_INFO.REQUESTS.name,
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/Requests.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.REQUESTS_CREATION.path,
    name: PATH_INFO.REQUESTS_CREATION.name,
    component: () =>
      import(
        /* webpackChunkName: "home" */ "../views/Requests/CreateRequest.vue"
      ),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.QUOTES.path,
    name: PATH_INFO.QUOTES.name,
    component: () =>
      import(/* webpackChunkName: "quotes" */ "@/views/Quotes.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.QUOTE.path,
    name: PATH_INFO.QUOTE.name,
    children: [
      {
        path: PATH_INFO.BASIC_INFO.childrenPath,
        name: PATH_INFO.BASIC_INFO.name,
        component: () =>
          import(/* webpackChunkName: "basic-info" */ "@/views/BasicInfoView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.SERVICES.childrenPath,
        name: PATH_INFO.SERVICES.name,
        component: () =>
          import(/* webpackChunkName: "services" */ "@/views/ServicesView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.ITINERARY.childrenPath,
        name: PATH_INFO.ITINERARY.name,
        component: () =>
          import(/* webpackChunkName: "itinerary" */ "@/views/ItineraryView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.EXPORT.childrenPath,
        name: PATH_INFO.EXPORT.name,
        component: () =>
          import(/* webpackChunkName: "export" */ "@/views/ExportView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.BOOK.childrenPath,
        name: PATH_INFO.BOOK.name,
        component: () =>
          import(/* webpackChunkName: "book" */ "@/views/BookView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.PAX_INFO.childrenPath,
        name: PATH_INFO.PAX_INFO.name,
        component: () =>
          import(/* webpackChunkName: "pax-info" */ "@/views/PaxInfoView"),
        meta: { requiresAuth: true },
      },
    ],
    component: () => import(/* webpackChunkName: "quote" */ "@/views/Quote"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.HISTORY.path,
    name: PATH_INFO.HISTORY.name,
    children: [
      {
        path: PATH_INFO.HISTORY_BASIC_INFO.childrenPath,
        name: PATH_INFO.HISTORY_BASIC_INFO.name,
        component: () =>
          import(/* webpackChunkName: "basic-info" */ "@/views/BasicInfoView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.HISTORY_SERVICES.childrenPath,
        name: PATH_INFO.HISTORY_SERVICES.name,
        component: () =>
          import(/* webpackChunkName: "services" */ "@/views/ServicesView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.HISTORY_ITINERARY.childrenPath,
        name: PATH_INFO.HISTORY_ITINERARY.name,
        component: () =>
          import(/* webpackChunkName: "itinerary" */ "@/views/ItineraryView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.HISTORY_EXPORT.childrenPath,
        name: PATH_INFO.HISTORY_EXPORT.name,
        component: () =>
          import(/* webpackChunkName: "pax-info" */ "@/views/ExportView"),
        meta: { requiresAuth: true },
      },
      {
        path: PATH_INFO.HISTORY_PAX_INFO.childrenPath,
        name: PATH_INFO.HISTORY_PAX_INFO.name,
        component: () =>
          import(/* webpackChunkName: "pax-info" */ "@/views/PaxInfoView"),
        meta: { requiresAuth: true },
      },
    ],
    component: () => import(/* webpackChunkName: "quote" */ "@/views/Quote"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.ITINERARIES_BY_DESTINATION.path,
    name: PATH_INFO.ITINERARIES_BY_DESTINATION.name,
    component: () =>
      import(/* webpackChunkName: "quotes" */ "@/views/ExampleItineraries.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.ITINERARIES_BY_DESTINATION_OLD.path,
    name: PATH_INFO.ITINERARIES_BY_DESTINATION_OLD.name,
    component: () =>
      import(/* webpackChunkName: "quotes" */ "@/views/ExampleItineraries.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: PATH_INFO.NOT_FOUND.path,
    name: PATH_INFO.NOT_FOUND.name,
    component: () =>
      import(/* webpackChunkName: "not-found" */ "@/views/NotFound.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "*",
    redirect: { name: PATH_INFO.NOT_FOUND.name },
  },
];

export default routes;
