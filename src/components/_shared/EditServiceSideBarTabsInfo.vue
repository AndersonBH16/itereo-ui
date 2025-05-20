<template>
  <b-tab-item label="INFO">
    <div class="EditServiceSideBarBox">
      <EditServiceSidebarNotes
        v-if="hasViewServiceNotesPermission"
        :editServiceSidebarFocusedElement="editServiceSidebarFocusedElement"
        :formItineraryService="formItineraryService"
        :emitUpdateForm="emitUpdateForm"
        :preventHTMLEscaping="preventHTMLEscaping"
      />
      <div class="columns edit_service_sidebar__check">
        <div class="column">
          <b-field
            label="Check-in"
            :disabled="hideElementByCondition || disableQuoteByStatus"
          >
            <b-clockpicker
              icon="clock"
              :hour-format="hourFormat"
              :locale="locale"
              :value="formItineraryService.check_in_without_format"
              @input="emitUpdateForm('check_in_without_format', $event)"
            >
            </b-clockpicker>
          </b-field>
        </div>
        <div class="column is-one-small px-0 mt-5">
          <IconChevronRight class="mt-2 icon is-small color-4" />
        </div>
        <div class="column">
          <b-field
            label="Check-out"
            :disabled="hideElementByCondition || disableQuoteByStatus"
          >
            <b-clockpicker
              icon="clock"
              :hour-format="hourFormat"
              :locale="locale"
              :value="formItineraryService.check_out_without_format"
              @input="emitUpdateForm('check_out_without_format', $event)"
            >
            </b-clockpicker>
          </b-field>
        </div>
      </div>
      <b-field
        label="Level"
        class="radioButtonSelector mt-2"
        width="100%"
        :disabled="hideElementByCondition || disableQuoteByStatus"
      >
        <b-radio-button
          v-model="formItineraryService.level"
          @input="emitUpdateForm('level', 0)"
          :native-value="0"
          type="is-primary is-light is-outlined is-focused"
        >
          All
        </b-radio-button>
        <b-radio-button
          v-model="formItineraryService.level"
          @input="emitUpdateForm('level', 1)"
          :native-value="1"
          type="is-primary is-light is-outlined is-focused"
        >
          Comfort
        </b-radio-button>
        <b-radio-button
          v-model="formItineraryService.level"
          @input="emitUpdateForm('level', 2)"
          :native-value="2"
          type="is-primary is-light is-outlined is-focused"
        >
          Superior
        </b-radio-button>
        <b-radio-button
          v-model="formItineraryService.level"
          @input="emitUpdateForm('level', 3)"
          :native-value="3"
          type="is-primary is-light is-outlined is-focused"
        >
          Luxury
        </b-radio-button>
      </b-field>
      <div
        class="my-5"
        :disabled="hideElementByCondition || disableQuoteByStatus"
      >
        <label class="label" style="display: inline-block">Description</label>
        <div
          v-if="isAvailableToShowSuggestedDescription"
          style="display: inline-block"
        >
          <b-button
            class="btn_show_suggested_description"
            @click="toggleShowSuggestedDescription"
          >
            {{ showSuggestedDescription ? "Hide" : "Show" }} suggested
            description
          </b-button>
          <b-button
            v-if="showSuggestedDescription"
            class="btn_replace_suggested_description"
            @click="takeSuggestedDescription"
          >
            Replace <IconReplace />
          </b-button>
        </div>
        <div class="btn_editing_description_container">
          <button
            v-if="editingServiceDescription"
            @click="
              resetDescription();
              toggleEditingServiceDescription();
            "
            class="btn_cancel_editing"
          >
            <IconClose />
          </button>
          <button
            v-if="editingServiceDescription"
            class="btn_confirm_editing"
            @click="
              () => {
                toggleEditingServiceDescription();
                emitUpdateForm('saveService', false);
              }
            "
          >
            <IconCheck />
          </button>
          <button
            v-if="
              !editingServiceDescription && hasViewEditDescriptionPermission
            "
            class="btn_open_editing"
            @click="toggleEditingServiceDescription"
          >
            <IconPencil />
          </button>
        </div>
        <br />
        <p
          v-if="showSuggestedDescription"
          v-html="service.description.value"
          class="suggested_description"
        ></p>
        <p
          v-if="!editingServiceDescription"
          v-html="formItineraryService.description.value"
        ></p>
        <vue-editor
          v-if="editingServiceDescription"
          placeholder="Add description here"
          :value="formItineraryService.description.value"
          @input="
            (value) => emitUpdateForm('description', preventHTMLEscaping(value))
          "
        />
      </div>
      <div
        class="mb-5 mt-2 uploadServicePhoto"
        :disabled="hideElementByCondition || disableQuoteByStatus"
      >
        <header style="display: flex; justify-content: space-between">
          <label class="label" style="display: inline-block">Photos</label>
          <AssetsContainer
            :locationPathProp="
              utils.getLocationsPath(service.location ? service.location : [])
            "
            :dayLocations="service.location"
            :formWithImages="[formItineraryService]"
            :category="categoryAsset.SERVICE"
            :validateFunctionExecution="validateFunctionExecution"
            type="service"
          />
        </header>
        <draggable
          v-if="
            formItineraryService &&
            formItineraryService.images_full &&
            formItineraryService.images_full.length > 0
          "
          :list="formItineraryService.images_full"
          :class="`columns mt-1 mb-2 DraggableBox`"
          v-bind="dragOptions"
          group="people"
        >
          <div
            class="column text-center"
            v-for="(image, index) in formItineraryService.images_full"
            :key="index"
          >
            <div class="PhotoImage sideBar">
              <expandable-image
                :src="image.thumbnail_1600X900"
                :alt="image.name"
                :title="image.name"
                :close-on-background-click="true"
              ></expandable-image>
              <b-button
                type="button-saas is-light border-radius-4 mr-2"
                size="is-small"
                @click="removeItineraryServiceImage(image.id)"
                style="position: absolute; top: 0.5rem; right: 0.5rem"
              >
                <IconTrash class="icon is-small" />
              </b-button>
            </div>
          </div>
        </draggable>
        <p v-else style="width: 100%; text-align: center" class="mt-5 mb-6">
          There are no photos added yet
        </p>

        <div v-if="suggestedImages && suggestedImages.length > 0">
          <label class="label mb-4" style="display: block"
            >Suggested Photos</label
          >
          <div style="display: flex; flex-wrap: wrap; gap: 1.2rem">
            <picture
              v-for="suggestedImage in suggestedImages"
              :key="suggestedImage.id"
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
              "
            >
              <expandable-image
                :src="suggestedImage.thumbnail_1600X900"
                :alt="suggestedImage.name"
                :title="suggestedImage.name"
                :close-on-background-click="true"
                class="service__suggested__image"
              ></expandable-image>
              <BaseButton
                action="principal"
                class="mt-1"
                style="position: absolute; top: -0.5rem; right: -0.5rem"
                @click="addItineraryServiceImage(suggestedImage)"
              >
                <i slot="icon" class="ml-1">
                  <IconPlus class="icon is-small" />
                </i>
                <p slot="text">Add</p>
              </BaseButton>
            </picture>
          </div>
        </div>
      </div>
      <div :disabled="hideElementByCondition || disableQuoteByStatus">
        <label class="label is-inline-block mt-2">Recommendations</label>
        <div class="btn_editing_description_container">
          <button
            v-if="editingServiceRecommendations"
            @click="
              resetServiceRecommendations();
              toggleEditingServiceRecommendations();
            "
            class="btn_cancel_editing"
          >
            <IconClose />
          </button>
          <button
            v-if="editingServiceRecommendations"
            class="btn_confirm_editing"
            @click="
              () => {
                toggleEditingServiceRecommendations();
                emitUpdateForm('saveService', false);
              }
            "
          >
            <IconCheck />
          </button>
          <button
            v-if="!editingServiceRecommendations"
            class="btn_open_editing"
            @click="toggleEditingServiceRecommendations"
          >
            <IconPencil />
          </button>
        </div>
        <p
          v-if="displayServiceRecommendations && !editingServiceRecommendations"
          v-html="formItineraryService.recommendations.value"
        ></p>
        <vue-editor
          v-if="editingServiceRecommendations"
          placeholder="Add recommendations here"
          :value="formItineraryService.recommendations.value"
          @input="
            (value) =>
              emitUpdateForm('recommendations', preventHTMLEscaping(value))
          "
        />
      </div>
    </div>
  </b-tab-item>
</template>

<script>
import EditServiceSidebarNotes from "@/components/quote-views/service-list/EditServiceSidebar/EditServiceSidebarNotes.vue";
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import { VueEditor } from "vue2-editor";
import AssetsContainer from "./AssetsContainer.vue";
import * as utils from "@/utils/itinerary";
import { CATEGORY_ASSET, USER_ROLE } from "@/constants";
import helpers from "@/helpers";

export default {
  name: "EditServiceSideBarTabsInfo",
  components: {
    AssetsContainer,
    VueEditor,
    draggable,
    EditServiceSidebarNotes,
  },
  props: {
    isEditServiceSidebarOpen: {
      type: Boolean,
      default: () => false,
    },
    editServiceSidebarFocusedElement: {
      type: String,
      default: "",
    },
    formItineraryService: {
      type: Object,
      default: () => {},
    },
    itineraryService: {
      type: Object,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      locale: undefined,
      utils: utils,
      categoryAsset: CATEGORY_ASSET,
      showSuggestedDescription: false,
      editingServiceDescription: false,
      editingServiceRecommendations: false,
    };
  },
  computed: {
    hourFormat() {
      return "24";
    },
    ...mapGetters({
      service: "services/getService",
      authData: "auth/getAuthData",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    isSeviceLoaded() {
      return this.formItineraryService?.id;
    },
    displayServiceRecommendations() {
      return this.formItineraryService?.recommendations?.value?.length > 0;
    },
    isAvailableToShowSuggestedDescription() {
      if (!this.service?.description || !this.formItineraryService?.description)
        return false;
      const differentDescriptions =
        this.formItineraryService.description.value?.trim() !==
        this.service.description.value.trim();
      return (
        this.service.description.value.trim().length > 0 &&
        differentDescriptions
      );
    },
    suggestedImages() {
      if (this.service?.images_full?.length === 0) return null;
      return this.service?.images_full?.filter(
        (image) =>
          !this.formItineraryService.images_full?.some(
            (img) => img.id === image.id
          )
      );
    },
    hasViewServiceNotesPermission() {
      return (
        !helpers.hasAnyRoles(
          this.authData.user,
          [USER_ROLE.TRAVEL_AGENT],
          false
        ) && this.isSeviceLoaded
      );
    },
    dragOptions() {
      return {
        animation: 200,
      };
    },
    hasViewEditDescriptionPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
  },
  methods: {
    preventHTMLEscaping(value) {
      return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    },
    addItineraryServiceImage(photo = null) {
      const currentItineraryServiceImages =
        this.formItineraryService.images_full || [];
      const newItineraryServiceImages = [
        ...currentItineraryServiceImages,
        photo,
      ];
      this.emitUpdateForm("images_full", newItineraryServiceImages);
    },
    removeItineraryServiceImage(photoId = null) {
      const filteredItineraryServiceImages =
        this.formItineraryService.images_full.filter(
          (photo) => photo.id !== photoId
        );
      this.emitUpdateForm("images_full", filteredItineraryServiceImages);
    },
    toggleEditingServiceDescription() {
      this.editingServiceDescription = !this.editingServiceDescription;
    },
    toggleEditingServiceRecommendations() {
      this.editingServiceRecommendations = !this.editingServiceRecommendations;
    },
    toggleShowSuggestedDescription() {
      this.showSuggestedDescription = !this.showSuggestedDescription;
    },
    takeSuggestedDescription() {
      this.formItineraryService.description.value =
        this.service.description.value;
      this.toggleShowSuggestedDescription();
    },
    resetDescription() {
      this.formItineraryService.description.value =
        this.itineraryService.description.value;
    },
    resetServiceRecommendations() {
      this.formItineraryService.recommendations.value =
        this.itineraryService.recommendations.value;
    },
    emitUpdateForm(key, value) {
      this.$emit("update", [key, value]);
    },
  },
};
</script>
<style>
.service__suggested__image:not(.expanded) > img {
  display: flex;
  width: 10rem;
  height: 6rem;
  object-fit: cover;
  border-radius: 0.5rem;
  overflow: hidden;
}
.expandable-image .expand-button {
  right: 100%;
  left: 1rem;
}
.notesField {
  margin-bottom: 1rem;
}
.notesField_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
}
.notesField textarea.base-textarea {
  line-height: 1.2rem !important;
}
.notesField_header > label {
  font-size: 1rem;
  font-weight: 600;
  color: #363636;
}
.notesField_header > span {
  cursor: pointer;
  color: #4a4a4a;
  font-size: 0.75rem;
  text-decoration: underline;
}
.btn_show_suggested_description {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a4a4a;
  text-decoration: underline;
  margin: -0.25rem 0 0 0.5rem;
  border: none;
  box-shadow: none;
}
.btn_replace_suggested_description {
  background-color: #1d3b83;
  color: #fff;
  text-decoration: none;
  font-size: 0.75rem;
  margin: -0.25rem 0 0 0.5rem;
}
.btn_replace_suggested_description:hover {
  color: #fff;
}
.btn_replace_suggested_description svg {
  width: 0.75rem;
  margin-left: 0.25rem;
}
.btn_replace_suggested_description path {
  fill: #fff;
}
.btn_replace_suggested_description:focus:not(:active),
.btn_show_suggested_description:focus:not(:active) {
  box-shadow: none;
}
.suggested_description {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.5;
  margin-bottom: 1rem;
}
.btn_editing_description_container {
  font-size: 0.2rem;
  margin-top: -0.25rem;
  float: right;
}
.btn_editing_description_container button {
  border: none;
  color: #fff;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  width: 2rem;
}
.btn_editing_description_container
  :is(.btn_open_editing, .btn_confirm_editing, .btn_cancel_editing) {
  font-size: 1rem;
}
.btn_editing_description_container
  :is(.btn_open_editing, .btn_confirm_editing, .btn_cancel_editing)
  svg {
  width: 0.9rem;
}
.btn_editing_description_container .btn_open_editing {
  background-color: #ff9316;
}
.btn_editing_description_container .btn_confirm_editing {
  background-color: #f00b81;
}
.btn_editing_description_container .btn_cancel_editing {
  background-color: white;
  color: #757575;
}
@media screen and (max-width: 480px) {
  .edit_service_sidebar__check {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
