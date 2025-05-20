<template>
  <b-modal
    id="itinerary-day-autocomplete-modal"
    title="View Itinerary Day Autocomplete"
    size="xl"
    v-model="modalOpen"
    @close="closeModal"
  >
    <div v-if="generatedDay" class="day_text_generator_modal">
      <h1>Day {{ generatedDay.start_day }}</h1>
      <hr />
      <div class="day_text_generator_modal__body">
        <div style="width: 100%">
          <strong class="is-block mb-0" style="height: 1.5rem"
            >CURRENT TEXTS</strong
          >
          <br />
          <div>
            <span
              v-html="day.title.value"
              class="is-block mb-4"
              style="font-size: 1rem; font-weight: 600"
            />
          </div>
          <span v-html="day.description.value" />
        </div>
        <hr />
        <div style="width: 100%">
          <strong class="is-block mb-0" style="height: 1.5rem">
            <IconChatGpt
              class="icon is-small mr-2"
              style="height: 1rem; width: 1rem"
            />
            GENERATED TEXTS
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
            <span
              v-html="generatedDay.title.value"
              class="is-block mb-4"
              style="font-size: 1rem; font-weight: 600"
            />
            <span v-html="generatedDay.description.value" />
          </div>
          <div v-else style="min-height: 100%">
            <div class="mb-2">
              <BaseInput
                v-model="generatedDay.title.value"
                placeholder="Add a title."
                size="large"
                class="w-100"
                :required="true"
              />
            </div>
            <VueEditor
              :value="generatedDay.description.value"
              @input="
                (value) =>
                  (generatedDay.description.value =
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
          @click="saveDay(generatedDay)"
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
import BaseInput from "@/components/base-ui/BaseInput.vue";
import IconCheck from "@/components/icons/IconCheck.vue";
import BaseButton from "@/components/base-ui/BaseButton.vue";
import helpers from "@/helpers";

export default {
  name: "ItineraryDayAutocompleteModal",
  components: {
    BaseButton,
    IconCheck,
    BaseInput,
    VueEditor,
  },
  props: {
    open: {
      type: Boolean,
      require: false,
    },
    saving: {
      type: Boolean,
      require: false,
    },
    closeModal: {
      type: Function,
      default: () => {},
    },
    day: {
      type: Object,
      default: () => {},
    },
    generatedDay: {
      type: Object,
      default: () => {},
    },
    saveDay: {
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
    };
  },
  methods: {
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
