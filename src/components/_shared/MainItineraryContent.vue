<template>
  <div class="is-flex is-justify-content-space-between">
    <div
      class="is-flex is-justify-content-space-between w-100 swap-tablet-mobile-only"
    >
      <div class="itineraryShareValues">
        <div class="is-h2 mb-2">
          <div class="is-flex">
            <h2 v-if="info.itinerary" class="itinerary_code">
              {{ info.itinerary ? info.itinerary.code : "" }}
            </h2>

            <h2 v-if="info.itinerary" class="itinerary_type">
              {{ itineraryTypeName }}
            </h2>

            <b-tag v-if="fromItineraryVersion" type="is-info">
              Version
              <strong style="color: #fff">{{
                fromItineraryVersion.data.version
              }}</strong>
              restored!
            </b-tag>

            <!-- <b-tooltip type="is-warning" position="is-bottom">
              <b-button class="p-0" style="height: auto;" @click="() => setItineraryHistoryModal(true)">
                <b-tag type="is-warning" class="px-3">
                  <b-icon icon="alert" custom-size="mdi-18px"/>
                  <strong style="top: -.1rem;" class="pb-4 ml-1 is-relative">Unstable version</strong>
                </b-tag>
              </b-button>

              <template v-slot:content>
                <p class="is-block" style="width: 12rem; white-space: wrap;">
                  The current version <strong>{{ info.itinerary.version }}</strong> is unstable. We recommend restoring to a stable version. Click the button to access Quote History.
                </p>
              </template>
            </b-tooltip> -->
          </div>
          <div class="is-flex">
            <strong
              v-if="!isEditingTitle && !loadingSkeleton"
              :class="`${
                historyView.isActive ? '' : 'color-secondary'
              } itineraryTitle`"
              @click="toggleEditTitle"
            >
              {{ info.itinerary ? info.itinerary.title.value : "" }}
            </strong>
            <b-skeleton
              height="30px"
              width="200px"
              :active="loadingSkeleton"
            ></b-skeleton>
            <div
              v-if="isEditingTitle && !loadingSkeleton"
              class="is-inline-flex"
            >
              <BaseInput
                placeholder="Add a title."
                type="text"
                :value="form.title || ''"
                @input.native="validateTitleInput"
                @keydown.native.enter="
                  stopPropagation($event);
                  saveTitle();
                "
                @keydown.native.esc="
                  stopPropagation($event);
                  closeEditTitle();
                "
                customSize="thin"
              />
              <div class="ml-3 is-flex is-justify-space-between">
                <BaseButton
                  class="mr-2"
                  @click="toggleEditTitle"
                  action="secondary"
                  size="medium"
                  :disabled="loadingSkeleton"
                >
                  <p slot="text">Cancel</p>
                </BaseButton>
                <BaseButton
                  @click="saveTitle"
                  action="tercery"
                  size="medium"
                  :disabled="loadingSkeleton"
                >
                  <p slot="text">Save</p>
                </BaseButton>
                >
              </div>
            </div>
            <MainItineraryActions
              v-if="info.itinerary"
              :loading="loading"
              :itinerary="itinerary"
              :switch-tag-modal="switchTagModal"
              :loadPricesItinerary="loadPricesItinerary"
            />
          </div>
        </div>
        <div
          v-if="!loadingSkeleton"
          class="is-flex is-justify-space-between is-align-items-center"
          style="flex-wrap: wrap; row-gap: 0.5rem"
        >
          <div class="is-flex is-align-items-center mr-4">
            <IconPax class="mtn-3 color-7 mr-1" />
            <span>{{ numPax ? numPax : "" }}</span>
          </div>
          <div class="is-flex is-align-items-center mr-4">
            <span
              :data-test-id="constants.DATA_TEST_ID_VALUES.ITINERARY_NUM_DAYS"
            >
              {{ numDays }}
            </span>
            <span class="ml-1">Day(s)</span>
          </div>
          <div
            v-if="itinerary.data"
            class="is-flex is-align-items-center mr-4"
            style="width: 100%; width: 8rem; height: 2rem"
          >
            <b-tooltip multilined class="tooltipSales">
              <template v-slot:content>
                <PhasesProgress
                  :reducedView="true"
                  :steps="helpers.getQuoteStatusPhases(quoteStatus)"
                />
              </template>
              <div class="is-flex is-align-items-center mr-4 w-auto">
                <span class="has-text-weight-semibold mr-1">Status:</span>
                <BaseSelect
                  size="auto"
                  :list="orderedItineraryStatus"
                  optionValue="id"
                  optionText="name"
                  :disabled="!displayItineraryStatusSelect"
                  :lock="!displayItineraryStatusSelect"
                  placeholder="Status"
                  :value="info.status"
                  @input="onChangeStatus"
                />
              </div>
            </b-tooltip>

            <BaseModal :isComponentModalActive="openModal">
              <IconWarning slot="icon" class="icon is-xsmall color-12" />
              <span slot="title"
                >Are you sure to
                <span class="has-text-weight-semibold">change</span> this
                status?
              </span>
              <span slot="paragraph">
                {{ changeStatusAlertMessage || "" }}
              </span>
              <div slot="buttons" class="is-flex">
                <BaseButton
                  @click="
                    () => {
                      openModal = false;
                      isItineraryPublishedModal = false;
                      info.status = quoteStatus;
                    }
                  "
                  action="secondary"
                  size="medium"
                  :disabled="loadingSkeleton"
                  class="mr-4"
                >
                  <p slot="text">No, take me back</p>
                </BaseButton>
                <BaseButton
                  @click="() => validateItineraryIsPublished(this.info.status)"
                  action="tercery"
                  size="medium"
                  :disabled="loadingSkeleton"
                >
                  <p slot="text">Yes, continue</p>
                </BaseButton>
              </div>
            </BaseModal>

            <BaseModal :isComponentModalActive="isItineraryPublishedModal">
              <IconWarning slot="icon" class="icon is-xsmall color-12" />
              <span slot="title">
                This itinerary has not been published yet. Then you will not be
                able to edit the export.
                <br />Are you sure to
                <span class="has-text-weight-semibold">change</span> this
                status?
              </span>
              <div slot="buttons" class="is-flex">
                <BaseButton
                  @click="
                    () => {
                      openModal = false;
                      isItineraryPublishedModal = false;
                      info.status = 1;
                      redirectToExportSection();
                    }
                  "
                  action="secondary"
                  size="medium"
                  :disabled="loadingSkeleton"
                  class="mr-4"
                >
                  <p slot="text">No, redirect to export</p>
                </BaseButton>
                <BaseButton
                  @click="() => handleChangeStatus(this.info.status)"
                  action="tercery"
                  size="medium"
                  :disabled="loadingSkeleton"
                >
                  <p slot="text">Yes, continue</p>
                </BaseButton>
              </div>
            </BaseModal>

            <ExternalExportModal
              :isModalOpen="showExternalExportModal"
              :loading="loadingSkeleton"
              :onExternalExportContinue="onExternalExportContinue"
              :closeModal="closeChangeStatusModal"
            />

            <CongratulationsModal
              :isModalOpen="showCongratulationsMessage"
              :closeModal="() => (showCongratulationsMessage = false)"
            />
          </div>
          <div class="ml-6 mr-4">
            <span class="has-text-weight-semibold">By:</span>
            {{ info.itinerary ? info.itinerary.user.email : "" }}
          </div>
        </div>
        <b-skeleton
          height="20px"
          width="400px"
          :active="loadingSkeleton"
        ></b-skeleton>
      </div>
      <!--Modal Level Buttons-->
      <div class="is-flex itineraryLevelValues">
        <MainItineraryContentModalLevel
          :itinerary="info.itinerary"
          :loadPricesItinerary="loadPricesItinerary"
          :loadItineraryPassengers="loadItineraryPassengers"
        />
        <!--Modal Level Buttons-->
        <!-- SideBar Country Info -->
      </div>
      <!-- Finish SideBar Country Info -->
    </div>
    <a href="#" v-if="showServiceSwitch">
      <div class="card cardItineraryContent cardShareEmail">
        <div class="card-content has-text-centered">
          <div class="content">
            <b-field class="switchhAllServices">
              <b-switch
                v-model="isSwitchedAllServicesText"
                true-value="Hide Services"
                false-value="Display Services"
                class="is-big color-2 mr-0"
              >
                <p class="mt-2 color-7">{{ isSwitchedAllServicesText }}</p>
              </b-switch>
            </b-field>
          </div>
        </div>
      </div>
    </a>
    <EntityTagModal
      v-if="itinerary.data"
      :is-modal-open="isTagModalOpen"
      :type="tagType"
      :save-tags="saveTags"
      :entity-tags="itinerary.data.tags"
      :close-modal="switchTagModal"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import clonedeep from "lodash.clonedeep";
import { PATH_INFO } from "@/router/path";
import {
  calculateDays,
  deleteObjectProperties,
  openToast,
} from "@/utils/utils";
import MainItineraryActions from "@/components/_shared/MainItineraryActions.vue";
import MainItineraryContentModalLevel from "@/components/_shared/MainItineraryContentModalLevel.vue";
import {
  ITINERARY_STATUS_TO_PUBLISH_QUOTE,
  ITINERARY_STATUS,
  ITINERARY_STATUS_BY_ID,
  REQUEST_STAGES,
  QUOTES_STATUS,
} from "@/constants/itinerary";
import helpers from "@/helpers";
import { helper } from "@/utils/itinerary";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import PhasesProgress from "./PhasesProgress.vue";
import ExternalExportModal from "@/components/quote-views/_shared/ExternalExportModal.vue";
import CongratulationsModal from "@/components/quote-views/_shared/CongratulationsModal.vue";
import EntityTagModal from "@/components/_shared/EntityTagModal.vue";
import { TAG_TYPES, USER_ROLE } from "@/constants";
import { getLocalStorageData } from "@/utils/localStorage";
import { ITINERARY_TYPES } from "@/constants/itinerary";
import { serviceHelper } from "@//utils/service";

export default {
  name: "MainItineraryContent",
  components: {
    EntityTagModal,
    MainItineraryActions,
    MainItineraryContentModalLevel,
    PhasesProgress,
    ExternalExportModal,
    CongratulationsModal,
  },
  data() {
    return {
      isSwitchedAllServicesText: "Display Services",
      isEditingTitle: false,
      form: {
        title: "",
      },
      openModal: null,
      showExternalExportModal: false,
      showCongratulationsMessage: false,
      changeStatusAlertMessage: "",
      isItineraryPublishedModal: false,
      loadingSkeleton: false,
      constants: {
        ITINERARY_STATUS,
        DATA_TEST_ID_VALUES,
      },
      helpers: {
        calculateDays,
        ...helper,
      },
      isTagModalOpen: false,
      tagType: TAG_TYPES.ITY,
    };
  },
  props: {
    showServiceSwitch: {
      type: Boolean,
      default: false,
    },
    loadPrices: {
      type: Boolean,
      default: false,
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      authData: "auth/getAuthData",
      clients: "client/getClients",
      itinerary: "itinerary/getItinerary",
      quoteStatus: "itinerary/getItineraryStatus",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      published_images_config: "itinerary/getPublishedConfigAndImages",
      loading: "utils/getLoading",
      numPax: "itinerary/getNumPax",
      status_itinerary: "status_itinerary/getStatusesItinerary",
      historyView: "utils/getHistoryView",
      request: "request/getRequest",
      clientContracts: "client/getClientContracts",
    }),
    info() {
      return {
        itinerary: this.itinerary.data,
        status: this.itinerary.data?.status?.id || 1,
      };
    },
    numDays() {
      return (
        calculateDays(
          this.itinerary.data?.start_date,
          this.itinerary.data?.end_date
        ) || 0
      );
    },
    itineraryTypeName() {
      const itineraryTypes = helper.getItineraryTypesMapped();
      return itineraryTypes.find(
        (itineraryType) =>
          itineraryType.id === this.itinerary.data.itinerary_type_id
      )?.name;
    },
    displayItineraryStatusSelect() {
      const isQuote =
        ITINERARY_TYPES.NO_TEMPLATE.id ===
        this.itinerary.data.itinerary_type_id;
      return (
        (!this.disableQuoteByStatus ||
          this.info.status === ITINERARY_STATUS.SENT.value) &&
        !this.hideElementByCondition &&
        isQuote
      );
    },
    orderedItineraryStatus() {
      return [
        this.status_itinerary.find(
          (status) => status.id === ITINERARY_STATUS.QUOTE.value
        ),
        this.status_itinerary.find(
          (status) => status.id === ITINERARY_STATUS.SENT.value
        ),
        this.status_itinerary.find(
          (status) => status.id === ITINERARY_STATUS.CONFIRM.value
        ),
        this.status_itinerary.find(
          (status) => status.id === ITINERARY_STATUS.CANCEL.value
        ),
      ];
    },
    displayExternalExport() {
      return helpers.hasAnyRoles(this.authData.user, [USER_ROLE.ADMIN], true);
    },
    fromItineraryVersion() {
      return getLocalStorageData(
        `from_itinerary_version_${this.$route.query.itinerary}`
      );
    },
  },
  methods: {
    setItineraryHistoryModal(newValue = false) {
      this.$store.dispatch("utils/setHistoryView", {
        historyView: {
          isModalOpen: newValue,
        },
      });
      if (newValue) this.getItineraryHistory();
    },
    async getItineraryHistory(payload = null) {
      this.setLoading(true);
      await this.$store.dispatch("itinerary/getItineraryHistory", payload);
      this.setLoading(false);
    },
    closeChangeStatusModal() {
      this.openModal = false;
      this.showExternalExportModal = false;
      this.isItineraryPublishedModal = false;
      this.info.status = this.quoteStatus;
    },
    validateTitleInput(event) {
      this.form.title = event.target.value.replace("|", "");
      event.target.value = this.form.title;
    },
    switchTagModal() {
      this.isTagModalOpen = !this.isTagModalOpen;
    },
    onChangeStatus(newStatus) {
      if (newStatus === this.info.status) return;
      this.changeStatusAlertMessage =
        ITINERARY_STATUS_BY_ID?.[newStatus]?.alertText;
      if (newStatus === ITINERARY_STATUS.CONFIRM.value) {
        const isItineraryPublished = this.published_images_config.config?.id;
        if (
          !isItineraryPublished &&
          ITINERARY_STATUS_TO_PUBLISH_QUOTE.includes(newStatus)
        ) {
          this.openModal = false;
          this.isItineraryPublishedModal = true;
        } else {
          this.showExternalExportModal = true;
        }
      } else {
        this.openModal = true;
      }
      this.info.status = newStatus;
    },
    redirectToExportSection() {
      this.$router.push({
        path: PATH_INFO.EXPORT.path,
        query: { itinerary: this.$route.query.itinerary },
      });
    },
    stopPropagation(event = null) {
      event?.stopPropagation();
    },
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) {
        this.setLoadingText("Loading content, please wait...");
      }
    },
    setLoadingText(value) {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    closeEditTitle() {
      this.form.title = "";
      this.isEditingTitle = false;
    },
    async loadPricesItinerary({ reload = false }) {
      if (this.$route.query.itinerary) {
        await this.$store
          .dispatch("itinerary/list_prices", {
            uuid: this.$route.query.itinerary,
            reload,
          })
          .catch((error) => {
            throw error;
          });
      }
    },
    async loadItineraryPassengers(reload = false) {
      if (this.$route.query.itinerary) {
        await this.$store
          .dispatch("itinerary/list_passengers", {
            uuid: this.$route.query.itinerary,
            reload,
          })
          .catch((error) => {
            throw error;
          });
      }
    },
    async loadStatusesItinerary() {
      this.loadingSkeleton = true;
      const payload = {
        page: 1,
      };
      await this.$store
        .dispatch("status_itinerary/getStatusesItinerary", payload)
        .catch((error) => {
          throw error;
        });
      this.loadingSkeleton = false;
    },
    toggleEditTitle() {
      if (this.disableQuoteByStatus) return;
      if (this.hideElementByCondition) return;

      this.isEditingTitle = !this.isEditingTitle;
      this.loadDay();
    },
    loadDay() {
      this.form.title = this.info.itinerary.title.value;
    },
    async saveTags(payload) {
      try {
        await this.saveData({
          tags: payload.tagIds || [],
          cur_step: payload.cur_step || 1,
          last_step: payload.last_step || 1,
        });
        openToast(this.$buefy, "Tags saved successfully!", "is-success");
      } catch (error) {
        throw error;
      }
    },
    async saveTitle() {
      this.loadingSkeleton = true;
      this.setLoading(true);

      try {
        await this.saveData({
          title: {
            ...this.itinerary.data.title,
            value: this.form.title,
          },
        });
      } catch (error) {
        throw error;
      }

      this.setLoading(false);
      this.toggleEditTitle();

      this.loadingSkeleton = false;
    },
    async saveData(updateData = {}) {
      let itinerary = {
        ...clonedeep(this.itinerary.data),
        ...updateData,
      };

      itinerary.client_id = itinerary.client.id;
      itinerary.currency_id = itinerary.currency.id;
      itinerary.language_id = itinerary.language.id;
      itinerary.status = itinerary.status.id;
      itinerary.num_day = this.numDays;

      deleteObjectProperties(itinerary, ["client", "currency", "language"]);

      await this.$store.dispatch("itinerary/update", itinerary);
    },
    async validateItineraryIsPublished(newStatus, forceSaving = false) {
      const isItineraryPublished = this.published_images_config.config?.id;
      if (
        !forceSaving &&
        !isItineraryPublished &&
        ITINERARY_STATUS_TO_PUBLISH_QUOTE.includes(newStatus)
      ) {
        this.openModal = false;
        this.isItineraryPublishedModal = true;
      } else {
        this.loadingSkeleton = true;
        this.setLoading(true);
        if (forceSaving) await this.changeStatus(newStatus);
        else await this.handleChangeStatus(newStatus);
        const payload = {
          id: this.$route.query.itinerary,
          reload: true,
          from: this.itinerary.data.start_date,
          to: this.itinerary.data.end_date,
        };
        await this.loadServicesItinerary(payload);
        this.loadingSkeleton = false;
        this.setLoading(false);
      }
    },
    async onExternalExportContinue(externalSource = "") {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          this.closeChangeStatusModal();

          this.$store.dispatch("itinerary/setIsRecentlyExported", true);

          await this.validateItineraryIsPublished(
            ITINERARY_STATUS.CONFIRM.value,
            true
          );

          await this.$store.dispatch("itinerary/exportToExternal", {
            itineraryId: this.itinerary.data.id,
            externalSource,
          });
          this.$store.dispatch("itinerary/setIsRecentlyExported", false);

          this.showCongratulationsMessage = true;
        },
        functionToExecuteOnFail: async (error) => {
          this.setLoading(false);
          this.loadingSkeleton = false;

          this.$store.dispatch("itinerary/setQuoteExportFailedAlert", {
            isOpen: true,
            title: error?.response?.data?.message,
            items: serviceHelper.adaptServiceExportErrors(
              error?.response?.data?.errors,
              this.$route.query.itinerary
            ),
          });

          throw error;
        },
      });
    },
    async handleChangeStatus(newStatus) {
      if (newStatus === ITINERARY_STATUS.CONFIRM.value) {
        this.openModal = false;
        this.isItineraryPublishedModal = false;
        this.showExternalExportModal = true;
        return;
      }
      this.changeStatus(newStatus);
    },
    async changeStatus(newStatus) {
      this.setLoading(true);
      this.openModal = false;
      this.isItineraryPublishedModal = false;

      const payload = {
        id: this.$route.query.itinerary,
        status: newStatus,
      };

      await this.updateQuoteStatus(payload);

      if (this.request?.id) {
        await this.$store.dispatch("request/getRequestById", {
          id: this.request.id,
        });
      }

      this.setLoading(false);
    },
    async updateQuoteStatus(payload) {
      await this.$store
        .dispatch("itinerary/change_status", payload)
        .then((response) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: response.message,
            position: "is-top",
            type: "is-success",
          });
        })
        .catch((error) => {
          this.$buefy.toast.open({
            duration: 5000,
            message:
              "Error trying to change status of itinerary, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        });
    },
    async updateRestRequestQuotesStatus(updatedRestQuotesStatus) {
      if ([null, undefined].includes(updatedRestQuotesStatus)) return;

      const restRequestQuotes = this.request.items.filter(
        (item) => item.id !== this.itinerary.data.id
      );

      if (!restRequestQuotes?.length) return;

      const changeStatusPayloads = restRequestQuotes.map((restRequestQuote) => {
        return {
          id: restRequestQuote.id,
          status: updatedRestQuotesStatus.id,
        };
      });

      await Promise.allSettled(
        changeStatusPayloads.map(
          async (payload) =>
            await this.$store.dispatch("itinerary/changeQuoteStatus", payload)
        )
      );
    },
    async updateRequestStage(quoteStatus) {
      if (!this.request.id) return;

      const response = this.getUpdatedRequesStageAndQuoteStatus(quoteStatus);

      const updatedRequestStage = response.stage;

      const updatedRestQuotesStatus = response.restQuotesStatus;

      this.updateRestRequestQuotesStatus(updatedRestQuotesStatus);

      const isDifferentStage = updatedRequestStage.id !== this.request.stage.id;

      if (!isDifferentStage) {
        return this.$store.dispatch("request/updateRequestItemById", {
          ...this.itinerary.data,
          status: Object.values(QUOTES_STATUS).find(
            (status) => status.id === quoteStatus
          ),
        });
      }

      this.setLoading(true);

      const adaptedRequest = {
        ...this.request,
        client_id: this.request.client.id,
        contract_id: this.clientContracts?.find(
          (clientContract) => clientContract.id === this.request.contract.id
        )?.contract_id,
        stage_id: updatedRequestStage.id,
      };

      await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          return await this.$store.dispatch("request/saveRequest", {
            request: adaptedRequest,
          });
        },
        functionToExecuteOnFail: async (error) => {
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message: "Error trying to update Request stage, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });

      this.setLoading(false);
    },
    getUpdatedRequesStageAndQuoteStatus(quoteStatus) {
      const isNegotationStage =
        this.request.stage.id === REQUEST_STAGES.NEGOTIATION.id;

      if (quoteStatus === QUOTES_STATUS.SENT.id && !isNegotationStage)
        return { stage: REQUEST_STAGES.SENT, restQuotesStatus: null };

      if (quoteStatus === QUOTES_STATUS.CONFIRMED.id)
        return {
          stage: REQUEST_STAGES.WON,
          restQuotesStatus: QUOTES_STATUS.REJECTED,
        };

      const restRequestQuotesStatuses = this.request.items
        .filter((item) => item.id !== this.itinerary.data.id)
        .map((item) => item.status.id);

      const everyQuoteIsRejected = [
        ...restRequestQuotesStatuses,
        quoteStatus,
      ].every((status) => status === QUOTES_STATUS.REJECTED.id);

      if (everyQuoteIsRejected)
        return { stage: REQUEST_STAGES.LOST, restQuotesStatus: null };

      const everyQuoteIsInpreparation = [
        ...restRequestQuotesStatuses,
        quoteStatus,
      ].every((status) => status === QUOTES_STATUS.IN_PREPARATION.id);

      if (everyQuoteIsInpreparation)
        return { stage: REQUEST_STAGES.IN_PREPARATION, restQuotesStatus: null };

      const someQuoteIsInpreparation = [...restRequestQuotesStatuses].some(
        (status) => status === QUOTES_STATUS.IN_PREPARATION.id
      );

      if (
        someQuoteIsInpreparation &&
        quoteStatus === QUOTES_STATUS.REJECTED.id
      ) {
        return {
          stage: REQUEST_STAGES.NEGOTIATION,
          restQuotesStatus: null,
        };
      }

      return {
        stage: this.request.stage,
        restQuotesStatus: null,
      };
    },
  },
  created() {
    this.loadStatusesItinerary();
  },
};
</script>

<style lang="scss" scope>
.itineraryTitle {
  cursor: pointer;
  overflow-wrap: anywhere;
}
.itinerary_code,
.itinerary_type {
  background-color: whitesmoke;
  width: fit-content;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  color: #444;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: inline-flex;
  margin-right: 0.5rem;
}
.itineraryLevelValues {
  align-items: center;
  margin-left: 2rem;
}
.itineraryShareValues .b-tooltip.is-primary .tooltip-content {
  background-color: #fff;
}
.itineraryShareValues .b-tooltip.is-top.is-primary .tooltip-content::before {
  border-top-color: #fff;
}
.b-tooltip.is-multiline.is-medium .tooltip-content {
  width: auto;
}
@media screen and (max-width: 480px) {
  .itineraryShareValues {
    margin: 1rem 0;
  }
  .itineraryLevelValues {
    align-items: center;
    margin-left: 0rem;
    margin-top: 1rem;
    margin-bottom: 0rem;
    order: 2;
    width: 100%;
  }
  .cardItineraryContent {
    max-height: fit-content;
    max-width: fit-content;
    min-height: fit-content;
    min-width: fit-content;
    padding: 0.5rem;
    max-width: 5rem;
  }
}
</style>
