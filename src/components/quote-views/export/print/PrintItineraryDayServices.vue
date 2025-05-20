<template>
  <tr v-if="dayServicesWithFullData.length > 0">
    <td
      :style="{ 'padding-top': '9px', 'text-size-adjust': '100%' }"
      valign="top"
    >
      <table
        align="left"
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="mcnTextContentContainer"
        :style="{
          'max-width': '100%',
          'min-width': '100%',
          'border-collapse': 'collapse',
          'text-size-adjust': '100%',
        }"
        width="100%"
      >
        <tbody>
          <tr>
            <td
              :style="{
                padding: '0px 18px 9px',
                'text-size-adjust': '100%',
                'word-break': 'break-word',
                'font-family': 'Verdana, Geneva, sans-serif',
                'font-size': '14px',
                'line-height': '200%',
                'text-align': 'left',
                color: 'rgb(77, 77, 77)',
              }"
              valign="top"
            >
              <h5>Services in day {{ day.start_day }}:</h5>
              <ul>
                <li
                  v-for="(service, index) in dayServicesWithFullData"
                  :key="index"
                >
                  <strong
                    v-if="
                      !isDayInsideOfServiceRange(day.start_date, service) &&
                      helper.isAccommodationPackageService(
                        service.id_service_type
                      )
                    "
                  >
                    {{
                      service.check_in && day.start_date === service.start_date
                        ? helper.validateCheckInAndCheckOut(service.check_in)
                        : ""
                    }}
                    {{
                      service.check_out && day.start_date === service.end_date
                        ? helper.validateCheckInAndCheckOut(service.check_out)
                        : ""
                    }}
                  </strong>
                  {{ service && "name" in service ? service.name.value : "" }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>
<script>
import { mapGetters } from "vuex";
import { serviceHelper } from "@/utils/service";
import { datesHelper } from "@/utils/dates";
import { format } from "date-fns";

export default {
  name: "PrintItineraryDayServices",
  props: {
    day: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      helper: {
        ...serviceHelper,
        ...datesHelper,
      },
    };
  },
  computed: {
    ...mapGetters({
      itineraryServices: "itinerary/getFilteredItineraryServicesForExport",
      publishedItinerary: "itinerary/getPublishedConfigAndImages",
    }),
    contentsSelected() {
      return this.publishedItinerary?.config?.contents;
    },
    adaptedItineraryServices() {
      const adaptedServices = this.itineraryServices
        ?.map((itineraryService) => {
          return {
            ...itineraryService,
            formattedStartDate: format(
              itineraryService.start_date,
              this.datesFormat
            ),
            formattedEndDate: format(
              itineraryService.end_date,
              this.datesFormat
            ),
            destination: itineraryService.location
              ?.flatMap((location) => location.location_name)
              ?.join(","),
          };
        })
        ?.filter((itineraryService) => Boolean(itineraryService.visible));

      return serviceHelper.filterServicesByLevelConfig(
        this.contentsSelected,
        adaptedServices
      );
    },
    dayServicesWithFullData() {
      const filteredServices = serviceHelper.filterHotelsByDay(
        this.day.services,
        this.day.start_day
      );
      return filteredServices
        ?.map((dayService) => {
          const fullService = this.adaptedItineraryServices?.find(
            (service) => service.id === dayService.itinerary_service
          );
          return fullService !== undefined ? fullService : false;
        })
        ?.filter((dayService) => dayService);
    },
  },
  methods: {
    format(date) {
      let formatted = "";
      if (date) {
        const d = new Date(date + " 00:00:00");
        const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
        const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
        const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
        formatted = `${da}-${mo}-${ye}`;
      }
      return formatted;
    },
    isDayInsideOfServiceRange(dayDate = "", service) {
      return (
        service.start_date?.localeCompare(dayDate) < 0 &&
        dayDate?.localeCompare(service.end_date) < 0
      );
    },
  },
};
</script>
