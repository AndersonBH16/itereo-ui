<template>
  <section>
    <GuideBox
      title="Adding a new service"
      description="Now, in this section you can browse and filter services as you want"
      :step="14"
      :positionY="-10"
      :showBackButton="false"
      :showNextButton="!loading"
    />
    <GuideBox
      title="Adding a new service"
      description="Here you can write the code of the service you want"
      :step="15"
      :positionY="20"
    />
    <GuideBox
      title="Adding a new service"
      description="Here you can select the type of services that you want"
      :step="16"
      :positionY="80"
    />
    <GuideBox
      title="Adding a new service"
      description="Here you can select the country of services that you want"
      :step="17"
      :positionY="140"
    />
    <GuideBox
      title="Adding a new service"
      description="Here you can select the destination of services that you want"
      :step="18"
      :positionY="200"
    />
    <GuideBox
      title="Adding a new service"
      description="Here you can select the date range that will filter the services"
      :step="19"
      :positionY="260"
    />
    <GuideBox
      title="Adding a new service"
      description="When you think you are done, you can click on 'Search' to start the search"
      :step="20"
      :positionY="320"
      v-if="!loading"
    />
    <GuideBox
      title="Adding a new service"
      description="Let´s add this one!"
      :step="21"
      :positionX="780"
      :positionY="120"
      v-if="!loading"
      :showNextButton="false"
    />
    <div class="columns mx-1 header-fixed">
      <div class="column mt-5 pl-0">
        <p class="has-text-left">
          <a
            class="button-saas color-8 has-text-weight-semibold"
            :class="{
              recentlyAffected: servicesAdded > 0,
            }"
          >
            <i class="mr-1"><IconBasket class="color-8 icon is-small" /></i
            >Added ({{ servicesAdded }})</a
          >
        </p>
        <div
          v-if="computedServices.length === 0"
          class="services__results__placeholder"
        >
          <p>
            There are no services here yet, please try to search services again
          </p>
          <IconArrowLeft />
        </div>
      </div>
      <b-pagination
        v-if="computedServices && computedServices.meta"
        class="mt-2 mb-0"
        :total="computedServices.meta.total"
        v-model="searchServicesPage"
        :range-before="3"
        :range-after="5"
        :rounded="false"
        size="is-small"
        order="is-centered"
        :per-page="computedServices.meta.per_page"
      >
        <template #default="props">
          <b-pagination-button
            :page="props.page"
            tag="button"
            :id="`page${props.page.number}`"
            @click.native="getServices()"
          >
            {{ props.page.number }}
          </b-pagination-button>
        </template>

        <template #previous="props">
          <b-pagination-button :page="props.page" @click.native="getServices()">
            <IconArrowLeft class="icon_previous" />
          </b-pagination-button>
        </template>

        <template #next="props">
          <b-pagination-button :page="props.page" @click.native="getServices()">
            <IconArrowRight class="icon_next" />
          </b-pagination-button>
        </template>
      </b-pagination>
      <div
        class="column mt-5 has-text-right pr-0"
        v-if="computedServices && computedServices.meta"
      >
        <p class="">
          Displaying
          <span class="has-text-weight-bold">{{ resultsInfo.displaying }}</span>
          of
          <span class="has-text-weight-bold">{{ resultsInfo.results }}</span>
          results
        </p>
      </div>
    </div>
    <div
      class="px-4 py-4 bg serviceSideBarResults"
      v-if="computedServices && computedServices.data"
    >
      <div
        class="mb-4"
        v-for="(service, index) in computedServices.data"
        :key="index"
      >
        <ServiceResultCard
          :index="index"
          :service="service"
          :setRoomsSelectedAccomPack="setRoomsSelectedAccomPack"
          :computedServices="computedServices"
          :createItineraryServiceForm="createItineraryServiceForm"
          :getServicePrice="getServicePrice"
          :updateServices="updateServices"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import GuideBox from "../../_shared/GuideBox.vue";
import helpers from "@/helpers";
import { serviceHelper } from "@/utils/service";
import { setItemToLocalStorage } from "@/utils/utils";
import ServiceResultCard from "./ServiceResultCard.vue";

export default {
  name: "AddServicesModalResult",
  components: {
    GuideBox,
    ServiceResultCard,
  },
  data() {
    return {
      helpers: helpers,
      serviceHelper: serviceHelper,
      data: {},
      setItemToLocalStorage,
      uuid: this.$route.query.itinerary,
      selectedServices: [],
    };
  },
  computed: {
    sampleFormat() {
      const dtf = new Intl.DateTimeFormat(this.locale, { timezome: "UTC" });
      return dtf.format(new Date(2000, 11, 25, 12));
    },
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      itineraryStatus: "itinerary/getItineraryStatus",
      services: "services/getServices",
      servicesItinerary: "itinerary/getServicesItinerary",
      searchServicesPayload: "services/getSearchServicesPayload",
      servicesAdded: "utils/getServicesAdded",
      user: "auth/getAuthUserData",
      authData: "auth/getAuthData",
      loading: "utils/getLoading",
    }),
    computedServices: {
      get() {
        this.setSelectedServicesOnMounted(this.services);
        return this.services;
      },
      set(value) {
        this.updateServices(value);
      },
    },
    resultsInfo() {
      return {
        displaying: this.computedServices.data
          ? this.computedServices.data?.length
          : 0,
        results: this.computedServices.meta
          ? this.computedServices.meta.total
          : 0,
      };
    },
    searchServicesPage: {
      get() {
        return this.searchServicesPayload.page;
      },
      set(value) {
        this.updateSearchServicesPayload("page", value);
      },
    },
  },
  props: {
    createItineraryServiceForm: {
      type: Function,
      default: () => {},
    },
    getServicePrice: {
      type: Function,
      default: () => {},
    },
    getServices: {
      type: Function,
      default: () => {},
    },
    setRoomsSelectedAccomPack: {
      type: Function,
      default: () => {},
    },
    updateSearchServicesPayload: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    isEqualServices(services = []) {
      const selectedCodes = this.selectedServices?.map((selSer) => selSer.code);
      const servicesCodes = services?.data?.map((ser) => ser.code);
      const isEqual =
        JSON.stringify(selectedCodes) === JSON.stringify(servicesCodes);
      return isEqual;
    },
    setSelectedServicesOnMounted(services = []) {
      if (!services || services.data === undefined) return;
      if (this.isEqualServices(services)) return;
      this.selectedServices = [];
      services?.data?.forEach((service) => {
        const { code } = service;
        const { num_pax, service_supplier } =
          service.prices_costs_margins ?? {};
        const newSuppliers = service_supplier?.map(
          ({ code, default_sup, cost }) => {
            return {
              code,
              num_pax: default_sup === 1 ? num_pax : 0,
              price:
                default_sup === 1
                  ? service.prices_costs_margins.price ??
                    service.prices_costs_margins.cost ??
                    0
                  : 0,
              price_unit:
                default_sup === 1
                  ? service.prices_costs_margins.price_unit ??
                    service.prices_costs_margins.cost_unit ??
                    0
                  : 0,
              cost_unit:
                default_sup === 1
                  ? service.prices_costs_margins.cost_unit ?? 0
                  : 0,
              cost: default_sup === 1 ? cost ?? 0 : 0,
              service_price:
                default_sup === 1
                  ? service.prices_costs_margins.service_price ?? {}
                  : {},
            };
          }
        );
        const newService = { code, suppliers: newSuppliers };
        this.addNewSelectedService(newService);
      });
    },
    addNewSelectedService(newService = {}) {
      this.selectedServices.push(newService);
    },
    updateServices(payload) {
      this.$store.dispatch("services/setServices", payload);
    },
  },
};
</script>

<style scoped>
.bg {
  background: #ebebeb;
}
.services__results__placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translateY(8rem);
}
.services__results__placeholder svg {
  transform: translateY(1rem);
}
.DayImage {
  width: 6rem;
  height: 4rem;
  display: flex;
  object-fit: cover;
}
.DayImage > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
