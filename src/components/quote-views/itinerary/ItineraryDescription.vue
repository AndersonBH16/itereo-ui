<template>
  <section class="mb-5 itinerary_description__container">
    <div
      v-if="!hideElementByCondition"
      class="mb-5 w-100 is-flex updateItineraryButton"
    >
      <b-tooltip
        position="is-top"
        type="is-light"
        label="Add days of other templates to the itinerary"
        class="modules__container"
        multilined
      >
        <a href="#modulesPlaceholder">
          <BaseButton
            @click="toggleIsAddingModules"
            action="green"
            class="mr-2"
            :disabled="disableQuoteByStatus"
          >
            <p slot="text">+ Modules</p>
          </BaseButton>
        </a>
      </b-tooltip>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="media mb-3">
          <div class="media-content">
            <p class="title is-4">Itinerary description</p>
          </div>
          <div v-if="!hideElementByCondition" class="media-right">
            <b-button
              v-if="autocomplete"
              :disabled="disableQuoteByStatus"
              :loading="generating"
              style="height: 2rem"
              class="itinerary_day_autocomplete__button mr-2"
              @click="handleAutocompleteDescription"
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
            <a
              :disabled="disableQuoteByStatus"
              v-if="!isEditing"
              class="ml-0 button button-saas pr-0"
              @click="toggleEditDescription"
              ><i
                :disabled="disableQuoteByStatus"
                class="button is-color4 is-danger button-saas is-radius is-size is-small ml-2"
                ><IconPencil class="icon is-small" /></i
            ></a>
          </div>
        </div>

        <div v-if="info && info.itinerary">
          <vue-editor v-if="isEditing" v-model="form.description" />
          <!-- <BaseTextarea
            v-if="isEditing"
            v-model="form.description"
            placeholder="Add a description."
            size="large"
            class="w-100"
          ></BaseTextarea> -->
          <div
            v-else-if="info.itinerary.description.value"
            class="content"
            v-html="info.itinerary.description.value"
          ></div>
          <div v-else class="content">Empty description.</div>
        </div>

        <footer class="card-footer pr-0">
          <div
            class="card-footer-item is-justify-content-flex-end pb-0"
            v-if="isEditing"
          >
            <BaseButton
              class="mb-0 mr-2"
              @click="cancelEdit"
              action="secondary"
              :disabled="isSaving"
              size="large"
            >
              <p slot="text">Cancel</p>
            </BaseButton>
            <BaseButton
              size="medium"
              @click="saveEdit"
              action="tercery"
              :loading="isSaving"
            >
              <i slot="icon" class="mr-4 ml-1">
                <IconCheck class="icon is-small" />
              </i>
              <p slot="text">Save</p>
            </BaseButton>
          </div>
        </footer>
      </div>
    </div>
    <ItineraryDescriptionAutocompleteModal
      :open="isAutocompleteModalOpen"
      :close-modal="() => (isAutocompleteModalOpen = false)"
      :description="selectedDescription"
      :generated-description="generatedDescription"
      :save="saveDescription"
    />
  </section>
</template>

<script>
import { PATH_INFO } from "@/router/path";
import { VueEditor } from "vue2-editor";
import { mapGetters } from "vuex";
import helpers from "@/helpers";
import IconChatGpt from "@/components/icons/IconChatGpt.vue";
import ItineraryDescriptionAutocompleteModal from "@/components/quote-views/itinerary/ItineraryDescriptionAutocompleteModal.vue";

export default {
  name: "ItineraryDescription",
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isEditing: false,
      form: {
        description: "",
      },
      isAutocompleteModalOpen: false,
      selectedDescription: null,
      generatedDescription: null,
      generating: false,
    };
  },
  components: {
    ItineraryDescriptionAutocompleteModal,
    IconChatGpt,
    VueEditor,
  },
  computed: {
    ...mapGetters({
      getItinerary: "itinerary/getItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      itineraryStatus: "itinerary/getItineraryStatus",
      itineraryDays: "itineraryDays/getItineraryDays",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    info() {
      return {
        itinerary: this.getItinerary.data,
      };
    },
  },
  props: {
    setLoading: {
      type: Function,
      default: () => {},
    },
    toggleIsAddingModules: {
      type: Function,
      default: () => {},
    },
    loadItinerary: {
      type: Function,
      default: () => {},
    },
    autocomplete: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async handleAutocompleteDescription() {
      this.generating = true;
      const result = await this.$store.dispatch(
        "itinerary/generate_description",
        {
          id: this.info.itinerary.id,
        }
      );
      this.selectedDescription = this.info.itinerary.description;
      this.generatedDescription = result.description;
      this.isAutocompleteModalOpen = true;
      this.generating = false;
    },
    toggleEditDescription() {
      this.isEditing = !this.isEditing;
      this.loadDay();
    },
    loadDay() {
      this.form.description = this.info.itinerary.description.value;
    },
    cancelEdit() {
      // this.loadDay();
      this.toggleEditDescription();
    },
    async saveDescription() {
      this.form.description = this.generatedDescription.value;
      await this.saveEdit();
      this.isAutocompleteModalOpen = false;
    },
    async saveEdit() {
      if (this.isSaving) {
        return false;
      }
      const itinerary = this.info.itinerary;

      this.isLoading = true;
      this.isSaving = true;
      const TOTAL_STEPS_TO_PERFORM = 1;

      helpers.applyTranslation(
        itinerary.language.language_code,
        itinerary.description,
        this.form.description
      );

      await this.$store
        .dispatch("itinerary/update_description", {
          uuid: itinerary.id,
          description: itinerary.description,
          cur_step: TOTAL_STEPS_TO_PERFORM,
          last_step: TOTAL_STEPS_TO_PERFORM,
        })
        .then(() => {
          this.isLoading = false;
          this.isSaving = false;
          this.isEditing = false;
          this.loadItinerary();
        })
        .catch((error) => {
          this.isLoading = false;
          this.isSaving = false;
          throw error;
        });
    },
    async updateItineraryDays() {
      try {
        this.setLoading(true);
        if (this.$route.query.itinerary) {
          const TOTAL_STEPS_TO_PERFORM = 1;
          const response = await this.$store.dispatch(
            "itineraryDays/updateItineraryDays",
            {
              data: {
                itinerary_uuid: this.$route.query.itinerary,
                autocomplete: true,
              },
              cur_step: TOTAL_STEPS_TO_PERFORM,
              last_step: TOTAL_STEPS_TO_PERFORM,
            }
          );
          if (response) {
            this.setLoading();
            this.$buefy.toast.open({
              duration: 5000,
              message: "Itinerary was updated sucessfully!",
              position: "is-top",
              type: "is-success",
            });
            return;
          }
          throw new Error();
        } else {
          this.$route.push(PATH_INFO.HOME.path);
        }
      } catch (err) {
        this.setLoading();
        this.$buefy.toast.open({
          duration: 5000,
          message: "Something went wrong, please try again.",
          position: "is-top",
          type: "is-danger",
        });
        throw err;
      }
    },
  },
};
</script>
<style scoped>
.updateItineraryButton {
  justify-content: flex-end;
}
.itinerary_description__container .card {
  background-color: var(--quote-bg-color);
}
@media screen and (max-width: 480px) {
  .modules__container {
    display: none;
  }
  .updateItineraryButton {
    margin-bottom: 0rem !important;
  }
}
</style>
