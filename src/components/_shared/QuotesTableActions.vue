<template>
  <div>
    <b-button
      @click="() => setIsActive(!isActive)"
      icon-left="menu"
      class="PopoverActionsButton"
    />
    <b-message
      ref="popup"
      class="PopoverActions"
      title="Choose an Action"
      v-model="isActive"
      aria-close-label="Close message"
    >
      <div>
        <a @click.prevent="handleDuplicate" href="" :disabled="loading">
          <IconDuplicate class="icon color-8 is-xsmall" />
          Duplicate</a
        >
      </div>
      <div v-if="canDelete">
        <a
          @click.prevent="handleDelete"
          href=""
          :disabled="loading || data.status.id !== 1"
        >
          <IconTrash class="icon color-8 is-xsmall" /> Delete</a
        >
      </div>
      <div>
        <a href=""> <IconExport class="icon color-8 is-xsmall" /> Export</a>
      </div>
    </b-message>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";
import { PATH_INFO } from "@/router/path";
import { DATE_FORMAT_YYYY_MM_DD } from "@/constants";

export default {
  name: "QuotesTableActions",
  components: {},
  data() {
    return {
      isActive: false,
    };
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      authData: "auth/getAuthData",
    }),
    canDelete() {
      const authUser = this.authData.user;
      return this.data.owner?.id === authUser.id;
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    payload: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) this.setLoadingText("Loading content, please wait...");
    },
    setLoadingText(value = "") {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    async duplicateItinerary(data) {
      const payload = {
        code: data.code,
        uuid: data.id,
        start_date: format(data.start_date, DATE_FORMAT_YYYY_MM_DD),
        name: data.name,
        onlyDuplicate: true,
      };
      this.setLoading(true);
      this.setIsActive(false);
      const response = await this.$store.dispatch(
        "itinerary/duplicate",
        payload
      );
      this.$buefy.toast.open({
        duration: 5000,
        message: response.message,
        position: "is-top",
        type: "is-success",
      });
      this.$router.push({
        path: PATH_INFO.BASIC_INFO.path,
        query: { itinerary: response.itinerary },
      });
      this.setLoading(false);
    },
    async handleDuplicate() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          return await this.duplicateItinerary(this.data);
        },
        functionToExecuteOnFail: async (error) => {
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message:
              "Error trying to duplicate the itinerary, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });
    },
    handleDelete() {
      this.setIsActive(false);
      this.$buefy.dialog.confirm({
        title: "Deleting itinerary",
        message:
          "Are you sure you want to <b>delete</b> this itinerary? This action cannot be undone",
        confirmText: "Yes, delete Itinerary",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.setLoading(true);
          this.$store
            .dispatch("itinerary/delete", this.data)
            .then((response) => {
              this.$buefy.toast.open({
                duration: 5000,
                message: response.message,
                position: "is-top",
                type: "is-success",
              });
            })
            .finally(() => this.setLoading(false));
        },
      });
    },
    setIsActive(newValue) {
      this.isActive = newValue;
    },
    handleClickOutside(event) {
      const popup = this.$refs.popup;
      if (this.isActive && popup && !popup.$el.contains(event.target)) {
        this.setIsActive(false);
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  watch: {
    isActive(newValue) {
      if (newValue) {
        setTimeout(() => {
          document.addEventListener("click", this.handleClickOutside);
        }, 1);
      } else document.removeEventListener("click", this.handleClickOutside);
    },
  },
};
</script>
<style>
.dialog .media {
  align-items: center;
}
</style>
