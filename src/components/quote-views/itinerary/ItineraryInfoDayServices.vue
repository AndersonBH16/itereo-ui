<template>
  <b-table
    :data="services_per_day"
    :draggable="!disableQuoteByStatus"
    @dragstart="dragstart"
    @drop="drop"
    @dragover="dragover"
    @dragleave="dragleave"
    :row-class="(row) => (row.visible ? '' : 'hidden_row')"
  >
    <b-table-column field="service_type" label="Type" v-slot="props">
      <b-icon
        :icon="showIconByServiceType(props.row.id_service_type)"
        alt="icon"
        class="card-icon"
      ></b-icon>
    </b-table-column>

    <b-table-column
      field="service_code"
      label="Code"
      v-slot="props"
      width="105"
    >
      <span class="color-7">{{ props.row.code }}</span>
    </b-table-column>

    <b-table-column field="level" label="Level" v-slot="props" width="40">
      {{ props.row.level_text }}
    </b-table-column>

    <b-table-column field="service_name" label="Name" v-slot="props">
      <ServiceTag
        v-if="props.row.optional === constants.SERVICE_OPTIONAL_TYPES.CONFIRMED"
        type="dark"
        :message="`Optional Experience Confirmed`"
      >
        <template #icon>
          <IconCheckCircle style="height: 0.6rem; width: 0.8rem" />
        </template>
        <template #message>
          <span> Optional Experience Confirmed</span>
        </template>
      </ServiceTag>
      <span v-else-if="props.row.optional">
        <ServiceTag :message="`Optional Experience`">
          <template #icon>
            <IconGrowthArrow style="height: 0.6rem" />
          </template>
          <template #message>
            <span> Optional Experience </span>
          </template>
        </ServiceTag>
      </span>
      <span class="field_name">
        <b-tooltip
          v-if="props.row.description.value.trim().length > 0"
          multilined
          class="service_description__tooltip m-0"
          type="is-white"
        >
          <template v-slot:content>
            <p class="m-0" v-html="props.row.description.value"></p>
            <span>Press the icon to copy the content</span>
          </template>
          <button class="show_more">
            <b-icon
              icon="text-box-outline"
              size="is-small"
              custom-size="mdi-18px"
            />
          </button>
          <button class="copy__button">
            <CopyContent
              :content="props.row.description.value"
              :showOnlyIcon="true"
            />
          </button>
        </b-tooltip>
        {{ props.row.name.value }}
        <b-tooltip
          label="Service is hidden, you can toggle it in the service list"
          position="is-bottom"
        >
          <b-icon v-if="!props.row.visible" :icon="'eye-off'"></b-icon>
        </b-tooltip>
      </span>
    </b-table-column>

    <b-table-column
      field="paxs"
      label="Pax(s)"
      width="50"
      centered
      v-slot="props"
    >
      {{ props.row.num_pax }}
    </b-table-column>

    <template #empty>
      <div class="has-text-centered">No available records.</div>
    </template>
  </b-table>
</template>

<script>
import { mapGetters } from "vuex";
import servicesTypes from "@/data/servicesTypes.json";
import { SERVICE_OPTIONAL_TYPES } from "@/constants/services";
import helpers from "@/helpers";
import CopyContent from "@/components/_shared/CopyContent.vue";
import ServiceTag from "@/components/quote-views/service-list/ServiceTag.vue";

export default {
  name: "ItineraryServicesDay",
  components: {
    ServiceTag,
    CopyContent,
  },
  data() {
    return {
      constants: { SERVICE_OPTIONAL_TYPES },
      helpers: helpers,
      serviceSelected: null,
    };
  },
  props: {
    data: {
      type: [Array, Object],
      require: () => {},
    },
    services_per_day: {
      type: [Array, Object],
      require: () => {},
    },
  },
  computed: {
    ...mapGetters({
      currencies: "currency/getCurrencies",
      itinerary: "itinerary/getItinerary",
      user: "auth/getAuthUserData",
      authData: "auth/getAuthData",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
    }),
  },
  mounted() {
    this.$store.dispatch("currency/getCurrencies");
  },
  methods: {
    dragstart(payload) {
      this.draggingRow = payload.row;
      this.draggingRowIndex = payload.index;
      payload.event.dataTransfer.effectAllowed = "copy";
      this.serviceSelected = payload.row;
    },
    dragover(payload) {
      payload.event.dataTransfer.dropEffect = "copy";
      payload.event.target.closest("tr").classList.add("is-selected");
      payload.event.preventDefault();
    },
    dragleave(payload) {
      payload.event.target.closest("tr").classList.remove("is-selected");
      payload.event.preventDefault();
    },
    drop(payload) {
      payload.event.target.closest("tr").classList.remove("is-selected");
      const droppedOnRowIndex = payload.index;
      this.$buefy.toast.open({
        duration: 5000,
        message: `Moved ${this.serviceSelected.code} from row ${
          this.draggingRowIndex + 1
        } to ${droppedOnRowIndex + 1}`,
        position: "is-top",
        type: "is-success",
      });
      const newService = {
        ...this.serviceSelected,
        order: payload.index + 1,
      };
      this.updateServicesPerDay(
        this.getReorderedServices(newService, payload.index)
      );
    },
    getReorderedServices(newService = {}, toIndex = 0) {
      const filteredServices = this.services_per_day.filter(
        (service) => service.id !== newService.id
      );
      const isInFirstPosition = toIndex === 0;
      const firstArray = filteredServices.slice(0, toIndex);
      const secondArray = filteredServices.slice(toIndex);
      const finalArray = [...firstArray, newService, ...secondArray];
      const newServices = isInFirstPosition
        ? [newService, ...filteredServices]
        : finalArray;
      const sortedServices = newServices.map((service, index) => {
        return { ...service, order: index + 1 };
      });
      return sortedServices;
    },
    showIconByServiceType(id) {
      const serviceType = servicesTypes.filter(
        (service) => service.entity_id === id
      );
      return serviceType.length !== 0
        ? serviceType[0].icon
        : "check-circle-outline";
    },
    updateServicesPerDay(value = []) {
      this.$emit("update", value);
    },
  },
};
</script>

<style>
.card-icon {
  padding-left: 5px;
  color: #4d4d4d;
}
.card-icon ::before {
  font-size: 20px;
}
.hidden_row {
  opacity: 0.5;
}
.field_name {
  display: flex;
  align-items: center;
}
.field_name > .b-tooltip {
  margin-left: 0.5rem;
}
.service_description__tooltip button {
  text-decoration: underline;
  color: #aeaeae;
  background-color: transparent;
  border: none;
}
.service_description__tooltip .tooltip-content > span {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  padding: 0.25rem 0.5rem 0.5rem 0.5rem;
  background: #fff;
  color: #aaa;
}
.service_description__tooltip .tooltip-content p {
  margin-bottom: 0;
}
.service_description__tooltip.b-tooltip.is-multiline.is-medium
  .tooltip-content {
  width: 26rem;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  height: 10rem;
}
.copy__button,
.show_more {
  width: 2rem;
}

.copy__button {
  display: none;
}
.copy__button .btn_copy_content {
  opacity: 1;
}
.copy__button .btn_copy_content svg {
  width: 1rem;
}
.tooltip-trigger:hover .copy__button {
  display: block;
}
.tooltip-trigger:hover .show_more {
  display: none;
}
</style>
