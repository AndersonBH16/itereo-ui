<template>
  <div :data-test-id="constants.DATA_TEST_ID_VALUES.ITINERARY_DAY">
    <BaseModal
      :isComponentModalActive="modal.open"
      :closeModal="toggleModalAndResetState"
    >
      <IconWarning
        v-if="modal.type === 'info'"
        slot="icon"
        class="icon is-xsmall color-12"
      />
      <IconError
        v-if="modal.type === 'danger'"
        slot="icon"
        class="icon is-large color-danger"
      />
      <span slot="title" v-html="modal[modal.type].message"></span>
      <span slot="paragraph" v-if="modal.type === 'info'"
        >Are you sure to continue?
      </span>
      <div slot="buttons" v-if="modal.type === 'info'" class="is-flex">
        <BaseButton
          @click="toggleModalAndResetState()"
          action="secondary"
          size="medium"
          :disabled="loading"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="updateDaysAndSave"
          action="tercery"
          size="medium"
          :disabled="loading"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>
    <div
      :class="
        focusedGuideBoxClass(
          'columns itineraryDay',
          [35, 37],
          false,
          () => index === 0
        )
      "
      v-if="dayData"
    >
      <div class="column is-one-quarter">
        <div
          :class="
            focusedGuideBoxClass(
              'PhotoImage itinerary_day_assets__container',
              41,
              false,
              () => index === 0
            )
          "
          :data-test-id="
            constants.DATA_TEST_ID_VALUES.ITINERARY_DAY_PHOTOS_CONTROL
          "
        >
          <img
            :src="`${
              dayData.images_full && dayData.images_full.length
                ? dayData.images_full[0].thumbnail_350X240
                : 'https://place-hold.it/610x380/DDDDDD/fff.jpg?bold&fontsize=50&text=610x380'
            }`"
            alt=""
          />
          <AssetsContainer
            v-if="isEditing"
            :dayLocations="dayData.location"
            :formWithImages="[dayData]"
            :locationPathProp="locationPath"
            :multiple="false"
            :type="constants.ASSET_TYPE.DAY"
            :validateFunctionExecution="validateFunctionExecution"
          />
        </div>
      </div>
      <div class="column">
        <div class="itineraryInfoDay mb-3">
          <div class="card">
            <div class="card-content">
              <div class="media mb-3">
                <div class="media-content">
                  <div
                    :class="
                      focusedGuideBoxClass(
                        'title is-5 mb-2 is-flex-grow-1 itinerary_day_title__container',
                        38,
                        true,
                        () => index === 0
                      )
                    "
                  >
                    <div class="mb-4 w-100 itinerary_info_day__header">
                      <span
                        class="has-text-weight-medium itineraryInfoDay__day"
                      >
                        Day {{ dayData.start_day }}
                      </span>
                      <div
                        v-if="!hideElementByCondition"
                        class="media-right is-flex is-justify-content-center"
                      >
                        <b-button
                          v-if="autocomplete"
                          :disabled="disableQuoteByStatus"
                          :loading="isGeneratingDayTexts"
                          style="height: 2rem"
                          class="itinerary_day_autocomplete__button mr-2"
                          @click="() => handleAutocompleteDay(dayData)"
                        >
                          <div class="is-flex is-align-items-center">
                            <i class="mr-4">
                              <IconChatGpt
                                class="icon is-small"
                                style="height: 1rem; width: 1rem"
                              />
                            </i>
                            <p style="font-size: 0.9rem">Autocomplete</p>
                          </div>
                        </b-button>
                        <div class="is-flex is-align-items-center">
                          <b-switch
                            v-model="isSwitchedDayServices"
                            class="color-2 mr-0"
                            :disabled="isLoading"
                            v-if="!isEditing"
                          >
                          </b-switch>
                          <b-button
                            :class="
                              focusedGuideBoxClass(
                                'button-saas p-0 pr-1 editButton',
                                36,
                                false,
                                () => index === 0
                              )
                            "
                            :data-test-id="
                              constants.DATA_TEST_ID_VALUES
                                .ITINERARY_DAY_EDIT_BUTTON
                            "
                            tag="a"
                            @click="
                              nextStep();
                              editDay();
                            "
                            v-if="!isEditing"
                            :loading="isLoading"
                            :disabled="isLoading || disableQuoteByStatus"
                          >
                            <i
                              class="button is-color4 is-info button-saas is-radius is-size is-small ml-2"
                            >
                              <IconPencil
                                class="icon is-small"
                                v-if="!isLoading"
                              />
                            </i>
                          </b-button>
                          <b-tooltip v-else label="Cancel day editing">
                            <b-button
                              type="button-saas is-light"
                              size="is-small"
                              @click="toggleEditADay(false)"
                              :disabled="isLoading"
                            >
                              <IconClose class="icon is-small" />
                            </b-button>
                          </b-tooltip>
                          <b-modal
                            v-model="isRemoveDayModalActive.isOpen"
                            has-modal-card
                            trap-focus
                            :destroy-on-hide="false"
                            aria-role="dialog"
                            aria-label="Example Modal"
                            aria-modal
                          >
                            <template #default="props">
                              <form action="">
                                <div class="modal-card" style="width: auto">
                                  <header class="modal-card-head">
                                    <p class="modal-card-title"></p>
                                    <button
                                      type="button"
                                      class="delete"
                                      @click="props.close"
                                    />
                                  </header>
                                  <section class="modal-card-body">
                                    <div
                                      style="width: 25rem"
                                      class="has-text-centered"
                                    >
                                      <h2 class="title">Removing a day</h2>
                                      <p>
                                        {{ isRemoveDayModalActive.message }}
                                      </p>
                                    </div>
                                  </section>
                                  <footer
                                    class="modal-card-foot is-flex is-justify-content-center"
                                  >
                                    <b-button
                                      label="Cancel"
                                      type="is-text"
                                      @click="props.close"
                                    />
                                    <b-button
                                      label="Delete"
                                      type="is-danger"
                                      @click="confirmRemoveDay(dayData)"
                                    />
                                  </footer>
                                </div>
                              </form>
                            </template>
                          </b-modal>
                        </div>
                      </div>
                    </div>
                    <p
                      v-if="!isEditing"
                      class="has-text-weight-bol"
                      :data-test-id="
                        constants.DATA_TEST_ID_VALUES.ITINERARY_DAY_TITLE_VIEW
                      "
                      v-html="dayData.title.value"
                    ></p>
                    <span
                      v-else
                      class="is-flex-grow-1 w-100"
                      :data-test-id="
                        constants.DATA_TEST_ID_VALUES
                          .ITINERARY_DAY_TITLE_EDIT_CONTROL
                      "
                    >
                      <BaseInput
                        v-model="form.title"
                        placeholder="Add a title."
                        size="large"
                        class="w-100"
                        :required="true"
                        :disabled="isLoading"
                      />
                    </span>
                  </div>
                  <GuideBox
                    title="Editing your itinerary"
                    description="Here, you can search a location"
                    :step="39"
                    :positionX="-100"
                    :positionY="0"
                    v-if="index === 0"
                    :showNextButton="form.location && form.location.length > 0"
                  />
                  <p
                    class="subtitle is-6 is-flex is-align-items-center mt-3 itinerary_day_subtitle__container"
                  >
                    <span class="mr-5">{{
                      dayData.start_date | customDate()
                    }}</span>
                    <span
                      v-if="!isEditing"
                      class="ml-5 itinerary_day_location"
                      :data-test-id="
                        constants.DATA_TEST_ID_VALUES
                          .ITINERARY_DAY_LOCATION_VIEW
                      "
                    >
                      {{ dayData.location | customJoin("location_name") }}
                    </span>
                    <span
                      v-else
                      :class="
                        focusedGuideBoxClass(
                          'is-flex-grow-1 w-100',
                          39,
                          true,
                          () => index === 0
                        )
                      "
                    >
                      <multiselect
                        v-model="form.location"
                        :options="allLocations"
                        :multiple="true"
                        tag-position="top"
                        :max-height="100"
                        :close-on-select="true"
                        :clear-on-select="false"
                        :preserve-search="true"
                        :allow-empty="true"
                        placeholder="Search a location and press enter"
                        track-by="location_name"
                        label="location_name"
                        @input="changeFormLocationsPath"
                        :disabled="isLoading"
                        :data-test-id="
                          constants.DATA_TEST_ID_VALUES
                            .ITINERARY_DAY_LOCATION_EDIT_CONTROL
                        "
                      >
                      </multiselect>
                    </span>
                  </p>
                </div>
              </div>

              <div
                :class="
                  focusedGuideBoxClass('my-4', 40, true, () => index === 0)
                "
              >
                <div
                  class="content"
                  v-html="dayData.description.value"
                  v-if="!isEditing"
                  :data-test-id="
                    constants.DATA_TEST_ID_VALUES.ITINERARY_DAY_DESCRIPTION_VIEW
                  "
                ></div>
                <vue-editor
                  v-else
                  :value="form.description"
                  :disabled="isLoading"
                  :is-disabled="isLoading"
                  :data-test-id="
                    constants.DATA_TEST_ID_VALUES
                      .ITINERARY_DAY_DESCRIPTION_EDIT_CONTROL
                  "
                  @input="
                    (value) =>
                      (form.description = helpers.preventHTMLEscaping(value))
                  "
                  @paste="(event) => onPaste(event)"
                  :id="`editor-${dayData.id}`"
                />
              </div>

              <div class="content" v-if="isSwitchedDayServices">
                <ItineraryInfoDayServices
                  :data="dayData"
                  :services_per_day="services_per_day"
                  @update="updateServicesPerDay"
                />
              </div>

              <footer
                v-if="!hideElementByCondition"
                class="card-footer pr-0 pl-0"
              >
                <div
                  class="card-footer-item is-justify-content-flex-end pb-0 pr-0"
                  v-if="!isEditing && !isReorderingServices"
                >
                  <div class="itineraryDayButtonsContainer">
                    <BaseButton
                      size="medium"
                      @click="addADay(index)"
                      :disabled="isLoading || disableQuoteByStatus"
                      action="green"
                    >
                      <IconPlus slot="icon" class="icon is-small" />
                      <p slot="text">Day</p>
                    </BaseButton>
                  </div>
                </div>
                <div
                  class="card-footer-item is-justify-content-space-between p-0"
                  v-else
                >
                  <b-tooltip
                    :active="nextDaysHaveServices"
                    label="There are services involved in this action"
                    type="is-warning"
                  >
                    <b-button
                      type="button-saas is-light border-radius-4 mr-2 remove_day__button"
                      size="is-small"
                      @click="toggleRemoveDayModal(dayData)"
                      :disabled="isLoading || nextDaysHaveServices"
                    >
                      <IconTrash class="icon is-small" />
                      <span class="ml-2">Remove day</span>
                    </b-button>
                  </b-tooltip>
                  <div
                    class="is-flex is-justify-content-space-between"
                    :data-test-id="
                      constants.DATA_TEST_ID_VALUES.ITINERARY_DAY_SAVE_BUTTON
                    "
                  >
                    <BaseButton
                      class="mb-0 mr-2"
                      @click="cancelEdit"
                      action="secondary"
                      :disabled="isLoading"
                      size="large"
                    >
                      <p slot="text">Cancel</p>
                    </BaseButton>
                    <BaseButton
                      size="medium"
                      @click="
                        nextStep();
                        saveEdit();
                      "
                      action="tercery"
                      :loading="isLoading"
                      :class="
                        focusedGuideBoxClass('', 44, false, () => index === 0)
                      "
                    >
                      <i slot="icon" class="mr-4 ml-1">
                        <IconCheck class="icon is-small" />
                      </i>
                      <p slot="text">Save</p>
                    </BaseButton>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addDays, format, parse } from "date-fns";
import { VueEditor } from "vue2-editor";
import Multiselect from "vue-multiselect";
import ItineraryInfoDayServices from "./ItineraryInfoDayServices.vue";
import AssetsContainer from "@/components/_shared/AssetsContainer.vue";
import cloneDeep from "lodash.clonedeep";
import { addDaysToDate, setDay, getSalesManualUUID } from "@/utils/utils";
import { getLocationsPath } from "@/utils/itinerary";
import { ASSET_TYPE, DATE_FORMAT_YYYY_MM_DD } from "@/constants";
import { PATH_INFO } from "@/router/path";
import GuideBox from "../../_shared/GuideBox.vue";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import helpers from "@/helpers";
import { serviceHelper } from "@/utils/service";
import IconChatGpt from "@/components/icons/IconChatGpt.vue";

export default {
  name: "ItineraryInfoDay",
  components: {
    IconChatGpt,
    ItineraryInfoDayServices,
    Multiselect,
    AssetsContainer,
    VueEditor,
    GuideBox,
  },
  data() {
    return {
      helpers: helpers,
      constants: {
        ASSET_TYPE,
        DATA_TEST_ID_VALUES,
        DATE_FORMAT_YYYY_MM_DD,
      },
      locationPath: "",
      isSwitchedDayServices: true,
      isLoading: false,
      isEditing: false,
      isReorderingServices: false,
      form: {
        title: "",
        location: null,
        description: "",
      },
      isRemoveDayModalActive: {
        isOpen: false,
        message: "",
      },
      services_per_day: [],
      modal: {
        info: {
          message: `Services, Itinerary dates and prices could be updated according to the new order
        <br />of days!`,
        },
        danger: {
          message: `Sorry, we cannot create the day, <br />because we have found a package, which dates cannot be edited.`,
        },
        open: false,
        type: "info",
      },
      itineraryDaysUpdated: [],
      dayData: cloneDeep(this.data),
    };
  },
  props: {
    index: {
      type: Number,
      default: 1,
    },
    selectedDay: {
      type: Object,
      default: () => {},
    },
    autocomplete: {
      type: Boolean,
      default: false,
    },
    data: {
      type: [Array, Object],
      default: () => {},
    },
    services_itinerary: {
      type: [Array, Object],
      default: () => {},
    },
    reorderDays: {
      type: Boolean,
      default: true,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    fetchSaveEdit: {
      type: Function,
      default: () => {},
    },
    generatingDays: {
      type: Boolean,
      default: false,
    },
    handleAutocompleteDay: {
      type: Function,
      default: () => {},
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    loadItinerary: {
      type: Function,
      default: () => {},
    },
    loadItineraryDays: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
    updateDaysEditedList: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
      itinerary: "itinerary/getItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      itineraryDays: "itineraryDays/getItineraryDays",
      locations: "client/getDestinations",
      countries: "client/getCountriesFromContract",
      itineraryStatus: "itinerary/getItineraryStatus",
      client_contracts: "client/getClientContracts",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      authUser: "auth/getAuthUserData",
      quoteServices: "itinerary/getServicesItinerary",
    }),
    allLocations() {
      return [...this.locations, ...this.countries];
    },
    isLocationsLoading() {
      return this.locations.length === 0;
    },
    locationsFormatted() {
      if (this.locations.length === 0) {
        return [];
      }
      if (!this.dayData.location) {
        return [];
      }
      return this.dayData.location.map((l) => {
        const location = this.allLocations.filter((il) => il.id === l.id);
        return {
          id: location.length ? location[0].id : 0,
          location_name: location.length ? location[0].location_name : "",
          location_code: location.length ? location[0].location_code : "",
          order: l.order,
        };
      });
    },
    nextDaysHaveServices() {
      const nextDays = this.itineraryDays.slice(this.index);
      return nextDays.some((day) => day.services.length > 0);
    },
    isGeneratingDayTexts() {
      return this.generatingDays && this.selectedDay?.id === this.dayData.id;
    },
  },
  watch: {
    data(newValue) {
      this.dayData = newValue;
    },
    dayData() {
      this.loadDayServices();
    },
  },
  mounted() {
    this.loadDayServices();
  },
  methods: {
    onPaste(event) {
      event.preventDefault();
      event.stopPropagation();
      const editor = document.querySelector(
        `#editor-${this.dayData.id} .ql-editor`
      );
      const pastedContent = event.clipboardData.getData("text");
      const validatedValue = this.preventHTMLEscaping(pastedContent);
      editor.innerHTML = validatedValue;
      setTimeout(() => {
        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNodeContents(editor);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        editor.scrollTop += 100000;
      }, 1);
    },
    preventHTMLEscaping(value) {
      const validatedValue = value.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      return validatedValue;
    },
    loadDayServices() {
      if (this.dayData.services && this.services_itinerary) {
        const servicesWithFullData = this.dayData?.services?.map(
          (dayService) => {
            const fullService = this.services_itinerary?.find(
              (service) => service.id === dayService.itinerary_service
            );
            return fullService !== undefined ? fullService : false;
          }
        );
        this.services_per_day = servicesWithFullData.filter(
          (service) => service !== false
        );
      }
    },
    updateServicesPerDay(value = []) {
      this.toggleIsReorderingServices(this.isDayServiceListReordered(value));
      this.services_per_day = value;
    },
    isDayServiceListReordered(value = []) {
      const initialServices = this.dayData.services.map(
        (s) => s.itinerary_service
      );
      const prevValue = JSON.stringify(initialServices);
      const newValue = JSON.stringify(value.map((s) => s.id));
      return prevValue !== newValue;
    },
    changeFormLocationsPath() {
      const filteredLocations = this.form.location.filter(
        (location) => location.id !== 0 && location.id !== null
      );
      const newLocationPath = getLocationsPath(filteredLocations);
      this.locationPath = newLocationPath;
    },
    processServices(services, cur_step = 0, last_step = 0) {
      const uuid = this.$route.query.itinerary;
      if (uuid) {
        services.forEach((service) => {
          service.day = setDay(
            service.start_date,
            service.end_date,
            this.itinerary.data
          );
        });
        return this.$store.dispatch("itinerary/add_service", {
          calculate_price: 1,
          data: services,
          uuid,
          sm: getSalesManualUUID(this.itinerary, this.client_contracts),
          cur_step,
          last_step,
        });
      } else {
        this.$router.push(PATH_INFO.HOME.path);
      }
    },
    toggleModalAndResetState(type = null) {
      this.toggleModal(type);
      this.resetState();
    },
    toggleModal(type = null) {
      this.modal.open = !this.modal.open;
      if (this.modal.open && type) {
        this.modal.type = type;
      }
    },
    resetState() {
      if (!this.modal.open) {
        this.itineraryDaysUpdated = [];
      }
    },
    async saveEdit() {
      if (this.isLoading) return false;

      this.isLoading = true;

      const initialQuoteServices = JSON.parse(
        JSON.stringify(this.quoteServices)
      );

      const uuid = this.$route.query.itinerary;
      const newServices = this.adaptDayServices(
        this.dayData.services,
        this.services_per_day
      );
      const TOTAL_STEPS_TO_PERFORM = 1;
      if (this.isReorderingServices && !this.isEditing) {
        const data = { ...this.dayData, services: newServices };
        const payload = { data, uuid };
        await this.fetchSaveEdit(
          payload,
          TOTAL_STEPS_TO_PERFORM,
          TOTAL_STEPS_TO_PERFORM
        );

        this.dayData = cloneDeep(this.data);

        this.toggleIsReorderingServices(false);

        this.isLoading = false;
        return;
      }

      let title = this.dayData.title;
      let description = this.dayData.description;

      const language_code = this.itinerary.data.language.language_code;

      helpers.applyTranslation(language_code, title, this.form.title);
      helpers.applyTranslation(
        language_code,
        description,
        this.form.description
      );

      let cleanImages = this.dayData?.images_full?.map(({ id }) => id);

      this.dayData.images = "{" + cleanImages.join(",") + "}";

      const cleanSourceLocations = (arr) =>
        arr.reduce((acc, el) => {
          const existLocation =
            this.form.location.findIndex((fl) => fl.id === el.id) > -1;
          if (!existLocation) {
            el["status"] = -1;
            acc.push(el);
          }
          return acc;
        }, []);

      const sourceLocations = this.dayData.location || [];
      const cleanLocations = cleanSourceLocations(sourceLocations);
      const newLocations = this.form.location.map((l, i) => ({
        id: l.id,
        order: i + 1,
      }));
      const location = newLocations?.concat(cleanLocations);

      const data = [
        {
          ...this.dayData,
          title,
          location,
          description,
          services: this.isReorderingServices
            ? newServices
            : this.dayData.services,
        },
      ];
      const payload = { uuid, data };

      await this.fetchSaveEdit(
        payload,
        TOTAL_STEPS_TO_PERFORM,
        TOTAL_STEPS_TO_PERFORM
      );

      await this.loadServicesItinerary(true);

      const newQuoteServices = JSON.parse(JSON.stringify(this.quoteServices));

      const isTheSameArray = serviceHelper.compareServicesOrderByCode(
        initialQuoteServices,
        newQuoteServices
      );

      if (!isTheSameArray) {
        Sentry.withScope((scope) => {
          scope.setTags({
            initial_quote_id: initialQuoteId,
            initial_services: JSON.stringify(initialQuoteServicesCodes),
            new_quote_id: newQuoteId,
            new_services: JSON.stringify(newQuoteServicesCodes),
          });

          console.log("ORIGINAL SERVICES", initialQuoteServicesCodes);
          console.log("NEW SERVICES", newQuoteServicesCodes);

          setTimeout(() => console.clear(), 0);

          Sentry.captureMessage(
            `Itinerary services with different order after editing day ${this.dayData?.start_day}: ${this.$route.query.itinerary}`,
            "error"
          );
        });
      }

      this.toggleEditADay();
      this.toggleIsReorderingServices(false);

      this.isLoading = false;
    },
    cancelEdit() {
      this.loadDay();
      this.toggleIsReorderingServices(false);
      this.toggleEditADay(false);
    },
    adaptDayServices(initialServices = [], newServices = []) {
      if (newServices.length === 0) return initialServices;
      const mappedServices = initialServices.map((ser) => {
        const service = newServices.find(
          (sp) => sp.id === ser.itinerary_service
        );
        return {
          ...ser,
          order: service?.order,
        };
      });
      return mappedServices.sort((a, b) => a.order - b.order);
    },
    addDays(date, count = 1) {
      const parsedDate = parse(date, DATE_FORMAT_YYYY_MM_DD, new Date());
      const newDate = addDays(new Date(parsedDate), count);
      const formattedDate = format(new Date(newDate), DATE_FORMAT_YYYY_MM_DD);
      return formattedDate;
    },
    getPackagesBeforeAfterNewDay(sourceItineraryDays, indexDay) {
      const packagesBeforeAndAfterNewDay = [];
      if (sourceItineraryDays.length) {
        sourceItineraryDays.forEach((day, index) => {
          if (
            day.services.length &&
            this.services_itinerary &&
            this.services_itinerary.length
          ) {
            if (index === indexDay || index === indexDay + 2) {
              day.services.forEach((service) => {
                const serviceFound = this.services_itinerary.filter(
                  (item) => item.service === service.uuid
                );
                if (serviceFound.length) {
                  if (serviceFound[0].id_service_type === 9) {
                    service.day = day.start_day;
                    service.serviceDetail = serviceFound[0];
                    packagesBeforeAndAfterNewDay.push(service);
                  }
                }
              });
            }
          }
        });
      }
      return packagesBeforeAndAfterNewDay;
    },
    updateServicesDates(days, indexDay) {
      const servicesToUpdate = [];
      if (days.length) {
        const itineraryServices = cloneDeep(this.services_itinerary);
        const dayStartDate = days[indexDay].start_date;

        days.forEach((day, index) => {
          if (index >= indexDay) {
            day.services.forEach((service) => {
              const existsService = servicesToUpdate.findIndex(
                (item) => item.service === service.uuid
              );
              if (existsService === -1) {
                const serviceFound = itineraryServices.filter(
                  (serviceItinerary) =>
                    service.uuid === serviceItinerary.service
                );
                servicesToUpdate.push(serviceFound[0]);
              }
            });
          }
        });
        if (servicesToUpdate.length) {
          servicesToUpdate.forEach((serviceItinerary) => {
            if (parse(serviceItinerary.start_date) >= parse(dayStartDate)) {
              serviceItinerary.start_date = addDaysToDate(
                serviceItinerary.start_date,
                1
              );
            }
            if (parse(serviceItinerary.end_date) >= parse(dayStartDate)) {
              serviceItinerary.end_date = addDaysToDate(
                serviceItinerary.end_date,
                1
              );
            }
          });
        }
      }
      return servicesToUpdate;
    },
    updateNewDayWithAccommodations(days, servicesItinerary) {
      if (days.length) {
        const accommodations = [];
        days.forEach((day) => {
          const services = day.services.length ? day.services : null;
          if (services) {
            services.forEach((service) => {
              const accommodationFound = servicesItinerary.filter(
                (itineraryService) =>
                  itineraryService.service === service.uuid &&
                  itineraryService.id_service_type === 2
              );
              if (accommodationFound.length) {
                if (
                  parse(day.start_date) <=
                    parse(accommodationFound[0].end_date) &&
                  parse(day.start_date) >=
                    parse(accommodationFound[0].start_date)
                ) {
                  accommodations.push(accommodationFound[0]);
                }
              }
            });
          }
        });
        if (accommodations.length) {
          days.forEach((day) => {
            day.services = day.services || [];
            accommodations.forEach((accommodation) => {
              const accommodationExists = day.services.findIndex(
                (item) => item.uuid === accommodation.service
              );
              if (
                parse(day.start_date) <= parse(accommodation.end_date) &&
                parse(day.start_date) >= parse(accommodation.start_date) &&
                accommodationExists == -1
              ) {
                day.services.push({
                  id: null,
                  order: 1,
                  uuid: accommodation.service,
                });
              }
            });
          });
        }
      }
      return days;
    },
    async updateDaysAndSave() {
      try {
        this.toggleModal();
        this.isLoading = true;
        this.setLoading(true);
        if (this.$route.query.itinerary && this.itineraryDaysUpdated.length) {
          const servicesItineraryUpdated = this.updateServicesDates(
            this.itineraryDaysUpdated,
            this.itineraryDaysUpdated[0].indexDay
          );
          const data = this.updateNewDayWithAccommodations(
            this.itineraryDaysUpdated,
            servicesItineraryUpdated
          );
          const TOTAL_STEPS_TO_PERFORM = servicesItineraryUpdated.length
            ? 2
            : 1;
          const payload = {
            uuid: this.$route.query.itinerary,
            data,
            cur_step: 1,
            last_step: TOTAL_STEPS_TO_PERFORM,
          };
          const response = await this.$store.dispatch(
            "itineraryDays/processItineraryDays",
            payload
          );

          if (response) {
            this.itineraryDaysUpdated = [];
            await this.loadItinerary(null, true);
            await this.loadItineraryDays(true);
            if (servicesItineraryUpdated.length) {
              await this.processServices(
                servicesItineraryUpdated,
                TOTAL_STEPS_TO_PERFORM,
                TOTAL_STEPS_TO_PERFORM
              );
              this.loadServicesItinerary(true);
            }
            this.isLoading = false;
            this.setLoading(false);
            this.resetState();
          } else {
            throw new Error();
          }
        }
      } catch (error) {
        this.itineraryDaysUpdated = [];
        this.isLoading = false;
        this.setLoading(false);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong, please try again!",
          position: "is-top",
          type: "is-danger",
        });
        throw error;
      }
    },
    async addADay(indexDay) {
      try {
        this.setLoading(true);
        if (this.isLoading) {
          return false;
        }

        if (this.itineraryDays.length < 1) {
          return false;
        }

        const itineraryStartDate = this.itinerary.data.start_date;
        const sourceItineraryDays = [...this.itineraryDays];
        const newDay = {
          id: null,
          duration: 1,
          title: {
            id: null,
            value: "Day added",
          },
          services: [],
          images: "",
          start_date: "",
          end_date: "",
          start_day: "",
          description: {
            id: null,
            value: "Day added description",
          },
          location: [],
        };
        let counterDay = 1;
        let counterDate = itineraryStartDate;
        let processedItineraryDays = [];

        sourceItineraryDays.splice(indexDay + 1, 0, newDay);

        processedItineraryDays = sourceItineraryDays.map((day, index) => {
          counterDay =
            index === 0 ? Number(counterDay) : Number(counterDay) + 1;
          counterDate = index === 0 ? counterDate : this.addDays(counterDate);
          const cleanImages =
            Array.isArray(day.images) && day.images.length
              ? day.images.map((img) => {
                  return img.id;
                })
              : [];
          day.images = "{" + cleanImages.join(",") + "}";
          return {
            ...day,
            start_day: counterDay,
            start_date: counterDate,
            end_date: counterDate,
            _order_start_day: true,
          };
        });

        const existsPackagesBeforeAndAfterNewDay =
          this.validateIfExistsPackageBeforeAfterNewDay(
            processedItineraryDays,
            indexDay
          );

        if (existsPackagesBeforeAndAfterNewDay) {
          this.toggleModalAndResetState("danger");
          this.setLoading(false);
          return false;
        }

        this.itineraryDaysUpdated = processedItineraryDays;
        this.itineraryDaysUpdated[0].indexDay = indexDay + 1;

        this.toggleModalAndResetState("info");
        this.setLoading(false);
      } catch (error) {
        this.itineraryDaysUpdated = [];
        this.isLoading = false;
        this.setLoading(false);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong, please try again!",
          position: "is-top",
          type: "is-danger",
        });
        throw error;
      }
    },
    loadDay() {
      this.form.title = this.dayData.title.value;
      this.form.description = this.dayData.description.value;
      this.form.location = this.locationsFormatted;
      this.changeFormLocationsPath();
    },
    toggleEditADay(newValue = null) {
      this.isEditing = newValue !== null ? newValue : !this.isEditing;

      this.updateDaysEditedList(this.dayData, this.isEditing);

      if (!this.isEditing) this.clearChanges();
    },
    clearChanges() {
      this.dayData = cloneDeep(this.data);
    },
    toggleIsReorderingServices(newValue = null) {
      this.isReorderingServices =
        newValue !== null ? newValue : !this.isReorderingServices;
    },
    editDay() {
      this.loadDay();
      this.toggleEditADay();
    },
    toggleRemoveDayModal(dayToRemove) {
      const isLastDay = this.itineraryDays?.at(-1)?.id === dayToRemove?.id;

      this.isRemoveDayModalActive = {
        isOpen: !this.isRemoveDayModalActive.isOpen,
        message: isLastDay
          ? "Are you sure you want to remove this day?"
          : "Are you sure you want to remove this day? Following days will be updated.",
      };
    },
    async confirmRemoveDay(dayToRemove) {
      try {
        this.setLoading(true);
        const uuid = this.$route.query.itinerary;
        const id = dayToRemove.id;
        const payload = { uuid, id };

        const initialQuoteServices = JSON.parse(
          JSON.stringify(this.quoteServices)
        );

        await this.$store.dispatch(
          "itineraryDays/deleteItineraryDays",
          payload
        );

        await this.validateNextDaysUpdating(dayToRemove);

        await Promise.allSettled([
          this.toggleEditADay(),
          this.toggleRemoveDayModal(),
          this.loadItineraryDays(true),
          this.loadServicesItinerary(true),
        ]);

        await this.loadItinerary(null, true);

        this.toggleEditADay(false);

        const newQuoteServices = JSON.parse(JSON.stringify(this.quoteServices));

        const isTheSameArray = serviceHelper.compareServicesOrderByCode(
          initialQuoteServices,
          newQuoteServices
        );

        if (!isTheSameArray) {
          Sentry.withScope((scope) => {
            scope.setTags({
              initial_quote_id: initialQuoteId,
              initial_services: JSON.stringify(initialQuoteServicesCodes),
              new_quote_id: newQuoteId,
              new_services: JSON.stringify(newQuoteServicesCodes),
            });

            console.log("ORIGINAL SERVICES", initialQuoteServicesCodes);
            console.log("NEW SERVICES", newQuoteServicesCodes);

            setTimeout(() => console.clear(), 0);

            Sentry.captureMessage(
              `Itinerary services with different order after removing day ${dayToRemove?.start_day}: ${this.$route.query.itinerary}`,
              "error"
            );
          });
        }

        this.setLoading(false);
      } catch (error) {
        this.setLoading(false);
        this.toggleRemoveDayModal();
        throw error;
      }
    },
    async validateNextDaysUpdating(dayToRemove) {
      try {
        const dayToRemoveIndex = this.itineraryDays.findIndex(
          (day) => day.id === dayToRemove.id
        );

        const nextDays = this.itineraryDays.slice(dayToRemoveIndex + 1) || [];

        if (nextDays.length === 0) return;

        const updatedNextDays = nextDays.map((day) => {
          day.start_day = day.start_day - 1;
          day.order = day.order - 1;
          day.start_date = this.addDays(day.start_date, -1);
          day.end_date = this.addDays(day.end_date, -1);
          return day;
        });

        const uuid = this.$route.query.itinerary;

        await Promise.allSettled(
          updatedNextDays.map(async (day) => {
            const payload = { data: day, uuid };

            const TOTAL_STEPS_TO_PERFORM = 1;

            await this.fetchSaveEdit(
              payload,
              TOTAL_STEPS_TO_PERFORM,
              TOTAL_STEPS_TO_PERFORM
            );
          })
        );
      } catch (error) {
        throw error;
      }
    },
    validateIfExistsPackageBeforeAfterNewDay(sourceItineraryDays, indexDay) {
      let packageExistsBeforeAfterNewDay = false;
      if (sourceItineraryDays.length) {
        const packageBeforeAndAfterNewDay = this.getPackagesBeforeAfterNewDay(
          sourceItineraryDays,
          indexDay
        );
        if (packageBeforeAndAfterNewDay.length) {
          const accommPackUuids = packageBeforeAndAfterNewDay.map(
            (item) => item.uuid
          );
          const uniquePackages = new Set(accommPackUuids);

          uniquePackages.forEach((id) => {
            const serviceFound = packageBeforeAndAfterNewDay.filter(
              ({ serviceDetail }) => serviceDetail.service === id
            );
            if (
              Array.isArray(serviceFound) &&
              serviceFound.length > 1 &&
              serviceFound[0].day !== serviceFound[1].day
            ) {
              packageExistsBeforeAfterNewDay = true;
            }
          });
        }
      }
      return packageExistsBeforeAfterNewDay;
    },
    focusedGuideBoxClass(
      classDefault,
      step,
      bgWhite = false,
      extraValidator = null
    ) {
      const bgWhiteClass = bgWhite ? "bg-white" : "";
      const checkStep = step.length
        ? step.includes(this.userGuideStep)
        : this.userGuideStep === step;
      const resultExtraValidator = !extraValidator || extraValidator();
      return this.isUserGuideActive &&
        checkStep &&
        !this.loading &&
        resultExtraValidator
        ? `${classDefault} is-guide-step ${bgWhiteClass}`
        : classDefault;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
.itineraryInfoDay__day {
  height: 1rem;
}
.ql-editor {
  max-height: 80px;
}
.itineraryInfoDay .card {
  background-color: var(--quote-bg-color);
}
.itineraryInfoDay .card-content div > .content {
  max-height: 100px;
  overflow-y: auto;
}
.itineraryInfoDay .table {
  background-color: var(--quote-bg-color);
}
.itineraryDayButtonsContainer {
  display: flex;
  justify-content: space-between;
}
.button-saas.editButton {
  height: max-content;
}
.quillWrapper[is-disabled="true"] {
  pointer-events: none;
  opacity: 0.5;
}
.itineraryInfoDay__day .remove_day__button[disabled] {
  cursor: not-allowed;
}
.itinerary_day_assets__container > div > .field {
  margin-top: 1rem;
}
.itinerary_day_assets__container > div > .field button {
  margin: 0 auto;
}
.itinerary_info_day__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@media screen and (max-width: 480px) {
  .PhotoImage img {
    width: 100%;
  }
  .media-content {
    overflow-y: clip;
  }
  .itinerary_day_title__container {
    align-items: flex-start !important;
    flex-direction: column;
    row-gap: 0.25rem;
    font-size: 1rem !important;
  }
  .itinerary_day_subtitle__container {
    flex-direction: column;
    align-items: flex-start !important;
    row-gap: 0.25rem;
  }
  .itinerary_day_location {
    margin: 0 !important;
  }
  .itinerary_day_assets__container > div > .field {
    margin-top: 0.5rem;
  }
  .itineraryInfoDay .card-content {
    padding: 0.75rem;
  }
  .itinerary_day_autocomplete__button {
    font-size: 0.7rem;
  }
  .itinerary_info_day__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .itinerary_info_day__header .media-right {
    margin: 0rem !important;
    width: 100%;
    justify-content: space-between !important;
  }
  .card-footer {
    padding: 0rem;
  }
  .card-footer-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 0rem;
  }
  .card-footer-item > div:nth-of-type(2) {
    width: 100%;
  }
  .itineraryDayButtonsContainer,
  .itineraryDayButtonsContainer > div,
  .itineraryDayButtonsContainer button {
    width: 100% !important;
    padding: 0rem;
  }
}
</style>
