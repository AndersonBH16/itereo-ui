<template>
  <div
    :class="`chart__container bar ${chartType} ${
      isSelectedChart ? 'selected' : ''
    }`"
    @click="() => setSelectedChart(reportName)"
  >
    <div class="chart__title is-flex is-flex-direction-column w-100">
      <header class="is-flex is-justify-content-space-between w-100">
        <div class="is-flex is-flex-direction-column w-100">
          <div class="is-flex is-relative mb-3">
            <button class="chart__return_button" @click="returnToReportsView">
              <b-icon
                size="is-small"
                custom-size="fa-5x"
                icon="keyboard-return"
              ></b-icon>
            </button>
            <h4>{{ reportTitle }}</h4>
            <b-button
              v-if="selectedChart !== reportName"
              style="position: absolute; top: 0rem; right: 0rem"
            >
              <b-icon
                size="is-small"
                custom-size="mdi-24px"
                icon="arrow-expand-all"
              ></b-icon>
            </b-button>
          </div>
        </div>
        <div class="chart__header__options">
          <b-button @click="() => openSelectedSourceDataTable(chartData)">
            See Source Data
          </b-button>
          <b-button
            v-if="0"
            @click="() => exportTableToExcel(chartData, excelReportTitle)"
          >
            Export Excel
          </b-button>
          <b-button v-if="isSelectedChart" @click="returnToReportsView">
            <b-icon
              size="is-small"
              custom-size="mdi-24px"
              icon="arrow-collapse-all"
            ></b-icon>
          </b-button>
        </div>
      </header>

      <div class="configuration__section w-100">
        <h3 class="text-left mb-4" style="font-size: 1rem">Configuration</h3>

        <!-- <slot name="configuration__section" /> -->
        <slot v-if="isSelectedChart" name="tags__section" />
      </div>
    </div>

    <ChartComponent
      v-if="!loading"
      :chart-data="chartData"
      :chart-options="chartOptions"
      :chart-type="selectedChartType"
      :height="isSelectedChart ? height : minHeight"
    />

    <b-skeleton v-else height="280px" width="100%" :active="true"></b-skeleton>

    <p v-html="legend"></p>

    <footer
      v-if="!loading && chartsTypes.length > 0"
      class="chart__footer mt-5"
    >
      <h3 class="mb-4">Other Charts</h3>
      <div class="is-flex" style="gap: 2rem">
        <div
          v-for="chartType in filteredCharts"
          :key="chartType"
          style="width: 20rem"
          @click="() => setSelectedChartType(chartType)"
        >
          <ChartComponent
            :chart-data="chartData"
            :chart-options="chartOptions"
            :chart-type="chartType"
          />
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import ChartComponent from "./ChartComponent.vue";

export default {
  name: "ReportItem",
  components: {
    ChartComponent,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    legend: {
      type: String,
      default: "",
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    selectedChart: {
      type: String,
      default: "",
    },
    chartType: {
      type: String,
      default: "bar",
    },
    reportName: {
      type: String,
      default: "",
    },
    reportTitle: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    excelReportTitle: {
      type: String,
      default: "",
    },
    openSelectedSourceDataTable: {
      type: Function,
      default: () => {},
    },
    exportTableToExcel: {
      type: Function,
      default: () => {},
    },
    returnToReportsView: {
      type: Function,
      default: () => {},
    },
    setSelectedChart: {
      type: Function,
      default: () => {},
    },
    chartsTypes: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: "150px",
    },
    minHeight: {
      type: String,
      default: "150px",
    },
  },
  data() {
    return {
      selectedChartType: this.chartType,
    };
  },
  computed: {
    filteredCharts() {
      return this.chartsTypes.filter(
        (chartType) => chartType !== this.selectedChartType
      );
    },
    isSelectedChart() {
      return this.selectedChart === this.reportName;
    },
  },
  methods: {
    setSelectedChartType(chartType) {
      this.selectedChartType = chartType;
    },
  },
};
</script>

<style scoped>
.chart-preview {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  max-width: 600px;
}

.configuration__section {
  display: none;
}

.selected .report_label {
  display: none;
}

.selected .configuration__section {
  display: block;
  border-bottom: 1px solid #ccc;
  padding-bottom: 2rem;
}

.chart__footer {
  display: none;
}

.chart__footer h3 {
  font-size: 1rem;
}

.selected .chart__footer {
  display: block;
  height: 15rem;
  width: 100%;
}

.chart__container .chart__title h4 {
  font-weight: 600;
}
.chart__container .chart__title .chart__return_button {
  background-color: transparent;
  border: none;
  outline: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  display: none;
}
.chart__container.selected .chart__title {
  position: relative;
  padding: 0rem;
  top: 0rem;
  left: 0rem;
}
.chart__container.selected .chart__title h4 {
  font-size: 1rem;
}
.chart__container.selected .chart__title button {
  display: block;
}
.chart__container .chart__title button:hover {
  box-shadow: 0px 0px 20px -8px #000;
}
.chart__container.selected > div:not(.chart__title) {
  /* width: 100%; */
  width: 30rem;
  margin-top: 2rem;
}
</style>
