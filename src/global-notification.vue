<template>
  <div></div>
</template>
<script>
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { mapGetters } from "vuex";
import request from "@/services/request";
import { getLocalStorageData } from "@/utils/localStorage";
import { PUSHER_TASK_TYPES } from "@/constants/utils";

const authData = getLocalStorageData("auth-data");

const channel = `App.Models.Tenant.UserTenant.${authData.user.id}`;

const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.VUE_APP_PUSHER_KEY,
  authEndpoint: `${request.defaults.baseURL}/tenant/broadcasting/auth`,
  cluster: process.env.VUE_APP_PUSHER_CLUSTER,
  forceTLS: true,
  Pusher: Pusher,
  bearerToken: authData.token,
});

export default {
  name: "GlobalNotification",
  render: function (h) {
    return h();
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      itineraryServices: "itinerary/getServicesItinerary",
    }),
  },
  methods: {
    async onNotification({ data, response }) {
      let actionText = "OK";

      if (this.itinerary.data) {
        if (response.task === PUSHER_TASK_TYPES.ITINERARY_EXPORT) {
          if (this.itinerary.data.id === response.itinerary.id) {
            await this.$store.dispatch("itinerary/read", {
              uuid: this.itinerary.data.id,
              force: true,
            });
          }
        } else if (response.task === PUSHER_TASK_TYPES.SERVICE_IMPORT) {
          if (this.itinerary.data.id === response.itinerary.id) {
            const importedServicesCodes = response.services.map(
              (service) => service.code
            );
            const newImportingData = {
              queue: {
                ...this.itinerary.queue,
                importing: {
                  ...this.itinerary.queue.importing,
                  services: [
                    ...this.itinerary.queue.importing.services.filter(
                      (service) => !importedServicesCodes.includes(service)
                    ),
                  ],
                },
              },
            };
            this.$store.dispatch(
              "itinerary/updateEntitiesImportingList",
              newImportingData
            );
            actionText = "";
          }
        } else if (response.task === PUSHER_TASK_TYPES.SERVICE_UDPATE) {
          const isImportedSuccessfully = data.type === "is-success";
          await this.$store.dispatch(
            "itinerary/postServiceImportingConfirmation",
            {
              isOpen: true,
              alertContent: {
                title: data.message,
                message: isImportedSuccessfully
                  ? "You can now close this alert and see the imported service in the itinerary"
                  : "Please check the service and try again",
              },
            }
          );
          if (isImportedSuccessfully) {
            const serviceCode = data.message.split(" ")[1];
            const serviceFound = this.itineraryServices.find(
              (service) => service.code === serviceCode
            );

            if (serviceFound) {
              await this.$store.dispatch(
                "itinerary/updateEntitiesImportingList",
                {
                  importing: this.itinerary.importing.filter(
                    (item) => item !== serviceFound.id
                  ),
                  disableLoading: [serviceFound.id],
                }
              );
            }
          }
        }
      }

      this.$buefy.snackbar.open({
        duration: 30000,
        message: data.message,
        type: data.type ?? "is-success",
        cancelText: "OK",
        actionText,
      });
    },
  },
  mounted() {
    echo.private(channel).notification(this.onNotification);
  },
  beforeDestroy() {
    echo.leave(channel);
  },
};
</script>
<style>
.snackbar__container {
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.snackbar__container strong {
  color: #fff;
}
</style>
