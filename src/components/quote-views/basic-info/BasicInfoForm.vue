<template>
  <section
    v-if="formItinerary && formItinerary[0]"
    :class="focusedGuideBoxClass('table-box mt-5 p-5 BasicInfoForm', 3, true)"
  >
    <div
      class="columns is-flex is-justify-content-space-between w-100 m-0 mb-4"
    >
      <h2 class="is-h2 mr-2 pb-3">
        <strong> Basic Information | </strong>
        <span
          v-if="
            itinerary.data &&
            itinerary.data.id &&
            formItinerary &&
            formItinerary.length &&
            formItinerary[0].quote_creation
          "
          class="quoteCreationSubtitle"
        >
          Quote creation:
          {{ itinerary.data.created_date | customDate(datesFormat) }}
        </span>
        <span v-else> Creating a new {{ itineraryTypeLabel }} </span>
        <BaseSelect
          v-if="displayItineraryTypes"
          label="Type"
          :list="itineraryTypes"
          optionValue="id"
          optionText="name"
          placeholder="Select a itinerary type"
          :disabled="loading || disableQuoteByStatus || hideElementByCondition"
          :value="formItinerary[0].itinerary_type_id || 0"
          @input="updateformItinerary('itinerary_type_id', $event)"
          class="field mb-2 itinerary_type_top__field"
          size="large"
          :data-test-id="constants.DATA_TEST_ID_VALUES.BASIC_INFO_TYPE_SELECT"
        />
      </h2>

      <AddServicesModal
        class="basicInfoAdd"
        :itineraryTypeLabel="itineraryTypeLabel"
        :handleSaveItinerary="handleSaveItinerary"
        :handleModalShortcuts="handleModalShortcuts"
        :handleModalPreventBasicInfo="handleModalPreventBasicInfo"
        :modalPreventBasicInfo="modalPreventBasicInfo"
        :showServices="showServices"
        :setLoading="setLoading"
        :shortcutsOpen="shortcutsOpen"
      />
    </div>
    <div class="columns">
      <GuideBox
        title="Creating a new quote"
        description="Choose a client"
        :step="4"
        :positionY="-180"
        :showNextButton="formItinerary[0].client_id !== null"
      />
      <div :class="focusedGuideBoxClass('column', 4, true)">
        <BaseSelect
          size="large"
          label="Client*"
          :list="clients"
          optionValue="id"
          optionText="name"
          :disabled="
            loading ||
            disableQuoteByStatus ||
            hideElementByCondition ||
            Boolean(request.id)
          "
          placeholder="Select a client"
          :value="formItinerary[0].client_id"
          @input="
            updateformItinerary('client_id', $event);
            updateformItinerary('contract_id', null);
            generateCode();
            loadFirstClientContract($event);
            nextStep();
          "
          :data-test-id="constants.DATA_TEST_ID_VALUES.BASIC_INFO_CLIENT_SELECT"
          :isNotValid="fieldHasError('client_id')"
        />
      </div>
      <GuideBox
        title="Creating a new quote"
        description="Write a title for your quote"
        :step="5"
        :positionY="-180"
        :showNextButton="formItinerary[0].title.value !== null"
      />
      <div :class="focusedGuideBoxClass('column', 5, true)">
        <BaseInput
          ref="form_title__element"
          size="large"
          label="Title*"
          :disabled="disableQuoteByStatus || loading || hideElementByCondition"
          :value="formItinerary[0].title.value || ''"
          placeholder="Title"
          @input.native="validateTitleInput"
          :data-test-id="constants.DATA_TEST_ID_VALUES.BASIC_INFO_TITLE"
          :isNotValid="fieldHasError('title', 'value')"
        />
      </div>
      <GuideBox
        title="Creating a new quote"
        description="Choose the number of passengers that you want"
        :step="6"
        :positionY="-180"
        :showNextButton="formItinerary[0].num_pax !== null"
      />
      <GuideBox
        title="Creating a new quote"
        description="Set the room distribution that you like"
        :step="7"
        :positionY="-220"
        :positionX="-250"
        :overlay="false"
        :showNextButton="false"
        :showBackButton="false"
      />
      <div :class="focusedGuideBoxClass('column', 6, true)">
        <BaseSelect
          size="large"
          :list="numPax"
          optionValue="value"
          optionText="value"
          placeholder="Select pax qty."
          :value="formItinerary[0].num_pax"
          label="N° Pax*"
          :disabled="disableQuoteByStatus || loading || hideElementByCondition"
          @input="
            nextStep();
            updateformItinerary('num_pax', $event);
            setDefaultRoomDistribution();
          "
          :data-test-id="constants.DATA_TEST_ID_VALUES.BASIC_INFO_PAX_SELECT"
          :isNotValid="fieldHasError('num_pax')"
        />
      </div>
      <div class="column">
        <BaseInputRoom
          size="large"
          label="Room Distribution *"
          :disabled="disableQuoteByStatus || loading || hideElementByCondition"
          placeholder="Select room distribution"
          :data="roomPreferableDistributionJson"
          @click.native="handleModalRoomDistribution"
        >
          <b-icon slot="icon" icon="bed" alt="icon" class="card-icon"></b-icon>
        </BaseInputRoom>

        <BaseModal
          :isComponentModalActive="modalRoomDistribution"
          :closeModal="handleModalRoomDistribution"
        >
          <div
            slot="body"
            class="roomDistributionCard is-flex align-items-center"
          >
            <h2 class="roomDistributionTitle">
              <b>Distribution of Rooms</b>
            </h2>
            <span class="roomDistributionSubtitle">
              Please select the preferred Distribution of Rooms
              <b>{{ formItinerary[0].num_pax }}</b> passengers
            </span>
            <span class="roomDistributionSubtitle">
              Keep in mind that Room Distribution could vary according to the
              availability of the hotel.
            </span>
            <div
              class="is-flex roomDistributionBody"
              :data-test-id="
                constants.DATA_TEST_ID_VALUES.BASIC_INFO_ROOM_SELECT
              "
            >
              <div
                v-for="item in roomPreferableDistributionJson"
                :key="item.id"
                class="roomDistributionBodyItem is-flex align-items-center"
                :is-selected="item.qty > 0 ? 'active' : ''"
              >
                <div>
                  <IconBedSingle
                    v-if="
                      item.id_room_type === 1 ||
                      item.id_room_type === 4 ||
                      item.id_room_type === 3
                    "
                  ></IconBedSingle>
                  <IconBedSingle v-if="item.id_room_type === 3"></IconBedSingle>
                  <IconBedDouble
                    v-if="
                      item.id_room_type === 2 ||
                      item.id_room_type === 5 ||
                      item.id_room_type === 4
                    "
                  ></IconBedDouble>
                  <IconBedDouble v-if="item.id_room_type === 5"></IconBedDouble>
                </div>
                <span>{{ item.name }}</span>
                <BaseInputNumber
                  controlsPosition="compact"
                  size="is-small"
                  :max="item.max_qty"
                  :min="0"
                  :placeholder="0"
                  v-model="item.qty"
                  @input="setMaxRoomQty"
                  :disabled="item.max_qty === 0 ? true : false"
                >
                </BaseInputNumber>
              </div>
            </div>
          </div>

          <div slot="buttons" class="roomDistributionButtons is-flex">
            <BaseButton
              action="secondary"
              size="large"
              class=""
              @click="
                prevStep();
                handleModalRoomDistribution();
              "
            >
              <p slot="text">Cancel</p>
            </BaseButton>
            <BaseButton
              action="tercery"
              size="large"
              @click="
                saveRoomPreferedDistribution();
                nextStep();
              "
              :disabled="loading || remainingPax > 0"
              :data-test-id="
                constants.DATA_TEST_ID_VALUES.BASIC_INFO_ROOM_SELECT_SAVE
              "
            >
              <p slot="text">Continue</p>
            </BaseButton>
          </div>
        </BaseModal>
      </div>
    </div>
    <div class="columns">
      <GuideBox
        title="Creating a new quote"
        description="Choose a date to start the itinerary"
        :step="8"
        :positionY="-20"
        :positionX="280"
      />
      <div
        :class="focusedGuideBoxClass('column', 8, true)"
        :data-test-id="
          constants.DATA_TEST_ID_VALUES.BASIC_INFO_DATA_FROM_SELECT
        "
      >
        <BaseDatePicker
          label="Date from*"
          :value="dateFrom"
          @input="dateFrom = $event"
          :disabled="disableQuoteByStatus || loading || hideElementByCondition"
          placeholder="Select date from"
          :isNotValid="fieldHasError('start_date')"
        />
      </div>
      <GuideBox
        title="Creating a new quote"
        description="Choose a date to finish the itinerary"
        :step="9"
        :positionY="-20"
        :positionX="280"
      />
      <div
        :class="focusedGuideBoxClass('column', 9, true)"
        :data-test-id="constants.DATA_TEST_ID_VALUES.BASIC_INFO_DATA_TO_SELECT"
      >
        <BaseDatePicker
          label="Date to *"
          :value="dateTo"
          @input="dateTo = $event"
          :min="minDateTo"
          :max="maxDateTo"
          :disabled="disableQuoteByStatus || loading || hideElementByCondition"
          placeholder="Select date to"
          :isNotValid="fieldHasError('end_date')"
        />
      </div>
      <GuideBox
        title="Creating a new quote"
        description="Here you have the number of days included in the itinerary"
        :step="10"
        :positionY="-150"
      />
      <div :class="focusedGuideBoxClass('column', 10, true)">
        <BaseInput
          size="large"
          label="N° Day(s)"
          :disabled="disableQuoteByStatus || loading || hideElementByCondition"
          placeholder="N° Days(s)"
          :value="days || 1"
          @input.native="handleValidateNDays($event)"
          type="number"
          id="daysInput"
          :max="constants.MAX_ITINERARY_DAYS"
          :maxlength="2"
          :isNotValid="fieldHasError('num_day')"
        />
      </div>
      <div class="column">
        <BaseSelect
          size="large"
          :list="tripTypes"
          optionValue="id"
          optionText="name"
          :disabled="true || disableQuoteByStatus || hideElementByCondition"
          placeholder="Select a trip type"
          :value="formItinerary[0].trip_type || ''"
          @input="updateformItinerary('trip_type', $event)"
          label="Trip type*"
        />
      </div>
    </div>
    <div class="columns">
      <GuideBox
        title="Creating a new quote"
        description="Choose a contract"
        :step="11"
        :positionY="-150"
        :showNextButton="formItinerary[0].contract_id !== null"
      />
      <div :class="focusedGuideBoxClass('column is-relative', 11, true)">
        <b-tooltip
          position="is-top"
          label="View Sales Manuals"
          class="corner__icon"
        >
          <button
            :disabled="loading"
            @click="displayIsViewContractSalesManualModal"
          >
            <IconEye
              class="icon color-8 is-xsmall mr-1"
              style="width: 1rem; height: 1rem"
            />
          </button>
        </b-tooltip>
        <BaseSelect
          size="large"
          :list="client_contracts"
          optionValue="id"
          optionText="code"
          :disabled="
            loading ||
            disableQuoteByStatus ||
            hideElementByCondition ||
            formItinerary[0].client_id === null ||
            Boolean(request.id)
          "
          placeholder="Select a contract"
          :value="formItinerary[0].contract_id"
          @input="
            updateformItinerary('contract_id', $event);
            nextStep();
          "
          label="Contract*"
          @click.native="isContractAvailableToSelect"
          :data-test-id="
            constants.DATA_TEST_ID_VALUES.BASIC_INFO_CONTRACT_SELECT
          "
          :isNotValid="fieldHasError('contract_id')"
        />
      </div>
      <div class="column">
        <BaseInput
          size="large"
          label="Code*"
          :disabled="
            itinerary.code === null ||
            disableQuoteByStatus ||
            loading ||
            hideElementByCondition
          "
          placeholder="Code-123-ABC"
          :value="formItinerary[0].code || ''"
          @input="updateformItinerary('code', $event)"
          id="daysInput"
        />
      </div>
      <div class="column">
        <BaseSelect
          size="large"
          :list="currencies"
          optionValue="id"
          optionText="currency_code"
          :disabled="
            true || disableQuoteByStatus || loading || hideElementByCondition
          "
          placeholder="Select a currency"
          :value="formItinerary[0].currency_id"
          @input="updateformItinerary('currency_id', $event)"
          label="Currency*"
        />
      </div>
      <div class="column">
        <BaseSelect
          size="large"
          :list="languages"
          optionValue="id"
          optionText="language_name"
          :disabled="disableQuoteByStatus || loading || hideElementByCondition"
          placeholder="Select a language"
          :value="formItinerary[0].language_id || ''"
          @input="updateformItinerary('language_id', $event)"
          label="Language*"
        />
      </div>
    </div>
    <div
      class="columns is-flex is-justify-content-space-between is-align-items-center basic_info_form__footer"
    >
      <div class="column" style="max-width: 10rem">
        <BaseSelect
          v-if="displayItineraryTypes"
          label="Type"
          :list="itineraryTypes"
          optionValue="id"
          optionText="name"
          placeholder="Select a itinerary type"
          :disabled="loading || disableQuoteByStatus || hideElementByCondition"
          :value="formItinerary[0].itinerary_type_id || 0"
          @input="updateformItinerary('itinerary_type_id', $event)"
          class="field itinerary_type_bottom__field"
          size="large"
          :data-test-id="constants.DATA_TEST_ID_VALUES.BASIC_INFO_TYPE_SELECT"
          :isNotValid="fieldHasError('itinerary_type_id')"
        />
      </div>
      <div>
        <BaseShortcutLink @click="handleModalShortcuts" class="shortcutsLink" />
        <BaseModal
          :isComponentModalActive="shortcutsOpen"
          type="shortcuts"
          :shortcuts="shortcuts"
          :closeModal="handleModalShortcuts"
        >
          <span slot="title">Basic Information keyboard shortcuts </span>
        </BaseModal>
      </div>
    </div>
  </section>
</template>

<script>
import { parse, format } from "date-fns";
import { mapGetters } from "vuex";
import AddServicesModal from "@/components/quote-views/_shared/AddServicesModal.vue";
import { basicInformationShortcuts as shortcuts } from "@/utils/shortcuts";
import GuideBox from "../../_shared/GuideBox.vue";
import {
  MAX_ITINERARY_DAYS,
  DATE_FORMAT_YYYY_MM_DD,
  USER_ROLE,
} from "@/constants";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import helpers from "@/helpers";
import { ITINERARY_TYPES } from "@/constants/itinerary";
import { helper } from "@/utils/itinerary";
import { datesHelper } from "@//utils/dates";

export default {
  name: "BasicInfoForm",
  data() {
    return {
      helper: {
        ...datesHelper,
        ...helper,
      },
      constants: {
        MAX_ITINERARY_DAYS,
        DATA_TEST_ID_VALUES,
        DATE_FORMAT_YYYY_MM_DD,
      },
      open: false,
      dateFrom: "",
      dateTo: this.formItinerary?.[0]?.end_date,
      maxDateTo: null,
      minDateTo: null,
      numPax: helper.generateList(1, 40),
      shortcutsOpen: false,
      shortcuts,
      modalRoomDistribution: null,
      remainingPax: 0,
    };
  },
  components: {
    AddServicesModal,
    GuideBox,
  },
  watch: {
    itineraryTypeIdByQuery(newValue) {
      if (newValue && !this.itinerary.data?.id) {
        this.updateformItinerary("itinerary_type_id", newValue);
      }
    },
    dateFrom(newDateFrom) {
      if (!newDateFrom) return;

      const endDate = parse(newDateFrom);
      endDate.setDate(endDate.getDate() + this.days - 1);

      this.updateformItinerary(
        "end_date",
        format(endDate, DATE_FORMAT_YYYY_MM_DD)
      );
      this.updateformItinerary("start_date", newDateFrom);

      this.minDateTo = this.dateFrom;
      this.maxDateTo = this.getMaxDateTo(this.dateFrom);

      if (parse(newDateFrom) > parse(this.formItinerary[0].end_date)) {
        this.$buefy.toast.open({
          duration: 4000,
          message: `Incorrect dates: The end date cannot be before the start date.`,
          position: "is-top",
          type: "is-danger",
        });
        return false;
      }
    },
    dateTo(newDateTo) {
      if (!newDateTo) return;

      this.updateformItinerary("end_date", newDateTo);
      if (!this.formItinerary[0].start_date) {
        this.updateformItinerary(
          "start_date",
          this.helper.getDateWithAddedDays(newDateTo, 0)
        );
      }
      if (parse(newDateTo) < parse(this.formItinerary[0].start_date)) {
        this.$buefy.toast.open({
          duration: 4000,
          message: `Incorrect dates: The end date cannot be before the start date.`,
          position: "is-top",
          type: "is-danger",
        });
        return false;
      }
    },
    formItinerary: {
      handler(newFormData) {
        this.dateFrom = newFormData[0].start_date;
        this.dateTo = newFormData[0].end_date;
        this.validateQuoteIsLinkedToRequest();
      },
      deep: true,
    },
  },
  computed: {
    sampleFormat() {
      const dtf = new Intl.DateTimeFormat(this.locale, { timezome: "UTC" });
      return dtf.format(new Date(2000, 11, 25, 12));
    },
    days() {
      const time =
        parse(this.formItinerary[0].end_date) -
        parse(this.formItinerary[0].start_date);
      const numberDays = time >= 0 ? time / (1000 * 60 * 60 * 24) + 1 : 0;
      this.handleChangeDays(numberDays);
      return Math.ceil(numberDays);
    },
    itineraryTypes() {
      return helper.getItineraryTypesMapped();
    },
    displayItineraryTypes() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    itineraryTypeIdByQuery() {
      const { query } = this.$route;
      if (query.itinerary) return null;
      if (query.type) {
        const typeId = this.itineraryTypes.find(
          (type) => type.type.toLowerCase() === query.type
        );
        return typeId?.id;
      }
      return ITINERARY_TYPES.NO_TEMPLATE.id;
    },
    ...mapGetters({
      authData: "auth/getAuthData",
      clients: "client/getClients",
      currencies: "currency/getCurrencies",
      itinerary: "itinerary/getItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      itineraryStatus: "itinerary/getItineraryStatus",
      client_contracts: "client/getClientContracts",
      roomPreferableDistributionJson:
        "itinerary/getRoomPreferableDistributionJson",
      loading: "utils/getLoading",
      languages: "language/getLanguages",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      formItinerary: "itinerary/getFormItinerary",
      datesFormat: "itinerary/getDatesFormat",
      request: "request/getRequest",
    }),
    itineraryTypeLabel() {
      const currentItineraryTypeId = this.formItinerary?.[0]?.itinerary_type_id;
      return helper
        .getItineraryTypesMapped()
        ?.find((itineraryType) => itineraryType.id === currentItineraryTypeId)
        ?.name;
    },
  },
  props: {
    setLoading: {
      type: Function,
      default: () => {},
      required: true,
    },
    modalPreventBasicInfo: {
      type: Boolean,
      default: false,
    },
    handleModalPreventBasicInfo: {
      type: Function,
      default: () => {},
    },
    handleSaveItinerary: {
      type: Function,
      default: () => {},
      required: true,
    },
    loadClientContracts: {
      type: Function,
      default: () => {},
    },
    showServices: {
      type: Boolean,
      default: true,
    },
    service_types: {
      type: [Array, Object],
      default: () => [],
    },
    tripTypes: {
      type: [Array, Object],
      default: () => [],
    },
    setGlobalModalOpenName: {
      type: Function,
      default: () => {},
    },
    updateformItinerary: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    fieldHasError(field, key2 = null) {
      const value = key2
        ? this.formItinerary[0][field][key2]
        : this.formItinerary[0][field];
      const valueIsString = typeof value === "string";

      return (
        [null, undefined, ""].includes(value) || valueIsString?.length === 0
      );
    },
    validateTitleInput(event) {
      const validatedTitle = event.target.value.replace("|", "");
      this.updateformItinerary("title", {
        id: this.formItinerary[0].title.id,
        value: validatedTitle,
      });
      event.target.value = validatedTitle;
    },
    displayIsViewContractSalesManualModal() {
      this.$store.dispatch("utils/setIsViewContractSalesManualModalOpen", true);
    },
    handleValidateNDays($event) {
      if (Number($event.target.value) <= MAX_ITINERARY_DAYS) {
        this.days = $event;
        this.handleNumberDays($event);
      } else {
        this.days = MAX_ITINERARY_DAYS;
        $event.target.value = this.days;
        this.handleNumberDays($event);
        this.$buefy.toast.open({
          duration: 5000,
          message: `N° Days max is ${MAX_ITINERARY_DAYS}`,
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    getMaxDateTo($event) {
      const endDate = new Date($event);
      endDate.setDate(endDate.getDate() + MAX_ITINERARY_DAYS);
      return endDate;
    },
    async loadFirstClientContract(clientId = "") {
      this.setLoading(true);
      await this.loadClientContracts(clientId);
      const firstClientContract = this.client_contracts[0];
      this.updateformItinerary("contract_id", firstClientContract?.id);
      this.setLoading(false);
    },
    isContractAvailableToSelect() {
      if (this.formItinerary[0].client_id === null) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Please select a Client before to select Contract.`,
          position: "is-top",
          type: "is-danger",
        });
        return;
      }
    },
    setDefaultRoomDistribution() {
      this.handleModalRoomDistribution();
      const defaultRoomDistribution = this.setDefaultRoomDistributionFromPax(
        this.roomPreferableDistributionJson,
        this.formItinerary[0].num_pax
      );
      this.$store.dispatch(
        "itinerary/setRoomPreferableDistributionJson",
        defaultRoomDistribution
      );
      this.setMaxRoomQty();
    },
    setDefaultRoomDistributionFromPax(data, numPax) {
      this.remainingPax = numPax;
      const roomQtyTypes = [...data];
      roomQtyTypes.sort((a, b) => b.max_pax - a.max_pax);
      const distribution = [];
      for (const roomType of roomQtyTypes) {
        const requiredRooms = Math.floor(this.remainingPax / roomType.max_pax);
        distribution.push({ ...roomType, qty: requiredRooms });
        this.remainingPax %= roomType.max_pax;
      }
      return distribution.sort((a, b) => a.max_pax - b.max_pax);
    },
    saveRoomPreferedDistribution() {
      this.handleModalRoomDistribution();
      if (this.formItinerary[0].id !== null) {
        this.handleSaveItinerary();
      }
    },
    setMaxRoomQty() {
      const numPax = this.formItinerary[0].num_pax;
      if (numPax > 1) {
        let acumPax = 0;
        this.roomPreferableDistributionJson.forEach((item) => {
          acumPax += item.qty * item.max_pax;
        });
        this.remainingPax = numPax - acumPax;

        this.roomPreferableDistributionJson.forEach((room) => {
          let { id_room_type, qty, max_pax } = room;
          if (id_room_type === 1) {
            if (this.remainingPax + qty <= numPax) {
              room.max_qty = this.remainingPax + qty;
            } else {
              room.max_qty = numPax;
            }
          } else if (this.remainingPax >= max_pax) {
            room.max_qty = Math.ceil(this.remainingPax / max_pax) + qty;
          } else {
            room.max_qty = qty;
          }
        });
        this.$store.dispatch(
          "itinerary/setRoomPreferableDistributionJson",
          this.roomPreferableDistributionJson
        );
        this.$forceUpdate();
      }
    },
    handleModalRoomDistribution() {
      if (this.disableQuoteByStatus) return;
      if (this.hideElementByCondition) return;

      if (!this.formItinerary[0].num_pax) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Please select pax qty before to select room distribution.`,
          position: "is-top",
          type: "is-danger",
        });
        return;
      }
      this.modalRoomDistribution = !this.modalRoomDistribution;
      if (this.modalRoomDistribution) {
        this.setGlobalModalOpenName("modalRoomDistribution");
      } else {
        this.setGlobalModalOpenName("");
      }
    },
    handleModalShortcuts() {
      this.shortcutsOpen = !this.shortcutsOpen;
    },
    generateCode() {
      this.$store.dispatch("itinerary/generateCode");
    },
    handleNumberDays(e) {
      const days = Number(e.target.value) - 1;
      if (days >= 1) {
        const newDate = parse(this.formItinerary[0].start_date);
        newDate.setDate(newDate.getDate() + days);
        this.dateTo = format(newDate, DATE_FORMAT_YYYY_MM_DD);
      } else {
        this.days = 1;
        this.updateformItinerary("num_day", 1);
        this.dateTo = this.formItinerary[0].start_date;
      }
    },
    handleChangeDays(days) {
      this.dateFrom = this.formItinerary[0].start_date;
      if (this.formItinerary?.[0]?.num_day !== Math.ceil(days))
        this.updateformItinerary("num_day", Math.ceil(days));
    },
    focusedGuideBoxClass(classDefault, step, bgWhite = false) {
      const bgWhiteClass = bgWhite ? "bg-white" : "";
      return this.isUserGuideActive && this.userGuideStep === step
        ? `${classDefault} is-guide-step ${bgWhiteClass}`
        : classDefault;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
    prevStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/prevStep");
    },
    validateQuoteIsLinkedToRequest() {
      if (
        this.request?.id &&
        !this.itinerary?.data?.id &&
        !this.formItinerary[0].num_pax &&
        !this.formItinerary[0].num_pax &&
        !this.formItinerary[0].room_preferable_dist.length &&
        !this.formItinerary[0].start_date &&
        !this.formItinerary[0].end_date
      ) {
        this.$nextTick(() => {
          this.$refs.form_title__element.$el.children[1].focus();
        });
      }
    },
  },
  mounted() {
    if (!this.itinerary.data?.id) {
      this.updateformItinerary(
        "itinerary_type_id",
        this.itineraryTypeIdByQuery
      );
    }
  },
};
</script>
<style>
.basic-info.shortcutLinkContainer .shortcutsLink {
  padding-right: 0.3em !important;
}
.roomDistributionCard {
  flex-direction: column;
}
.roomDistributionTitle,
.roomDistributionSubtitle {
  text-align: left;
  line-height: 40px;
}
.roomDistributionTitle {
  font-size: 30px;
  font-weight: 400;
  color: #32324d;
  margin-bottom: 1rem !important;
}
.roomDistributionSubtitle {
  font-size: 1rem;
  font-weight: 300;
  color: #32324d;
}
.roomDistributionBody {
  padding: 2rem 0;
  width: 90%;
  margin-top: 1.5rem;
  justify-content: space-evenly;
}
.roomDistributionBodyItem {
  flex-direction: column;
  padding: 1rem;
  border-radius: 0 0 0.8rem 0.8rem;
}
.roomDistributionBodyItem span {
  margin: 0.8rem 0;
  font-weight: 400;
}
.roomDistributionButtons {
  width: 60%;
  justify-content: space-between;
}
.roomDistributionButtons .field {
  width: 40%;
}
.quoteCreationSubtitle {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: #666687;
}
.roomDistributionBodyItem[is-selected="active"] {
  border: 4px solid #f00b81;
  position: relative;
}
.roomDistributionBodyItem[is-selected="active"]::after {
  content: "Selected ✔";
  position: absolute;
  top: -2rem;
  width: 100%;
  border: 1px solid #f00b81;
  outline: 4px solid #f00b81;
  text-align: center;
  color: #fff;
  background-color: #f00b81;
  border-radius: 0.8rem 0.8rem 0 0;
  padding: 0.25rem 0;
}
.corner__icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  height: min-content;
  background-color: transparent;
}
.corner__icon button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.itinerary_type_top__field {
  display: none !important;
}
@media screen and (max-width: 480px) {
  .BasicInfoForm .animation-content {
    max-width: 90% !important;
    min-width: 90% !important;
    max-height: 90% !important;
    min-height: 90% !important;
    overflow-x: hidden;
  }
  .BasicInfoForm .animation-content .card {
    max-width: auto !important;
    min-width: auto !important;
    max-height: 100% !important;
    min-height: 100% !important;
  }
  .roomDistributionTitle {
    font-size: 1.5rem;
    line-height: 1.5rem;
  }
  .roomDistributionSubtitle {
    font-size: 0.85rem;
    line-height: 1.5rem;
    font-weight: 400;
  }
  .roomDistributionBody {
    flex-direction: column;
    gap: 2rem;
  }
  .roomDistributionBodyItem {
    border: 1px solid #ccc;
    border-radius: 1rem;
  }
  .roomDistributionBodyItem[is-selected="active"] {
    border-radius: 0 0 1rem 1rem;
    margin-top: 2rem;
  }
  .roomDistributionButtons {
    gap: 1rem;
    align-items: center;
    width: 100%;
  }
  .roomDistributionButtons .field {
    width: auto;
    margin: 0;
  }
  .card-footer {
    position: sticky;
    bottom: 0;
    left: 0;
    background-color: #fff;
  }
  .quoteCreationSubtitle {
    display: block;
    margin: 0.25rem 0 1rem;
  }
  .BasicInfoForm {
    padding: 1.25rem !important;
    margin-top: 0rem !important;
  }
  .BasicInfoForm .columns {
    margin: 0.2rem 0;
  }
  .BasicInfoForm .column {
    padding: 0.5rem 0;
  }
  .BasicInfoForm > div > h2 {
    padding: 0 !important;
    margin: 0 !important;
  }
  .selectContainer .label,
  .base-input-container .label {
    font-size: 0.8rem !important;
  }
  .itinerary_type_top__field {
    display: flex !important;
    margin: 0rem !important;
  }
  .basic_info_form__footer,
  .itinerary_type_bottom__field {
    display: none !important;
  }
  .shortcutsLink {
    display: none;
  }
  .columns:not(:last-child) {
    margin-bottom: 0rem;
  }
}
</style>
