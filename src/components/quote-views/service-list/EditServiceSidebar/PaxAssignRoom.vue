<template>
  <div class="room__box">
    <header>
      <div>
        <h4>{{ room.name }}</h4>
        <span>Max passengers: {{ room.qty * room.max_passengers }}</span>
      </div>
      <b-select
        v-if="isAvailableToAddPaxs"
        size="is-small"
        expanded
        class="passengers__select"
        :disabled="!passengers.length"
        placeholder="Select passengers"
        @input="udpateRoomPassengers($event, room, true)"
      >
        <option
          v-for="passenger in passengers"
          :key="passenger.id"
          :value="passenger"
        >
          {{ passenger.first_name }}
        </option>
      </b-select>
      <IconCheckCircle
        v-else
        style="height: 2rem; width: 2rem; color: #61a609"
      />
    </header>
    <footer v-if="room.passengers" class="mt-2">
      <div v-for="passenger in room.passengers" :key="passenger.id">
        <TextWithHoverDetail :message="passenger.email">
          <template #baseText>
            <IconPax style="width: 0.8rem" /> {{ passenger.first_name }}
          </template>
        </TextWithHoverDetail>
        <span @click="udpateRoomPassengers(passenger, room)">
          <IconClose class="mt-1" style="width: 0.8rem; cursor: pointer" />
        </span>
      </div>
    </footer>
  </div>
</template>
<script>
import TextWithHoverDetail from "@/components/_shared/TextWithHoverDetail.vue";

export default {
  name: "PaxAssignRoom",
  components: {
    TextWithHoverDetail,
  },
  props: {
    room: {
      type: Object,
      default: () => {},
    },
    passengers: {
      type: Array,
      default: () => [],
    },
    udpateRoomPassengers: {
      type: Function,
      default: () => {},
    },
    saveRoom: {
      type: Function,
      default: () => {},
    },
    service_price: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    maxRoomPassengers() {
      return this.room.max_passengers * this.room.qty || 0;
    },
    isAvailableToAddPaxs() {
      if ([undefined, null].includes(this.room.passengers)) return true;
      return this.maxRoomPassengers > this.room.passengers?.length;
    },
    isNewRoom() {
      return (
        this.service_price.find((price) => price.romm_id === this.room.id) ===
        undefined
      );
    },
  },
};
</script>
<style scoped>
.room__box {
  background-color: #fff;
  border-radius: 0.6rem;
  padding: 1rem;
  width: 24rem;
  display: flex;
  flex-direction: column;
}
.room__box > header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.room__box > header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #6d6d6d;
}
.room__box > header span {
  font-size: 0.7rem;
  color: #6d6d6d;
}
.room__box > footer > div {
  display: inline-flex;
  background-color: #d9d9d9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  gap: 0.25rem;
  font-size: 0.7rem;
  margin-right: 0.5rem;
}
</style>
