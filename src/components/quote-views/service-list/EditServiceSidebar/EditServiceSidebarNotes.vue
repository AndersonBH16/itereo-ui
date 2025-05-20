<template>
  <div class="notesField">
    <div class="notesField_header">
      <label
        class="mb-3 mt-2 recommendationsTextarea"
        v-if="formItineraryService.notes !== undefined && showServiceNotes"
        >Notes</label
      >
      <span @click="toggleShowServiceNotes" class="">
        {{ showServiceNotes ? "Hide" : "Show" }} notes
      </span>
    </div>
    <vue-editor
      v-if="showServiceNotes && !disableQuoteByStatus"
      id="serviceNotesEditor"
      placeholder="Add notes here"
      :disabled="hideElementByCondition || disableQuoteByStatus"
      :value="formItineraryService.notes.value"
      @input="(value) => emitUpdateForm('notes', preventHTMLEscaping(value))"
    />
    <p
      v-else-if="showServiceNotes && disableQuoteByStatus"
      v-html="formItineraryService.notes.value"
      class="notesField__content"
    ></p>
  </div>
</template>
<script>
import { VueEditor } from "vue2-editor";
import { mapGetters } from "vuex";
import { utilsHelper } from "@/utils/utils";
import { SERVICE_ROW_FIELDS } from "@/constants/services";

export default {
  name: "EditServiceSidebarNotes",
  components: {
    VueEditor,
  },
  props: {
    editServiceSidebarFocusedElement: {
      type: String,
      default: "",
    },
    formItineraryService: {
      type: Object,
      default: () => {},
    },
    emitUpdateForm: {
      type: Function,
      default: () => {},
    },
    preventHTMLEscaping: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      showServiceNotes: false,
    };
  },
  computed: {
    ...mapGetters({
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
  },
  methods: {
    toggleShowServiceNotes() {
      this.showServiceNotes = !this.showServiceNotes;
    },
    validateWhetherOpenServiceNotesOrNot() {
      if (this.editServiceSidebarFocusedElement === SERVICE_ROW_FIELDS.NOTES) {
        this.toggleShowServiceNotes();
        setTimeout(() => {
          utilsHelper.pointCursorAtTheEnd("#serviceNotesEditor .ql-editor");
        }, 1);
      }
    },
  },
  mounted() {
    this.validateWhetherOpenServiceNotesOrNot();
  },
};
</script>
<style scoped>
.notesField__content {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 16rem;
}
</style>
