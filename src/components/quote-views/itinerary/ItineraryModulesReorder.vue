<template>
  <div
    class="px-4 itinerary__days__container"
    :is-total-template-active="isModuleGrouped"
  >
    <header>
      <h3>Current Itinerary</h3>
      <span>{{ updatedItineraryDays.length }} days</span>
    </header>

    <!-- MERGE LOGIC DISABLED TEMPORARILY -->

    <!-- <div
      class="is-flex is-justify-content-flex-end gap-2 mb-2 top__tabs__buttons"
    >
      <b-button
        @click="() => updateIsMergeDaysTabActive(false)"
        :class="`${!isMergeDaysTabActive ? 'active' : ''}`"
      >
        Reorder days
      </b-button>
      <b-button
        @click="() => updateIsMergeDaysTabActive(true)"
        :class="`${isMergeDaysTabActive ? 'active' : ''}`"
        :disabled="isModuleGrouped"
      >
        Merge days
      </b-button>
    </div> -->

    <!-- <section
      v-if="isMergeDaysTabActive"
      :class="`merging__section DraggableBox${isDragging ? ' is__dragging' : ''}`"
    >
      <div
        v-for="(item, index) in updatedItineraryDays"
        :key="item.id"
        class="box__container"
      >
        <ModuleCard v-if="item.isModule" :module="item" :highlight="true"/>
        <div v-else>
          <p
            style="
              text-align: left;
              font-weight: 600;
              position: absolute;
              top: 0.5rem;
              left: 1.2rem;
            "
          >
            Day {{ index + 1 }}
          </p>
          <draggable
            v-model="item.nestedDays"
            group="people"
            v-bind="dragOptions"
            class="nested__days__drag_container"
            @start="onDragStart"
            @end="onDragEnd"
          >
            <ItineraryModuleDay
              v-for="nestedDay in item.nestedDays"
              :key="nestedDay.id"
              :day="nestedDay"
            />
          </draggable>
          <b-button
            v-if="item.nestedDays.length === 0"
            class="remove__button pl-4 pr-2"
            type="button-saas is-danger border-radius-4"
            size="is-small"
            @click="() => removeDayByIndex(index)"
          >
            <IconTrash class="icon is-small" />
            <span class="ml-2">Remove day</span>
          </b-button>
        </div>
      </div>
      <ItineraryModulePlaceholder :addItemAtTheEnd="addItemAtTheEnd" :dragOptions="dragOptions"/>
    </section> -->

    <draggable
      :class="`reorder__days__container DraggableBox${
        isDragging ? ' is__dragging' : ''
      }`"
      :list="updatedItineraryDays"
      @start="onDragStart"
      @end="(event) => onDragEnd(event)"
      @change="validateChange"
      v-bind="dragOptions"
      group="people"
    >
      <div
        v-for="item in updatedItineraryDays"
        :key="item.id"
        :class="getItineraryItemClass(item)"
      >
        <ModuleCard
          v-if="item.isModule"
          :module="item"
          :highlight="true"
          :startDay="item.start_day"
          :endDay="item.end_day"
        />
        <ItineraryReorderCard v-else :item="item" :startDay="item.start_day" />
      </div>
      <ItineraryModulePlaceholder
        :addItemAtTheEnd="addItemAtTheEnd"
        :dragOptions="dragOptions"
      />
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import ItineraryReorderCard from "@/components/quote-views/itinerary/ItineraryReorderCard.vue";
import ItineraryModulePlaceholder from "@/components/quote-views/itinerary/ItineraryModulePlaceholder.vue";
import ModuleCard from "@/components/quote-views/itinerary/ModuleCard.vue";
import { helpers as modulesHelpersFromUtils } from "@/utils/modules";
import { dayHelpers } from "@/utils/day";

export default {
  name: "ItineraryModulesReorder",
  components: {
    ItineraryReorderCard,
    ItineraryModulePlaceholder,
    ModuleCard,
    draggable,
  },
  props: {
    daysForRemoving: {
      type: Array,
      default: () => [],
    },
    isModuleGrouped: {
      type: Boolean,
      default: false,
    },
    updatedItineraryDays: {
      type: Array,
      default: () => [],
    },
    dragOptions: {
      type: Object,
      default: () => {},
    },
    isMergeDaysTabActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      helper: { ...modulesHelpersFromUtils, ...dayHelpers },
      isDragging: false,
    };
  },
  methods: {
    getItineraryItemClass(day = {}) {
      const fixedClasses = "box__container";
      const highlightClass = day.isTemplateDay ? "highlight" : "";
      return `${fixedClasses} ${highlightClass}`;
    },
    validateChange() {
      const updatedItemsByNumDay =
        modulesHelpersFromUtils.getItineraryItemsWithUpdatedNumDay(
          this.updatedItineraryDays
        );
      this.$emit("update:updatedItineraryDays", updatedItemsByNumDay);
    },
    updateIsMergeDaysTabActive(newValue = false) {
      this.$emit("update:isMergeDaysTabActive", newValue);
    },
    removeDayByIndex(index) {
      const newValue = [...this.updatedItineraryDays];
      newValue.splice(index, 1);
      this.$emit("update:daysForRemoving", [
        ...this.daysForRemoving,
        this.updatedItineraryDays[index],
      ]);
      this.$emit("update:updatedItineraryDays", newValue);
    },
    onDragStart() {
      this.isDragging = true;
    },
    onDragEnd() {
      this.isDragging = false;
    },
    addItemAtTheEnd(event) {
      const itemToAddAtTheEnd = event?.added?.element;
      const updatedItineraryItems = [
        ...this.updatedItineraryDays,
        itemToAddAtTheEnd,
      ];
      const updatedItemsByNumDay =
        modulesHelpersFromUtils.getItineraryItemsWithUpdatedNumDay(
          updatedItineraryItems
        );
      this.$emit("update:updatedItineraryDays", updatedItemsByNumDay);
    },
  },
};
</script>
<style>
.modules_container main .itineraryReorderDayCard {
  margin-bottom: 0.5rem !important;
  box-shadow: none;
}
.modules_container main .itineraryReorderDayHeader {
  text-align: left;
}
.modules_container main > div:nth-of-type(1) .itineraryReorderDayHeader {
  background-color: #eeeeee;
}
.modules_container main .itineraryReorderDayHeader .title.is-5 {
  font-size: 1rem;
}
.modules_container main .itineraryReorderDayHeader .subtitle.is-6 {
  font-size: 0.8rem;
}
.modules_container main .itineraryReorderDayHeader .card-header-icon {
  padding: 0;
}
.modules_container main .card_secondary .itineraryReorderDayHeader,
.modules_container main .card_secondary .card-content.pt-0 {
  cursor: grab !important;
}
.itinerary__days__container {
  width: 50%;
  max-height: 100%;
}
.itinerary__days__container header {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c7c7c;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 0.5rem;
}
.modules_container main > div > header > h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c7c7c;
  display: inline-flex;
}
.modules_container main > div > header > span {
  float: right;
  font-weight: 800;
  font-size: 0.8rem;
  color: #101920;
}
.itinerary__days__container .DraggableBox {
  overflow-y: auto;
  overflow-x: hidden;
  height: 98%;
  padding: 1rem;
  border: 1px dashed #d9d9d9;
  border-radius: 1rem;
}
.itinerary__days__container .DraggableBox .sortable-chosen.ghost {
  opacity: 0.1;
  position: relative;
}
.modules_container
  .itinerary__days__container
  .DraggableBox
  .sortable-chosen.ghost::after {
  content: "";
  display: block;
  position: absolute;
  top: 0rem;
  left: 0;
  width: 31.5rem;
  height: 90%;
  background-color: #101920;
  border-radius: 1rem;
}
.itinerary__days__container[is-total-template-active="true"]
  .DraggableBox
  .sortable-chosen.ghost::after {
  width: 22rem;
  height: 7rem;
  margin: 0rem !important;
  background-color: #0191ff;
}
.group1 {
  border: 1px solid #d9d9d9;
  width: auto;
  padding: 0.5rem 0.5rem 0rem;
  border-radius: 0.75rem;
  margin: 0.75rem 0;
  transition: padding 0.2s ease;
}
.group1 .itineraryReorderDayCard {
  border: none;
}
.group1 .itineraryReorderDayHeader {
  padding: 1rem 1.5rem 0.5rem;
}
.group1 .drag-handle {
  cursor: grab;
}
.group1 .drag_container {
  min-height: 3rem;
  /* display: none; */
}
.group1.sortable-ghost {
  border: none;
  padding: 0.25rem 0 0;
}
.group1.sortable-ghost .drag-handle {
  padding: 0;
}
.group1.sortable-ghost .drag_container {
  min-height: 0rem;
}
.group1.sortable-ghost .itineraryReorderDayCard {
  border: 1px solid #d9d9d9;
}
.group1.sortable-ghost .itineraryReorderDayHeader {
  padding: 0.5rem 1rem;
}
.group1 .group2 {
  border-radius: 0.75rem;
  padding: 0;
  overflow: hidden;
}
.group2.sortable-ghost .itineraryReorderDayCard {
  border: 1px solid #d9d9d9;
  border-radius: 0.75rem;
}
.DraggableBox > .group2.sortable-chosen.ghost {
  border: none;
  border-radius: 0.75rem;
  width: 22rem;
}
.box__container {
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  position: relative;
}
.itinerary__days__container .box__container {
  margin: 1rem 0;
}
.itinerary__days__container .box__container:first-child {
  margin-top: 0;
}

.itinerary__days__container .box__container.highlight {
  background-color: #fefeda;
}
.nested__day {
  border: 1px solid #d9d9d9;
  box-shadow: 0 0 0 2px #d9d9d900;
  padding: 1rem 0.5rem;
  border-radius: 0.5rem;
  position: relative;
  transition: box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}
.is__dragging .nested__day.sortable-chosen {
  /* padding: 1rem 0.5rem; */
}
.is__dragging .box__container:not(.sortable-chosen) {
  display: block;
  border-color: #f00b81;
  box-shadow: 0 0 5px 0px #f00b8150;
}
.nested__days__drag_container {
  /* border: 1px solid #d9d9d9; */
  border-radius: 0.75rem;
  padding: 2rem 1rem 1rem 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;
}
.merging__section .nested__days__drag_container {
  border: 1px solid #d9d9d9;
}
.box__container .remove__button {
  color: #fff;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
.is__dragging .box__container .remove__button {
  display: none;
}

.is__dragging .nested__days__drag_container {
}
.is__dragging .nested__days {
}
.nested__days__drag_container[draggable="false"] {
  /* border: 1px solid #d9d9d900; */
}
.itinerary__days__container .tabs {
  margin-top: 1rem;
  justify-content: flex-end;
}
.itinerary__days__container .b-tabs .tab-content {
  padding: 0 !important;
}
.itinerary__days__container .tabs ul {
  justify-content: flex-end;
}
.itinerary__days__container
  .tabs
  ul
  :is(li.is-active, li.is-active span, li.is-active:hover, li.is-active:hover
    span) {
  background-color: var(--info-color);
  color: #fff;
  border-radius: 0.5rem;
}
.top__tabs__buttons .active {
  background-color: var(--info-color);
  color: #fff;
}
.reorder__days__container .box__container {
  background-color: #f7f7f7;
}
.nested__days__drag_container.is__reordering {
  background-color: #f7f7f7;
}
</style>
