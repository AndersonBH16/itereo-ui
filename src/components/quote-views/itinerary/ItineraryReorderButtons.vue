<template>
  <div class="columns">
    <BaseModal
      :isComponentModalActive="reorderDaysModal"
      :closeModal="handleReorderModal"
    >
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title"
        >Services dates and prices will be updated according to the new order
        <br />
        of days!</span
      >
      <span slot="paragraph">Are you sure to continue? </span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="handleReorderModal()"
          action="secondary"
          size="medium"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="done()"
          action="tercery"
          size="medium"
          :disabled="loading"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>
    <div class="column">
      <p class="title is-4 color-4">Re-order: Itinerary Days</p>
    </div>
    <div class="column is-flex justify-content-end">
      <BaseButton
        @click="cancel"
        :disabled="loading"
        action="turquose-secondary"
        size="large"
        class="mr-2"
      >
        <span slot="text">Cancel</span>
      </BaseButton>
      <BaseButton
        @click="handleReorderModal"
        :disabled="loading"
        action="turquose"
      >
        <i slot="icon">
          <IconCheck class="icon is-small" />
        </i>
        <span slot="text">Done editing</span>
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { parse } from "date-fns";
import {
  setDay,
  calculateDuration,
  addDaysToDate,
  getSalesManualUUID,
} from "@/utils/utils";

export default {
  name: "ItineraryReorderButtons",
  data() {
    return {
      updatedAccommPacks: [],
      reorderDaysModal: false,
    };
  },
  props: {
    newDaysOrder: {
      type: Array,
      default: null,
    },
    loadServicesItinerary: {
      type: Function,
      default: () => {},
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      client_contracts: "client/getClientContracts",
      itinerary: "itinerary/getItinerary",
      services_itinerary: "itinerary/getServicesItinerary",
      itineraryDays: "itineraryDays/getItineraryDays",
      loading: "utils/getLoading",
    }),
  },
  methods: {
    handleReorderModal() {
      this.reorderDaysModal = !this.reorderDaysModal;
    },
    loadItineraryDays(uuid) {
      return this.$store
        .dispatch("itineraryDays/getItineraryDays", { uuid })
        .then((result) => result)
        .catch((error) => {
          throw error;
        });
    },
    setOldOrderInAccommPackDays() {
      const allAccommPacks = [];
      const itineraryDays = this.itineraryDays;
      itineraryDays.map((day) => {
        if (Array.isArray(day.services) && day.services.length > 0) {
          day.services.map((item) => {
            const accommPackFound = this.services_itinerary.filter(
              ({ service, id_service_type }) =>
                service === item.uuid &&
                (id_service_type === 2 || id_service_type === 9)
            );
            if (accommPackFound && accommPackFound.length > 0) {
              let orderInDays = 0;
              const oldAccommPacks =
                allAccommPacks.length > 0
                  ? allAccommPacks.filter(
                      ({ code }) => code === accommPackFound[0].code
                    )
                  : null;
              if (oldAccommPacks && oldAccommPacks.length > 0) {
                orderInDays += oldAccommPacks.length;
              }
              item.orderInDays = orderInDays;
              allAccommPacks.push(accommPackFound[0]);
            }
            return item;
          });
        }
        return day;
      });
      return itineraryDays;
    },
    foundAndRemoveAccommPacksInDayService(itineraryDays, oldItineraryDays) {
      const allAccommPacks = [];
      const daysUpdated = itineraryDays;
      daysUpdated.map((day) => {
        if (Array.isArray(day.services) && day.services.length > 0) {
          const oldDay = oldItineraryDays.filter((d) => d.id === day.id);
          day.services = oldDay[0].services.map((item) => {
            const accommPackFound = this.services_itinerary.filter(
              ({ service, id_service_type }) =>
                service === item.uuid &&
                (id_service_type === 2 || id_service_type === 9)
            );
            if (accommPackFound && accommPackFound.length > 0) {
              allAccommPacks.push({
                ...accommPackFound[0],
                orderInDays: item.orderInDays,
                day_date: day.start_date,
              });
              return {
                ...item,
                status: -1,
                accomPack: true,
              };
            }
            return item;
          });
        }
        return day;
      });
      return { daysUpdated, allAccommPacks };
    },
    setCorrectDatesAccomPack(uniqueAccommPacksCodes, allAccommPacks) {
      uniqueAccommPacksCodes.forEach((code) => {
        const sameAccommPacks = allAccommPacks.filter(
          (item) => item.code === code
        );
        const originalService = sameAccommPacks[0];
        const startDates = [];
        sameAccommPacks.forEach((accomPack) => {
          const { start_date, end_date, day_date, orderInDays } = accomPack;
          if (
            parse(day_date) < parse(start_date) ||
            parse(day_date) > parse(end_date)
          ) {
            // sólo si las nuevas fechas del accommodation y/o package se encuentran fuera del rango inicial
            startDates.push(
              orderInDays > 0 ? addDaysToDate(day_date, -orderInDays) : day_date
            );
            const newStartDate = startDates.sort(
              (a, b) => parse(a) - parse(b)
            )[0];

            originalService.start_date =
              parse(newStartDate) < parse(this.itinerary.data.start_date)
                ? this.itinerary.data.start_date
                : newStartDate;

            if (!accomPack.day) {
              throw new Error(`Field day doesn't exists in service`);
            }
            const serviceDays = calculateDuration(accomPack.day);

            originalService.end_date = addDaysToDate(
              originalService.start_date,
              serviceDays
            );
          }
        });
        this.updatedAccommPacks.push(originalService);
      });
    },
    updateAccommPacksDatesAndOrder(itineraryDays) {
      const oldItineraryDays = this.setOldOrderInAccommPackDays();
      const { daysUpdated, allAccommPacks } =
        this.foundAndRemoveAccommPacksInDayService(
          itineraryDays,
          oldItineraryDays
        );
      itineraryDays = daysUpdated;
      const allAccomPacksCodes = allAccommPacks.map((service) => service.code);
      const uniqueAccommPacksCodes = new Set(allAccomPacksCodes);
      this.setCorrectDatesAccomPack(uniqueAccommPacksCodes, allAccommPacks);
      itineraryDays.map((day) => {
        const { start_date } = day;
        const accomPacksAccordingToStartDate = this.updatedAccommPacks.filter(
          (item) =>
            parse(start_date) >= parse(item.start_date) &&
            parse(start_date) <= parse(item.end_date)
        );
        if (
          accomPacksAccordingToStartDate &&
          accomPacksAccordingToStartDate.length > 0 &&
          (!day.services || day.services.length === 0)
        ) {
          // en caso no existan servicios dentro del día se insertan los servicios desde cero
          day.services = [];
          accomPacksAccordingToStartDate.forEach((item) => {
            const exitsService = day.services.findIndex(
              (e) => e.uuid === item.service
            );
            if (exitsService < 0) {
              day.services.push({
                id: null,
                uuid: item.service,
                status: 1,
              });
            }
          });
        }
        if (Array.isArray(day.services) && day.services.length > 0) {
          // en caso si existan servicios dentro del día
          day.services.forEach((service, index, self) => {
            accomPacksAccordingToStartDate.forEach((item) => {
              if (item.service === service.uuid) {
                service.status = 1;
              } else {
                const exitsService = self.findIndex(
                  (e) => e.uuid === item.service
                );
                if (exitsService < 0) {
                  self.push({
                    id: null,
                    uuid: item.service,
                    status: 1,
                  });
                }
              }
            });
          });
        }
        return day;
      });
      return itineraryDays;
    },
    updateRestServicesDates(day, restServices) {
      const { services } = day;
      if (Array.isArray(services) && services.length) {
        services.forEach((service) => {
          const servicesFound = this.services_itinerary.filter(
            (s) => s.service === service.uuid
          );
          servicesFound.forEach((serviceFound) => {
            const { start_date } = day;
            if (
              (serviceFound &&
                serviceFound.id_service_type !== 2 &&
                serviceFound.id_service_type !== 9) ||
              serviceFound.start_date === serviceFound.end_date
            ) {
              serviceFound.start_date = start_date;
              serviceFound.end_date = start_date;
              restServices.push(serviceFound);
            }
          });
        });
      }
    },
    processServices(services) {
      services.forEach((service) => {
        service.day = setDay(
          service.start_date,
          service.end_date,
          this.itinerary.data
        );
      });
      return this.$store
        .dispatch("itinerary/add_service", {
          calculate_price: 1,
          data: services,
          uuid: this.$route.query.itinerary,
          sm: getSalesManualUUID(this.itinerary, this.client_contracts),
        })
        .then((result) => result)
        .catch((error) => {
          console.info(error);
          throw error;
        });
    },
    processDays(payload) {
      return this.$store
        .dispatch("itineraryDays/processItineraryDays", payload)
        .then((response) => response)
        .catch((error) => {
          throw error;
        });
    },
    async processNewDaysOrder(days) {
      try {
        this.setLoading(true);
        const uuid = this.$route.query.itinerary;
        const sourceItineraryDays = [...days];
        const itineraryStartDate = this.itinerary.data.start_date;
        let counterDay = 1;
        let counterDate = itineraryStartDate;

        let processedItineraryDays = [];
        processedItineraryDays = sourceItineraryDays.map((day, index) => {
          counterDay =
            index === 0 ? Number(counterDay) : Number(counterDay) + 1;
          counterDate = index === 0 ? counterDate : addDaysToDate(counterDate);
          return {
            ...day,
            start_day: counterDay,
            start_date: counterDate,
            end_date: counterDate,
          };
        });
        processedItineraryDays = this.updateAccommPacksDatesAndOrder(
          processedItineraryDays
        );
        const restServices = [];
        const daysUpdated = [];

        processedItineraryDays.map((day) => {
          const cleanImages =
            Array.isArray(day.images) && day.images.length > 0
              ? day.images.map((img) => {
                  return img.id;
                })
              : [];
          day.images = "{" + cleanImages.join(",") + "}";
          const data = [{ ...day, _order_start_day: true }];
          daysUpdated.push(data[0]);
          this.updateRestServicesDates(data[0], restServices);
        });

        const allServices = [...restServices, ...this.updatedAccommPacks];
        const promises = [];
        promises.push(this.processDays({ data: daysUpdated, uuid }));
        promises.push(this.processServices(allServices));
        const result = await Promise.all(promises);
        if (result) {
          this.toggleReorderList();
          this.handleReorderModal();
          await this.loadItineraryDays(uuid);
          await this.loadServicesItinerary(true);
          return;
        }
        throw new Error("Ups! something went wrong, please try again!");
      } catch (err) {
        this.setLoading(false);
        console.info(err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong, please try again!",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    done() {
      // Guardado del reorder aquí
      if (Array.isArray(this.newDaysOrder) && this.newDaysOrder.length > 0) {
        this.processNewDaysOrder(this.newDaysOrder);
      }
    },
    cancel() {
      this.$store.commit("itinerary/SET_SELECTED_DAY", null);
      this.toggleReorderList();
    },
    toggleReorderList() {
      this.$store.commit("itinerary/SET_TOGGLE_REORDER_LIST", false);
    },
  },
};
</script>
