<template>
  <b-tab-item label="PAX ASSIGNED">
    <div class="notification is-info is-light has-text-centered">
      Please select the passenger(s) that will assigned in this service.
    </div>
    <p>
      Go to
      <router-link
        :to="{ path: paths.PAX_INFO.path }"
        class="underline color-1 has-text-weight-semibold"
        >Paxs info</router-link
      >
      to change all the information of passenger(s)
    </p>

    <div
      v-if="isAccommodationOrPackageService"
      class="py-5"
      style="
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1rem;
      "
      :disabled="hideElementByCondition || disableQuoteByStatus"
    >
      <PaxAssignRoom
        v-for="room in roomsSelected"
        :key="room.romm_id"
        :room="room"
        :passengers="passengerOptions"
        :udpateRoomPassengers="udpateRoomPassengers"
        :saveRoom="saveRoom"
        :service_price="formItineraryService.service_price"
      />
    </div>

    <div
      v-else
      class="columns is-multiline is-desktop mt-3 mx-0 EditServiceSideBarBox"
      :disabled="hideElementByCondition || disableQuoteByStatus"
    >
      <div
        v-for="(passenger, index) in passengers"
        :key="index"
        class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen is-half-fullhd has-mobile-cards"
      >
        <div class="card">
          <div class="card-content">
            <div class="content">
              <b-checkbox
                v-model="passengersSelected"
                :native-value="passenger.id"
              >
                <p class="title is-5">
                  {{ passenger.first_name + " " + passenger.last_name }}
                </p>
                <p class="subtitle is-6">
                  {{
                    "Nro. " + passenger.passport_number + " " + passenger.email
                  }}
                </p>
              </b-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-field v-if="0">
      <b-switch
        class="v-middle color-2 mr-0"
        v-model="isSwitched"
        v-on:input="handledToggleSwitch"
      >
        <p class="mt-2 color-11">Apply the passenger(s) to all Services.</p>
      </b-switch>
    </b-field>
  </b-tab-item>
</template>

<script>
import { mapGetters } from "vuex";
import { serviceHelper } from "@/utils/service";
import PaxAssignRoom from "@/components/quote-views/service-list/EditServiceSidebar/PaxAssignRoom.vue";
import { PATH_INFO } from "@/router/path";
import helper from "@/helpers";

export default {
  name: "EditServiceSideBarTabsPaxs",
  components: { PaxAssignRoom },
  data() {
    return {
      isSwitched: false,
      paths: { ...PATH_INFO },
    };
  },
  props: {
    formItineraryService: {
      type: Object,
      default: () => {},
    },
    passengers: {
      type: [Array, Object],
      default: () => [],
    },
    passengerOptions: {
      type: Array,
      default: () => [],
    },
    itinerary: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    roomsSelected: {
      get() {
        const filteredRoomsByQty = this.formItineraryService.room?.filter(
          (room) => room.qty > 0
        );
        return filteredRoomsByQty?.reduce((acc, room) => {
          if (room.qty === 1) return [...acc, { ...room, room_id: room.id }];
          const roomPassengers = JSON.parse(JSON.stringify(room.passengers));
          const roomsByQty = helper
            .getArrayFromNumber(room.qty + 1)
            .map((_, index) => ({
              ...room,
              id: `${room.id}-${index}`,
              room_id: room.id,
              qty: 1,
              passengers:
                roomPassengers?.length > 0
                  ? roomPassengers.splice(0, room.max_passengers)
                  : [],
            }));
          return [...acc, ...roomsByQty];
        }, []);
      },
      set(value) {
        this.$emit("update", ["passengers", value]);
      },
    },
    isAccommodationOrPackageService() {
      return serviceHelper.isAccommodationPackageService(
        this.formItineraryService.id_service_type
      );
    },
    passengersSelected: {
      get() {
        if (!this.formItineraryService.passengers) return [];
        if (Array.isArray(this.formItineraryService.passengers)) {
          return this.formItineraryService.passengers;
        }
        return this.formItineraryService.passengers.slice(1, -1).split(",");
      },
      set(value) {
        const itineraryNumPax = this.itinerary.data.num_pax;
        this.formItineraryService.passengers = value
          .reverse()
          .slice(0, itineraryNumPax)
          .reverse();
      },
    },
  },
  methods: {
    udpateRoomPassengers(passenger, room, adding = false) {
      if (passenger === undefined || room === undefined) return;
      const roomRelated = this.formItineraryService.room?.find(
        (roomOption) => roomOption.id === room.room_id
      );
      const pastPassengers = roomRelated?.passengers || [];
      const newRoom = {
        ...roomRelated,
        passengers: adding
          ? [...pastPassengers, passenger]
          : pastPassengers.filter((p) => p.id !== passenger.id),
      };
      this.saveRoom(newRoom);
    },
    saveRoom(newRoom) {
      const newRooms = this.formItineraryService.room?.map((roomSelected) =>
        roomSelected.id !== newRoom.id ? roomSelected : newRoom
      );
      this.roomsSelected = newRooms;
    },
    handledToggleSwitch() {
      this.$emit("handled-toggle-switch", this.isSwitched);
      this.isSwitched = false;
    },
  },
};
</script>

<style scoped>
.EditServiceSideBarBox :is(.title, .subtitle) {
  margin: 0rem;
}
</style>
