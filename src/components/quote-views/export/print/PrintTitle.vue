<template>
  <tr>
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
                color: 'rgb(0, 0, 0)',
                'font-family':
                  'Open Sans, Helvetica Neue, Helvetica, Arial,sans-serif',
                'font-size': '34px',
                'line-height': '100%',
                'text-size-adjust': '100%',
                'word-break': 'break-word',
                'text-align': 'left',
              }"
              valign="top"
            >
              <div :style="{ 'text-align': 'center' }">
                <div>
                  <br />
                  <span
                    :style="{
                      'font-size': '12px',
                      'letter-spacing': '5px',
                      'text-transform': 'uppercase',
                      display: displayItineraryDates ? 'inherit' : 'none',
                    }"
                  >
                    📅 {{ format(itinerary.start_date) }} ➞ 📅
                    {{ format(itinerary.end_date) }}
                  </span>
                  <br />
                  <strong>
                    <span
                      :style="{ 'font-size': '32px', color: 'rgb(77, 77, 77)' }"
                    >
                      {{
                        itinerary && "title" in itinerary
                          ? itinerary.title.value
                          : ""
                      }}
                    </span>
                  </strong>
                  <br />
                  <span
                    :style="{
                      'font-size': '12px',
                      'letter-spacing': '5px',
                      'text-transform': 'uppercase',
                    }"
                  >
                    📌
                    {{
                      itinerary.location && "location" in itinerary
                        ? itinerary.location
                            .map(function (x) {
                              return x.location_name;
                            })
                            .join(", ")
                        : ""
                    }}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from "vuex";
import { TEMPLATE_CONFIG } from "@/constants/exportConfig";
import { exportHelper } from "@/utils/export";

export default {
  name: "PrintTitle",
  props: {
    itinerary: {
      type: [Array, Object],
      default: () => [],
    },
  },
  data() {
    return {
      constants: {
        TEMPLATE_CONFIG,
      },
      helper: {
        ...exportHelper,
      },
    };
  },
  computed: {
    ...mapGetters({
      publishedConfigAndImages: "itinerary/getPublishedConfigAndImages",
    }),
    displayItineraryDates() {
      return this.helper.isSectionDisplayed(
        this.publishedConfigAndImages.config.contents,
        this.constants.TEMPLATE_CONFIG.DISPLAY_TRAVEL_DATES
      );
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
  },
};
</script>
