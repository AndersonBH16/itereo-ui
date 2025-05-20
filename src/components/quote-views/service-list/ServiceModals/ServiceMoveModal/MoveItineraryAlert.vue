<template>
  <b-modal
    v-model="isOpen"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Modal"
    aria-modal
    @close="isOpen = false"
    v-bind="$attrs"
  >
    <div class="service_move_massive_modal udpate_itinerary_modal">
      <GlobalEvents @keydown.enter="keymap" @keydown.49="keymap" />
      <header style="width: 100%">
        <h1>Do you want to update itinerary dates as well?</h1>
        <p style="width: 100%; text-align: left" class="mt-4">
          <span class="has-text-weight-bold">Tip</span>: Press 1 to move only
          services
        </p>
      </header>
      <main>
        <p style="width: 100%; text-align: left" class="my-4">
          New itinerary dates would be from
          <strong>{{ newItineraryDatesFixed.start_date }}</strong> to
          <strong>{{ newItineraryDatesFixed.end_date }}</strong>
        </p>
      </main>
      <footer class="is-flex">
        <BaseButton action="secondary" @click="moveAllServices">
          <p slot="text">No, move only services</p>
        </BaseButton>
        <BaseButton
          action="principal"
          @click="moveItinerary"
          :idElement="'confirmButton'"
        >
          <p slot="text">Yes, move itinerary and services</p>
        </BaseButton>
      </footer>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { datesHelper } from "@/utils/dates";
import GlobalEvents from "vue-global-events";
import { KEYBOARD_KEYS } from "@/constants/shortcuts";
import { SERVICE_ROW_FIELDS } from "@/constants/services";

export default {
  name: "MoveItineraryAlert",
  components: { GlobalEvents },
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    moveAllServices: {
      type: Function,
      default: () => {},
    },
    getServiceChunks: {
      type: Function,
      default: () => {},
    },
    isAvailableToEnter: {
      type: Boolean,
      default: false,
    },
    closeIsModalOpen: {
      type: Function,
      default: () => {},
    },
    serviceEdited: {
      type: Object,
      default: () => {},
    },
    getDiffDays: {
      type: Function,
      default: () => {},
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      newItineraryDatesFixed: {},
    };
  },
  computed: {
    ...mapGetters({
      formItinerary: "itinerary/getFormItinerary",
      itinerary: "itinerary/getItinerary",
      itineraryServices: "itinerary/getServicesItinerary",
    }),
    newItineraryDates() {
      if (this.serviceEdited === null || !this.isModalOpen)
        return {
          start_date: null,
          end_date: null,
        };
      const daysToMove = this.getDiffDays(this.serviceEdited);
      return {
        start_date: datesHelper.getDateWithAddedDays(
          this.serviceEdited.previousValue,
          daysToMove
        ),
        end_date: datesHelper.getDateWithAddedDays(
          this.itinerary.data.end_date,
          daysToMove
        ),
      };
    },
    isOpen: {
      get() {
        return this.isModalOpen;
      },
      set(newValue) {
        this.$emit("update:isModalOpen", newValue);
      },
    },
  },
  watch: {
    isModalOpen(newValue) {
      if (!newValue) return;
      this.newItineraryDatesFixed = this.newItineraryDates;
    },
  },
  methods: {
    keymap(e) {
      if (!this.isModalOpen) return;
      const code = e.which || e.keyCode;
      if (code === KEYBOARD_KEYS.NUM_1) this.moveAllServices();
      if (code === KEYBOARD_KEYS.ENTER && this.isAvailableToEnter)
        this.moveItinerary();
    },
    async updateItineraryDays(cur_step = 0, last_step = 0) {
      const response = await this.$store.dispatch(
        "itineraryDays/updateItineraryDays",
        {
          data: { itinerary_uuid: this.$route.query.itinerary },
          cur_step,
          last_step,
        }
      );
      return response;
    },
    async moveItinerary() {
      try {
        this.setLoading(true);
        await this.$store.dispatch("itinerary/udpateFormItineraryByKey", {
          key: SERVICE_ROW_FIELDS.START_DATE,
          value: this.newItineraryDatesFixed.start_date,
        });
        await this.$store.dispatch("itinerary/udpateFormItineraryByKey", {
          key: SERVICE_ROW_FIELDS.END_DATE,
          value: this.newItineraryDatesFixed.end_date,
        });
        const TOTAL_STEPS_TO_PERFORM =
          3 + this.getServiceChunks(this.itineraryServices).chunks.length;
        await this.$store.dispatch("itinerary/update", {
          ...this.formItinerary[0],
          cur_step: 1,
          last_step: TOTAL_STEPS_TO_PERFORM,
        });
        await this.moveAllServices(false, 2, TOTAL_STEPS_TO_PERFORM);
        await this.updateItineraryDays(
          TOTAL_STEPS_TO_PERFORM,
          TOTAL_STEPS_TO_PERFORM
        );
        this.closeIsModalOpen();
        this.$buefy.toast.open({
          duration: 5000,
          message: "Changes saved successfully",
          position: "is-top",
          type: "is-success",
        });
        this.setLoading(false);
      } catch (error) {
        this.closeIsModalOpen();
        this.$buefy.toast.open({
          duration: 5000,
          message: error?.response?.data?.message
            ? error.response.data.message
            : "Can't update the itinerary, please try again",
          position: "is-top",
          type: "is-danger",
        });
        this.setLoading(false);
        throw error;
      }
    },
  },
};
</script>
<style scoped>
.udpate_itinerary_modal {
  height: 13rem;
  width: 36rem;
}
.udpate_itinerary_modal.service_move_massive_modal main {
  min-height: auto;
}
</style>
