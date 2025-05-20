<template>
  <tr>
    <td
      :style="{ 'padding-top': '9px', 'text-size-adjust': '100%' }"
      valign="top"
    >
      <table align="center" cellpadding=".25rem" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th
              class="has-text-centered"
              :style="{ border: '1px solid #ccc', padding: '6px' }"
            >
              Day(s)
            </th>
            <th
              :style="{
                width: '5rem',
                border: '1px solid #ccc',
                padding: '6px',
              }"
              class="has-text-centered"
            >
              From
            </th>
            <th
              :style="{
                width: '5rem',
                border: '1px solid #ccc',
                padding: '6px',
              }"
              class="has-text-centered"
            >
              To
            </th>
            <th
              class="has-text-centered"
              :style="{ border: '1px solid #ccc', padding: '6px' }"
            >
              Destination
            </th>
            <th
              class="has-text-centered"
              :style="{ border: '1px solid #ccc', padding: '6px' }"
            >
              Level
            </th>
            <th :style="{ border: '1px solid #ccc', padding: '.25rem' }">
              Title
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="itineraryService in adaptedItineraryServices"
            :key="itineraryService.id"
          >
            <td
              :style="{
                'font-size': '12px',
                'font-family': 'Verdana',
                padding: '6px',
                border: '1px solid #ccc',
                'border-collapse': 'collapse',
                'text-align': 'center',
              }"
            >
              {{ itineraryService.day }}
            </td>
            <td
              :style="{
                'font-size': '12px',
                'font-family': 'Verdana',
                padding: '6px',
                width: '100px',
                border: '1px solid #ccc',
                'border-collapse': 'collapse',
                'text-align': 'center',
              }"
            >
              {{ itineraryService.formattedStartDate }}
            </td>
            <td
              :style="{
                'font-size': '12px',
                'font-family': 'Verdana',
                padding: '6px',
                width: '100px',
                border: '1px solid #ccc',
                'border-collapse': 'collapse',
                'text-align': 'center',
              }"
            >
              {{ itineraryService.formattedEndDate }}
            </td>
            <td
              :style="{
                'font-size': '12px',
                'font-family': 'Verdana',
                padding: '6px',
                border: '1px solid #ccc',
                'border-collapse': 'collapse',
                'text-align': 'center',
              }"
            >
              {{ itineraryService.destination }}
            </td>
            <td
              :style="{
                'font-size': '12px',
                'font-family': 'Verdana',
                padding: '6px',
                border: '1px solid #ccc',
                'border-collapse': 'collapse',
                'text-align': 'center',
              }"
            >
              {{ itineraryService.level_text }}
            </td>
            <td
              :style="{
                'font-size': '12px',
                'font-family': 'Verdana',
                padding: '6px',
                border: '1px solid #ccc',
                'border-collapse': 'collapse',
              }"
            >
              {{ itineraryService.name.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";
import { serviceHelper } from "@/utils/service";

export default {
  name: "PrintItineraryServices",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      helper: {
        format,
      },
    };
  },
  computed: {
    ...mapGetters({
      itineraryServices: "itinerary/getServicesItinerary",
      datesFormat: "itinerary/getDatesFormat",
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
  },
};
</script>
