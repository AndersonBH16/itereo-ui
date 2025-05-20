<template>
  <tr>
    <td
      class="mcnCaptionBlockInner"
      :style="{ padding: '9px', 'text-size-adjust': '100%' }"
      valign="top"
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="mcnCaptionLeftContentOuter"
        :style="{ 'border-collapse': 'collapse', 'text-size-adjust': '100%' }"
        width="100%"
      >
        <tbody>
          <tr>
            <td
              class="mcnCaptionLeftContentInner"
              :style="{ padding: '0px 9px', 'text-size-adjust': '100%' }"
              valign="top"
            >
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                :style="{
                  'border-collapse': 'collapse',
                  'text-size-adjust': '100%',
                }"
              >
                <tbody>
                  <tr>
                    <td
                      :style="{
                        'text-size-adjust': '100%',
                        'word-break': 'break-word',
                        color: 'rgb(150, 150, 150)',
                        'font-family': 'Verdana, Geneva, sans-serif',
                        'font-size': '14px',
                        'line-height': '200%',
                        'text-align': 'left',
                      }"
                      valign="top"
                    >
                      <table
                        :style="{
                          background: 'rgb(245, 245, 245)',
                          padding: '0px',
                          'font-size': '14px',
                          'border-spacing': '0px',
                          'border-collapse': 'collapse',
                          'text-size-adjust': '100%',
                          'text-align': 'center',
                        }"
                      >
                        <tbody>
                          <tr>
                            <td
                              v-for="(
                                price, index
                              ) in quotePricesWithServicesByPriceLevel"
                              :key="index"
                              :style="{
                                padding: '5px 10px',
                                border: '0.1rem solid rgb(232, 232, 232)',
                                'border-radius': '30px !important',
                                width: '33% !important',
                              }"
                              valign="center"
                            >
                              <p></p>
                              <p>Total Price</p>
                              <p
                                :style="{
                                  color: 'rgb(111, 111, 111)',
                                  'font-weight': 'bold',
                                  'font-size': '28px',
                                }"
                              >
                                $ {{ price.total }}
                              </p>
                              <h6>{{ price.type }} Class</h6>
                              <br />
                              <span
                                v-for="(serv, idx) in price.services"
                                :key="idx"
                              >
                                <p
                                  :style="{
                                    marginBottom: '1em',
                                    lineHeight: '1.25em',
                                    'font-family':
                                      'Verdana, Geneva, sans-serif',
                                  }"
                                >
                                  <span>{{
                                    serv && "name" in serv
                                      ? serv.name.value
                                      : ""
                                  }}</span
                                  ><br />

                                  <!-- {{
                                    serv &&
                                    'description' in serv &&
                                    serv.description.value.replace(
                                      /\s/g,
                                      ''
                                    ) !== ''
                                      ? serv.description.value
                                      : 'name' in serv
                                      ? serv.name.value
                                      : ''
                                  }} -->
                                </p>
                              </span>
                              <br />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from "vuex";
import { SERVICE_LEVELS_BY_NAMES, SERVICE_LEVELS } from "@/constants/services";
import { isAccommodationPackageService } from "@/utils/service";
import { exportHelper } from "@/utils/export";

export default {
  name: "PrintPrices",
  props: {
    itinerary: {
      type: [Array, Object],
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      itineraryPrices: "itinerary/getPricesItineraries",
      quoteServices: "itinerary/getServicesItinerary",
      publishedConfigAndImages: "itinerary/getPublishedConfigAndImages",
    }),
    validatedQuotePrices() {
      return this.itineraryPrices?.at(-1)?.prices;
    },
    quoteAccommodationAndPackageServices() {
      return this.quoteServices?.filter((service) => {
        return isAccommodationPackageService(service.id_service_type);
      });
    },
    quotePricesWithServicesByPriceLevel() {
      const contentsSelected =
        this.publishedConfigAndImages?.config?.contents || [];
      const itineraryPricesLevels = this.validatedQuotePrices || [];
      return exportHelper
        .getPricesLevelFiltered(
          contentsSelected,
          itineraryPricesLevels,
          this.validatedQuotePrices
        )
        ?.map((price) => {
          return {
            ...price,
            services: this.quoteAccommodationAndPackageServices?.filter(
              (service) => {
                return [
                  SERVICE_LEVELS_BY_NAMES[price.type].type,
                  SERVICE_LEVELS.ALL.type,
                ].includes(service.level_text);
              }
            ),
          };
        });
    },
  },
};
</script>
