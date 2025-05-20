<template>
  <div
    class="service_row_card"
    @click="
      handleClickServiceRowCard(
        data.item,
        constants.EDIT_SERVICE_SIDEBAR_TABS_IDS.INFO
      )
    "
    :data-test-id="
      constants.DATA_TEST_ID_VALUES.ITINERARY_SERVICE_OPEN_SIDEBAR_BUTTON
    "
  >
    <div v-if="!isNewService" class="service_row_content">
      <header>
        <div>
          <b-icon
            :icon="helpers.showIconByServiceType(data.item.id_service_type)"
            alt="icon"
            class="card-icon"
          ></b-icon>
          <CopyContent
            :content="data.item.code || newService.code"
            v-if="!isNewService"
          />
        </div>
        <b-tooltip
          v-if="
            isAvailableToReplaceService &&
            !hideElementByCondition &&
            !disableQuoteByStatus
          "
          label="Replace service"
        >
          <button
            class="service_row_replace_button"
            @click="
              stopPropagation($event);
              openServiceReplaceModal(data.item);
            "
          >
            <IconReplace />
          </button>
        </b-tooltip>
      </header>
      <TextWithHoverDetail :message="data.value.value">
        <template #baseText>
          <b-tooltip
            v-if="isServiceRecentlyImported && displayImportServiceButton"
            type="is-dark"
            position="is-top"
            style="padding: 0rem"
          >
            <b-tag class="mb-1" type="is-info" rounded>
              <b-icon
                size="is-small"
                custom-size="fa-5x"
                icon="swap-vertical-bold"
              ></b-icon>
              Recently imported
            </b-tag>
            <template v-slot:content>
              <span style="font-weight: 300"
                >Last imported on
                <strong style="color: #fff">{{
                  lastServiceImportText
                }}</strong></span
              >
            </template>
          </b-tooltip>
          <ServiceTag
            v-if="
              data.item.optional === constants.SERVICE_OPTIONAL_TYPES.CONFIRMED
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
            v-else-if="data.item.optional"
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
          <p>{{ data.value.value }}</p>
        </template>
      </TextWithHoverDetail>
    </div>
    <p
      v-if="isNewService"
      class="service_row_card_placeholder"
      :data-test-id="constants.DATA_TEST_ID_VALUES.SELECT_SERVICE_BUTTON"
    >
      Select a service ...
    </p>
    <div
      v-if="
        helpers.isAccommodationPackageService(data.item.id_service_type) &&
        hasServicePriceContent(data.item.service_price) &&
        data.item.service_price !== null &&
        data.item.service_price.length > 0
      "
      class="tags_container"
      @click="(event) => onServiceRoomTypeClick(event, data.item)"
    >
      <span
        v-for="room in serviceRooms"
        :key="room.id"
        style="position: relative"
      >
        <span class="tag_alert" v-if="room.room_qty > 1">{{
          room.room_qty
        }}</span>
        <ServiceTag :message="room.romm_name">
          <template #message>
            <span>
              {{ room.romm_name }}
            </span>
          </template>
        </ServiceTag>
      </span>
    </div>
    <span
      v-if="
        helpers.isAccommodationPackageService(data.item.id_service_type) &&
        (data.item.service_price === null ||
          data.item.service_price.length === 0) &&
        !helpers.isDraftService(data.item)
      "
    >
      <ServiceTag type="warning" :message="`No rooms for this service`">
        <template #icon>
          <IconInfo />
        </template>
        <template #message>
          <span> No rooms for this service </span>
        </template>
      </ServiceTag>
    </span>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CopyContent from "@/components/_shared/CopyContent.vue";
import ServiceTag from "@/components/quote-views/service-list/ServiceTag.vue";
import helpers from "@/helpers";
import { datesHelper } from "@/utils/dates";
import { serviceHelper } from "@/utils/service";
import { showIconByServiceType } from "@/utils/utils";
import TextWithHoverDetail from "../../_shared/TextWithHoverDetail.vue";
import { SERVICE_TYPE, USER_ROLE } from "@/constants";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import {
  EDIT_SERVICE_SIDEBAR_TABS_IDS,
  SERVICE_OPTIONAL_TYPES,
} from "@/constants/services";

export default {
  name: "ServiceRowCard",
  components: {
    CopyContent,
    ServiceTag,
    TextWithHoverDetail,
  },
  props: {
    stopPropagation: {
      type: Function,
      default: () => {},
    },
    handleModalEditServiceModal: {
      type: Function,
      default: () => {},
    },
    openServiceSelectModal: {
      type: Function,
      default: () => {},
    },
    openServiceReplaceModal: {
      type: Function,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
    newService: {
      type: Object,
      default: () => {},
    },
    handleClickServiceRowCard: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      helpers: {
        ...helpers,
        ...serviceHelper,
        showIconByServiceType,
        ...datesHelper,
      },
      constants: {
        DATA_TEST_ID_VALUES,
        EDIT_SERVICE_SIDEBAR_TABS_IDS,
        SERVICE_OPTIONAL_TYPES,
      },
    };
  },
  computed: {
    ...mapGetters({
      datesFormat: "itinerary/getDatesFormat",
      authData: "auth/getAuthData",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    serviceRooms() {
      return this.data?.item?.service_price || [];
    },
    displayServiceRowCardTags() {
      return (
        this.helpers.isAccommodationPackageService(
          this.data.item.id_service_type
        ) &&
        this.data.item.service_price !== null &&
        this.data.item.service_price.length > 0
      );
    },
    isAvailableToReplaceService() {
      return (
        this.data.item.id_service_type !== SERVICE_TYPE.PACKAGE &&
        !serviceHelper.isDraftService(this.data.item)
      );
    },
    isNewService() {
      const isAdding = serviceHelper.isDraftService(this.data.item);
      const isServiceSelected =
        this.newService.code && this.newService.code.length > 0;
      return isAdding && !isServiceSelected;
    },
    isServiceRecentlyImported() {
      if (this.data.item.last_import === null) return false;

      const nowTime = new Date();
      const lastServiceImportTime = new Date(this.data.item.last_import);

      const differenceInMillis = Math.abs(nowTime - lastServiceImportTime);

      const differenceInHours = differenceInMillis / (1000 * 60 * 60);

      return differenceInHours <= 24;
    },
    lastServiceImportText() {
      return `${this.helpers.getDatetimeFromUTC(
        this.data.item.last_import,
        this.datesFormat
      )}`;
    },
    displayImportServiceButton() {
      const isAdmin = helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.ADMIN],
        true
      );
      return this.data.item.last_import !== null && isAdmin;
    },
  },
  methods: {
    onServiceRoomTypeClick(event, service) {
      event.stopPropagation();
      this.handleClickServiceRowCard(
        service,
        EDIT_SERVICE_SIDEBAR_TABS_IDS.ROOM_TYPES
      );
    },
    hasServicePriceContent(servicePrice) {
      return servicePrice?.every((room) => {
        return room?.romm_name?.length > 0;
      });
    },
  },
};
</script>
<style>
.service_row_card {
  background-color: #f2f2f2;
  border-radius: 0.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  display: inline-block;
  height: auto;
  text-align: left;
  cursor: pointer;
  width: 100%;
}
.service_row_content {
  position: relative;
}
.service_row_content > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.service_row_content .card-icon {
  padding: 0;
}
.service_row_content .card-icon i::before {
  font-size: 1rem !important;
}
.service_row_content span {
  font-size: 0.7rem;
}
.service_row_content p {
  cursor: pointer;
  width: 100%;
  color: #f00b81;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
p.service_row_card_placeholder {
  color: #b5b5b5;
  font-weight: 600;
  padding: 0.5rem;
}
.service_row_card:hover .btn_copy_content {
  opacity: 1;
}
.service_row_replace_button {
  opacity: 0;
  pointer-events: none;
  cursor: default !important;
  border: none;
  background-color: #d9d9d9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}
.service_row_replace_button:hover {
  background-color: #b5b5b5;
}
.service_row_card:hover .service_row_replace_button {
  opacity: 1;
  pointer-events: all;
}
.tag_alert {
  position: absolute;
  top: -0.5rem;
  right: -0.25rem;
  background-color: black;
  color: white;
  border-radius: 50%;
  padding: 0rem 0.25rem;
  font-size: 0.6rem;
  z-index: 1;
}
.tags_container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
  column-gap: 0.25rem;
}
.tags_container > span {
  max-width: 100%;
}
</style>
