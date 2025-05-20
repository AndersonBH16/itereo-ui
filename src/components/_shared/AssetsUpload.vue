<template>
  <div>
    <b-button
      v-if="hasViewUploadPhotoPermission"
      class="mx-1"
      type="is-dark"
      size="is-small"
      @click="openUploadAssetsModal"
      >Upload<i class="mr-2 ml-4"> <IconUpload class="icon is-small" /> </i
    ></b-button>
    <b-modal v-model="isCardModalActive" has-modal-card>
      <div class="modal-card" style="width: 52rem; overflow: visible">
        <header class="modal-card-head">
          <p class="modal-card-title">Upload Photo</p>
          <button type="button" class="delete" @click="toggleModal" />
        </header>

        <section class="modal-card-body" style="overflow: visible">
          <b-upload
            v-if="form.data"
            @input="handleFileUpload($event)"
            accept="image/*"
            :disabled="isLoading"
            expanded
            class="mb-4"
          >
            <a class="button is-primary is-fullwidth">
              <b-icon icon="upload"></b-icon>
              <span>{{ "Click to upload another image" }}</span>
            </a>
          </b-upload>
          <div class="row w-100 assets_upload_content__container">
            <div class="col-6">
              <b-field
                v-if="!form.data"
                label-position="outside"
                class="mb-2"
                style="display: flex; justify-content: space-between"
              >
                <div class="control mb-2 w-100">
                  <b-upload
                    @input="handleFileUpload($event)"
                    accept="image/*"
                    drag-drop
                    :disabled="isLoading"
                    expanded
                  >
                    <section class="section">
                      <div class="content has-text-centered">
                        <p>
                          <b-icon icon="upload" size="is-large"></b-icon>
                        </p>
                        <p>Drop your image here or click to upload</p>
                      </div>
                    </section>
                  </b-upload>
                </div>
              </b-field>
              <div class="image-preview">
                <template v-if="form.data">
                  <picture>
                    <expandable-image
                      :src="form.data"
                      :alt="form.assets_name"
                      :title="form.assets_name"
                      :close-on-background-click="true"
                      class="gallery_img"
                    ></expandable-image>
                  </picture>
                </template>
              </div>
            </div>
            <div class="col-6">
              <div v-if="image">
                <div class="columns w-100 mb-0">
                  <p class="column">
                    <span class="has-text-weight-semibold">File name:</span>
                    {{ image.name }}
                  </p>
                  <p class="column">
                    <span class="has-text-weight-semibold">Size:</span>
                    {{ (image.size / 1024).toFixed(2) }}KB
                  </p>
                </div>
                <p
                  class="is-block resolution_info w-100"
                  :is-warning="imageResolutionWarning !== null"
                >
                  <IconWarning
                    v-if="imageResolutionWarning !== null"
                    class="icon is-small"
                  />
                  <IconCheck v-else class="icon is-small" />
                  <span class="has-text-weight-semibold">Resolution:</span>
                  {{ form.width }} x {{ form.height }} px
                </p>
              </div>
              <div
                v-if="imageResolutionWarning !== null"
                class="image_warning mb-2"
              >
                <IconWarning class="icon is-small" />
                <p>{{ imageResolutionWarning.message }}</p>
              </div>

              <BaseInput
                type="text"
                placeholder="demo"
                v-model="form.assets_name"
                :disabled="isLoading"
                size="xlarge"
                class="my-3"
                label="Name (*)"
                @input="handlValidateName"
              />
              <span class="validator__text">{{ validatorText }}</span>
              <p class="validator__text--right">{{ validatorExample }}</p>

              <BaseSelect
                size="large"
                :list="contractLocations"
                optionValue="location_code"
                optionText="location_name"
                placeholder="Select a country"
                v-model="form.assets_country"
                :disabled="isLoading"
                v-if="isShownByCategory()"
                @input="setDestinationsFromCountry($event)"
                class="mb-3"
                label="Country (*)"
              />

              <BaseSelect
                size="large"
                :list="destinations"
                optionValue="location_code"
                optionText="location_name"
                placeholder="Select a City or Landmark"
                label="City or Landmarks"
                v-model="form.assets_city"
                :disabled="isLoading"
                v-if="isShownByCategory()"
                class="mb-3"
              />
            </div>
          </div>
        </section>

        <footer class="modal-card-foot is-flex is-justify-content-flex-end">
          <BaseButton
            :disabled="isLoading || isDisabledByCategoryCondition()"
            :loading="isLoading"
            @click="onSubmit"
            action="tercery"
            size="large"
          >
            <p slot="text">Save</p>
          </BaseButton>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import imageCompression from "browser-image-compression";
import { CATEGORY_ASSET, USER_ROLE } from "@/constants";
import helpers from "@/helpers";

export default {
  name: "AssetsUpload",
  props: {
    location: {
      type: String,
    },
    locationPath: {
      type: String,
      default: "",
    },
    category: {
      type: Number,
      default: CATEGORY_ASSET.LOCATION,
    },
    toggleLoading: {
      type: Function,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    contractLocations: {
      type: Array,
      default: () => [],
    },
    dayLocations: {
      type: Array,
      default: () => [],
    },
    setImageProcessingId: {
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
      isCardModalActive: false,
      preview: null,
      image: null,
      form: {
        category: this.category,
        assets_name: "",
        assets_country: "",
        assets_city: "",
        data: "",
      },
      selected: null,
      destinations: [],
      validatorText: "",
      validatorExample: "",
    };
  },
  computed: {
    ...mapGetters({
      list: "assets/list",
      authData: "auth/getAuthData",
    }),
    imageList() {
      return this.list.data;
    },
    imageResolutionWarning() {
      const minWidth = 1600;
      const minHeight = 900;
      const maxWidth = 2 * minWidth;
      const maxHeight = 2 * minHeight;
      const isPoorQuality =
        this.form &&
        (this.form.width < minWidth ||
          this.form.height < minHeight ||
          this.form.width > maxWidth ||
          this.form.height > maxHeight);
      if (!isPoorQuality) return null;
      return {
        message: `It's recommended to upload an image with a resolution between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight} pixels`,
      };
    },
    hasViewUploadPhotoPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
  },
  methods: {
    isDisabledByCategoryCondition() {
      if (
        [CATEGORY_ASSET.LOCATION, CATEGORY_ASSET.SERVICE].includes(
          this.category
        )
      ) {
        const isDisabled =
          !this.form.assets_country ||
          !this.form.assets_city ||
          !this.form.data;
        return isDisabled;
      }
      if ([CATEGORY_ASSET.CLIENT].includes(this.category)) {
        const isDisabled = !this.form.data;
        return isDisabled;
      }
    },
    isShownByCategory() {
      return [CATEGORY_ASSET.LOCATION, CATEGORY_ASSET.SERVICE].includes(
        this.category
      );
    },
    setDefaultLocation() {
      const defaultCountry = this.dayLocations.find((location) =>
        [null, 0].includes(location?.parent)
      );
      const defaultDestination = defaultCountry
        ? this.dayLocations.find(
            (location) => location?.parent === defaultCountry?.id
          )
        : this.dayLocations?.[0];
      const formCountry = defaultCountry
        ? defaultCountry
        : this.contractLocations.find(
            (location) => location.id === defaultDestination?.parent
          );
      this.setDestinationsFromCountry(formCountry?.location_code);
      this.form.assets_country = formCountry?.location_code;
      this.form.assets_city = defaultDestination?.location_code;
    },
    checkIsFormCompleted() {
      return (
        this.form.assets_name !== "" &&
        this.form.assets_country !== "" &&
        this.form.data !== ""
      );
    },
    setDestinationsFromCountry(event = "") {
      const destinations = this.contractLocations.find(
        (location) => location.location_code === event
      )?.destination;

      this.destinations = destinations || [];
      this.form.assets_city = "";
    },
    async handleImageUpload(file) {
      const imageFile = file;
      const imageResolution = await this.getImageResolution(file);
      const maxWidthOrHeight =
        Math.max(imageResolution.width, imageResolution.height) * 0.8;

      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(imageFile, options);
        return compressedFile;
      } catch (error) {
        console.log(error);
      }
    },
    async getImageResolution(file) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = window.URL.createObjectURL(file);
        image.onload = () => {
          resolve({
            width: image.width,
            height: image.height,
          });
        };
        image.onerror = reject;
      });
    },
    async handleFileUpload(file) {
      const compressedFile = await this.handleImageUpload(file);
      let image = new Image();
      image.src = window.URL.createObjectURL(compressedFile);
      image.onload = () => {
        this.form = {
          ...this.form,
          width: image.width,
          height: image.height,
        };
      };
      if (file.name) {
        const fileName = file.name.substring(0, file.name.lastIndexOf("."));
        this.form.assets_name = fileName;
      }

      const reader = new FileReader();
      this.toggleLoading(true);

      reader.onload = function (e) {
        this.form.data = e.target.result;
        this.toggleLoading(false);
      }.bind(this);

      reader.onerror = function (error) {
        console.info(error);
        this.toggleLoading(false);
      };
      this.image = compressedFile;
      reader.readAsDataURL(this.image);
    },
    toggleModal() {
      this.isCardModalActive = !this.isCardModalActive;
    },
    openUploadAssetsModal() {
      this.toggleModal();
      this.setDefaultLocation();
    },
    validateImageHasValidFormat(form) {
      const allowedFormats = /^(jpeg|jpg|png|gif|bmp)$/;
      const base64Pattern = /^data:image\/([a-zA-Z]+);base64,[A-Za-z0-9+/=]+$/;
      const match = form.data.match(base64Pattern);

      const format = match[1];
      if (!allowedFormats.test(format)) {
        return {
          valid: false,
          error: `Image contains an invalid image format: ${format}, please change the image format to: jpeg, jpg, png`,
        };
      }
      return {
        valid: true,
        error: "",
      };
    },
    async saveImages() {
      this.toggleLoading(true);
      const isFormCompleted = this.checkIsFormCompleted();
      const hasValidFormat = this.validateImageHasValidFormat(this.form);
      if (!hasValidFormat.valid) {
        this.toggleLoading(false);
        return this.$buefy.toast.open({
          duration: 5000,
          message: hasValidFormat.error,
          position: "is-top",
          type: "is-danger",
        });
      }
      if (!isFormCompleted) {
        this.toggleLoading(false);
        return this.$buefy.toast.open({
          duration: 5000,
          message: "Please, complete the form",
          position: "is-top",
          type: "is-warning",
        });
      }
      this.form.assets_name = this.formatText(this.form.assets_name);

      if (this.category === CATEGORY_ASSET.CLIENT) {
        this.form.assets_country = this.locationPath;
      }
      const response = await this.$store.dispatch("assets/save", this.form);
      this.$buefy.toast.open({
        duration: 5000,
        message: response.message,
        position: "is-top",
        type: "is-success",
      });
      this.form = {
        assets_name: "",
        assets_country: "",
        assets_city: "",
        data: "",
      };
      this.image = null;
      await this.$store.dispatch("assets/list", {
        path: this.locationPath,
        category: this.category,
      });
      this.setImageProcessingId(this.imageList[0].id);
      this.toggleLoading(false);
      this.toggleModal();
    },
    async onSubmit() {
      await this.validateFunctionExecution(this.saveImages, () => {
        this.toggleLoading(false);
        this.toggleModal();
      });
    },
    handlValidateName(event) {
      const prevString = event;
      const newString = this.formatText(prevString);
      if (event !== newString && this.form.assets_name !== newString) {
        this.validatorText =
          "Please do not include special characters such as commas, &, %, /, $ in the asset name.";
        this.validatorExample = "Correct name: " + newString;
      } else {
        this.validatorText = "";
        this.validatorExample = "";
      }
    },
    formatText(text) {
      return text.replace(/[&/\\#,;+()$~%.'":*?<>{}]/g, "_");
    },
  },
};
</script>
<style>
.validator__text {
  color: rgb(255, 97, 97);
  font-size: 0.7rem;
  position: relative;
  top: -0.5rem;
  left: 0.5rem;
}
.validator__text--right {
  color: rgb(67 149 44);
  font-size: 0.75rem;
  font-weight: 600;
  position: relative;
  top: -0.5rem;
  left: 0.5rem;
}
.image-preview picture {
  display: flex;
  width: 100%;
  height: 20rem;
}
.image_warning {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #ff9316;
  color: #fff;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.image_warning > svg,
.resolution_info > svg {
  width: 1rem !important;
  height: 1rem !important;
}
.resolution_info svg {
  color: #00636a;
  margin: 0 0.1rem 0.1rem 0;
}
.resolution_info[is-warning="true"] svg {
  color: #ff9316;
}
.upload .upload-draggable:hover.is-primary {
  border-color: #1d3b83;
  background: rgba(87, 106, 213, 0.05);
}
@media screen and (max-width: 480px) {
  .assets_upload_content__container {
    display: flex;
    flex-direction: column;
    margin: 0rem !important;
  }
  .assets_upload_content__container > div {
    width: 100%;
    padding: 0rem !important;
  }
}
</style>
