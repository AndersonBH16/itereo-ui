<template>
  <div>
    <BaseButton
      @click="
        nextStep();
        toggleModal();
      "
      action="principal"
    >
      <i slot="icon" class="ml-1">
        <IconPlus class="icon is-small" />
      </i>
      <p slot="text">Select Photo</p>
    </BaseButton>

    <b-modal
      v-model="showModal"
      has-modal-card
      :data-test-id="constants.DATA_TEST_ID_VALUES.CLOSE_MODAL_BUTTON"
    >
      <form onsubmit="return false">
        <div class="modal-card w-100">
          <header class="modal-card-head">
            <AssetsUpload
              :location="location"
              :locationPath="locationPath"
              :category="category"
              :isLoading="isLoading"
              :toggleLoading="toggleLoading"
              :contractLocations="contractLocations"
              :dayLocations="dayLocations"
              :setImageProcessingId="setImageProcessingId"
              :validateFunctionExecution="validateFunctionExecution"
            />
          </header>

          <section class="modal-card-body">
            <AssetsList
              :isLoading="isLoading"
              :toggleLoading="toggleLoading"
              :assetsList="assetsList"
              :handleAssetOnClick="handleAssetOnClick"
              :loadData="loadData"
              :type="type"
              :category="category"
              :location="location"
              :locationPath="locationPath"
              :imageProcessingId="imageProcessingId"
            />
          </section>
          <GuideBox
            title="Editing your itinerary"
            description="To add this photo, click on 'Add assets'"
            :step="43"
            :positionX="680"
            :positionY="-150"
            :showNextButton="false"
          />
          <GuideBox
            title="Editing your Weblink"
            description="To add this photo to your Weblink, click on 'Add assets'"
            :step="55"
            :positionX="680"
            :positionY="-180"
            :showNextButton="false"
          />
          <footer class="modal-card-foot is-flex is-justify-content-flex-end">
            <BaseButton
              :disabled="isLoading"
              :loading="isLoading"
              @click="
                nextStep();
                handleSaveServicesAssets();
              "
              action="tercery"
              size="large"
              :class="focusedGuideBoxClass('', [43, 55], false)"
            >
              <p
                slot="text"
                :data-test-id="constants.DATA_TEST_ID_VALUES.SAVE_PHOTO_BUTTON"
              >
                Add assets
              </p>
            </BaseButton>
          </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AssetsList from "./AssetsList.vue";
import AssetsUpload from "./AssetsUpload.vue";
import { getLocationsPath } from "@/utils/itinerary";
import GuideBox from "./GuideBox.vue";
import { CATEGORY_ASSET, ASSET_TYPE } from "@/constants";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "AssetsContainer",
  components: {
    AssetsList,
    AssetsUpload,
    GuideBox,
  },
  props: {
    dayLocations: {
      type: [Array, Object],
      default: () => [],
    },
    formWithImages: {
      type: Array,
      default: () => [],
    },
    category: {
      type: Number,
      default: CATEGORY_ASSET.LOCATION,
    },
    type: {
      type: String,
      default: () => "",
    },
    locationPathProp: {
      type: String,
      default: () => "",
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    allowEmpty: {
      type: Boolean,
      default: false,
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: {
        CATEGORY_ASSET,
        ASSET_TYPE,
        DATA_TEST_ID_VALUES,
      },
      location: "",
      showModal: false,
      isLoading: false,
      assetsList: [],
      imageProcessingId: null,
    };
  },
  computed: {
    ...mapGetters({
      contractLocations: "client/getCountriesFromContract",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
    }),
    locationPath() {
      return this.locationPathProp;
    },
  },
  watch: {
    imageProcessingId() {
      setTimeout(() => {
        this.imageProcessingId = null;
      }, 5000);
    },
  },
  methods: {
    loadData(payload = {}) {
      this.loading = true;
      this.$store
        .dispatch("assets/list", payload)
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          throw error;
        });
    },
    toggleModal() {
      if (!this.locationPath && this.locationPath === "")
        this.getLocationPathFromContract();
      this.assetsList = this.formWithImages[0].images_full
        ? this.formWithImages[0].images_full
        : [];
      if (this.dayLocations && this.dayLocations.length) {
        let location = this.dayLocations.reduce((max, obj) =>
          max.id > obj.id ? max : obj
        );
        if (location) {
          this.location = location.location_code;
        }
      }
      if (!this.showModal) {
        this.loadData({
          path: this.locationPath,
          category: this.category,
        });
      }
      this.showModal = !this.showModal;
    },
    toggleLoading(value) {
      this.isLoading = value;
    },
    handleAssetOnClick(value, image) {
      const index = this.assetsList
        ? this.assetsList.findIndex((list) => {
            return list.id == image.id;
          })
        : -1;
      if (index >= 0) {
        this.assetsList = this.assetsList.filter((asset, index) => index > 0);
      } else {
        if (
          this.type == this.constants.ASSET_TYPE.DAY ||
          this.type == this.constants.ASSET_TYPE.EXPORT ||
          !this.multiple
        ) {
          this.assetsList = [image];
        } else {
          this.assetsList.push(image);
        }
      }
    },
    handleSaveServicesAssets() {
      if (!this.assetsList.length && !this.allowEmpty) {
        return this.$buefy.toast.open({
          duration: 5000,
          message: "Please, select at least one asset to add.",
          position: "is-top",
          type: "is-danger",
        });
      }

      this.assetsList.forEach((img) => {
        const found = this.formWithImages[0].images_full
          ? this.formWithImages[0].images_full.findIndex(function (img2) {
              if (img2.id == img.id) return true;
            })
          : -1;

        if (found === -1) {
          if (this.multiple) {
            this.formWithImages[0].images_full.push(img);
          } else {
            this.formWithImages[0].images_full = [img];
          }
        }
      });
      if (this.assetsList.length === 0) {
        this.formWithImages[0].images_full = [];
      }
      this.$emit("update", this.formWithImages);
      this.toggleModal();
      this.assetsList = [];
    },
    getLocationPathFromContract() {
      const locationsPath = getLocationsPath(this.contractLocations);
      this.locationPath = locationsPath;
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
        !this.isLoading &&
        resultExtraValidator
        ? `${classDefault} is-guide-step ${bgWhiteClass}`
        : classDefault;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
    setImageProcessingId(id) {
      this.imageProcessingId = id;
    },
  },
};
</script>
