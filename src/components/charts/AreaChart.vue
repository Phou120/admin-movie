<script setup lang="ts">
import { computed } from "vue";
import type { EChartsCoreOption } from "echarts/core";
import * as echarts from "echarts";
import BaseChart from "./BaseChart.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  data: number[];
  labels: string[];
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "#52c41a",
});

const chartOption = computed<EChartsCoreOption>(() => ({
  grid: {
    top: "10%",
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: props.labels,
    axisLine: {
      lineStyle: { color: "rgba(0,0,0,0.1)" },
    },
    axisLabel: {
      color: "#666",
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      lineStyle: { color: "rgba(0,0,0,0.1)" },
    },
    axisLabel: {
      color: "#666",
    },
    splitLine: {
      lineStyle: { color: "rgba(0,0,0,0.05)" },
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "#52c41a",
    textStyle: {
      color: "#fff",
    },
    formatter: (params: any) => {
      return `<strong>${params.name}</strong><br/>${params.value}`;
    },
  },
  series: [
    {
      name: t("dashboard.charts.series.value"),
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        width: 3,
        color: props.color,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 0, [
          { offset: 0, color: `${props.color}80` },
          { offset: 1, color: `${props.color}20` },
        ]),
      },
      data: props.data,
    },
  ],
}));
</script>

<template>
  <BaseChart :option="chartOption" />
</template>
