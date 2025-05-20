<template>
  <section style="width: 100%">
    <div
      :class="[
        'card-header weblink_card__header',
        isItineraryCancelled
          ? 'box__disabled'
          : isOpenWeblinkTab
          ? 'card-open'
          : '',
      ]"
      role="button"
      @click="toggleWebItinerary"
    >
      <p class="card-header-title">Weblink / Web Itinerary</p>
      <div
        class="card-header-icon"
        v-if="
          this.$route.query.itinerary !== undefined && !hideElementByCondition
        "
      >
        <a
          v-if="!isOpenWeblinkTab"
          :class="focusedGuideBoxClass('button button-saas', 47, false)"
        >
          <i
            class="button is-color4 is-danger button-saas is-radius is-size is-small"
          >
            <IconPencil class="icon is-small" />
          </i>
        </a>
        <a v-if="isOpenWeblinkTab" class="ml-5 color-11">
          <i class="button button-saas button-info is-size is-small mr-0">
            <IconClose class="icon is-small color-11" />
          </i>
          Cancel
        </a>
      </div>
      <div class="weblink__buttons">
        <BaseButton
          v-if="isOpenWeblinkTab"
          size="medium"
          @click="onlySaveExportChanges"
          action="tercery"
        >
          <IconCheck slot="icon" class="icon is-small" />
          <p slot="text">Save</p>
        </BaseButton>
        <button
          :disabled="loading"
          @click="
            () => {
              publishItineraryAndOpenWeblinks();
              finishTourGuide();
            }
          "
          class="button-outline button is-color2 color2"
        >
          <i class="mr-4"><IconExport class="icon is-small" /></i>
          Export Weblink
        </button>
      </div>
    </div>
    <b-collapse
      :class="`card mb-2 ${isOpenWeblinkTab ? 'show' : ''}`"
      :open="isOpenWeblinkTab"
      @open="isOpenWeblinkTab"
      animation="slide"
    >
      <GuideBox
        title="Editing the Weblink"
        description="Here you can select a template to show your quotation, please select the one you like the most"
        :step="48"
        :positionX="350"
        :positionY="-110"
        :showNextButton="false"
        :showBackButton="false"
        v-if="!loading"
      />
      <GuideBox
        title="Editing the Weblink"
        description="Here you can also select what content you want to show in your Weblink"
        :step="49"
        :positionX="350"
        :positionY="150"
        v-if="!loading"
      />
      <GuideBox
        title="Editing the Weblink"
        description="You can press here if you want to hide travel dates in your Weblink"
        :step="50"
        :positionX="220"
        :positionY="340"
        v-if="!loading"
      />
      <GuideBox
        title="Editing the Weblink"
        description="You can press here if you want to hide the list of services in your Weblink"
        :step="51"
        :positionX="480"
        :positionY="340"
        v-if="!loading"
      />
      <GuideBox
        title="Editing the Weblink"
        description="Here you can add photos that you want to show in your Weblink"
        :step="52"
        :positionX="350"
        :positionY="350"
        v-if="!loading"
      />
      <GuideBox
        title="Editing the Weblink"
        description="Let's add one photo to your Weblink, click on 'Add Photo'"
        :step="53"
        :positionX="20"
        :positionY="380"
        :showNextButton="false"
        v-if="!loading"
      />
      <GuideBox
        title="Editing the Weblink"
        description="Great!, you have added a photo to your Weblink"
        :step="56"
        :positionX="20"
        :positionY="360"
        :showBackButton="false"
        v-if="!loading"
      />
      <GuideBox
        title="Editing the Weblink"
        description="Now you can add more photos or publish your Weblink"
        :step="57"
        :positionX="20"
        :positionY="360"
        v-if="!loading"
        :primaryButtonAction="handleScroll"
      />
      <GuideBox
        title="Editing the Weblink"
        description="As the last step, you can publish your Weblink clicking on 'Publish/Open'"
        :step="58"
        :positionX="420"
        :positionY="0"
        :showNextButton="false"
        v-if="!loading"
      />
      <div class="card-content">
        <div
          v-if="!isExperience"
          :class="focusedGuideBoxClass('template-cards mb-5', 48, true)"
        >
          <p class="has-text-weight-bold template-card-title mb-2">
            Select a template
          </p>
          <div class="carousel__container">
            <div
              v-for="template in templates"
              :key="template.id"
              :class="[
                templateOption === template.id ? 'active' : '',
                'border-radius-20 is-flex p-2 w-40 template__card',
              ]"
            >
              <div class="PhotoImage sideBar" @click="nextStep()">
                <img :src="template.image_cover" :alt="template.name" />
                <b-radio
                  v-model="templateOption"
                  name="name"
                  :native-value="Number(template.id)"
                  class="card__content"
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                >
                  {{ template.name }}
                </b-radio>
              </div>
            </div>
          </div>
        </div>
        <ExportAccordionColors
          v-if="isTemplateSelectedAvailableToEdit() && !isExperience"
          :templateColors="templateColors"
          @update="updateColors"
        />
        <div
          v-if="!isExperience"
          :class="focusedGuideBoxClass('template-cards', 49, true)"
        >
          <p class="has-text-weight-bold template-card-title mb-4">
            Select content
          </p>
          <p class="template-card-title mb-2">
            Choose the content you want to show in your Weblink
          </p>
          <div class="block is-flex export_config_contents__container">
            <div class="mr-5">
              <p class="has-text-weight-semibold template-card-title mb-2">
                Sections
              </p>
              <div
                :class="
                  focusedGuideBoxClass(
                    'checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2',
                    50,
                    true
                  )
                "
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_TRAVEL_DATES"
                  size="is-small"
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                  >Travel dates
                </b-checkbox>
              </div>
              <div
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_ITINERARY"
                  size="is-small"
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                  >Itinerary
                </b-checkbox>
              </div>
              <div
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.ITINERARY_DESCRIPTION"
                  size="is-small"
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                  >Description
                </b-checkbox>
              </div>
              <div
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_HOTELS_ACCOMMODATIONS"
                  size="is-small"
                  @input.native="
                    () =>
                      checkConfigOptions(
                        false,
                        templateConfig.DISPLAY_HOTELS_ACCOMMODATIONS
                      )
                  "
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                  >Accommodations/Hotels
                </b-checkbox>
              </div>
              <div
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_CONTACT_US"
                  size="is-small"
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                  >Contact Us
                </b-checkbox>
              </div>
            </div>
            <div class="mr-5">
              <p class="has-text-weight-semibold template-card-title mb-2">
                Service List
              </p>
              <div
                :class="
                  focusedGuideBoxClass(
                    'checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2',
                    51,
                    true
                  )
                "
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_SERVICE_LIST"
                  size="is-small"
                  @input="() => checkConfigOptions(false)"
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                  >Service list
                </b-checkbox>
              </div>
              <div
                v-if="hasViewServiceListWithPricesPermission"
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-tooltip
                  position="is-bottom"
                  type="is-warning"
                  class="tooltip__warning"
                  multilined
                  :active="serviceListWithPricesConditions.length > 0"
                >
                  <b-checkbox
                    v-model="configOptions"
                    :native-value="
                      templateConfig.DISPLAY_SERVICE_LIST_WITH_PRICES
                    "
                    size="is-small"
                    :disabled="
                      serviceListWithPricesConditions.length > 0 ||
                      disableQuoteByStatus ||
                      hideElementByCondition
                    "
                  >
                    Service list with prices
                  </b-checkbox>
                  <template v-slot:content>
                    <ul class="tooltip__list">
                      <li
                        v-for="condition in serviceListWithPricesConditions"
                        :key="condition"
                      >
                        {{ condition }}
                      </li>
                    </ul>
                  </template>
                </b-tooltip>
              </div>
              <div
                :class="
                  focusedGuideBoxClass(
                    'checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2',
                    51,
                    true
                  )
                "
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_OPTIONALS_WITH_PRICES"
                  size="is-small"
                  @input.native="
                    () =>
                      checkConfigOptions(
                        false,
                        templateConfig.DISPLAY_OPTIONALS_WITH_PRICES
                      )
                  "
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                >
                  Optionals with prices
                </b-checkbox>
              </div>
            </div>
            <div>
              <p class="has-text-weight-semibold template-card-title mb-2">
                Prices Level
              </p>
              <div
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_COMFORT_LEVEL"
                  size="is-small"
                  @input="
                    () =>
                      checkConfigOptions(
                        true,
                        templateConfig.DISPLAY_COMFORT_LEVEL
                      )
                  "
                  :disabled="
                    disableQuoteByStatus ||
                    hideElementByCondition ||
                    isLevelDisabled(constants.SERVICE_LEVELS.COMFORT.id)
                  "
                  >Comfort level
                </b-checkbox>
              </div>
              <div
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_SUPERIOR_LEVEL"
                  size="is-small"
                  @input="
                    () =>
                      checkConfigOptions(
                        true,
                        templateConfig.DISPLAY_SUPERIOR_LEVEL
                      )
                  "
                  :disabled="
                    disableQuoteByStatus ||
                    hideElementByCondition ||
                    isLevelDisabled(constants.SERVICE_LEVELS.SUPERIOR.id)
                  "
                  >Superior level
                </b-checkbox>
              </div>
              <div
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_LUXURY_LEVEL"
                  size="is-small"
                  @input="
                    () =>
                      checkConfigOptions(
                        true,
                        templateConfig.DISPLAY_LUXURY_LEVEL
                      )
                  "
                  :disabled="
                    disableQuoteByStatus ||
                    hideElementByCondition ||
                    isLevelDisabled(constants.SERVICE_LEVELS.LUXURY.id)
                  "
                  >Luxury level
                </b-checkbox>
              </div>
              <div
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_PRICES"
                  size="is-small"
                  @input.native="
                    () =>
                      checkConfigOptions(false, templateConfig.DISPLAY_PRICES)
                  "
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                >
                  Prices Levels
                </b-checkbox>
              </div>
              <div
                v-if="hasViewPaymentMethodsPermission"
                class="checkbox-container border-radius-20 p-1 pt-2 pl-2 mb-2"
              >
                <b-checkbox
                  v-model="configOptions"
                  :native-value="templateConfig.DISPLAY_PAYMENT_GATEWAY"
                  size="is-small"
                  @input.native="
                    () =>
                      checkConfigOptions(
                        false,
                        templateConfig.DISPLAY_PAYMENT_GATEWAY
                      )
                  "
                  :disabled="disableQuoteByStatus || hideElementByCondition"
                >
                  Payment Methods
                </b-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div :class="focusedGuideBoxClass('mb-5 mt-5 content', 52, true)">
          <p class="has-text-weight-bold template-card-title mb-2">
            Select Images
          </p>
          <div
            class="columns w-100 mb-0 mt-1 export_photos__container"
            :disabled="disableQuoteByStatus || hideElementByCondition"
          >
            <div
              class="column is-centered"
              v-for="imageType in templateImages"
              :key="imageType.type"
            >
              <b-tooltip
                :label="`${imageType.label} image`"
                type="is-info"
                position="is-bottom"
              >
                <div class="PhotoImage sideBar">
                  <img
                    :src="imageType.images_full[0].thumbnail_350X240"
                    :alt="imageType.images_full[0].name"
                  />
                </div>
              </b-tooltip>
              <div class="flex-center">
                <AssetsContainer
                  class="pt-2"
                  :locationPathProp="getAssetPath(imageType)"
                  :formWithImages="[imageType]"
                  :category="imageType.category"
                  type="export"
                  :multiple="false"
                  :allow-empty="true"
                  :validateFunctionExecution="validateFunctionExecution"
                  @update="updateImages"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!hideElementByCondition"
          class="is-flex is-justify-content-flex-end"
        >
          <button
            :disabled="loading"
            @click="
              () => {
                publishItineraryAndOpenWeblinks();
                finishTourGuide();
              }
            "
            class="button-outline button is-color2 color2"
          >
            <i class="mr-4"><IconExport class="icon is-small" /></i>
            Export Weblink
          </button>
        </div>
      </div>
    </b-collapse>

    <br />

    <div
      v-if="!hideElementByCondition"
      role="button"
      :class="`card-header export_word__container ${
        isItineraryCancelled ? 'box__disabled' : ''
      }`"
    >
      <p class="card-header-title">Word / Text Processor</p>
      <ExportToWordButton />
    </div>

    <br />

    <hr style="background-color: #aaa" />

    <div
      v-if="!hideElementByCondition"
      role="button"
      class="card-header external_export_tab"
      style="display: flex; justify-content: space-between"
    >
      <div class="w-100">
        <div class="mb-2" style="display: block">
          <p v-if="isAlreadyExported" class="card-header-title">
            <IconCheckCircle /> Exported to
            <strong class="has-text-capitalize ml-1">{{
              itineraryExternalSource
            }}</strong>
          </p>
          <p v-else-if="isExportingToExternal" class="card-header-title">
            <span class="loading_circle__icon mr-2"></span> Exporting
            <strong class="has-text-capitalize ml-1">{{
              itineraryExternalSource
            }}</strong>
          </p>
          <p v-else class="card-header-title pl-0">Export to External Source</p>
        </div>
        <div class="pb-2 is-flex is-justify-content-space-between w-100">
          <div>
            <p>
              <IconWarning
                v-if="!accountOnOtherSystem"
                class="icon_warning"
                style="width: 1.2rem; height: 1.2rem"
              />
              <span class="has-text-weight-semibold">User: </span>
              {{ accountOnOtherSystem ? authData.user.external_code : "No" }}
            </p>
            <p class="mt-2">
              <span class="has-text-weight-semibold">Code: </span>
              {{
                itineraryExternalCode.length > 0
                  ? itineraryExternalCode
                  : "Please wait 10 to 15 minutes after confirming"
              }}
            </p>
            <p
              v-if="!isAlreadyExported || itineraryExternalUrl.length > 0"
              class="mt-2"
            >
              <span class="has-text-weight-semibold">Link(Oppen): </span>
              <a
                class="has-text-underline"
                v-if="itineraryExternalUrl.length > 0"
                :href="itineraryExternalUrl"
                target="_blank"
              >
                {{ itineraryExternalUrl }}
              </a>
              <span v-else>
                Please wait 10 to 15 minutes after confirming
              </span>
            </p>
            <p v-if="!isAlreadyExported && !isItineraryConfirmed" class="mt-2">
              <IconWarning
                class="icon_warning"
                style="width: 1.2rem; height: 1.2rem"
              />
              <span class="has-text-weight-semibold py-4">Important:</span>
              To export a quote, it must first be confirmed.
            </p>
          </div>
          <div>
            <button
              v-if="exportToExternalButtonEnable"
              :disabled="loading"
              @click="onExternalExportClick"
              class="button-outline button is-color2 color2"
            >
              <i class="mr-4"><IconExport class="icon is-small" /></i>
              Export Itinerary
            </button>
            <ExternalExportModal
              :isModalOpen="showExternalExportModal"
              :loading="loading"
              :onExternalExportContinue="onExternalExportContinue"
              :closeModal="closeExternalExportModal"
            />

            <CongratulationsModal
              :isModalOpen="showCongratulationsMessage"
              :closeModal="() => (showCongratulationsMessage = false)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import AssetsContainer from "../../_shared/AssetsContainer.vue";
import GuideBox from "@/components/_shared/GuideBox.vue";
import ExternalExportModal from "@/components/quote-views/_shared/ExternalExportModal.vue";
import CongratulationsModal from "@/components/quote-views/_shared/CongratulationsModal.vue";
import {
  TEMPLATES,
  TEMPLATES_LIST,
  TEMPLATE_CONFIG,
  SERVICE_LIST_WITH_PRICES_CONDITIONS,
  getTemplateImagesDefault,
} from "@/constants/exportConfig";
import ExportToWordButton from "./ExportToWordButton.vue";
import ExportAccordionColors from "./ExportAccordionColors.vue";
import * as utils from "@/utils/itinerary";
import { CATEGORY_ASSET, USER_ROLE } from "@/constants";
import { exportHelper } from "@/utils/export";
import helpers from "@/helpers";
import { ITINERARY_STATUS } from "@/constants/itinerary";
import { SERVICE_LEVELS } from "@/constants/services";
import { serviceHelper } from "@/utils/service";

export default {
  name: "ExportAccordion",
  components: {
    AssetsContainer,
    GuideBox,
    ExportToWordButton,
    ExportAccordionColors,
    ExternalExportModal,
    CongratulationsModal,
  },
  props: {
    isExperience: {
      type: Boolean,
      default: false,
    },
    published_images_config: {
      type: [Array, Object],
      default: () => [],
    },
    templateColors: {
      type: Array,
      default: () => [],
    },
    templateImages: {
      type: Array,
      default: () => [],
    },
    isOpenWeblinkTab: {
      type: Boolean,
      default: false,
    },
    setIsOpenWeblinkTab: {
      type: Function,
      default: () => {},
    },
    handleLoading: {
      type: Function,
      default: () => {},
    },
    loadPublishedImagesItinerary: {
      type: Function,
      default: () => {},
    },
    finishTourGuide: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      helper: { ...exportHelper },
      constants: {
        SERVICE_LEVELS,
      },
      templateConfig: TEMPLATE_CONFIG,
      utils: utils,
      showCongratulationsMessage: false,
      showExternalExportModal: false,
      configOptions: [],
      templateOption: 1,
    };
  },
  watch: {
    isExperience() {
      this.$emit(
        "update:templateImages",
        getTemplateImagesDefault(this.isExperience)
      );
    },
  },
  computed: {
    ...mapGetters({
      countries: "client/getCountriesFromContract",
      itinerary: "itinerary/getItinerary",
      itineraryStatus: "itinerary/getItineraryStatus",
      templates: "itinerary/getWebTemplates",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      authData: "auth/getAuthData",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      loading: "utils/getLoading",
      itineraryServices: "itinerary/getServicesItinerary",
      isRecentlyExported: "itinerary/getIsRecentlyExported",
      itineraryPaxPrices: "itinerary/getPaxPrices",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      quotePrices: "itinerary/getPricesItineraries",
    }),
    isItineraryCancelled() {
      return this.itineraryStatus === ITINERARY_STATUS.CANCEL.value;
    },
    itineraryExternalSource() {
      return this.itinerary?.data?.external_source?.trim() || "";
    },
    itineraryExternalCode() {
      return this.itinerary?.data?.external_code?.trim() || "";
    },
    itineraryExternalUrl() {
      return this.itinerary?.data?.external_url?.trim() || "";
    },
    accountOnOtherSystem() {
      return this.authData.user.external_code?.length > 0;
    },
    isAvailableToExternalExport() {
      return (
        this.accountOnOtherSystem &&
        this.itineraryStatus === ITINERARY_STATUS.CONFIRM.value &&
        !this.isRecentlyExported
      );
    },
    isExportingToExternal() {
      return this.itinerary.exporting?.includes(this.itinerary.data?.id);
    },
    isAlreadyExported() {
      return this.itineraryExternalCode.length > 0;
    },
    isItineraryConfirmed() {
      return this.itineraryStatus === ITINERARY_STATUS.CONFIRM.value;
    },
    exportToExternalButtonEnable() {
      return (
        this.isAvailableToExternalExport &&
        !this.isAlreadyExported &&
        !this.isExportingToExternal
      );
    },
    hasViewPaymentMethodsPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    hasViewServiceListWithPricesPermission() {
      return helpers.hasAnyRoles(this.authData.user, [USER_ROLE.ADMIN], true);
    },
    serviceListWithPricesConditions() {
      const conditions = Object.values(SERVICE_LIST_WITH_PRICES_CONDITIONS);
      const hasHiddenItineraryServices =
        this.getHiddenItineraryServices().length > 0;
      const hasFee = this.validateIfQuoteHasFee();
      const hasUpsale = this.validateIfQuoteHasUpsale();

      const disableServiceListWithPrices =
        hasHiddenItineraryServices || hasFee || hasUpsale;

      if (!disableServiceListWithPrices) return [];

      const contents = this.published_images_config?.config?.contents || [];
      this.setConfigOptions(
        contents
          .map((content) => content.id_content)
          .filter(
            (content) =>
              !disableServiceListWithPrices ||
              content !== TEMPLATE_CONFIG.DISPLAY_SERVICE_LIST_WITH_PRICES
          )
      );

      return conditions.filter((condition) => {
        if (
          condition ===
            SERVICE_LIST_WITH_PRICES_CONDITIONS.NO_HIDDEN_SERVICES &&
          hasHiddenItineraryServices
        )
          return condition;
        if (condition === SERVICE_LIST_WITH_PRICES_CONDITIONS.NO_FEE && hasFee)
          return condition;
        if (
          condition === SERVICE_LIST_WITH_PRICES_CONDITIONS.NO_UPSALE &&
          hasUpsale
        )
          return condition;
      });
    },
  },
  methods: {
    isLevelDisabled(level) {
      const validation = (service) =>
        [level, SERVICE_LEVELS.ALL.id].includes(service.level);

      const hasServices = this.itineraryServices.filter(validation).length > 0;

      const hasPriceGreaterThanZero =
        this.quotePrices?.[0]?.prices.find(
          (priceLevel) => priceLevel.level === level
        )?.total > 0;

      return !hasServices || !hasPriceGreaterThanZero;
    },
    closeExternalExportModal() {
      this.showExternalExportModal = false;
    },
    async onExternalExportContinue(externalSource = "") {
      this.handleLoading(true);
      this.closeExternalExportModal();
      this.$store.dispatch("itinerary/setIsRecentlyExported", true);
      await this.$store.dispatch("itinerary/exportToExternal", {
        itineraryId: this.itinerary.data.id,
        externalSource,
      });
      this.$store.dispatch("itinerary/setIsRecentlyExported", false);
      this.showCongratulationsMessage = true;
      this.handleLoading(false);
    },
    async onExternalExportClick() {
      this.showExternalExportModal = true;
    },
    getHiddenItineraryServices() {
      return (
        this.itineraryServices.filter(
          (itineraryService) => !itineraryService.visible
        ) || []
      );
    },
    validateIfQuoteHasFee() {
      return this.itineraryPaxPrices.some((itineraryPaxPrice) => {
        return itineraryPaxPrice.price_levels.some((priceLevel) => {
          return priceLevel.prices.some((price) => price.fee > 0);
        });
      });
    },
    validateIfQuoteHasUpsale() {
      return this.itineraryPaxPrices.some((itineraryPaxPrice) => {
        return itineraryPaxPrice.price_levels.some((priceLevel) => {
          return priceLevel.prices.some((price) => price.mkt_coin > 0);
        });
      });
    },
    getExportToOOTooltip() {
      if (this.isExportingToExternal) return "Your quote is exporting...";
      if (this.isAlreadyExported) return "Your quote was already exported!";
      return "Export to Open Orange";
    },
    async exportToExternal() {
      if (!this.isAvailableToExternalExport) {
        return this.$buefy.toast.open({
          duration: 5000,
          message: "The quote is not available to do an external export!",
          position: "is-top",
          type: "is-danger",
        });
      }
      if (this.isAlreadyExported) {
        return this.$buefy.toast.open({
          duration: 5000,
          message: "The quote is already exported!",
          position: "is-top",
          type: "is-warning",
        });
      }
      if (this.isExportingToExternal) {
        return this.$buefy.toast.open({
          duration: 5000,
          message: "The quote is already exporting!",
          position: "is-top",
          type: "is-warning",
        });
      }
      this.handleLoading(true);
      await this.$store.dispatch("itinerary/setIsRecentlyExported", true);
      await this.$store.dispatch(
        "itinerary/exportToExternal",
        this.itinerary.data.id
      );
      await this.$store.dispatch("itinerary/setIsRecentlyExported", false);
      this.handleLoading(false);
      return this.$buefy.toast.open({
        duration: 10000,
        message: "The quote was successfully exported!",
        position: "is-top",
        type: "is-success",
      });
    },
    updateImages(newTemplateImages) {
      const defaultImages = getTemplateImagesDefault();
      this.$emit(
        "update:templateImages",
        this.templateImages.map((templateImage) => {
          const found = newTemplateImages.find(
            (newTemplateImage) => newTemplateImage.type === templateImage.type
          );
          if (found) {
            const defaultImage = defaultImages.find(
              (defaultImage) => defaultImage.type === found.type
            );
            return {
              ...found,
              images_full:
                found.images_full.length > 0
                  ? found.images_full
                  : defaultImage.images_full,
            };
          }
          return templateImage;
        })
      );
    },
    getAssetPath(imageType) {
      if (this.itinerary.data === undefined) return "";

      if (this.isExperience) {
        const firstItineraryServiceLocations =
          this.itineraryServices?.[0]?.location || [];
        return utils.getLocationsPath(firstItineraryServiceLocations);
      }
      if (imageType.category === CATEGORY_ASSET.CLIENT)
        return `CLIENT-${this.itinerary.data.client.id}`;

      return utils.getLocationsPath(this.countries);
    },
    toggleWebItinerary() {
      if (this.$route.query.itinerary === undefined) return;

      this.setIsOpenWeblinkTab(!this.isOpenWeblinkTab);
      this.nextStep();
    },
    setConfigOptions(newConfigOptions = []) {
      if (newConfigOptions.length === 0) {
        this.configOptions = [];
        return;
      }
      this.configOptions = newConfigOptions;
    },
    checkConfigOptions(fromLevels = false, templateConfigSelected = null) {
      const {
        DISPLAY_OPTIONALS_WITH_PRICES,
        DISPLAY_PRICES,
        DISPLAY_HOTELS_ACCOMMODATIONS,
        DISPLAY_PAYMENT_GATEWAY,
        DISPLAY_COMFORT_LEVEL,
        DISPLAY_LUXURY_LEVEL,
        DISPLAY_SUPERIOR_LEVEL,
        DISPLAY_SERVICE_LIST,
      } = TEMPLATE_CONFIG;

      const somePriceLevelSelected = this.configOptions.some((item) =>
        [
          DISPLAY_COMFORT_LEVEL,
          DISPLAY_LUXURY_LEVEL,
          DISPLAY_SUPERIOR_LEVEL,
        ].includes(item)
      );

      const isSelectingSomePriceLevel = [
        DISPLAY_COMFORT_LEVEL,
        DISPLAY_LUXURY_LEVEL,
        DISPLAY_SUPERIOR_LEVEL,
      ].includes(templateConfigSelected);

      if (isSelectingSomePriceLevel && !somePriceLevelSelected) {
        this.configOptions = this.configOptions.filter(
          (item) => ![DISPLAY_PAYMENT_GATEWAY].includes(item)
        );
      }

      const includesOptionalsWithPrices = this.configOptions.includes(
        DISPLAY_OPTIONALS_WITH_PRICES
      );
      const includesPriceLevels = this.configOptions.includes(DISPLAY_PRICES);
      const includesHotels = this.configOptions.includes(
        DISPLAY_HOTELS_ACCOMMODATIONS
      );
      const includesPaymentGateway = this.configOptions.includes(
        DISPLAY_PAYMENT_GATEWAY
      );

      const unselectingOptionalsWithPrices =
        templateConfigSelected === DISPLAY_OPTIONALS_WITH_PRICES &&
        includesOptionalsWithPrices &&
        includesPaymentGateway;
      const unselectingPricesLevels =
        templateConfigSelected === DISPLAY_PRICES &&
        includesPriceLevels &&
        includesPaymentGateway;
      const unselectingHotels =
        templateConfigSelected === DISPLAY_HOTELS_ACCOMMODATIONS &&
        includesHotels &&
        includesPaymentGateway;

      if (
        unselectingOptionalsWithPrices ||
        unselectingHotels ||
        unselectingPricesLevels
      ) {
        this.configOptions = this.configOptions.filter(
          (item) => item !== DISPLAY_PAYMENT_GATEWAY
        );
      }

      if (
        templateConfigSelected === DISPLAY_PAYMENT_GATEWAY &&
        !includesPaymentGateway &&
        (!includesOptionalsWithPrices ||
          !includesPriceLevels ||
          !includesHotels)
      ) {
        this.configOptions = [
          ...this.configOptions,
          ...[
            DISPLAY_OPTIONALS_WITH_PRICES,
            DISPLAY_PRICES,
            DISPLAY_HOTELS_ACCOMMODATIONS,
          ].filter((item) => !this.configOptions.includes(item)),
        ];
      }

      if (!somePriceLevelSelected && !fromLevels) {
        const filteredLevels = [
          {
            level: SERVICE_LEVELS.COMFORT.id,
            configOption: DISPLAY_COMFORT_LEVEL,
          },
          {
            level: SERVICE_LEVELS.SUPERIOR.id,
            configOption: DISPLAY_SUPERIOR_LEVEL,
          },
          {
            level: SERVICE_LEVELS.LUXURY.id,
            configOption: DISPLAY_LUXURY_LEVEL,
          },
        ].filter((item) => !this.isLevelDisabled(item.level));

        this.configOptions = [
          ...this.configOptions,
          ...filteredLevels.map((item) => item.configOption),
        ];
      } else if (!somePriceLevelSelected && fromLevels) {
        this.configOptions = this.configOptions.filter(
          (item) =>
            ![DISPLAY_SERVICE_LIST, DISPLAY_HOTELS_ACCOMMODATIONS].includes(
              item
            )
        );
      }
    },
    updateConfig() {
      const config = this.published_images_config.config
        ? { ...this.published_images_config.config }
        : {};
      config.id_template = this.templateOption;
      if (!config.id) {
        config.id = null;
      }

      const contents = [];
      this.configOptions.forEach((content) => {
        const existsConfigOption = contents.find(
          (item) => item.id_content === content
        );
        if (typeof content === "number" && !existsConfigOption) {
          contents.push({
            id: null,
            id_content: content,
          });
        }
      });

      if (config.contents && config.contents.length) {
        config.contents.forEach((content) => {
          const finIndexContent = contents.findIndex(
            (item) => item.id_content === content.id_content
          );
          if (finIndexContent !== -1) {
            contents[finIndexContent].id = content.id;
          } else {
            contents.push({
              ...content,
              status: -1,
            });
          }
        });
      }

      config.contents = contents;
      return config;
    },
    async onlySaveExportChanges() {
      try {
        this.handleLoading(true);
        await this.handleSaveImagesAndConfig({ cur_step: 1, last_step: 1 });
        this.handleLoading(false);
        this.$buefy.toast.open({
          duration: 5000,
          message: "The data was successfully updated!",
          position: "is-top",
          type: "is-success",
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: error.response?.data?.message
            ? error.response.data.message
            : "Can't save changes.",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    async handleSaveImagesAndConfig(payload) {
      const config = this.updateConfig();
      let adaptedPayload = {
        id: this.$route.query.itinerary,
        data: {
          images: [],
          config,
        },
        cur_step: payload?.cur_step || 1,
        last_step: payload?.last_step || 1,
      };

      const newImages = this.templateImages.map((item) => {
        const imageIds = item.images_full
          .map((image) => image.id)
          .filter((id) => id != null)
          .join(",");

        return {
          type: item.type,
          id: item.id,
          images: "{" + imageIds + "}",
        };
      });

      adaptedPayload.data.images = [
        ...adaptedPayload.data.images,
        ...newImages,
      ];
      adaptedPayload.data.config.colors =
        this.helper.getColorsWithoutDuplicated(this.templateColors);

      return this.$store
        .dispatch("itinerary/publishConfigAndImages", adaptedPayload)
        .then((response) => {
          if (response) {
            this.$buefy.toast.open({
              duration: 5000,
              message: "The data was successfully updated!",
              position: "is-top",
              type: "is-success",
            });
            this.loadPublishedImagesItinerary();
            return response;
          }
        })
        .catch((error) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: error.message,
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        });
    },
    openItinerary() {
      const idTemplate = this.published_images_config.config.id_template;
      const pathTemplate = TEMPLATES_LIST.find(
        (template) => template.id === idTemplate
      )?.path;
      window.open(
        `${process.env.VUE_APP_WEB_LINK_URL}/${pathTemplate}/${this.published_images_config.code}`,
        "_blank",
        ""
      );
    },
    publishItinerary(payload) {
      if (this.$route.query.itinerary) {
        const adaptedPayload = {
          data: {
            id: this.$route.query.itinerary,
            lang: this.itinerary.data.language.id,
          },
          lang: this.itinerary.data.language.id,
          cur_step: payload?.cur_step || 1,
          last_step: payload?.last_step || 1,
        };
        return this.$store.dispatch("itinerary/publish", adaptedPayload);
      } else {
        this.$router.push("/");
      }
    },
    closeWebItineraryAccordion() {
      this.setIsOpenWeblinkTab(false);
    },
    async publishItineraryAndOpenWeblinks() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          this.handleLoading(true);
          this.closeWebItineraryAccordion();
          await this.handleSaveImagesAndConfig({ cur_step: 1, last_step: 2 });
          const response = await this.publishItinerary({
            cur_step: 2,
            last_step: 2,
          });
          if (response) {
            this.handleLoading(false);
            this.$buefy.toast.open({
              duration: 5000,
              message: response.message,
              position: "is-top",
              type: "is-success",
            });
            if (
              this.published_images_config &&
              this.published_images_config.config
            ) {
              const idTemplate =
                this.published_images_config.config.id_template ??
                TEMPLATES.WHITELABEL.id;

              const pathTemplate = this.isExperience
                ? TEMPLATES.EXPERIENCE.path
                : TEMPLATES_LIST.find((template) => template.id === idTemplate)
                    ?.path;
              const weblinkUrl = `${process.env.VUE_APP_WEB_LINK_URL}/${pathTemplate}/${this.published_images_config.code}`;
              window.open(weblinkUrl, "_blank", "");
            }
          }
        },
        functionToExecuteOnFail: async (error) => {
          this.handleLoading(false);

          this.$store.dispatch("itinerary/setQuoteExportFailedAlert", {
            isOpen: true,
            title: error?.response?.data?.message,
            items: serviceHelper.adaptServiceExportErrors(
              error?.response?.data?.errors,
              this.$route.query.itinerary
            ),
          });
        },
      });
    },
    async getWebTemplates() {
      await this.$store.dispatch("itinerary/getWebTemplates");
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
    handleScroll() {
      scroll(0, 100);
    },
    updateColors({ key = "", value = "" }) {
      const newColors = this.templateColors.map((color) => {
        return {
          ...color,
          value: color.type === key ? value : color.value,
        };
      });
      const mainKey = "updateColors";
      this.$emit("update", { key: mainKey, value: newColors });
    },
    isTemplateSelectedAvailableToEdit() {
      const templatesAvaialableToEdit = this.templates
        .filter((template) => template.id === 1)
        .map((template) => template.id);
      return templatesAvaialableToEdit.includes(this.templateOption);
    },
  },
  mounted() {
    this.getWebTemplates();
    if (this.published_images_config.config) {
      this.templateOption = this.published_images_config.config.id_template
        ? this.published_images_config.config.id_template
        : 1;
      if (
        this.published_images_config.config.contents &&
        this.published_images_config.config.contents.length
      ) {
        const contents = this.published_images_config.config.contents;
        this.setConfigOptions(contents.map((content) => content.id_content));
      }
    }
  },
};
</script>

<style>
.is-centered {
  text-align: center;
}
.flex-center {
  display: flex;
  justify-content: space-around;
}
.word-card-images {
  justify-content: space-around;
}
.word-card-image {
  max-width: 200px;
  max-height: 250px;
}
.word-card-image-empty {
  width: 200px;
  background: white;
}
.template-card {
  border: 2px solid var(--gray-600);
  justify-content: space-between;
  margin: 2rem auto;
  width: fit-content;
  filter: grayscale(100%);
}
.template-card.active {
  border-color: var(--secondary-color);
  filter: none;
}
.card-header {
  padding: 0;
  border-radius: 15px !important;
  border-bottom: 0;
}
.publish.color-11 {
  transition: transform 0.3s, border 0.3s, background 0.3s, color 0.3s;
}
.publish.color-11:hover {
  color: var(--info-color) !important;
}
.checkbox-container {
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 15%),
    0 0 0 1px rgb(10 10 10 / 2%);
  width: max-content;
}
.carousel-arrow .icon {
  color: #fff;
  border: #fff;
}
.carousel-list.has-shadow {
  box-shadow: none;
}
.carousel-list {
  width: 100%;
  gap: 2rem;
  margin: 0 auto;
}
.carousel-slides {
  overflow-x: scroll;
}
.carousel-slides::-webkit-scrollbar {
  height: 0.8rem;
}
.carousel-slide {
  margin: 0 2rem;
  max-width: 15rem;
  min-width: 15rem;
}
.PhotoImage.sideBar img {
  height: 10rem;
}
.PhotoImage {
  justify-content: center;
  align-items: center;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
.card__content {
  padding: 1rem 0;
}
.carousel__container {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  padding-top: 3rem;
}
.carousel__container .active {
  border: 2px solid var(--secondary-color);
  border-radius: 0px 0px 20px 20px !important;
  position: relative;
}
.carousel__container .active::after {
  content: "Selected ✔";
  position: absolute;
  left: 0;
  top: -2rem;
  width: 100%;
  border: 1px solid #f00b81;
  outline: 2px solid #f00b81;
  text-align: center;
  color: #fff;
  background-color: #f00b81;
  border-radius: 0.8rem 0.8rem 0 0;
  padding: 0.25rem 0;
}
.external_export_tab {
  padding: 1rem;
}
.external_export_tab[is-disabled="true"] {
  opacity: 0.6;
  cursor: no-drop;
}
.external_export_tab[is-disabled="true"] .card-header-icon,
.external_export_tab[is-disabled="true"] button {
  opacity: 0.6 !important;
  cursor: no-drop !important;
}
.external_export_tab .icon_warning > svg,
.external_export_tab p > svg {
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
  color: #198754;
}
.external_export_tab .icon_warning {
  color: #ff9316;
}
.box__disabled {
  background: #eaeaef;
  border: 1px solid #666687;
  opacity: 0.99 !important;
  cursor: no-drop;
}
.tooltip__warning.b-tooltip.is-multiline.is-medium .tooltip-content {
  width: 18rem;
}
.tooltip__list {
  padding-left: 1rem;
}
.tooltip__list,
.tooltip__list li {
  list-style: disc;
  text-align: left;
}
.loading_circle__icon {
  border-radius: 50%;
  border: 2px dashed #ff9316;
  width: 1rem;
  height: 1rem;
}
.weblink_card__header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}
.card-header-title,
.card-header-icon {
  padding: 0;
}
.export_word__container {
  padding: 1rem;
}
.card-open .weblink__buttons {
  display: flex;
  margin-left: 1rem;
  gap: 1rem;
}
.card-open .weblink__buttons .field {
  margin-bottom: 0rem;
}
.card-header {
  box-shadow: 0 0 0.25em rgba(10, 10, 10, 0.1);
}
@media screen and (max-width: 480px) {
  .card-open.weblink_card__header {
    flex-wrap: wrap;
    row-gap: 1rem;
  }
  .weblink__buttons i.button {
    width: 1rem !important;
    height: 1.25rem !important;
    margin-right: 0.5rem;
  }
  .card-header {
    padding: 1rem;
  }
  .PhotoImage.sideBar {
    min-width: 12rem;
    height: 8rem;
  }
  .PhotoImage.sideBar img {
    width: 100%;
    height: 100%;
  }
  .card-open .weblink__buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-left: 0rem;
  }
  .card-content {
    width: 100%;
  }
  .export_config_contents__container {
    flex-direction: column;
    row-gap: 1rem;
    margin-top: 1rem;
  }
  .export_photos__container {
    display: flex;
    overflow-x: auto;
    margin: 0rem;
  }
}
</style>
