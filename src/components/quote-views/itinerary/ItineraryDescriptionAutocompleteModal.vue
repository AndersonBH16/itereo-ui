<template>
  <b-modal
    id="itinerary-description-autocomplete-modal"
    title="View Itinerary Description Autocomplete"
    size="xl"
    v-model="modalOpen"
    @close="closeModal"
  >
    <div v-if="description" class="day_text_generator_modal">
      <div class="day_text_generator_modal__body">
        <div style="width: 100%">
          <strong class="is-block mb-0" style="height: 1.5rem"
            >CURRENT DESCRIPTION</strong
          >
          <br />
          <span v-html="description.value" />
        </div>
        <hr />
        <div style="width: 100%">
          <strong class="is-block mb-0" style="height: 1.5rem">
            <IconChatGpt
              class="icon is-small mr-2"
              style="height: 1rem; width: 1rem"
            />
            GENERATED DESCRIPTION
            <b-button
              v-if="!isEditModeEnabled"
              class="button-saas p-0 pr-1 editButton"
              tag="a"
              @click="toggleIsEditModeEnabled"
            >
              <i
                class="button is-color4 is-info button-saas is-radius is-size is-small ml-2"
              >
                <IconPencil class="icon is-small" />
              </i>
            </b-button>
            <b-button
              v-else
              type="button-saas is-light"
              size="is-small"
              @click="toggleIsEditModeEnabled"
            >
              <IconClose class="icon is-small" />
            </b-button>
          </strong>
          <br />
          <div v-if="!isEditModeEnabled">
            <span v-html="generatedDescription.value" />
          </div>
          <div v-else style="min-height: 100%">
            <VueEditor
              :value="generatedDescription.value"
              @input="
                (value) =>
                  (generatedDescription.value =
                    helpers.preventHTMLEscaping(value))
              "
            />
          </div>
        </div>
      </div>
      <div class="day_text_generator_modal_save_button__container">
        <BaseButton
          :loading="saving"
          size="medium"
          action="tercery"
          @click="saveDescription"
        >
          <i slot="icon" class="mr-4 ml-1">
            <IconCheck class="icon is-small" />
          </i>
          <p slot="text">Save</p>
        </BaseButton>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { mapGetters } from "vuex";
import IconCheck from "@/components/icons/IconCheck.vue";
import BaseButton from "@/components/base-ui/BaseButton.vue";
import helpers from "@/helpers";
import IconChatGpt from "@/components/icons/IconChatGpt.vue";
import IconPencil from "@/components/icons/IconPencil.vue";
import IconClose from "@/components/icons/IconClose.vue";

export default {
  name: "ItineraryDescriptionAutocompleteModal",
  components: {
    IconClose,
    IconPencil,
    IconChatGpt,
    BaseButton,
    IconCheck,
    VueEditor,
  },
  props: {
    open: {
      type: Boolean,
      require: false,
    },
    closeModal: {
      type: Function,
      default: () => {},
    },
    description: {
      type: Object,
      default: () => {},
    },
    generatedDescription: {
      type: Object,
      default: () => {},
    },
    save: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
    }),
  },
  watch: {
    open(newValue) {
      this.modalOpen = newValue;
    },
  },
  data() {
    return {
      modalOpen: false,
      helpers: helpers,
      isEditModeEnabled: false,
      saving: false,
    };
  },
  methods: {
    saveDescription() {
      this.saving = true;
      this.save(this.generatedDescription);
      this.saving = false;
    },
    toggleIsEditModeEnabled() {
      this.isEditModeEnabled = !this.isEditModeEnabled;
    },
  },
};
</script>

<style>
.day_text_generator_modal {
  background-color: #fff;
  width: 100%;
  height: auto;
  border-radius: 1rem;
  padding: 2rem;
}
.day_text_generator_modal h1 {
  font-size: 1.25rem;
  font-weight: 600;
}
.day_text_generator_modal > hr {
  background-color: #aaa;
}
.day_text_generator_modal .ql-editor {
  min-height: 100% !important;
}
.day_text_generator_modal__body {
  display: flex;
  gap: 1rem;
}
.day_text_generator_modal__body > hr {
  height: 100%;
  width: 4px;
  background-color: #aaa;
}
.day_text_generator_modal_save_button__container button {
  margin-left: auto;
  margin-top: 1rem;
}
@media screen and (max-width: 480px) {
  .day_text_generator_modal__body {
    flex-direction: column;
    height: auto;
    padding-bottom: 2rem;
  }
  .day_text_generator_modal__body > hr {
    width: 100%;
    min-height: 2px !important;
    max-height: 2px !important;
    margin: 0.5rem 0;
  }
  .day_text_generator_modal_save_button__container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: #fff;
  }
  .day_text_generator_modal_save_button__container button {
    width: 100% !important;
  }
}
</style>
