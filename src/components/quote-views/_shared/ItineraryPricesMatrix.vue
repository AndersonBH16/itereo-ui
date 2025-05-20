<template>
  <div v-if="!loading">
    <b-modal
      title="Generating Matrix Calculation"
      :width="600"
      v-model="isOpen"
      @close="closeFirstStepModal()"
    >
      <div class="itinerary_matrix_modal__container p-5">
        <h1 class="is-relative is-inline" style="width: fit-content">
          Generating Matrix Calculation
          <b-tag
            type="is-info"
            class="px-2"
            style="
              position: absolute;
              top: -0.75rem;
              right: -2.5rem;
              height: fit-content;
            "
          >
            <p>BETA</p>
          </b-tag>
        </h1>
        <p class="has-text-left mt-2 mb-4">
          Please read the information above to proceed with the Matrix
          Calculation
        </p>
        <ul class="mb-4">
          <li>The quote services must have the same selected price level</li>
          <li>The quote must be configured for 3 passengers</li>
          <li>
            There is a risk if the quote is for December. Please validate the
            result <strong>(BETA)</strong>
          </li>
        </ul>
        <div class="is-flex is-flex-direction-column is-align-items-start mb-5">
          <b-checkbox
            v-model="hasFinishedFirstCondition"
            size="is-small"
            class="mb-2"
          >
            I've finished adding the services
          </b-checkbox>
          <b-checkbox v-model="hasFinishedSecondCondition" size="is-small">
            I've added the necessary markup and fee for the quote
          </b-checkbox>
        </div>
        <div
          v-if="hasFinishedFirstCondition && hasFinishedSecondCondition"
          class="mb-2"
        >
          <h3 class="has-text-left modal__subtitle mb-3">
            Matrix Configuration
          </h3>
          <div class="is-flex">
            <b-field
              label="From Paxs"
              class="is-flex is-align-items-center m-0 mr-4"
            >
              <b-select
                class="ml-2 mb-2"
                placeholder="Select the number of pax"
                v-model="payload.from_pax"
                @input="onPayloadFromPaxUpdate"
              >
                <option
                  v-for="payloadPaxOption in payloadFromPaxOptions"
                  :value="payloadPaxOption"
                  :key="payloadPaxOption"
                >
                  {{ payloadPaxOption }}
                </option>
              </b-select>
            </b-field>
            <b-field
              label="To Paxs"
              class="is-flex is-align-items-center m-0 mr-4"
            >
              <b-select
                class="ml-2 mb-2"
                placeholder="Select the number of pax"
                v-model="payload.to_pax"
                @input="onPayloadToPaxUpdate"
              >
                <option
                  v-for="payloadPaxOption in payloadToPaxOptions"
                  :value="payloadPaxOption"
                  :key="payloadPaxOption"
                >
                  {{ payloadPaxOption }}
                </option>
              </b-select>
            </b-field>
            <b-field label="Start Date" class="is-flex is-align-items-center">
              <b-datepicker
                class="ml-2 mb-2"
                :value="new Date(payload.start_date)"
                placeholder="Select a start date"
                icon="calendar-today"
                disabled
              >
              </b-datepicker>
            </b-field>
          </div>
        </div>
        <div class="is-flex is-justify-content-end">
          <BaseButton
            action="principal"
            @click="onFistStepContinueClick"
            :disabled="
              !hasFinishedFirstCondition || !hasFinishedSecondCondition
            "
          >
            <p slot="text">Generate Matrix</p>
          </BaseButton>
        </div>
      </div>
    </b-modal>

    <b-modal
      title="Generating Matrix Calculation"
      :width="900"
      v-model="isSecondStepModalOpen"
      @close="closeSecondStepModal"
    >
      <div class="itinerary_matrix_modal__container p-5">
        <h1 class="is-relative is-inline" style="width: fit-content">
          Quote Matrix Calculation
          <b-tag
            type="is-info"
            class="px-2"
            style="
              position: absolute;
              top: -0.75rem;
              right: -2.5rem;
              height: fit-content;
            "
          >
            <p>BETA</p>
          </b-tag>
        </h1>

        <table
          v-if="adaptedItineraryPricesMatrix.length > 0"
          class="w-100 mt-4"
        >
          <thead>
            <tr>
              <th>
                {{ helper.format(itinerary.data.start_date, datesFormat) }} -
                {{ helper.format(itinerary.data.end_date, datesFormat) }}
              </th>
              <th>Level</th>
              <th
                v-for="matrix in adaptedItineraryPricesMatrix"
                :key="matrix.num_pax"
              >
                {{ matrix.num_pax }} paxs
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(serviceRow, serviceRowIndex) in adaptedServicesRows"
              :key="serviceRow.code"
            >
              <td style="display: block; width: 12rem">
                <ServiceRow :service="serviceRow" />
              </td>
              <td>
                {{ helper.getServiceLevelText(serviceRow) }}
              </td>
              <td
                v-for="(matrix, matrixIndex) in adaptedItineraryPricesMatrix"
                :key="matrixIndex"
              >
                <div
                  class="is-flex is-flex-direction-column"
                  :style="{
                    height: serviceRow.showRooms ? '3rem' : '0rem',
                    'margin-bottom': serviceRow.showRooms ? '2rem' : '0rem',
                  }"
                >
                  <p
                    :style="{
                      color:
                        matrix.service_itinerary[serviceRowIndex].price <= 0
                          ? '#dc3545'
                          : 'inherit',
                    }"
                  >
                    {{ itinerary.data.currency.currency_sign }}
                    {{ matrix.service_itinerary[serviceRowIndex].price }}
                  </p>
                  <div
                    v-if="serviceRow.showRooms"
                    class="is-flex is-justify-content-center mt-2"
                    style="flex-wrap: wrap"
                  >
                    <b-tooltip
                      v-for="room in matrix.service_itinerary[serviceRowIndex]
                        .service_price"
                      :key="room.id_room_type"
                      :label="room.romm_name"
                      type="is-light"
                    >
                      <b-taglist attached class="mb-0 is-relative">
                        <b-tag
                          type="is-light"
                          class="px-1"
                          style="background-color: #eee; height: 1.25rem"
                        >
                          {{ room.room_qty }} x
                        </b-tag>
                        <b-tag
                          rounded
                          type="is-light"
                          class="px-1"
                          style="height: 1.25rem"
                        >
                          <span style="font-size: 0.7rem">
                            {{
                              helper.getRoomAcronymByRoomType(room.id_room_type)
                            }}
                          </span>
                        </b-tag>
                      </b-taglist>
                    </b-tooltip>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Fee</td>
              <td></td>
              <td
                v-for="matrix in adaptedItineraryPricesMatrix"
                :key="matrix.num_pax"
              >
                {{ itinerary.data.currency.currency_sign }}
                {{ matrix.priceToShow.fee }}
              </td>
            </tr>
            <tr>
              <td>Margin</td>
              <td></td>
              <td
                v-for="matrix in adaptedItineraryPricesMatrix"
                :key="matrix.num_pax"
              >
                {{ itinerary.data.currency.currency_sign }}
                {{ matrix.priceToShow.margin }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td></td>
              <td
                v-for="matrix in adaptedItineraryPricesMatrix"
                :key="matrix.num_pax"
              >
                <strong
                  :style="{
                    color: matrix.priceToShow.isWarningPrice
                      ? '#dc3545'
                      : 'inherit',
                  }"
                >
                  {{ itinerary.data.currency.currency_sign }}
                  {{ matrix.priceToShow.total }}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>

        <div class="mt-4">
          <BaseButton
            class="m-0 mr-2"
            action="secondary"
            @click="returnToFistStepModal"
          >
            <i slot="icon">
              <b-icon icon="arrow-left" custom-size="mdi-18px" class="pt-1" />
            </i>
            <p slot="text">Return to Matrix Configuration</p>
          </BaseButton>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import ServiceRow from "@/components/quote-views/service-list/ServiceModals/ServiceRow.vue";
import { mapGetters } from "vuex";
import { format } from "date-fns";
import helper from "@/helpers";
import { serviceHelper } from "@/utils/service";
import { SERVICE_ROW_FIELDS } from "@/constants/services";

export default {
  name: "ItineraryPricesMatrix",
  components: {
    ServiceRow,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    isFirstStepModalOpen: {
      type: Boolean,
      default: false,
    },
    closeFirstStepModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      constants: {
        SERVICE_ROW_FIELDS,
      },
      helper: {
        format,
        ...serviceHelper,
      },
      isOpen: this.isFirstStepModalOpen,
      isSecondStepModalOpen: false,
      hasFinishedFirstCondition: false,
      hasFinishedSecondCondition: false,
      payload: {
        from_pax: null,
        to_pax: null,
        start_date: null,
      },
      payloadFromPaxOptions: [],
      payloadToPaxOptions: [],
    };
  },
  computed: {
    ...mapGetters({
      itinerary: "itinerary/getItinerary",
      datesFormat: "itinerary/getDatesFormat",
      itineraryPricesMatrix: "itinerary/getItineraryPricesMatrix",
    }),
    adaptedItineraryPricesMatrix() {
      const validateditineraryPricesMatrix =
        this.itineraryPricesMatrix?.[0]?.data || [];
      return validateditineraryPricesMatrix.map((itineraryPriceMatrix) => {
        const priceLevelToShow = itineraryPriceMatrix.prices?.[0]?.prices?.find(
          (priceLevel) => {
            return priceLevel.total !== 0;
          }
        );
        const isWarningPrice = itineraryPriceMatrix.service_itinerary.some(
          (itineraryService) => itineraryService.price <= 0
        );
        return {
          ...itineraryPriceMatrix,
          priceToShow: {
            total: priceLevelToShow?.total || 0,
            fee: priceLevelToShow?.fee || 0,
            margin: priceLevelToShow?.margin || 0,
            isWarningPrice,
          },
        };
      });
    },
    adaptedServicesRows() {
      const itineraryServices =
        this.adaptedItineraryPricesMatrix[0].service_itinerary;
      return itineraryServices.map((itineraryService) => ({
        ...itineraryService,
        showRooms: this.helper.isAccommodationPackageService(
          itineraryService.id_service_type
        ),
      }));
    },
  },
  watch: {
    isFirstStepModalOpen(newValue) {
      this.isOpen = newValue;
    },
  },
  methods: {
    returnToFistStepModal() {
      this.setIsOpenSecondStepModalOpen(false);
      this.resetFirstStepModal();
      this.isOpen = true;
      this.loadFormPayload();
    },
    resetFirstStepModal() {
      this.hasFinishedFirstCondition = false;
      this.hasFinishedSecondCondition = false;
    },
    setIsOpenSecondStepModalOpen(newValue = false) {
      this.isSecondStepModalOpen = newValue;
    },
    closeSecondStepModal() {
      this.closeFirstStepModal();
      this.resetFirstStepModal();
      this.setIsOpenSecondStepModalOpen(false);
    },
    async onFistStepContinueClick() {
      this.isOpen = false;
      this.resetFirstStepModal();
      await this.generateItineraryPricesMatrix();
      this.loadDataForSecondStepModal();
    },
    loadDataForSecondStepModal() {
      this.setIsOpenSecondStepModalOpen(true);
    },
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) {
        this.setLoadingText("Loading content, please wait...");
      }
    },
    setLoadingText(value) {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    async generateItineraryPricesMatrix() {
      await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          this.setLoading(true);
          await this.$store.dispatch(
            "itinerary/generateItineraryPricesMatrix",
            {
              itineraryId: this.itinerary.data.id,
              data: {
                ...this.payload,
              },
            }
          );
          return this.setLoading(false);
        },
        functionToExecuteOnFail: async (error) => {
          this.closeFirstStepModal();
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message:
              "Error trying to generate the Quote Matrix, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });
    },
    onPayloadFromPaxUpdate(newValue) {
      this.payloadToPaxOptions = helper.getArrayFromNumbersRange(newValue, 10);
    },
    onPayloadToPaxUpdate(newValue) {
      this.payloadFromPaxOptions = helper.getArrayFromNumbersRange(5, newValue);
    },
    loadFormPayload() {
      this.payloadFromPaxOptions = helper.getArrayFromNumbersRange(1, 10);
      this.payloadToPaxOptions = helper.getArrayFromNumbersRange(1, 10);
      this.payload = {
        from_pax: this.payloadFromPaxOptions[0],
        to_pax: this.payloadToPaxOptions.at(-1),
        start_date: this.itinerary.data.start_date,
      };
    },
    async loadItineraryPricesMatrix() {
      await this.$store.dispatch("utils/validateFunctionExecution", {
        functionToExecute: async () => {
          this.isOpen = false;
          this.setLoading(true);
          const matrixIsEmpty = this.itineraryPricesMatrix.length === 0;
          if (matrixIsEmpty) {
            await this.$store.dispatch("itinerary/getItineraryPricesMatrix", {
              itineraryId: this.itinerary.data.id,
            });
          }
          this.loadStepModalByContext(matrixIsEmpty);
          this.setLoading(false);
        },
        functionToExecuteOnFail: async (error) => {
          this.closeFirstStepModal();
          this.setLoading(false);
          this.$buefy.toast.open({
            duration: 5000,
            message: "Error trying to get the Quote Matrix, please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw error;
        },
      });
    },
    loadStepModalByContext() {
      const matrixIsEmpty = this.itineraryPricesMatrix.length === 0;
      if (matrixIsEmpty) {
        this.loadFormPayload();
        this.isOpen = true;
      } else {
        this.loadDataForSecondStepModal();
      }
    },
  },
  mounted() {
    this.setLoading(true);
    this.loadItineraryPricesMatrix();
  },
};
</script>
<style>
.itinerary_matrix_modal__container {
  width: 100%;
  overflow: hidden;
}
.itinerary_matrix_modal__container h1 {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: left;
  padding-top: 0.25rem;
  padding-bottom: 0.8rem;
  color: #000;
}
.itinerary_matrix_modal__container p,
.itinerary_matrix_modal__container span,
.itinerary_matrix_modal__container input {
  font-size: 0.8rem;
}
.itinerary_matrix_modal__container .input:focus {
  color: #363636 !important;
  border: none;
  box-shadow: none;
}
.itinerary_matrix_modal__container ul {
  padding-left: 1rem;
}
.itinerary_matrix_modal__container ul li {
  text-align: left;
  list-style: disc;
  font-size: 0.8rem;
}
.modal__subtitle {
  font-size: 1rem;
  font-weight: 600;
}
.itinerary_matrix_modal__container table {
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
  height: 85%;
  display: block;
}
.itinerary_matrix_modal__container table :is(th, td) {
  font-size: 0.8rem;
  padding: 0.25rem;
  text-align: center;
  vertical-align: middle;
}
.itinerary_matrix_modal__container table thead,
.itinerary_matrix_modal__container table th:nth-of-type(1),
.itinerary_matrix_modal__container table td:nth-of-type(1) {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: #fff;
}
.itinerary_matrix_modal__container table thead {
  z-index: 2;
}
.itinerary_matrix_modal__container table td:nth-of-type(n + 3) {
  color: #0f7343;
}
.itinerary_matrix_modal__container table tr {
  border-bottom: 1px solid #eee;
}
.itinerary_matrix_modal__container table th {
  min-width: 5rem;
}
.itinerary_matrix_modal__container label {
  font-size: 0.8rem !important;
  font-weight: 500;
}
.itinerary_matrix_modal__container .prices_levels__container > div {
  padding: 1.5rem;
  box-shadow: 0px 4px 50px -15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}
</style>
