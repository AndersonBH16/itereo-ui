<template>
  <PageWrapper>
    <Loading :loading="loading" :loadingText="loadingText" />
    <NavbarMain />
    <WelcomeText />
    <div class="columns is-block-tablet-only">
      <div class="column is-three-fifths--off is-full-tablet">
        <HomeQuoteTable :openGuideModal="openGuideModal" />
        <ButtonViewAll />
      </div>

      <div class="column" v-if="false">
        <HomeReportsTable />
        <ButtonViewAll />
      </div>
    </div>

    <div class="columns is-block-tablet-only mb-1" v-if="false">
      <div class="column is-three-fifths is-full-tablet">
        <HomeFinancesTable />
        <ButtonViewAll />
      </div>

      <div class="column" v-if="false">
        <HomeFinancesChart />
      </div>
    </div>

    <BaseModal
      type="guide"
      :isComponentModalActive="isComponentModalActive"
      :closeModal="closeModal"
      :actionButtonOne="startTour"
    >
      <h1 slot="title" class="guidemodal__h1">
        Hi!, we want to make it more easy for you
      </h1>
      <p slot="paragraph">
        Please, follow this user guide to show you what you can do and how to do
        it.
      </p>
      <img slot="image" src="/img/startguide.png" alt="modal image" />
    </BaseModal>
  </PageWrapper>
</template>

<script>
import PageWrapper from "@/components/_shared/PageWrapper.vue";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import WelcomeText from "@/components/_shared/WelcomeText.vue";
import HomeQuoteTable from "@/components/home/HomeQuoteTable.vue";
import HomeReportsTable from "@/components/home/HomeReportsTable.vue";
import HomeFinancesTable from "@/components/home/HomeFinancesTable.vue";
import HomeFinancesChart from "@/components/home/HomeFinancesChart.vue";
import ButtonViewAll from "@/components/home/ButtonViewAll.vue";
import Loading from "../components/_shared/Loading.vue";
import BaseModal from "@/components/base-ui/BaseModal.vue";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    PageWrapper,
    NavbarMain,
    WelcomeText,
    HomeQuoteTable,
    HomeReportsTable,
    HomeFinancesTable,
    HomeFinancesChart,
    ButtonViewAll,
    Loading,
    BaseModal,
  },
  data() {
    return {
      tour: null,
      isComponentModalActive: false,
    };
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
    }),
  },
  methods: {
    closeModal() {
      this.isComponentModalActive = false;
    },
    openGuideModal() {
      this.isComponentModalActive = true;
    },
    startTour() {
      this.$store.dispatch("userguide/setIsGuideActive", true);
      this.$store.dispatch("userguide/nextStep");
      this.closeModal();
    },
  },
};
</script>
<style>
.guidemodal__h1 {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
}
</style>
