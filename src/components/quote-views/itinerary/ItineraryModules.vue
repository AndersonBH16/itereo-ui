<template>
  <b-sidebar
    type="is-light"
    :fullheight="true"
    :overlay="true"
    :right="true"
    :can-cancel="['escape']"
    v-if="isAddingModules"
    v-model="isAddingModules"
    class="sidebarRight sidebarSearch"
    ref="sidebarContent"
    @close="
      clearTemplateItineraryDays();
      closeIsAddingModules();
    "
  >
    <div class="is-flex pt-5 pb-2 px-5 space-between align-items-center">
      <a
        @click="
          closeIsAddingModules();
          clearTemplateItineraryDays();
        "
        class="is-flex color-8 align-items-center"
      >
        <IconChevronLeft class="icon is-small mr-2" />
        <div>
          <span class="color-4 has-text-weight-medium is-h2">
            Back Itinerary
          </span>
        </div>
      </a>
      <a
        @click="
          closeIsAddingModules();
          clearTemplateItineraryDays();
        "
        class="color-8 sideBarCloseButton"
      >
        <IconClose class="icon is-small" />
      </a>
    </div>
    <div class="columns p-5 ml-2 modules_container">
      <main>
        <div class="px-4 template__days">
          <header class="mb-5">
            <button
              class="btnSelectTemplate"
              @click="openTemplateSelectModal"
              :is-template-selected="templateSelected !== null"
            >
              {{
                templateSelected === null
                  ? "Select here ..."
                  : templateSelected.bottomText
              }}
            </button>
            <span>{{ moduleFilteredDays.length }} days</span>
            <div>
              <b-switch
                v-model="isModuleGrouped"
                class="color-2 mr-0 is-small"
                v-if="moduleFilteredDays.length > 0"
                :disabled="isMergeDaysTabActive"
              >
                Group
              </b-switch>
            </div>
          </header>
          <draggable
            v-if="moduleFilteredDays.length > 0 && !isModuleGrouped"
            class="DraggableBox"
            :list="moduleFilteredDays"
            :disabled="false"
            v-bind="dragOptions"
            group="people"
            :sort="false"
          >
            <div v-for="(day, index) in moduleFilteredDays" :key="day.id">
              <div v-if="!isMergeDaysTabActive" class="box__container">
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
                <div
                  :class="`nested__days__drag_container ${
                    !isMergeDaysTabActive ? 'is__reordering' : ''
                  }`"
                >
                  <ItineraryModuleDay
                    v-for="nestedDay in day.nestedDays"
                    :key="nestedDay.id"
                    :day="nestedDay"
                  />
                </div>
              </div>
              <ItineraryModuleDay v-else :day="day" />
            </div>
          </draggable>
          <draggable
            v-else-if="isModuleGrouped"
            class="DraggableBox"
            :disabled="false"
            :list="[moduleSelected]"
            v-bind="dragOptions"
            group="people"
            :sort="false"
          >
            <ModuleCard :module="moduleSelected" />
          </draggable>
          <div
            class="template_days_placeholder"
            v-if="!isModuleGrouped && moduleFilteredDays.length === 0"
          >
            <i slot="icon">
              <IconArrowRight class="icon is-small" />
            </i>
            <p>Please select a template</p>
          </div>
        </div>
        <ItineraryModulesReorder
          :isMergeDaysTabActive="isMergeDaysTabActive"
          :daysForRemoving="daysForRemoving"
          :isModuleGrouped="isModuleGrouped"
          :updatedItineraryDays="updatedItineraryDays"
          :dragOptions="dragOptions"
          @update:isMergeDaysTabActive="isMergeDaysTabActive = $event"
          @update:updatedItineraryDays="updatedItineraryDays = $event"
          @update:daysForRemoving="daysForRemoving = $event"
        />
      </main>
      <footer>
        <SelectModal
          :searchPayload="payload"
          :closeSelectModal="closeTemplateSelectModal"
          :isSelectModalActive="isTemplateSelectModalActive"
          :data="formattedTemplates"
          :loadItineraries="loadItineraries"
          :handleClickItem="handleClickItemTemplateSelectModal"
          @update:searchPayload="updateSearchPayload"
        />
        <div class="is-flex justify-content-end btnSaveModules">
          <BaseButton @click="saveDaysReorder" action="tercery">
            <i slot="icon">
              <IconCheck class="icon is-small" />
            </i>
            <span slot="text">Save</span>
          </BaseButton>
        </div>
      </footer>
    </div>
  </b-sidebar>
</template>

<script>
import draggable from "vuedraggable";
import { mapGetters } from "vuex";
import SelectModal from "../../_shared/SelectModal.vue";
import { helpers as modulesHelpersFromUtils } from "@/utils/modules";
import { dayHelpers } from "@/utils/day";
import { serviceHelper } from "@/utils/service";
import ItineraryModulesReorder from "./ItineraryModulesReorder.vue";
import ItineraryModuleDay from "./ItineraryModuleDay.vue";
import ModuleCard from "./ModuleCard.vue";

import { ITINERARY_TYPES } from "@/constants/itinerary";

export default {
  name: "ItineraryModules",
  components: {
    draggable,
    SelectModal,
    ItineraryModulesReorder,
    ItineraryModuleDay,
    ModuleCard,
  },
  props: {
    itineraryDays: {
      type: Array,
      default: () => [],
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    isAddingModules: {
      type: Boolean,
      default: false,
    },
    closeIsAddingModules: {
      type: Function,
      default: () => {},
    },
    loadItineraryDays: {
      type: Function,
      default: () => {},
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    loadPricesItinerary: {
      type: Function,
      default: () => {},
    },
    loadItinerary: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    const testDaysWithNestedDays = this.itineraryDays.map((day) => {
      const nestedDays = [...(day?.nestedDays || []), day];
      return {
        ...day,
        nestedDays: nestedDays,
      };
    });
    return {
      daysForRemoving: [],
      updatedItineraryDays: testDaysWithNestedDays,
      moduleFilteredDays: [],
      isMergeDaysTabActive: false,
      payload: {
        page: 1,
        type: ITINERARY_TYPES.MODULE.id,
        country: "",
        limit: 100,
        code: "",
        tags: [],
      },
      isTemplateSelectModalActive: false,
      isModuleGrouped: false,
      templateSelected: null,
      modulesHelpers: { ...modulesHelpersFromUtils, ...dayHelpers },
      helper: { ...serviceHelper },
    };
  },
  computed: {
    ...mapGetters({
      templateItineraryDays: "itineraryDays/getTemplateItineraryDays",
      itinerary: "itinerary/getItinerary",
      countries: "client/getCountriesFromContract",
      itineraries: "itinerary/getItineraries",
    }),
    templateServices() {
      return this.templateItineraryDays
        .flatMap((day) => day.services)
        .filter(
          (service, index, self) =>
            index ===
            self.findIndex(
              (t) => t.itinerary_service === service.itinerary_service
            )
        );
    },
    formattedTemplates() {
      const data = this.itineraries ? this.itineraries.data : [];
      const dataFiltered = data
        ?.filter((it) => it.location && it.location.length)
        .map((item) => {
          return {
            topText: item.code,
            bottomText: item.title,
            rightText: item.location[0].location_name,
            id: item.id,
          };
        });
      return dataFiltered || [];
    },
    dragOptions() {
      return {
        animation: 200,
      };
    },
    moduleSelected() {
      return {
        id: this.templateSelected?.id,
        isModule: true,
        name: this.templateSelected?.bottomText,
        moduleDays: this.moduleFilteredDays,
        moduleServices: this.templateServices,
      };
    },
  },
  methods: {
    getItineraryDaysToRemove() {
      const daysToRemove = this.itineraryDays.filter((day) => {
        return !this.updatedItineraryDays.find((tDay) => tDay.id === day.id);
      });
      const newDaysForRemoving = [...this.daysForRemoving, ...daysToRemove];
      this.daysForRemoving = Array.from(
        new Set(newDaysForRemoving.map((day) => day.id))
      ).map((dayId) => newDaysForRemoving.find((day) => day.id === dayId));
    },
    setTemplateFilteredDaysTester(initialLoad = false) {
      const initialTemplateDaysIds = this.templateItineraryDays.map(
        (day) => day.id
      );
      const filteredTemplateDays = !initialLoad
        ? this.moduleFilteredDays.filter((day) => {
            return initialTemplateDaysIds.includes(day.id);
          })
        : this.templateItineraryDays;
      const testDaysWithFilteredServices = filteredTemplateDays.map((day) => {
        return {
          ...day,
          isTemplateDay: true,
        };
      });
      const testDaysWithNestedDays = testDaysWithFilteredServices.map((day) => {
        const areNestedDays = day.nestedDays?.length > 0;
        return {
          ...day,
          nestedDays: areNestedDays ? day.nestedDays : [day],
        };
      });
      this.moduleFilteredDays = testDaysWithNestedDays;
    },
    updateSearchPayload(payload) {
      this.payload = payload;
    },
    clearTemplateItineraryDays() {
      this.$store.dispatch("itineraryDays/clearTemplateItineraryDays");
    },
    openTemplateSelectModal() {
      this.isTemplateSelectModalActive = true;
    },
    closeTemplateSelectModal() {
      this.isTemplateSelectModalActive = false;
    },
    async handleClickItemTemplateSelectModal(item) {
      this.templateSelected = item;
      this.isModuleGrouped = true;
      this.closeTemplateSelectModal();
      await this.getTemplateDays();
    },
    async loadItineraries() {
      this.setLoading(true);
      const payload = {
        ...this.payload,
        tags: this.payload.formattedTags,
      };
      await this.$store.dispatch("itinerary/list", payload);
      this.setLoading(false);
    },
    async getTemplateDays() {
      if (this.templateSelected === null) return;
      this.setLoading(true);
      await this.$store.dispatch("itineraryDays/getItineraryDays", {
        uuid: this.templateSelected.id,
        type: ITINERARY_TYPES.MODULE.id,
      });
      this.setTemplateFilteredDaysTester(true);
      this.setLoading(false);
    },
    async removeDays(daysToRemove, cur_step = 0, last_step = 0) {
      const fetchArray = daysToRemove.map((day) =>
        this.removeDay(day, cur_step, last_step)
      );
      await Promise.all(fetchArray).finally();
    },
    async removeDay(day, cur_step = 0, last_step = 0) {
      const uuid = this.$route.query.itinerary;
      const id = day.id;
      const payload = { uuid, id, cur_step, last_step };
      await this.$store.dispatch("itineraryDays/deleteItineraryDays", payload);
    },
    getDaysForRemoving(days) {
      const filteredDays = days.filter((day) => day?.nestedDays?.length > 0);
      const daysForRemoving = filteredDays.flatMap((day) => day?.nestedDays);
      const daysForRemovingFiltered = this.itineraryDays.filter((iDay) => {
        const itineraryDayFound = daysForRemoving.find(
          (rDay) => rDay.id === iDay.id
        );
        if (itineraryDayFound === undefined) return iDay;
      });
      return daysForRemovingFiltered;
    },
    getUngroupedModuleDays(itineraryItems = []) {
      return itineraryItems.reduce((acc, item) => {
        if (item.isModule) {
          const moduleDays = item.moduleDays || [];
          return [
            ...acc,
            ...moduleDays.map((day) => ({
              ...day,
              nestedDays: [day] || [],
            })),
          ];
        }
        return [...acc, item];
      }, []);
    },
    async saveDaysReorder() {
      try {
        this.closeIsAddingModules();
        this.setLoading(true);
        const itineraryItemsUngrouped = this.getUngroupedModuleDays(
          this.updatedItineraryDays
        );
        const daysForRemoving = this.getDaysForRemoving(
          itineraryItemsUngrouped
        );
        const TOTAL_STEPS_TO_PERFORM = daysForRemoving.length + 1;
        await this.removeDays(daysForRemoving, 1, TOTAL_STEPS_TO_PERFORM);
        const payload = {
          uuid: this.$route.query.itinerary,
          data: itineraryItemsUngrouped,
          cur_step: TOTAL_STEPS_TO_PERFORM,
          last_step: TOTAL_STEPS_TO_PERFORM,
        };
        await this.$store.dispatch("itineraryDays/mergeItineraryDays", payload);
        await this.loadServicesItinerary(true);
        await Promise.allSettled([
          this.loadItineraryDays(true),
          this.loadPricesItinerary(true),
          this.loadItinerary(null, true),
        ]);
        this.clearTemplateItineraryDays();
        this.setLoading(false);
      } catch (error) {
        this.setLoading(false);
        console.console.error("Error", error);
        return this.$buefy.toast.open({
          duration: 5000,
          message: "Ups!, merge couldn´t be done. Please try again later",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
  },
  mounted() {
    this.loadItineraries();
  },
};
</script>
<style>
.modules_container {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  text-align: center;
  gap: 1rem;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.modules_container > footer {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  padding: 1rem;
  justify-content: flex-end;
  align-items: center;
}
.modules_container .btnSelectTemplate {
  background-color: #eeeeee;
  color: #6d6d6d;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: left;
  padding: 0.25rem 1rem;
  width: fit-content;
  max-width: 85%;
  border-radius: 0.5rem;
  border: none;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.modules_container .btnSelectTemplate[is-template-selected="true"] {
  color: #f00b81;
}
.modules_container main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  height: 90%;
}
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
.modules_container main > div:nth-of-type(1) {
  width: 50%;
}
.modules_container main > div:nth-of-type(2) {
  width: 50%;
  max-height: 100%;
}
.modules_container main > div:nth-of-type(1) > header,
.modules_container main > div:nth-of-type(2) > header {
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
.modules_container main > div:nth-of-type(1) > header > div {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}
.modules_container .template_days_placeholder {
  width: 100%;
  margin-top: 5rem;
  text-align: center;
}
.modules_container .template_days_placeholder svg {
  transform: rotate(-90deg);
  margin-bottom: 1rem;
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
.modules_container
  main
  > div:nth-of-type(1)
  .card_secondary.sortable-chosen.ghost
  .itineraryReorderDayHeader {
  background-color: #fdffbc;
}
.modules_container main > div:nth-of-type(1) .DraggableBox {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding: 0 0 2rem 0;
}
.templateDays_container {
  background-color: #d9d9d9;
  padding: 0 0.5rem 1.5rem 0.5rem;
  border-radius: 0.5rem;
}
.templateDays_container > button {
  width: 100%;
  padding: 0.5rem 0;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: #d9d9d9;
  font-weight: 800;
  cursor: grab;
}
.templateDays_container .column {
  padding-bottom: 0rem !important;
}
.templateDays_container
  .column
  .itineraryReorderDayCard#itineraryReorderDayCard {
  margin-bottom: 0rem !important;
  border-left: 0rem;
}
.templateDays_container .column .itineraryReorderDayHeader {
  border-radius: 0.5rem !important;
}
.modules_container .templateDays_container[draggable="true"] {
  height: 7.8rem;
  overflow: hidden;
  margin-top: 0.5rem;
  transition: height 0.3s ease;
}
.group1 {
  border: 1px solid #d9d9d9;
  width: auto;
  padding: 0.5rem 0.5rem 0rem;
  border-radius: 0.75rem;
  margin: 2rem 0;
  transition: padding 0.2s ease;
  position: relative;
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
/* .group1 .drag_container {
  min-height: 3rem;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(255, 0, 0, 0.185);
  display: block;
} */
.is__dragging .group1 .drag_container {
}
.group1.sortable-ghost {
  border: none;
  padding: 0.25rem 0 0;
  margin: 0;
}
.group1.sortable-ghost .drag-handle {
  padding: 0;
}
.group1.sortable-ghost .drag_container {
  min-height: 0rem;
  background-color: blue;
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
.template__days .DraggableBox > div {
  margin-top: 1rem;
}
</style>
