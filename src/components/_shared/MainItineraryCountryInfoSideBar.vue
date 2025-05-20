<template>
  <div>
    <a href="#" @click="open = true">
      <div class="card cardItineraryContent">
        <div class="card-content has-text-centered">
          <div class="content">
            <p class="is-h3 mb-0">
              <strong class="is-uppercase">0 Cou</strong>
            </p>
            <small class="small-transparent">0</small>
            <IconInfo class="infoCardContent color-4" />
          </div>
        </div>
      </div>
    </a>
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :overlay="true"
      :right="true"
      v-model="open"
      class="sidebarRight"
    >
      <div class="topCloseSideBar is-flex pr-5 p-2">
        <a @click="open = false" class="is-flex color-8">
          <IconChevronLeft class="icon is-small mr-2" />
          <span class="color-4 has-text-weight-medium"
            >Country Information</span
          >
        </a>
        <a @click="open = false" class="color-8 sideBarCloseButton">
          <IconClose class="icon is-small" />
        </a>
      </div>
      <div class="p-3 SideBarBox">
        <b-tabs
          v-model="activeTab"
          position="is-centered"
          class="block mb-0 countryInfoTab"
        >
          <b-tab-item label="Peru">
            <b-field class="mb-6">
              <BaseTextarea
                placeholder="Add the description here"
                size="large"
                class="w-100"
                value="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
              ></BaseTextarea>
            </b-field>
          </b-tab-item>
          <b-tab-item label="Argentina">
            <b-field class="mb-6">
              <BaseTextarea
                placeholder="Add the description here"
                size="large"
                class="w-100"
                value="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
              ></BaseTextarea>
            </b-field>
          </b-tab-item>
        </b-tabs>
        <div class="BottomButtonsSideBar is-flex">
          <!--<button
            type="button"
            @click="open = false"
            class="button color-7 button is-text px-6 mr-4 button"
          >
            Cancel
          </button>-->
          <BottomButtonSaveSideBar />
        </div>
      </div>
    </b-sidebar>
    <!--Button-->
  </div>
</template>

<script>
import BottomButtonSaveSideBar from "@/components/_shared/BottomButtonSaveSideBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "MainItineraryCountryInfoSideBar",
  components: {
    BottomButtonSaveSideBar,
  },
  data() {
    return {
      open: false,
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: false,
      activeTab: 0,
    };
  },
  computed: {
    ...mapGetters({
      itineraryStatus: "itinerary/getItineraryStatus",
    }),
  },
};
</script>
