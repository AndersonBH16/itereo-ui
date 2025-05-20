import auth from "./auth";
import request from "./request";
import itinerary from "./itinerary";
import itineraryDays from "./itinerary_days";
import services from "./services";
import currency from "./currency";
import language from "./language";
import status_itinerary from "./status_itinerary";
import client from "./client";
import service_types from "./service_types";
import tags from "./tags";
import locations from "./locations";
import assets from "./assets";
import users from "./users";
import utils from "./utils";
import reports from "./reports";
import prices from "./prices";
import room_distribution from "./room_distribution";
import shortcuts from "./shortcuts";
import userguide from "./userguide";
import tenants from "./tenants";

const isDevelopment =
  process.env.NODE_ENV !== "production" &&
  process.env.NODE_ENV !== "dev" &&
  process.env.NODE_ENV !== "pre";

const strict = isDevelopment;

const state = { isDevelopment };

const modules = {
  auth,
  request,
  itinerary,
  itineraryDays,
  services,
  currency,
  language,
  status_itinerary,
  client,
  service_types,
  tags,
  locations,
  assets,
  users,
  utils,
  prices,
  room_distribution,
  shortcuts,
  userguide,
  tenants,
  reports,
};

export default {
  strict,
  plugins: [],
  state,
  modules,
};
