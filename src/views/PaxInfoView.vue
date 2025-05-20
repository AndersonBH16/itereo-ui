<template>
  <div class="is-flex">
    <div style="width: 100%">
      <div class="columns m-0">
        <div class="column">
          <BaseModal
            :isComponentModalActive="modalPreventExitPaxInfo"
            :closeModal="closeModalPreventExitPaxInfo"
            :cancel="cancel"
          >
            <IconWarning slot="icon" class="icon is-xsmall color-12" />
            <span slot="paragraph">Do you want to save your changes?</span>
            <div slot="buttons" class="is-flex">
              <BaseButton
                @click="
                  closeModalPreventExitPaxInfo();
                  goToNextView();
                "
                action="secondary"
                size="medium"
                class="mr-4"
              >
                <p slot="text">No, discard changes</p>
              </BaseButton>
              <BaseButton
                @click="
                  handleSavePassenger(dataPassengers);
                  goToNextView();
                "
                action="tercery"
                size="medium"
              >
                <p slot="text">Yes, save changes</p>
              </BaseButton>
            </div>
          </BaseModal>
          <PaxInfoForm
            :dataPassengers="dataPassengers"
            :disablePaxInfoForm="disablePaxInfoForm"
            :handleSavePassenger="handleSavePassenger"
            :closeTabPassenger="closeTabPassenger"
            @updatePassengers="dataPassengers = $event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import helpers from "@/helpers";
import { PATH_INFO } from "@/router/path";
import { ITINERARY_STATUS } from "@/constants/itinerary";
import PaxInfoForm from "@/components/quote-views/pax-info/PaxInfoForm.vue";

export default {
  name: "PaxInfoView",
  components: {
    PaxInfoForm,
  },
  props: {
    loadItinerary: {
      type: Function,
      default: () => {},
    },
    loadPassengersItinerary: {
      type: Function,
      default: () => {},
    },
    loadPublishedItinerary: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      modalPreventExitPaxInfo: false,
      isLoading: false,
      activeTab: 0,
      nextView: null,
      dataPassengers: [],
      cancel: ["x", "outside"],
    };
  },
  computed: {
    backgroundImage() {
      return helpers.backgroundImage(
        "https://305c511294116d47a2eb-8984c8bf4382d773df005374b9639769.ssl.cf2.rackcdn.com/itereo/ttc/background_app.jpg"
      );
    },
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      prices_itinerary: "itinerary/getPricesItineraries",
      numPax: "itinerary/getNumPax",
      passengersActiveTab: "itinerary/getPassengersActiveTab",
      passengersItineraries: "itinerary/getPassengersItineraries",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
      itineraryStatus: "itinerary/getItineraryStatus",
      historyView: "utils/getHistoryView",
    }),
    info() {
      return {
        itinerary: this.itinerary,
      };
    },
    disablePaxInfoForm() {
      return (
        this.disableQuoteByStatus ||
        (this.hideElementByCondition &&
          this.itineraryStatus !== ITINERARY_STATUS.SENT.value)
      );
    },
  },
  methods: {
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) {
        this.setLoadingText("Loading content, please wait...");
      }
    },
    setLoadingText(value) {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    toggleModalPreventExitPaxInfo(newValue = false) {
      this.modalPreventExitPaxInfo = newValue;
    },
    closeModalPreventExitPaxInfo() {
      this.toggleModalPreventExitPaxInfo(false);
    },
    goToNextView() {
      this.toggleModalPreventExitPaxInfo(false);
      this.$router.push(this.nextView.fullPath);
    },
    closeTabPassenger(passengerSelected) {
      if (this.disableQuoteByStatus) return;

      if (passengerSelected.id != null) {
        this.$buefy.dialog.confirm({
          title: "Deleting passenger",
          message:
            "Are you sure you want to <b>delete</b> this passenger (" +
            passengerSelected.first_name +
            ")?",
          confirmText: "Delete passenger",
          type: "is-danger",
          iconPack: "fas",
          hasIcon: true,
          onConfirm: () => {
            this.toggleLoading(true);
            var lstPassengerForDelete = [];
            passengerSelected.status = -1;
            lstPassengerForDelete.push(passengerSelected);
            const TOTAL_STEPS_TO_PERFORM = 1;
            const payload = {
              id_itinerary: this.info.itinerary.data.id,
              data: lstPassengerForDelete,
              cur_step: TOTAL_STEPS_TO_PERFORM,
              last_step: TOTAL_STEPS_TO_PERFORM,
            };
            this.$store
              .dispatch("itinerary/save_passenger", payload)
              .then((response) => {
                this.toggleLoading(false);
                this.$buefy.toast.open({
                  duration: 5000,
                  message: response.message,
                  position: "is-top",
                  type: "is-success",
                });
              })
              .catch((error) => {
                this.toggleLoading(false);
                var validations = "";
                if (typeof error.response.data.errors !== "undefined") {
                  error.response.data.errors.forEach((response_each) => {
                    validations += response_each.errors.first_name
                      ? response_each.errors.first_name + "</br>"
                      : "";
                    validations += response_each.errors.last_name
                      ? response_each.errors.last_name + "</br>"
                      : "";
                    validations += response_each.errors.email
                      ? response_each.errors.email + "</br>"
                      : "";
                    validations += response_each.errors.phone
                      ? response_each.errors.phone + "</br>"
                      : "";
                    validations += response_each.errors.passport_number
                      ? response_each.errors.passport_number + "</br>"
                      : "";
                    validations += response_each.errors.passport_expiration
                      ? response_each.errors.passport_expiration + "</br>"
                      : "";
                  });
                } else {
                  validations += error.response.data.message;
                }
                this.$buefy.toast.open({
                  duration: 5000,
                  message: validations,
                  position: "is-top",
                  type: "is-danger",
                });
              });
          },
        });
      } else {
        // this.passengers.splice(passengerSelected.key - 1);
        this.loadDataPassengersWithLoading(this.$route.query.itinerary, true);
      }
    },
    toggleLoading(value) {
      this.setLoading(value);
      this.isLoading = value;
    },
    async loadDataPassengersWithLoading(uuid, reload) {
      this.toggleLoading(true);
      await this.loadPassengersItinerary({ uuid, reload });
      this.toggleLoading(false);
    },
    validateForm(passengers) {
      let msgValidation = "";
      let flgErrorField = false;
      let indexTab;
      let msgValidationTab = "";
      let flgErrorTab = false;
      this.toggleLoading(true);
      passengers.forEach((passenger, index) => {
        flgErrorTab = false;
        msgValidationTab = "";
        indexTab = index + 1;
        if (passenger.first_name == null || passenger.first_name == "") {
          msgValidationTab += "please fill the field first name </br>";
          flgErrorField = flgErrorTab = true;
        }
        if (passenger.last_name == null || passenger.last_name == "") {
          msgValidationTab += "please fill the field last name </br>";
          flgErrorField = flgErrorTab = true;
        }
        if (passenger.email == null || passenger.email == "") {
          msgValidationTab += "please fill the field email </br>";
          flgErrorField = flgErrorTab = true;
        }
        if (passenger.phone == null || passenger.phone == "") {
          msgValidationTab += "please fill the field phone </br>";
          flgErrorField = flgErrorTab = true;
        }
        if (
          passenger.passport_number == null ||
          passenger.passport_number == ""
        ) {
          msgValidationTab += "please fill the field passport number </br>";
          flgErrorField = flgErrorTab = true;
        }
        if (
          passenger.passport_expiration == null ||
          passenger.passport_expiration == ""
        ) {
          msgValidationTab += "please fill the field passport expiration </br>";
          flgErrorField = flgErrorTab = true;
        }
        if (flgErrorTab) {
          msgValidation += "Pax " + indexTab + ": </br>" + msgValidationTab;
        }
      });

      if (flgErrorField) {
        this.toggleLoading(false);
        this.$buefy.toast.open({
          duration: 5000,
          message: msgValidation,
          position: "is-top",
          type: "is-danger",
        });
        return false;
      }
      return true;
    },
    handleSavePassenger(passengers) {
      if (this.disablePaxInfoForm) return;

      if (!this.validateForm(passengers)) {
        return false;
      }
      const TOTAL_STEPS_TO_PERFORM = 1;
      const payload = {
        id_itinerary: this.info.itinerary.data.id,
        data: passengers,
        cur_step: TOTAL_STEPS_TO_PERFORM,
        last_step: TOTAL_STEPS_TO_PERFORM,
      };
      this.$store
        .dispatch("itinerary/save_passenger", payload)
        .then((response) => {
          this.toggleLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message: response.message,
            position: "is-top",
            type: "is-success",
          });
        })
        .catch((error) => {
          this.toggleLoading(false);
          var validations = "";
          if (typeof error.response.data.errors !== "undefined") {
            error.response.data.errors.forEach((response_each) => {
              validations += response_each.errors.first_name
                ? response_each.errors.first_name + "</br>"
                : "";
              validations += response_each.errors.last_name
                ? response_each.errors.last_name + "</br>"
                : "";
              validations += response_each.errors.email
                ? response_each.errors.email + "</br>"
                : "";
              validations += response_each.errors.phone
                ? response_each.errors.phone + "</br>"
                : "";
              validations += response_each.errors.passport_number
                ? response_each.errors.passport_number + "</br>"
                : "";
              validations += response_each.errors.passport_expiration
                ? response_each.errors.passport_expiration + "</br>"
                : "";
            });
          } else {
            validations += error.response.data.message;
          }
          this.$buefy.toast.open({
            duration: 5000,
            message: validations,
            position: "is-top",
            type: "is-danger",
          });
        });
    },
    async loadItineraryByRouteQuery() {
      this.toggleLoading(true);
      await this.loadItinerary();
      await this.loadPublishedItinerary();
      await this.loadDataPassengersWithLoading(
        this.$route.query.itinerary,
        true
      );
      this.toggleLoading(false);
    },
    isEqualObjects(obj1, obj2, keysToCompare) {
      const isEqual = keysToCompare.every((key) => {
        if (obj1 === undefined || obj2 === undefined) return true;
        return obj1[key] === obj2[key];
      });
      return isEqual;
    },
    checkPaxInfoFormIsModified() {
      const keysToCompare = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "gender",
        "passport_number",
        "passport_expiration",
        "birthdate",
        "note",
        "emergency_phone",
        "emergency_name",
      ];
      return !this.dataPassengers.every((passenger, index) => {
        return this.isEqualObjects(
          passenger,
          this.passengersItineraries[index],
          keysToCompare
        );
      });
    },
    async loadItineraryVersion(itineraryId) {
      this.setLoading(true);
      if (!this.itinerary?.data?.id) {
        await this.$store.dispatch("itinerary/getItineraryVersion", {
          itineraryId: itineraryId,
          version: this.historyView.version,
        });
      }
      this.setLoading(false);
    },
  },
  beforeRouteLeave(to, from, next) {
    const isModified = this.checkPaxInfoFormIsModified();
    if (isModified && this.nextView === null) {
      this.nextView = to;
      this.toggleModalPreventExitPaxInfo(true);
    } else {
      this.nextView = null;
      next();
    }
  },
  beforeMount() {
    this.$store.dispatch("utils/setHistoryView");
    if (this.historyView.isActive) {
      return this.loadItineraryVersion(this.$route.query.itinerary);
    } else if (this.$route.query.itinerary && !this.info.itinerary.data) {
      this.loadItineraryByRouteQuery();
    } else if (!this.$route.query.itinerary && this.info.itinerary.data) {
      this.loadDataPassengersWithLoading(this.info.itinerary.data.id, true);
      this.$router.push({
        path: PATH_INFO.PAX_INFO.path,
        query: { itinerary: this.info.itinerary.data.id },
      });
    } else if (this.$route.query.itinerary && this.info.itinerary.data) {
      this.loadDataPassengersWithLoading(this.$route.query.itinerary, true);
    } else {
      // redirect to home when don't have itineray uuid in query
      console.log("No information");
      this.$router.push({
        path: PATH_INFO.HOME.path,
      });
    }
  },
};
</script>
