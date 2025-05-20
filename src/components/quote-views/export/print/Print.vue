<template>
  <div>
    <header class="modal-card-head modalCardPrint">
      <p class="modal-card-title">Print Version</p>
    </header>
    <center
      ref="textPage"
      class="PrintVersionContainer"
      :style="{ 'font-family': 'Montserrat, Verdana, Helvetica, Arial' }"
    >
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        :style="{
          'border-collapse': 'collapse',
          height: '100%',
          width: '100%',
          'text-size-adjust': '100%',
          'max-width': '700px !important',
        }"
        width="100%"
      >
        <tbody>
          <PrintNavbarMain />
          <PrintHeroImage />
          <PrintTitle :itinerary="itinerary.data" :format-date="formatDate" />
          <PrintDividerYellow />
          <PrintDescription :itinerary="itinerary.data" />
          <PrintDividerPink />
          <span v-for="(day, index) in daysWithFullServices" :key="index + 'a'">
            <PrintItineraryDayImage
              :day="day"
              :format-date="formatDate"
              :itinerary="itinerary.data"
            />
            <PrintItineraryDayTitle
              :day="day"
              :format-date="formatDate"
              :itinerary="itinerary.data"
            />

            <PrintDividerPink />
            <PrintItineraryDayDescription
              :day="day"
              :format-date="formatDate"
              :itinerary="itinerary.data"
            />
            <PrintItineraryDayServices
              :day="day"
              :format-date="formatDate"
              :itinerary="itinerary.data"
            />
          </span>
          <div
            v-if="
              helper.isSectionDisplayed(
                publishedConfigAndImages.config.contents,
                constants.TEMPLATE_CONFIG.DISPLAY_HOTELS_ACCOMMODATIONS
              )
            "
          >
            <PrintSectionTitle :title="'ACCOMMODATION AND PRICES'" />
            <PrintDividerGreen />
            <PrintPrices :itinerary="itinerary.data" />
          </div>
          <div>
            <PrintSectionTitle :title="'SERVICES'" />
            <PrintDividerGreen />
            <PrintItineraryServices :itinerary="itinerary.data" />
          </div>
          <div
            v-if="
              helper.isSectionDisplayed(
                publishedConfigAndImages.config.contents,
                constants.TEMPLATE_CONFIG.DISPLAY_CONTACT_US
              )
            "
          >
            <PrintQuestionsTitle />
            <PrintDividerYellow />
            <PrintQuestionsInfo :itinerary="itinerary.data" />
          </div>
        </tbody>
      </table>
    </center>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PrintDividerYellow from "@/components/quote-views/export/print/PrintDividerYellow.vue";
import PrintDividerPink from "@/components/quote-views/export/print/PrintDividerPink.vue";
import PrintDividerGreen from "@/components/quote-views/export/print/PrintDividerGreen.vue";
import PrintNavbarMain from "@/components/quote-views/export/print/PrintNavbarMain.vue";
import PrintTitle from "@/components/quote-views/export/print/PrintTitle.vue";
import PrintHeroImage from "@/components/quote-views/export/print/PrintHeroImage.vue";
import PrintDescription from "@/components/quote-views/export/print/PrintDescription.vue";
import PrintItineraryDayImage from "@/components/quote-views/export/print/PrintItineraryDayImage.vue";
import PrintItineraryDayTitle from "@/components/quote-views/export/print/PrintItineraryDayTitle.vue";
import PrintItineraryDayDescription from "@/components/quote-views/export/print/PrintItineraryDayDescription.vue";
import PrintItineraryDayServices from "@/components/quote-views/export/print/PrintItineraryDayServices.vue";
import PrintSectionTitle from "@/components/quote-views/export/print/PrintSectionTitle.vue";
import PrintPrices from "@/components/quote-views/export/print/PrintPrices.vue";
import PrintItineraryServices from "@/components/quote-views/export/print/PrintItineraryServices.vue";
import PrintQuestionsTitle from "@/components/quote-views/export/print/PrintQuestionsTitle.vue";
import PrintQuestionsInfo from "@/components/quote-views/export/print/PrintQuestionsInfo.vue";
import { TEMPLATE_CONFIG } from "@/constants/exportConfig";
import { exportHelper } from "@/utils/export";

export default {
  name: "Print",
  components: {
    PrintDividerYellow,
    PrintDividerPink,
    PrintDividerGreen,
    PrintNavbarMain,
    PrintHeroImage,
    PrintTitle,
    PrintDescription,
    PrintItineraryDayImage,
    PrintItineraryDayTitle,
    PrintItineraryDayDescription,
    PrintItineraryDayServices,
    PrintSectionTitle,
    PrintPrices,
    PrintItineraryServices,
    PrintQuestionsTitle,
    PrintQuestionsInfo,
  },
  data() {
    return {
      constants: {
        TEMPLATE_CONFIG,
      },
      helper: {
        ...exportHelper,
      },
      loading: true,
      id: null,
      title: "Itereo Travel Itinerary",
      description:
        "ITEREO Travel Planner© is about simplifying the process of tailoring tours for your clients.",
      url: "",
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      itineraryDays: "itineraryDays/getItineraryDays",
      itineraryServices: "itinerary/getInitialServicesItinerary",
      publishedConfigAndImages: "itinerary/getPublishedConfigAndImages",
    }),
    daysWithFullServices() {
      return this.itineraryDays.map((day) => {
        const services = day.services.map((service) => {
          const serviceData = this.itineraryServices.find(
            (itineraryService) => itineraryService.id === service.id
          );
          return { ...service, ...serviceData };
        });
        return { ...day, services };
      });
    },
  },
  methods: {
    printPage() {
      window.print();
    },
    formatDate(date) {
      let formatted = "";
      if (date) {
        const d = new Date(date + " 00:00:00");
        const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
        const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
        const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
        formatted = `${da}-${mo}-${ye}`;
      }
      return formatted;
    },
    selectText(element) {
      let range = {};
      if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
      } else if (window.getSelection) {
        range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    },
    copyPage() {
      this.selectText(this.$refs.textPage);
      document.execCommand("copy");
    },
  },
};
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}

body {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
}
h1,
h2 {
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--textDarkSecondColor);
  line-height: 1.3em;
}
h3,
h4,
h5,
h6,
.title {
  color: #1a1a1a;
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  font-weight: 600;
}

h1 {
  font-size: 2.3em;
}

h2 {
  font-size: 2.1em;
}

h3 {
  font-size: 1.8rem;
}

h4 {
  font-size: 1.5rem;
}

h5 {
  font-size: 1.3rem;
}

h6 {
  font-size: 1.1rem;
}

p {
  line-height: 1.9em;
  color: #4d4d4d !important;
}

.app_loading {
  max-width: 100vw;
  overflow: hidden;
}

.media + .media {
  border: none;
}

.button,
button {
  border-radius: 3px;
  text-transform: uppercase;
  font-family: "Oswald", Helvetica, Arial, Lucida, sans-serif !important;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

button.button:hover {
  -webkit-box-shadow: inset 0 0 0 100px rgb(0 0 0 / 20%);
  box-shadow: inset 0 0 0 100px rgb(0 0 0 / 20%);
}

.button.is-primary,
.has-background-primary {
  background-color: var(--textAccentColor) !important;
  border-color: transparent;
  color: #fff;
}

.has-text-primary {
  color: var(--textAccentColor) !important;
}

a,
.has-text-info {
  color: #0476c9 !important;
}

/*Start Hero General*/

.hero.has-background {
  position: relative;
  overflow: hidden;
  color: #fff;
}

.hero-background {
  position: absolute;
  width: 100%;
  height: 100%;
}
.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-background.is-transparent {
  opacity: 0.3;
}

.banner_background {
  height: 400px;
  object-fit: cover;
}

/*Finish Hero General*/

/*Start NavbarTop*/
.navbarTopContainer {
  background-color: var(--bgMainColor);
}
.navbarTop a {
  color: var(--textAccentColor) !important;
  font-size: 0.8rem;
  font-weight: 600;
}

.navbarTop a:hover {
  background: transparent;
  color: #b30048 !important;
}

.navbarTopIcons a span i:before {
  font-size: 20px !important;
}

.navbarTopInfo {
  display: flex;
}

/*Finish NavbarTop*/

/*Start NavbarMain*/

.navbar-item img {
  max-height: 5.4rem;
}

.navbarMain {
  position: relative;
  background: transparent;
  margin-top: 0;
  line-height: 23px;
  width: 100%;
}

.navbarMain .navbarMainValue {
  font-weight: bold;
  font-size: 1.4rem;
  /*color: #4a4a4a;*/
  color: var(--textDarkSecondColor);
}

.navbarMain small {
  font-weight: 600;
  color: var(--textAccentColor);
}

.navbar.navbarMain .navbar-brand,
.navbar.navbarSecondary .navbar-brand {
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.navbar.navbarMain .navbar-brand > .navbar-item,
.navbar.navbarMain .navbar-brand .navbar-link {
  display: inline-block;
}

.navbarMain a.navbar-burger.burger {
  display: none;
}
.navbarMain a .priceSelected {
  padding: 0.5rem 0.75rem;
}
/*Finish NavbarMain*/

/*Start HeroImage*/

.hero-body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.HeroImageCloudEffect {
  z-index: 9;
}
.HeroImageCloudEffect img {
  width: 100%;
}
.hero.heroHome.is-fullheight.has-background .hero-body {
  align-items: flex-end;
}
.textHeroImage {
  text-shadow: 0em 0.1em 0.3em rgb(0 0 0 / 38%);
  position: relative;
  z-index: 1;
}

.textHeroImage .title {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 3rem);
  font-weight: 700;
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  color: var(--textLightColor);
  line-height: clamp(2rem, 3vw, 4rem);
}

.textHeroImage .subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--textLightSecondColor);
}

.hero_subtitle {
  font-size: clamp(0.85rem, 1.25vw, 1.5rem);
  font-weight: 500;
  color: var(--textLightColor);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 1rem;
}
/*Finish HeroImage*/

/*Start NavbarSecondary*/

.navbarSecondaryBag {
  background-color: #fcfcfc;
}

.navbarSecondary .navbar-brand a.is-active {
  border-bottom: 2px solid var(--textSecondAccentColor) !important;
}

.navbarSecondary .navbar-brand a {
  padding-bottom: 29px;
  font-weight: 600;
  color: var(--textAccentColor) !important;
  transition: color 300ms ease 0ms;
  font-size: 0.95rem;
  padding-left: 25px;
  padding-right: 25px;
}

.navbarSecondary .navbar-brand a.is-active,
.navbarSecondary .navbar-brand a:hover {
  color: var(--textSecondAccentColor) !important;
}

.navbarSecondary a.navbar-burger.burger {
  display: none;
}

/* Finish NavbarSecondary*/

/* Start Itinerary Description*/

.itineraryDescription {
  line-height: 1.9em;
  color: #4d4d4d !important;
}

.dayTitle {
  font-weight: 700;
  font-size: 1.5rem;
  text-transform: none;
  color: var(--textLightSecondColor);
}

.daySubtitle {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--textLightSecondColor);
}

/* Finish Itinerary Description*/

/*Start Banner Image*/

.ImgFullEffectToBottom {
  background-size: cover;
  background-position: center;
  height: 650px;
  position: relative;
}

.ImgFullEffectToBottom img {
  z-index: 9;
}

.ImgFullEffectToBottom:after {
  position: absolute;
  top: 0px;
  content: " ";
  display: block;
  background-image: url(/img/effect-top-bottom.png);
  height: 100%;
  background-repeat: no-repeat;
  width: 100%;
  background-size: cover;
}

.responsibleTravel {
  position: absolute;
  right: 10%;
  max-height: 250px;
  bottom: 20%;
}

/*Finish Banner Image*/

/* Start Itinerary section*/

.module_box {
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 6px 6px 0 0;
}

.card-img-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.25rem;
  border-radius: 0 !important;
}

.title_modules {
  text-shadow: -1px 1px 1px black;
  text-align: left;
}

.itineraryDays {
  padding: 0 3rem;
  margin: 0 3rem;
}

.itineraryDays .image.is-3by1 {
  padding-top: 14%;
  min-height: 150px;
}

.card.itineraryDay {
  box-shadow: none !important;
  background: transparent;
  border: none;
}

.card.itineraryDay .card-content {
  padding: 1.25rem;
}
.section-day-conn {
  margin: 2.8rem 0;
}
.card.itineraryDay .card-content span:first-child .section-day-conn {
  margin-top: 1.4rem;
}
.card.itineraryDay .card-content span:last-child .section-day-conn {
  margin-bottom: 0;
}
.module-box {
  background-size: cover;
  background-position: center;
  border-radius: 0 !important;
}

.module_order-number {
  position: absolute;
  font-size: 1.5em;
  font-weight: 600;
  line-height: 48px;
  float: left;
  left: 18px;
  top: 85px;
  filter: drop-shadow(0 2px 4px rgb(53 85 93 / 40%));
  width: 86px;
  height: 86px;
  border: none;
  z-index: 2;
  transition: all 0.3s ease;
}

.module_order-number img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  object-position: center;
}

.section-day-conn a {
  z-index: 2;
}

.section-day-conn:hover .hover_select_day-connection {
  -webkit-transform: scale(1.12);
  -ms-transform: scale(1.12);
  transform: scale(1.12);
  filter: drop-shadow(0 2px 4px rgba(53, 85, 93, 0.4));
  transition: all 0.3s ease;
}

.section-day-conn.active .border-shadow,
.section-day-conn:hover .border-shadow {
  background-color: #fffde6 !important;
}

.rounded-circle {
  border-radius: 50% !important;
}

.ItineraryDayContent {
  border-left: 5px solid #b30048;
}

.ItineraryDayContent .subtitle {
  font-size: 0.9rem;
}

.ItineraryDayContent .title {
  font-size: 1.2rem;
}

.ItineraryDayContent .subtitle strong {
  color: #b30048;
  font-weight: 700;
}

.ItineraryDayContent .subtitle .icon i:before {
  font-size: 1rem;
}

.column.is-five-percent {
  align-items: center;
  width: 5%;
  display: flex;
  justify-content: flex-end;
}

.timeline::before {
  display: block;
  content: "";
  position: absolute;
  /* top: -50px; */
  left: 64px;
  height: 80%;
  z-index: -1;
}

/*.timeline:last-child:before {
    height: 60%;
}*/

/*Finish Itinerary Section*/

/*Finish Pricing*/

.pricing-table .pricing-plan .plan-header {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.55em;
  align-content: center;
  text-align: center;
  padding-bottom: 0;
}

.pricing-table .pricing-plan .plan-items {
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

.pricing-table .pricing-plan .plan-items:last-child {
  border: 0.1rem solid #e8e8e8;
}

.pricing-table .pricing-plan .plan-item {
  padding: 0.75em;
  align-content: center;
  text-align: center;
  font-size: 0.9em;
}

.pricing-table .pricing-plan .plan-item:first-child {
  margin-bottom: 0.5rem;
}

.pricing-table .pricing-plan .plan-item:last-child {
  padding-bottom: 3rem;
}

.plan-price-amount span {
  font-size: 1.3rem;
}

.pricing-table .pricing-plan .plan-price {
  font-size: 0.75rem;
  font-weight: 400;
  padding: 1.25rem 0.95rem;
  align-content: center;
  text-align: center;
  background-position-y: 75%;
  background-size: cover;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
}

.pricing-table .pricing-plan.is-unselect .plan-price {
  background-image: linear-gradient(
      180deg,
      rgba(34, 27, 69, 0.73) 0%,
      rgba(34, 27, 69, 0.73) 100%
    ),
    url("/img/image_holder.jpg");
}

.pricing-table .pricing-plan.is-unselect .button {
  background-color: #6f6f6f !important;
}

.pricing-table .pricing-plan.is-primary .plan-price {
  background-image: linear-gradient(
      180deg,
      rgba(1, 113, 113, 0.73) 0%,
      rgba(1, 113, 113, 0.73) 100%
    ),
    url("/img/image_holder_primary.jpg");
}

.pricing-table .pricing-plan .button {
  border-color: transparent;
  color: #fff;
  text-transform: uppercase;
}

.pricing-table .pricing-plan .plan-price .plan-price-amount {
  font-size: 2.5rem;
  font-weight: 700;
  padding: 0.2em;
  padding-top: 0;
}

.pricing-table
  .pricing-plan
  .plan-price
  .plan-price-amount
  .plan-price-currency {
  vertical-align: super;
  font-size: 1rem !important;
  font-weight: 400 !important;
  color: #4a4a4a;
  margin-right: 0.25rem;
}

.pricing-table .pricing-plan .plan-footer {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 0.75em;
  align-content: center;
  text-align: center;
  margin-top: auto;
}

.pricing-plan .carousel .carousel-indicator {
  display: none;
}

.pricing-plan .carousel.is-overlay .carousel-indicator {
  display: flex;
}

.pricing-plan .carousel .image img {
  min-height: 210px;
}

.pricing-plan .carousel.is-overlay .image img {
  min-height: auto;
}

.pricing-plan .carousel .title-hotel-carousel {
  position: absolute;
  z-index: 1;
  bottom: 4%;
  left: 2%;
  text-shadow: 0em 0.1em 0.3em rgb(0 0 0 / 60%);
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
}

.pricing-plan .carousel.is-overlay .title-hotel-carousel {
  font-size: 1.4rem;
}

/*Finish Pricing*/

/*Start Destination*/

.carouselDestinations .image {
  max-height: 600px;
}
.carouselDestinations .imageDestinations img {
  object-fit: cover;
  border-radius: 0;
  height: 100vh;
}

.carouselDestinations.carousel-list .carousel-slides .carousel-slide {
  border: none;
}

.carouselDestinations .card-content {
  box-shadow: none;
  position: absolute;
  bottom: 5%;
  text-align: center;
  width: 100%;
}

.carouselDestinations .subtitle img {
  height: 80px;
  width: 80px;
  margin-bottom: 0.5rem;
}

.carouselDestinations .title {
  font-size: 38px;
  font-weight: 700;
  text-shadow: 0em 0.1em 1em rgb(0 0 0 / 60%);
}

.overlayDestinations {
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  transition: all 0.3s ease;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  z-index: 1;
}

.overlayDestinations:hover {
  background: rgb(0 0 0 / 30%);
}

/*Finish Destination*/

/* Start Contact Us*/

.effectContactUs {
  background-size: cover;
  background-position: top;
  height: 100vh;
  position: relative;
}

.effectContactUs:after {
  position: absolute;
  top: 0px;
  content: " ";
  display: block;
  background-image: url(/img/effect-top-bottom.png);
  height: 100vh;
  background-repeat: no-repeat;
  width: 100%;
  background-size: cover;
}
.sidebar-contactUs-container {
  position: fixed;
  right: 0;
  z-index: 4 !important;
  display: flex;
  top: 0;
  height: 100%;
  width: 100%;
  transition: all 1s ease;
  transform: translate(0%, 0%);
  -webkit-transform: translate(0%, 0%);
}

.sidebar-contactUs-container .overlay {
  background-color: rgba(10, 10, 10, 0.87);
}
.sidebar-contactUs-container .content {
  background-color: #d11762;
  overflow: hidden;
  overflow-y: auto;
  transition: all 1s ease;
  transform: translate(0%, 0%);
  -webkit-transform: translate(0%, 0%);
}
.sidebar-contactUs-container .content .header {
  background-color: #159033;
  color: white;
  text-align: left;
}
.sidebar-contactUs-container .content .header a {
  color: white !important;
  cursor: pointer;
}
.contact-us-form-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}
.contact-us-form-container p {
  color: white !important;
  font-size: 18px;
  font-weight: 400;
  line-height: 25px;
  padding: 2rem;
  text-align: center;
}
.contact-us-form-container .contact-us-form {
  width: 20rem;
  display: flex;
  flex-direction: column;
}
.contact-us-form-container .contact-us-form input,
textarea {
  width: 100%;
  outline: none;
  font-size: 18px;
  line-height: 20px;
  padding: 1rem;
  border: transparent;
  margin-bottom: 0.5rem;
}

.contact-us-form-container .contact-us-form button {
  width: 80%;
  background: #159033;
  color: white;
  margin: auto;
  outline: none;
  font-size: 20px;
  line-height: 20px;
  padding: 1rem 5rem 1rem 2rem;
  border: transparent;
  margin-top: 0.5rem;
}
.contact-us-form-container .contact-us-form button:hover {
  -webkit-box-shadow: inset 0 0 0 100px rgb(0 0 0 / 20%);
  box-shadow: inset 0 0 0 100px rgb(0 0 0 / 20%);
}
.contact-us-form-container .contact-us-form button span {
  padding-right: 4rem;
}
/* Finish Contact Us*/

/*Start Why Company*/

.whyCompany img {
  height: 75%;
  width: 75%;
  margin: auto;
  text-align: center;
  display: block;
}

.whyCompany p {
  font-size: 0.9rem;
  line-height: 1.67;
}

.card.whyCompany {
  box-shadow: none;
}

/*Finish Why Company*/

/*Start Questions*/

.AgentProfileImg:after {
  position: absolute;
  top: 0px;
  content: " ";
  display: block;
  background-image: url(/img/effect-profile.png);
  height: 100%;
  background-repeat: no-repeat;
  width: 100%;
  background-size: cover;
}

.AgentProfileImg {
  position: relative;
  overflow: hidden;
  color: #fff;
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  height: 300px;
  width: 300px;
  margin: auto;
}

a.questionsMail {
  color: #4d4d4d !important;
}

/*Finish Questions*/

/*Footer*/

#main-footer {
  background-color: #023b3c;
}

.footerSecondaryBg {
  background-color: #d11762;
}

.footerSecondary,
.footerSecondary a:hover {
  background: transparent;
}

.footerSecondary a {
  color: #fff !important;
}

/*Footer*/

/*Sidebar service*/

.b-sidebar.sideBarBox .sidebar-content {
  background: #fff;
}
.sideBarTop {
  position: fixed;
  width: 50%;
  z-index: 3;
}
.desktop {
  display: block;
}
.mobile {
  display: none;
}
.sideBarTopPrice,
.sideBarQtyPaxs {
  padding-top: 4px;
  padding-bottom: 5px;
}

.sideBarTopPrice {
  border-left: 1px solid white;
  padding-left: 15px;
}

.sideBarTop a {
  color: #fff !important;
}

.sideBarTopPrice div,
.sideBarQtyPaxs div {
  font-weight: 600;
  font-size: 1rem;
}

.sideBarQtyPaxs {
  text-align: center;
}

.b-sidebar .sidebar-content {
  width: 600px;
}
.itinerarySideBar-content-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.itinerarySideBar-content {
  width: 50%;
  overflow-y: scroll;
}
.itinerarySideBar-content-description {
  margin-top: 65px;
}
.itinerarySideBar-title-container {
  padding: 2rem 3rem 0 2.3rem;
  margin-bottom: 0.5rem;
}
.itinerarySideBar-title-container .textHeroImage {
  text-shadow: none;
}
.itinerarySideBar-title-container .subtitle {
  font-size: 1rem;
}
.itinerarySideBar-title-container .title {
  font-size: 1.9rem;
}
.heroDaySidebar {
  min-height: 250px;
  width: 50%;
}

.heroDaySidebar .textHeroImage .subtitle {
  font-size: 1.2rem;
}

.heroDaySidebar .textHeroImage .title {
  font-size: 1.6rem;
}

.heroDaySidebar .hero-body {
  padding: 1.5rem 1.8rem;
  align-items: flex-end;
  align-content: flex-end;
  display: none;
}

.sidebarDayDescription {
  border: 1px solid #e8e8e8;
}

.sideBarAccommodations .carousel {
  margin: 0 1.8rem;
}

.sideBarAccommodations .carousel .carousel-indicator {
  display: none;
}

.sideBarAccommodations .carousel.is-overlay .carousel-indicator {
  display: flex;
}

.sideBarAccommodations .carousel .image img {
  min-height: 210px;
  object-fit: cover;
}

.sideBarAccommodations .carousel.is-overlay .image img {
  min-height: auto;
}

.sideBarAccommodations .carousel .title-hotel-carousel {
  position: absolute;
  z-index: 1;
  bottom: 4%;
  left: 2%;
  text-shadow: 0em 0.1em 0.3em rgb(0 0 0 / 60%);
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
}

.sideBarAccommodations .carousel.is-overlay .title-hotel-carousel {
  font-size: 1.4rem;
}

.carousel-arrow .icon {
  color: #0476c9;
}

.sideBarContactUs {
  text-align: center;
  margin-top: 1rem;
  border-top: 1px dashed #e8e8e8;
  padding: 1.3rem 1rem 1.4rem 1rem;
}

.card.sidebarDay {
  box-shadow: none !important;
  background: transparent;
  border: none;
}
.sidebarDay .media-left {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebarDayContent {
  background: rgba(0, 148, 255, 0.15);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.06);
}
.collapseCard.card {
  width: 100% !important;
}
.card-icon,
.card-hour {
  color: #4d4d4d;
}
.card-icon {
  width: 40px;
}
.card-hour {
  font-size: 0.8rem;
  font-weight: 600;
}
.sidebarDayContent .title {
  font-size: 1rem;
  line-height: 1.4;
}
.sidebarDayContent .collapseTitle {
  font-weight: 600;
}

.card.sidebarDay .card-content {
  padding: 1.5rem 2.5rem 1.25rem 2rem;
}

.sidebarTimeline.timeline::before {
  left: 80px;
  border-right: 2px dashed #4d4d4d;
  z-index: -1;
}
.sidebar-close {
  display: none !important;
}
/*Sidebar service*/

/*Start NavbarResponsive*/

.navbarResponsive {
  text-align: center;
  background: #eff2f7;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  margin: 0;
  border-top: 1px solid #e8e8e8;
  display: none !important;
  z-index: 9;
}

.navbarResponsive a {
  color: #4d4d4d !important;
  font-weight: 600;
  transition: color 300ms ease 0ms;
  font-size: 0.95rem;
}

.navbarResponsive a:hover,
.navbarResponsive a:focus,
.navbarResponsive a:active {
  color: #d11762 !important;
}

.navbarResponsive .column {
  padding: 1.5rem 0.45rem;
}

.navbarResponsive i:before {
  font-size: 2.6rem !important;
}

.b-sidebar .sidebar-background {
  background: rgba(10, 10, 10, 0.4) !important;
}
.printFloat {
  position: fixed;
  right: 40px;
  max-width: 235px;
  z-index: 1;
  transition: all 0.3s;
  cursor: pointer;
  bottom: 40px;
  font-size: 1em;
}
.printFloatButton {
  width: 60px;
  height: 60px;
  background-color: #0476c9;
  color: #fff !important;
  border-radius: 100%;
  text-align: center;
  z-index: 1;
  padding: 1.3rem 0.2rem;
}
.printFloatButton:hover,
.printFloatButton:focus {
  background-color: #006ab7;
}
.printFloatButton .my-float {
  margin: 1rem;
  position: relative;
  top: 3px;
  left: 1px;
}
/*Finish NavbarResponsive*/
</style>
import { map } from 'core-js/core/array';
