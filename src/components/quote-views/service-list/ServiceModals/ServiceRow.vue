<template>
  <div :class="`service_row ${highlight ? 'highlight' : ''}`">
    <div
      v-if="fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.VISIBLE)"
      style="flex: 1"
    >
      {{ parseNumberToTrueFalse(service.visible) }}
    </div>
    <div
      v-if="fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.DAY)"
      style="flex: 1"
    >
      {{ service.day || "-" }}
    </div>
    <div
      v-if="fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.DATES)"
      class="service_dates"
      style="flex: 1"
    >
      <p>
        {{ helpers.format(service.start_date, datesFormat) }}
      </p>
      <p>
        {{ validatedServiceEndDate }}
      </p>
    </div>
    <div
      v-if="fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.LOCATION)"
      style="flex: 1"
    >
      <p class="service_row_country m-0">{{ country }}</p>
      <p class="service_row_destination">{{ destination }}</p>
    </div>
    <div class="service_row_card" style="flex: 3">
      <header>
        <b-icon
          :icon="helpers.showIconByServiceType(service.id_service_type)"
          alt="icon"
          class="card-icon"
        ></b-icon>
        <span>{{ service.code }}</span>
      </header>
      <TextWithHoverDetail :message="validatedServiceName">
        <template #baseText>
          <ServiceTag
            v-if="
              service.optional === constants.SERVICE_OPTIONAL_TYPES.CONFIRMED
            "
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
          <ServiceTag
            v-else-if="service.optional"
            type="light"
            :message="`Optional Experience`"
          >
            <template #icon>
              <IconGrowthArrow style="height: 0.6rem" />
            </template>
            <template #message>
              <span> Optional Experience </span>
            </template>
          </ServiceTag>
          <p>{{ validatedServiceName }}</p>
        </template>
      </TextWithHoverDetail>
      <div
        v-if="serviceHasRooms && hasServicePriceContent(service.service_price)"
        class="tags_container"
      >
        <span
          v-for="room in service.service_price"
          :key="room.id"
          class="w-100"
          style="position: relative"
        >
          <span class="tag_alert" v-if="room.room_qty > 1">
            {{ room.room_qty }}
          </span>
          <ServiceTag :message="room.romm_name">
            <template #message>
              <span>
                {{ room.romm_name }}
              </span>
            </template>
          </ServiceTag>
        </span>
      </div>
    </div>
    <div
      v-if="fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.LEVEL)"
      class="has-text-centered"
      style="flex: 1"
    >
      {{ findLevelByID(service.level) }}
    </div>
    <div
      v-if="fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.NUM_PAX)"
      style="flex: 1"
    >
      {{ service.num_pax }}
    </div>
    <div
      v-if="fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.COST)"
      class="color-7"
      style="flex: 1"
    >
      $ {{ service.cost || 0 }}
    </div>
    <div
      v-if="
        service.isPriceEdited &&
        fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.PRICE)
      "
      class="is__warning"
      style="flex: 1"
    >
      <span v-if="adaptedFields.PRICE.text.length > 0">
        {{ adaptedFields.PRICE.text }}
      </span>
      <span v-else>
        $ {{ service.price || 0 }}
        <IconWarningCircle
          v-if="service.isPriceEdited"
          class="ml-1 mb-1"
          style="fill: #ff9316"
        />
      </span>
    </div>
    <div
      v-if="
        fieldsLabels.includes(constants.SERVICE_ROW_FIELDS.PRICE) &&
        !service.isPriceEdited
      "
      class="color-up"
      style="flex: 1"
    >
      <span v-if="adaptedFields.PRICE.text.length > 0">
        {{ adaptedFields.PRICE.text }}
      </span>
      <span v-else> $ {{ service.price || 0 }} </span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";
import { serviceHelper } from "@/utils/service";
import { showIconByServiceType } from "@/utils/utils";
import ServiceTag from "@/components/quote-views/service-list/ServiceTag.vue";
import TextWithHoverDetail from "@/components/_shared/TextWithHoverDetail.vue";
import {
  SERVICE_LEVELS_OPTIONS,
  SERVICE_ROW_FIELDS,
  SERVICE_OPTIONAL_TYPES,
} from "@/constants/services";

export default {
  name: "ServiceRow",
  components: {
    TextWithHoverDetail,
    ServiceTag,
  },
  props: {
    service: {
      type: Object,
      default: () => {},
    },
    fieldsToDisplay: {
      type: Array,
      default: () => [],
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      constants: { SERVICE_ROW_FIELDS, SERVICE_OPTIONAL_TYPES },
      helpers: { showIconByServiceType, format, ...serviceHelper },
    };
  },
  computed: {
    ...mapGetters({
      countries: "client/getCountriesFromContract",
      datesFormat: "itinerary/getDatesFormat",
    }),
    validatedServiceName() {
      return this.service?.name?.value || "";
    },
    validatedServiceEndDate() {
      return this.service.start_date < this.service.end_date
        ? format(this.service.end_date, this.datesFormat)
        : "";
    },
    country() {
      const serviceCountry = this.service?.location?.find((location) =>
        [null, 0].includes(location.parent)
      );
      const serviceDestination = this.service?.location?.find(
        (location) => ![null, 0].includes(location.parent)
      );
      const countryByDestination =
        serviceCountry ||
        serviceHelper.getParentLocation(
          serviceDestination?.parent,
          this.countries
        );
      return countryByDestination?.location_name || "-";
    },
    destination() {
      return (
        this.service.location?.find(
          (location) => ![0, null].includes(location.parent)
        )?.location_name || ""
      );
    },
    isAccommodationPackageService() {
      return this.helpers.isAccommodationPackageService(
        this.service.id_service_type
      );
    },
    serviceHasRooms() {
      return (
        this.isAccommodationPackageService &&
        this.service?.service_price?.length > 0
      );
    },
    adaptedFields() {
      return this.fieldsToDisplay.reduce((acc, field) => {
        const formattedLabel = field.label.toUpperCase();
        acc[formattedLabel] = {
          ...field,
          text: field.text,
        };
        return acc;
      }, {});
    },
    fieldsLabels() {
      return this.fieldsToDisplay.map((field) => field.label);
    },
  },
  methods: {
    parseNumberToTrueFalse(value) {
      return value ? "Yes" : "No";
    },
    findLevelByID(id) {
      return SERVICE_LEVELS_OPTIONS.find((level) => level.id === id)?.name;
    },
    hasServicePriceContent(servicePrice) {
      return servicePrice?.every((room) => {
        return room?.romm_name?.length > 0;
      });
    },
  },
};
</script>
<style scoped>
.service_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  font-size: 0.8rem;
  margin: 0.5rem 0;
  text-align: center;
  color: #444;
}
.service_row.highlight {
  background-color: #fefeda;
  padding: 0.25rem;
}
.service_row_card {
  background-color: #f2f2f2;
  border-radius: 0.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  display: inline-block;
  height: auto;
  text-align: left;
  max-width: 15rem;
  cursor: initial;
}
.service_row_card > header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  margin: 0 0 0 -0.5rem;
}
.service_row_card > header > span {
  font-size: 0.7rem;
}
.service_row_card p {
  cursor: initial;
  width: 100%;
  color: #f00b81;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
}
.service_dates > p {
  font-size: 0.7rem;
  display: block;
  width: max-content;
  margin: 0 auto;
}
.service_row_country,
.service_row_destination {
  cursor: initial;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: center;
}
.service_row_country {
  display: block;
  color: #b5b5b5;
  font-size: 0.7rem;
}
.service_row_destination {
  font-size: 0.7rem;
  color: #444;
  margin-bottom: 0.1rem;
}
.is__warning,
.is__warning svg,
.is__warning svg path {
  color: #ff9316;
  fill: #ff9316 !important;
  position: relative;
}
@media screen and (max-width: 480px) {
  /* .service_row {
    overflow-x: auto;
  } */
  .service_row > div {
    min-width: 6rem;
  }
  div.service_row_card {
    max-width: 100%;
    min-width: 10rem;
  }
}
</style>
