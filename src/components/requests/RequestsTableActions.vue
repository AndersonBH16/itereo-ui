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
      <b-tooltip
        :active="!canDelete"
        :label="deleteError"
        type="is-light"
        class="request_action__button__container w-100"
      >
        <b-button
          @click="handleDeleteRequest"
          type="is-primary"
          size="is-small"
          class="request_action__button"
          style="border: none"
          :disabled="!canDelete"
          outlined
        >
          <IconTrash class="icon color-8 is-xsmall" />
          <span> Delete </span>
        </b-button>
      </b-tooltip>
    </b-message>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RequestsTableActions",
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
      return this.deleteError === null;
    },
    deleteError() {
      const authUser = this.authData.user;
      if (this.data.user?.id !== authUser.id)
        return "You aren't owner of this request.";

      if (this.data.quotes_number > 0) return "This request has quotes.";

      return null;
    },
  },
  props: {
    data: {
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
    async handleDeleteRequest() {
      return await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          return await this.deleteRequest();
        },
        functionToExecuteOnFail: async (error) => {
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message: "Error trying to delete the request, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });
    },
    deleteRequest() {
      this.setIsActive(false);
      this.$buefy.dialog.confirm({
        title: "Deleting Request",
        message:
          "Are you sure you want to <b>delete</b> this Request? This action cannot be undone.",
        confirmText: "Yes, delete Request",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.setLoading(true);
          this.$store
            .dispatch("request/deleteRequest", {
              id: this.data.id,
            })
            .then(() => {
              this.$buefy.toast.open({
                duration: 5000,
                message: "Request deleted successfully.",
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

.request_action__button__container:hover {
  background-color: #eee !important;
  padding: 0rem;
}

.request_action__button__container:hover .request_action__button,
.request_action__button:hover {
  background-color: #eee !important;
}

.request_action__button {
  border: none;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 0.85rem !important;
  color: #444 !important;
}

.request_action__button.button.is-primary:hover {
  color: #444 !important;
}
</style>
