<template>
  <div>
    <canvas ref="chartCanvas" :style="{ height: height }"></canvas>
  </div>
</template>

<script>
import {
  Chart,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";

import { FunnelController, TrapezoidElement } from "chartjs-chart-funnel";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register all required components
Chart.register(
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Legend,
  Tooltip,
  Title,
  FunnelController,
  TrapezoidElement,
  ChartDataLabels
);

export default {
  name: "ChartComponent",
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    chartType: {
      type: String,
      default: "bar", // default chart type
    },
    height: {
      type: String,
      default: "150px",
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy(); // Cleanup any previous chart instance
      }

      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: false,
            text: "Requests by Stage",
          },
        },
      };

      const barOptions = ["bar", "line"].includes(this.chartType)
        ? {
            scales: {
              y: {
                title: {
                  display: true,
                  text: "N° Request",
                  font: {
                    size: 14,
                    weight: "bold",
                  },
                },
                beginAtZero: true,
              },
            },
          }
        : {};

      const funnelOptions = {
        indexAxis: "y", // Make funnel chart vertical
        plugins: {
          datalabels: {
            display: true, // Enable labels only for funnel chart
            color: "#000", // Label text color
            anchor: "center",
            align: "center",
            font: {
              size: 12,
            },
            formatter: (value, context) => {
              return `${
                context.chart.data.labels[context.dataIndex]
              }\n${value}`;
            },
          },
        },
      };

      const options = {
        ...defaultOptions,
        ...this.chartOptions,
        ...(this.chartType === "funnel" ? funnelOptions : barOptions),
      };

      this.chartInstance = new Chart(this.$refs.chartCanvas, {
        type: this.chartType,
        data: this.chartData,
        options: options,
      });
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.renderChart();
      },
    },
    // chartOptions: {
    //   deep: true,
    //   handler() {
    //     this.renderChart();
    //   },
    // },
    chartType() {
      this.renderChart();
    },
    height() {
      this.renderChart();
    },
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
