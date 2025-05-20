<template>
  <div>
    <b-field>
      <BaseInput
        placeholder="Search assets by name..."
        type="search"
        :lazy="true"
        :value="search"
        @input="
          search = $event;
          handleLoadData();
        "
        size="large"
        class="w-100"
      />
      <BaseButton
        @click="handleLoadData"
        action="principal"
        class="mx-1"
        size="large"
      >
        <i slot="icon">
          <IconSearch />
        </i>
      </BaseButton>
    </b-field>
    <GuideBox
      title="Editing your itinerary"
      description="Let´s add this one"
      :step="42"
      :positionX="-10"
      :positionY="200"
      :showNextButton="false"
      v-if="!isLoading"
    />
    <GuideBox
      title="Editing your itinerary"
      description="Let´s add this one"
      :step="54"
      :positionX="-10"
      :positionY="200"
      :showNextButton="false"
    />
    <div
      id="gallery"
      :data-test-id="constants.DATA_TEST_ID_VALUES.PHOTOS_GALLERY"
    >
      <div
        v-for="(image, index) in data.data"
        :key="index"
        :class="focusedGuideBoxClass('', [42, 54], false, () => index === 0)"
      >
        <expandable-image
          :src="getAssetImage(image)"
          :alt="image.name"
          :title="image.name"
          :close-on-background-click="true"
          class="gallery_img"
        ></expandable-image>
        <div class="is-flex is-align-content-space-between buttons-img">
          <b-checkbox
            class="checkAdd"
            @input="
              nextStep();
              handleAssetOnClick($event, image);
            "
            type="is-success"
            :value="
              assetsList
                ? assetsList.findIndex((list) => {
                    return list.id == image.id;
                  }) >= 0
                  ? true
                  : false
                : false
            "
            >Add</b-checkbox
          >
        </div>
        <p class="description">
          <span>
            Name:<b> {{ image.name | truncate(15, "...") }}</b>
          </span>
          <span v-if="isLocationList()">
            <br />
            Location:<b> {{ image.path }}</b>
          </span>
        </p>
      </div>
    </div>
    <b-pagination
      :total="data.total"
      v-model="data.currentPage"
      :range-before="1"
      :range-after="2"
      :rounded="false"
      size="is-small"
      :per-page="10"
      order="is-centered"
      class="mt-6"
    >
      <template #default="props">
        <b-pagination-button
          :page="props.page"
          tag="button"
          :id="`page${props.page.number}`"
          @click.native="onPageChange(props.page.number, props)"
        >
          {{ props.page.number }}
        </b-pagination-button>
      </template>

      <template #previous="props">
        <b-pagination-button
          :page="props.page"
          @click.native="onPageChange(props.page.number)"
        >
          <IconArrowLeft class="icon_previous" />
        </b-pagination-button>
      </template>

      <template #next="props">
        <b-pagination-button
          :page="props.page"
          @click.native="onPageChange(props.page.number)"
        >
          <IconArrowRight class="icon_next" />
        </b-pagination-button>
      </template>
    </b-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GuideBox from "./GuideBox.vue";
import { CATEGORY_ASSET } from "@/constants";
import { DATA_TEST_ID_VALUES } from "@/constants/test";

export default {
  name: "AssetsList",
  data() {
    return {
      constants: { DATA_TEST_ID_VALUES },
      search: "",
      placeholderImage:
        "https://place-hold.it/1200X725/DDDDDD/fff.jpg?bold&fontsize=50&text=Processing Image",
    };
  },
  props: {
    assetsList: {
      type: Array,
      default: () => [],
    },
    handleAssetOnClick: {
      type: Function,
    },
    toggleLoading: {
      type: Function,
    },
    loadData: {
      type: Function,
    },
    category: {
      type: Number,
      default: CATEGORY_ASSET.LOCATION,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: "",
    },
    locationPath: {
      type: String,
      default: "",
    },
    imageProcessingId: {
      type: Number,
      default: 0,
    },
  },
  components: { GuideBox },
  computed: {
    ...mapGetters({
      list: "assets/list",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
    }),
    data() {
      return {
        data: this.list.data,
        total: this.list.meta ? this.list.meta.total : 0,
        currentPage: this.list.meta ? this.list.meta.current_page : 1,
        lastPage: this.list.meta ? this.list.meta.last_page : 1,
        prev: this.list.links ? this.list.links.prev : 1,
        next: this.list.links ? this.list.links.next : 1,
        perPage: this.perPage,
        loading: this.loading,
      };
    },
  },
  methods: {
    isLocationList() {
      return this.category === CATEGORY_ASSET.LOCATION;
    },
    handleLoadData() {
      const payload = {
        page: this.data.currentPage,
        order: "desc",
        search: this.search,
        path: this.locationPath,
        category: this.category,
      };
      this.loadData(payload);
    },
    onPageChange(page) {
      this.data.currentPage = page;
      this.handleLoadData();
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
      return this.isUserGuideActive && checkStep && resultExtraValidator
        ? `${classDefault} is-guide-step ${bgWhiteClass}`
        : classDefault;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
    getAssetImage(image) {
      if (this.imageProcessingId === image.id) {
        return this.placeholderImage;
      }
      return image.thumbnail_1200X725;
    },
  },
};
</script>
<style scoped>
.checkAdd {
  height: 45px;
  background: white;
  width: 100%;
  margin: 0 !important;
}
@media screen and (max-width: 480px) {
  #gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
