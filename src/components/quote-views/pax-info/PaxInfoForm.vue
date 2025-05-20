<template>
  <section class="table-box mt-5 p-2 columns is-desktop PaxsInfoForm">
    <GlobalEvents
      @keydown.alt.78="keymap"
      @keydown.alt.83="keymap"
      @keydown.alt.39="keymap"
      @keydown.alt.37="keymap"
      @keydown.46="keymap"
      @keydown.shift.219="keymap"
    />
    <div class="column">
      <div v-if="!hideElementByCondition">
        <div class="export_save_button__container">
          <BaseButton
            size="medium"
            @click="handleSavePassenger(formDataPassengers)"
            :disabled="disablePaxInfoForm"
            action="tercery"
            class="is-pulled-right"
          >
            <i slot="icon">
              <BaseButtonLock v-if="disablePaxInfoForm" class="icon-check" />
              <IconCheck v-else class="icon is-small" />
            </i>
            <p slot="text">Save</p>
          </BaseButton>
        </div>
        <BaseButton
          size="medium"
          @click="addTabPassenger"
          :disabled="disableQuoteByStatus || hideElementByCondition"
          action="principal"
          class="is-pulled-right mr-4 pax_form_new__button"
        >
          <i slot="icon">
            <IconPlus v-if="itineraryStatus === 1" class="icon is-small" />
            <BaseButtonLock
              v-if="disableQuoteByStatus || hideElementByCondition"
              class="icon-check"
            />
          </i>
          <p slot="text">New pax</p>
        </BaseButton>
      </div>
      <b-tabs
        v-model="passengersActiveTab"
        :multiline="multiline"
        v-if="formDataPassengers.length > 0"
      >
        <template v-for="(passenger, index) in formDataPassengers">
          <b-tab-item
            :key="passenger.key"
            :value="passenger.key"
            :label="index < 9 ? 'PAX 0' + (index + 1) : 'PAX ' + (index + 1)"
          >
            <div class="columns is-variable is-6">
              <div class="column">
                <BaseInput
                  type="text"
                  placeholder="First Name"
                  v-model="passenger.first_name"
                  label="First Name *"
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
              <div class="column">
                <BaseInput
                  type="text"
                  placeholder="Last Name"
                  v-model="passenger.last_name"
                  label="Last Name *"
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
              <div class="column">
                <BaseInput
                  type="email"
                  placeholder="@domain.com"
                  v-model="passenger.email"
                  label="Email *"
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
            </div>
            <div class="columns is-variable is-6">
              <div class="column">
                <BaseInput
                  type="number"
                  placeholder="98765-1516"
                  v-model="passenger.phone"
                  label="Phone *"
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
              <div class="column">
                <BaseSelect
                  size="large"
                  :list="[
                    { value: 'Female' },
                    { value: 'Male' },
                    { value: 'Other' },
                  ]"
                  optionValue="value"
                  optionText="value"
                  placeholder="Select a gender"
                  :value="passenger.gender"
                  @input="passenger.gender = $event"
                  label="Gender *"
                  :disabled="disablePaxInfoForm"
                />
              </div>
              <div class="column">
                <BaseInput
                  type="text"
                  placeholder="Passport number"
                  v-model="passenger.passport_number"
                  label="Passport number *"
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
            </div>
            <div class="columns is-variable is-6">
              <div class="column">
                <BaseDatePicker
                  label="Passport expiration *"
                  v-model="passenger.passport_expiration"
                  placeholder="Select date"
                  :disabled="disablePaxInfoForm"
                  :isNotValid="false"
                />
              </div>
              <div class="column">
                <BaseDatePicker
                  label="Birthdate"
                  v-model="passenger.birthdate"
                  placeholder="Select birthdate"
                  :disabled="disablePaxInfoForm"
                  :isNotValid="false"
                />
              </div>
              <div class="column">
                <BaseInput
                  type="text"
                  placeholder="Nationality"
                  v-model="passenger.nationality"
                  label="Nationality"
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
            </div>
            <div class="columns is-variable is-6">
              <div class="column">
                <BaseTextarea
                  size="large"
                  label="Pax note"
                  class="mb-4"
                  :maxlength="200"
                  placeholder="Add the pax note here"
                  v-model="passenger.note.value"
                  :disabled="disablePaxInfoForm"
                />
              </div>
            </div>
            <div class="columns is-variable is-6">
              <div class="column">
                <BaseInput
                  type="text"
                  placeholder="Emergency Phone"
                  v-model="passenger.emergency_phone"
                  label="Emergency Phone "
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
              <div class="column">
                <BaseInput
                  type="text"
                  placeholder="Emergency Name"
                  v-model="passenger.emergency_name"
                  label="Emergency Name "
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
              <div class="column">
                <BaseInput
                  type="text"
                  placeholder="Emergency Last Name"
                  v-model="passenger.emergency_last_name"
                  label="Emergency Last Name"
                  size="large"
                  :disabled="disablePaxInfoForm"
                />
              </div>
            </div>
            <div
              v-if="!hideElementByCondition"
              class="columns is-variable is-6"
            >
              <div class="column"></div>
              <div class="column"></div>
              <div class="column">
                <b-button
                  type="is-danger"
                  class="button mr-2 is-pulled-right"
                  v-bind:icon-right="passenger.id ? 'delete' : ''"
                  v-if="
                    formDataPassengers.length > 1 ||
                    (formDataPassengers.length == 1 && passenger.id)
                  "
                  @click="closeTabPassenger(passenger)"
                  :disabled="disableQuoteByStatus"
                  >{{ passenger.id ? "Delete Pax" : "Cancel" }}</b-button
                >
              </div>
            </div>
          </b-tab-item>
        </template>
      </b-tabs>
      <div
        v-if="!hideElementByCondition"
        class="shortcutLinkContainer paxInfoForm"
      >
        <BaseShortcutLink @click="handleModal" class="shortcutsLink" />
        <BaseModal
          :isComponentModalActive="shortcutsOpen"
          type="shortcuts"
          :shortcuts="shortcuts"
          :closeModal="handleModal"
        >
          <span slot="title">Pax Information keyboard shortcuts </span>
        </BaseModal>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import GlobalEvents from "vue-global-events";
import { paxInfoFormShortcuts as shortcuts } from "@/utils/shortcuts";

export default {
  name: "PaxInfoForm",
  components: {
    GlobalEvents,
  },
  props: {
    dataPassengers: {
      type: Array,
      default: () => [],
    },
    handleSavePassenger: {
      type: Function,
    },
    closeTabPassenger: {
      type: Function,
    },
    disablePaxInfoForm: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const data = [
      {
        client: "ELA",
        paxs: "02",
        contract: "ELA-2020",
        update: "2020-08-27",
        status: "Enabled",
        price: "$3,583",
      },
    ];
    return {
      data,
      showBooks: false,
      multiline: true,
      locale: undefined,
      passengersActiveTab: 0,
      shortcutsOpen: false,
      shortcuts,
      formDataPassengers: this.dataPassengers,
    };
  },
  computed: {
    sampleFormat() {
      const dtf = new Intl.DateTimeFormat(this.locale, { timezome: "UTC" });
      return dtf.format(new Date(2000, 11, 25, 12));
    },
    ...mapGetters({
      passengersItineraries: "itinerary/getPassengersItineraries",
      numPax: "itinerary/getNumPax",
      itineraryStatus: "itinerary/getItineraryStatus",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
  },
  methods: {
    handleModal() {
      this.shortcutsOpen = !this.shortcutsOpen;
    },
    keymap(e) {
      e = e || window.event;
      const code = e.which || e.keyCode;
      switch (code) {
        case 37:
        case 39:
        case 46:
        case 83:
        case 78:
        case 219:
          e.preventDefault();
          e.stopPropagation();
          break;
      }
      if (code === 78) {
        this.addTabPassenger();
      } else if (code === 83) {
        this.handleSavePassenger(this.formDataPassengers);
      } else if (code === 39) {
        if (this.passengersActiveTab < this.formDataPassengers.length) {
          this.passengersActiveTab++;
        }
      } else if (code === 37) {
        if (this.passengersActiveTab > 0) {
          this.passengersActiveTab--;
        }
      } else if (code === 46) {
        const passenger = this.formDataPassengers[this.passengersActiveTab];
        this.closeTabPassenger(passenger);
      } else if (code === 219) {
        this.handleModal();
      }
    },
    setPassengersActiveTabLast() {
      this.passengersActiveTab = this.formDataPassengers.length - 1;
    },
    setKeyToEachPassenger(passengers = []) {
      if (!passengers || !Array.isArray(passengers)) return [];
      return passengers.map((passenger, index) => {
        return {
          ...passenger,
          key: (index + 1).toString(),
          passport_expiration: passenger.passport_expiration,
          birthdate: passenger.birthdate,
          status: 1,
        };
      });
    },
    validateCurrentForm(last_passenger, nroPax) {
      let flgErrorField = false;
      let msgValidation = "Pax " + nroPax + ": </br>";
      if (
        last_passenger.first_name == null ||
        last_passenger.first_name == ""
      ) {
        msgValidation += "please fill the field first name </br>";
        flgErrorField = true;
      }
      if (last_passenger.last_name == null || last_passenger.last_name == "") {
        msgValidation += "please fill the field last name </br>";
        flgErrorField = true;
      }
      if (last_passenger.email == null || last_passenger.email == "") {
        msgValidation += "please fill the field email </br>";
        flgErrorField = true;
      }
      if (last_passenger.phone == null || last_passenger.phone == "") {
        msgValidation += "please fill the field phone </br>";
        flgErrorField = true;
      }
      if (
        last_passenger.passport_number == null ||
        last_passenger.passport_number == ""
      ) {
        msgValidation += "please fill the field passport number </br>";
        flgErrorField = true;
      }
      if (
        last_passenger.passport_expiration == null ||
        last_passenger.passport_expiration == ""
      ) {
        msgValidation += "please fill the field passport expiration </br>";
        flgErrorField = true;
      }

      if (flgErrorField) {
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
    addTabPassenger() {
      if (this.disableQuoteByStatus) return;
      if (this.hideElementByCondition) return;

      if (this.formDataPassengers.length === this.numPax) {
        this.$buefy.toast.open({
          duration: 5000,
          message:
            "You reached the passenger limit, please increase the number of passengers of the itinerary",
          position: "is-top",
          type: "is-danger",
        });
        return false;
      }

      if (this.formDataPassengers.length > 0) {
        const last_passenger =
          this.formDataPassengers[this.formDataPassengers.length - 1];
        if (
          !this.validateCurrentForm(
            last_passenger,
            this.formDataPassengers.length
          )
        ) {
          return false;
        }
      }

      const key_passenger = (this.formDataPassengers.length + 1).toString();
      this.formDataPassengers = this.formDataPassengers.concat({
        key: key_passenger,
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "Male",
        passport_number: "",
        passport_expiration: undefined,
        birthdate: undefined,
        note: {
          id: null,
          value: null,
          translate: null,
        },
        emergency_phone: "",
        emergency_name: "",
        emergency_last_name: "",
        nationality: "",
        status: "1",
      });

      this.$nextTick(() => {
        this.setPassengersActiveTabLast();
      });
    },
    loadPassengers(newPassengersData) {
      this.formDataPassengers = this.setKeyToEachPassenger(newPassengersData);
      if (!newPassengersData || newPassengersData.length === 0) {
        this.addTabPassenger();
      } else {
        this.$nextTick(() => {
          this.setPassengersActiveTabLast();
        });
      }
    },
  },
  watch: {
    passengersItineraries(newValue) {
      this.loadPassengers(newValue);
    },
    formDataPassengers(newValue) {
      this.$emit("updatePassengers", newValue);
    },
  },
  mounted() {
    this.loadPassengers(this.passengersItineraries);
  },
};
</script>

<style>
.shortcutLinkContainer.paxInfoForm {
  padding-right: 0.3em;
}

@media screen and (max-width: 480px) {
  .b-tabs .tabs {
    width: 100%;
    margin-top: 1rem;
  }
  .export_save_button__container {
    position: fixed;
    z-index: 1;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding: 1rem;
  }
  .export_save_button__container .field,
  .export_save_button__container button {
    width: 100% !important;
  }
  .PaxsInfoForm {
    margin-top: 0rem !important;
  }
  .pax_form_new__button {
    margin-right: 0rem !important ;
  }
  .b-tabs:not(:last-child) {
    margin-bottom: 0rem !important;
  }
}
</style>
